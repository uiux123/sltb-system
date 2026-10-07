import mongoose, {
  ClientSession
} from "mongoose";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import Bus
  from "../models/bus.model";

import SparePart
  from "../models/sparePart.model";

import {
  CreateMaintenanceRecordInput,
  UpdateMaintenanceRecordInput,
  MaintenancePartInput,
  IMaintenancePartUsed
} from "../types/maintenanceRecord.types";

import {
  StockStatus
} from "../types/sparePart.types";


// =========================================================
// INTERNAL TYPES
// =========================================================

interface StockChange {
  part_id: string;
  quantity: number;
}


// =========================================================
// ROUND TO TWO DECIMAL PLACES
// =========================================================

const roundToTwo = (
  value: number
): number => {

  return (
    Math.round(
      (
        value +
        Number.EPSILON
      ) * 100
    ) / 100
  );
};


// =========================================================
// CALCULATE STOCK STATUS
// =========================================================

const calculateStockStatus = (
  quantity: number,
  reorderLevel: number
): StockStatus => {

  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (
    quantity <=
    reorderLevel
  ) {
    return "Low Stock";
  }

  return "Available";
};


// =========================================================
// PARSE DATE
// =========================================================

const parseDate = (
  value: string | Date,
  fieldName: string
): Date => {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    throw new Error(
      `${fieldName} contains an invalid date or time.`
    );
  }

  return date;
};


// =========================================================
// NORMALIZE SPARE-PART INPUT
// =========================================================
//
// Example:
//
// SP001 quantity 1
// SP001 quantity 2
//
// becomes:
//
// SP001 quantity 3
//
// =========================================================

const normalizePartsInput = (
  parts:
    MaintenancePartInput[]
): MaintenancePartInput[] => {

  const partMap =
    new Map<string, number>();


  for (
    const item of parts
  ) {

    const partId =
      item.part_id
        .trim()
        .toUpperCase();


    if (!partId) {

      throw new Error(
        "Part ID cannot be empty."
      );
    }


    if (
      !Number.isInteger(
        item.quantity
      ) ||
      item.quantity <= 0
    ) {

      throw new Error(
        `Quantity for part ${partId} must be a positive whole number.`
      );
    }


    const existingQuantity =
      partMap.get(partId) ?? 0;


    partMap.set(
      partId,
      existingQuantity +
      item.quantity
    );
  }


  return Array.from(
    partMap.entries()
  ).map(
    (
      [
        part_id,
        quantity
      ]
    ) => ({
      part_id,
      quantity
    })
  );
};


// =========================================================
// PREPARE PARTS USED
// =========================================================
//
// All reads participate in the same transaction.
//
// Checks:
//
// - spare part exists
// - spare part belongs to bus depot
// - enough stock exists
// - captures historical part name
// - captures historical unit cost
// - calculates line total
//
// =========================================================

const preparePartsUsed =
  async (
    partsInput:
      MaintenancePartInput[],

    depotId: string,

    session: ClientSession
  ): Promise<
    IMaintenancePartUsed[]
  > => {

    const normalizedParts =
      normalizePartsInput(
        partsInput
      );


    const preparedParts:
      IMaintenancePartUsed[] = [];


    for (
      const item of normalizedParts
    ) {

      const sparePart =
        await SparePart
          .findOne({
            part_id:
              item.part_id
          })
          .session(session);


      if (!sparePart) {

        throw new Error(
          `Spare part ${item.part_id} does not exist.`
        );
      }


      if (
        sparePart.depot_id
          .toUpperCase() !==
        depotId.toUpperCase()
      ) {

        throw new Error(
          `Spare part ${item.part_id} does not belong to the bus depot.`
        );
      }


      if (
        sparePart.quantity_in_stock <
        item.quantity
      ) {

        throw new Error(
          `Insufficient stock for ${sparePart.part_name}. Available: ${sparePart.quantity_in_stock}, required: ${item.quantity}.`
        );
      }


      const lineTotal =
        roundToTwo(
          sparePart.unit_cost *
          item.quantity
        );


      preparedParts.push({
        part_id:
          sparePart.part_id,

        part_name:
          sparePart.part_name,

        quantity:
          item.quantity,

        unit_cost:
          sparePart.unit_cost,

        line_total:
          lineTotal
      });
    }


    return preparedParts;
  };


// =========================================================
// DEDUCT SPARE-PART STOCK
// =========================================================
//
// This operation is inside the MongoDB transaction.
//
// There is NO manual failure rollback.
//
// If any later operation fails:
//
// abortTransaction()
//      ↓
// MongoDB restores this inventory automatically.
//
// =========================================================

const deductPartsFromStock =
  async (
    parts:
      IMaintenancePartUsed[],

    depotId: string,

    session: ClientSession
  ): Promise<void> => {

    for (
      const item of parts
    ) {

      const sparePart =
        await SparePart
          .findOneAndUpdate(
            {
              part_id:
                item.part_id
                  .toUpperCase(),

              depot_id:
                depotId
                  .toUpperCase(),

              quantity_in_stock: {
                $gte:
                  item.quantity
              }
            },
            {
              $inc: {
                quantity_in_stock:
                  -item.quantity
              }
            },
            {
              new: true,
              runValidators: true,
              session
            }
          );


      if (!sparePart) {

        throw new Error(
          `Unable to deduct stock for ${item.part_id}. The available quantity may have changed.`
        );
      }


      sparePart.stock_status =
        calculateStockStatus(
          sparePart.quantity_in_stock,
          sparePart.reorder_level
        );


      await sparePart.save({
        session
      });
    }
  };


// =========================================================
// RESTORE SPARE-PART STOCK
// =========================================================
//
// This is NOT an error rollback.
//
// This is used when the user intentionally reverses/deletes
// a maintenance record.
//
// The restoration itself is also performed inside the
// DELETE transaction.
//
// =========================================================

const restoreStock =
  async (
    stockChanges:
      StockChange[],

    depotId: string,

    session: ClientSession
  ): Promise<void> => {

    for (
      const change of
        stockChanges
    ) {

      const sparePart =
        await SparePart
          .findOneAndUpdate(
            {
              part_id:
                change.part_id
                  .toUpperCase(),

              depot_id:
                depotId
                  .toUpperCase()
            },
            {
              $inc: {
                quantity_in_stock:
                  change.quantity
              }
            },
            {
              new: true,
              runValidators: true,
              session
            }
          );


      if (!sparePart) {

        throw new Error(
          `Unable to restore stock for spare part ${change.part_id}.`
        );
      }


      sparePart.stock_status =
        calculateStockStatus(
          sparePart.quantity_in_stock,
          sparePart.reorder_level
        );


      await sparePart.save({
        session
      });
    }
  };


// =========================================================
// SYNCHRONIZE BUS STATUS
// =========================================================
//
// If one or more maintenance records are:
//
// In Progress
//
// bus becomes:
//
// Under Maintenance
//
// If no In Progress maintenance remains and the bus is
// currently Under Maintenance:
//
// Operational
//
// Breakdown and Out of Service are preserved.
//
// =========================================================

const synchronizeBusStatus =
  async (
    busId: string,
    session: ClientSession
  ): Promise<void> => {

    const normalizedBusId =
      busId
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Bus must still exist
    // -----------------------------------------------------

    const bus =
      await Bus
        .findOne({
          bus_id:
            normalizedBusId
        })
        .session(session);


    if (!bus) {

      throw new Error(
        `Bus ${normalizedBusId} does not exist.`
      );
    }


    // -----------------------------------------------------
    // Check for active maintenance
    // -----------------------------------------------------

    const activeMaintenance =
      await MaintenanceRecord
        .exists({
          bus_id:
            normalizedBusId,

          status:
            "In Progress"
        })
        .session(session);


    // -----------------------------------------------------
    // Active maintenance exists
    // -----------------------------------------------------

    if (
      activeMaintenance
    ) {

      if (
        bus.bus_status !==
        "Under Maintenance"
      ) {

        bus.bus_status =
          "Under Maintenance";


        await bus.save({
          session
        });
      }


      return;
    }


    // -----------------------------------------------------
    // No active maintenance
    // -----------------------------------------------------
    //
    // Only automatically restore:
    //
    // Under Maintenance → Operational
    //
    // Do not overwrite:
    //
    // Breakdown
    // Out of Service
    //
    // -----------------------------------------------------

    if (
      bus.bus_status ===
      "Under Maintenance"
    ) {

      bus.bus_status =
        "Operational";


      await bus.save({
        session
      });
    }
  };


// =========================================================
// CREATE MAINTENANCE RECORD
// =========================================================
//
// REAL TRANSACTION:
//
// START
//   ↓
// Validate maintenance
//   ↓
// Read Bus
//   ↓
// Read/validate Spare Parts
//   ↓
// Deduct Spare Parts
//   ↓
// Create Maintenance Record
//   ↓
// Synchronize Bus Status
//   ↓
// COMMIT
//
// Any error:
//
// ABORT
//
// =========================================================

export const createMaintenanceRecord =
  async (
    data:
      CreateMaintenanceRecordInput
  ) => {

    const maintenanceId =
      data.maintenance_id
        .trim()
        .toUpperCase();


    const busId =
      data.bus_id
        .trim()
        .toUpperCase();


    const session =
      await mongoose.startSession();


    try {

      const createdRecord =
        await session.withTransaction(
          async () => {

            // =============================================
            // DUPLICATE MAINTENANCE ID
            // =============================================

            const existingRecord =
              await MaintenanceRecord
                .findOne({
                  maintenance_id:
                    maintenanceId
                })
                .session(session);


            if (
              existingRecord
            ) {

              throw new Error(
                "A maintenance record with this Maintenance ID already exists."
              );
            }


            // =============================================
            // FIND BUS
            // =============================================

            const bus =
              await Bus
                .findOne({
                  bus_id:
                    busId
                })
                .session(session);


            if (!bus) {

              throw new Error(
                "The selected bus does not exist."
              );
            }


            // Depot is derived from Bus.
            const depotId =
              bus.depot_id
                .trim()
                .toUpperCase();


            // =============================================
            // VALIDATE LABOUR COST
            // =============================================

            if (
              !Number.isFinite(
                data.labour_cost
              ) ||
              data.labour_cost < 0
            ) {

              throw new Error(
                "Labour cost cannot be negative."
              );
            }


            // =============================================
            // VALIDATE DOWNTIME
            // =============================================

            if (
              !Number.isFinite(
                data.downtime_hours
              ) ||
              data.downtime_hours < 0
            ) {

              throw new Error(
                "Downtime hours cannot be negative."
              );
            }


            // =============================================
            // DATES
            // =============================================

            const reportedDate =
              parseDate(
                data.reported_date,
                "Reported date"
              );


            let completionDate:
              Date | undefined;


            if (
              data.completion_date
            ) {

              completionDate =
                parseDate(
                  data.completion_date,
                  "Completion date"
                );
            }


            // =============================================
            // STATUS / DATE VALIDATION
            // =============================================

            if (
              data.status ===
                "Completed" &&
              !completionDate
            ) {

              throw new Error(
                "Completion date is required when maintenance status is Completed."
              );
            }


            if (
              data.status ===
                "In Progress" &&
              completionDate
            ) {

              throw new Error(
                "Completion date should not be provided while maintenance is In Progress."
              );
            }


            if (
              completionDate &&
              completionDate <
                reportedDate
            ) {

              throw new Error(
                "Completion date cannot be before the reported date."
              );
            }


            // =============================================
            // PREPARE PARTS
            // =============================================

            const preparedParts =
              await preparePartsUsed(
                data.parts_used ?? [],
                depotId,
                session
              );


            // =============================================
            // COST CALCULATIONS
            // =============================================

            const partsCost =
              roundToTwo(
                preparedParts.reduce(
                  (
                    total,
                    part
                  ) =>
                    total +
                    part.line_total,
                  0
                )
              );


            const totalRepairCost =
              roundToTwo(
                partsCost +
                data.labour_cost
              );


            // =============================================
            // DEDUCT INVENTORY
            // =============================================

            await deductPartsFromStock(
              preparedParts,
              depotId,
              session
            );


            // =============================================
            // CREATE MAINTENANCE
            // =============================================

            const maintenanceRecord =
              new MaintenanceRecord({
                maintenance_id:
                  maintenanceId,

                bus_id:
                  busId,

                depot_id:
                  depotId,

                reported_date:
                  reportedDate,

                maintenance_type:
                  data.maintenance_type,

                fault_category:
                  data.fault_category,

                fault_description:
                  data.fault_description,

                parts_used:
                  preparedParts,

                parts_cost:
                  partsCost,

                labour_cost:
                  data.labour_cost,

                total_repair_cost:
                  totalRepairCost,

                downtime_hours:
                  data.downtime_hours,

                technician_id:
                  data.technician_id,

                completion_date:
                  completionDate,

                status:
                  data.status
              });


            await maintenanceRecord.save({
              session
            });


            // =============================================
            // SYNCHRONIZE BUS
            // =============================================

            await synchronizeBusStatus(
              busId,
              session
            );


            return maintenanceRecord;
          }
        );


      if (
        !createdRecord
      ) {

        throw new Error(
          "Maintenance transaction did not return a created record."
        );
      }


      return createdRecord;

    } finally {

      await session.endSession();

    }
  };


// =========================================================
// GET ALL
// =========================================================

export const getAllMaintenanceRecords =
  async () => {

    return MaintenanceRecord
      .find()
      .sort({
        reported_date: -1
      });
  };


// =========================================================
// GET BY MAINTENANCE ID
// =========================================================

export const getMaintenanceRecordById =
  async (
    maintenanceId: string
  ) => {

    return MaintenanceRecord
      .findOne({
        maintenance_id:
          maintenanceId
            .trim()
            .toUpperCase()
      });
  };


// =========================================================
// GET BY BUS
// =========================================================

export const getMaintenanceRecordsByBus =
  async (
    busId: string
  ) => {

    return MaintenanceRecord
      .find({
        bus_id:
          busId
            .trim()
            .toUpperCase()
      })
      .sort({
        reported_date: -1
      });
  };


// =========================================================
// GET BY DEPOT
// =========================================================

export const getMaintenanceRecordsByDepot =
  async (
    depotId: string
  ) => {

    return MaintenanceRecord
      .find({
        depot_id:
          depotId
            .trim()
            .toUpperCase()
      })
      .sort({
        reported_date: -1
      });
  };


// =========================================================
// GET BY STATUS
// =========================================================

export const getMaintenanceRecordsByStatus =
  async (
    status: string
  ) => {

    if (
      status !==
        "In Progress" &&
      status !==
        "Completed"
    ) {

      throw new Error(
        "Maintenance status must be In Progress or Completed."
      );
    }


    return MaintenanceRecord
      .find({
        status
      })
      .sort({
        reported_date: -1
      });
  };


// =========================================================
// GET BY SPARE PART
// =========================================================

export const getMaintenanceRecordsByPart =
  async (
    partId: string
  ) => {

    return MaintenanceRecord
      .find({
        "parts_used.part_id":
          partId
            .trim()
            .toUpperCase()
      })
      .sort({
        reported_date: -1
      });
  };


// =========================================================
// UPDATE MAINTENANCE RECORD
// =========================================================
//
// REAL TRANSACTION:
//
// START
//   ↓
// Read Maintenance
//   ↓
// Validate update
//   ↓
// Update Maintenance
//   ↓
// Synchronize Bus
//   ↓
// COMMIT
//
// =========================================================

export const updateMaintenanceRecord =
  async (
    maintenanceId: string,
    data:
      UpdateMaintenanceRecordInput
  ) => {

    const normalizedMaintenanceId =
      maintenanceId
        .trim()
        .toUpperCase();


    const session =
      await mongoose.startSession();


    try {

      const updatedRecord =
        await session.withTransaction(
          async () => {

            // =============================================
            // FIND EXISTING RECORD
            // =============================================

            const maintenanceRecord =
              await MaintenanceRecord
                .findOne({
                  maintenance_id:
                    normalizedMaintenanceId
                })
                .session(session);


            if (
              !maintenanceRecord
            ) {

              return null;
            }


            // =============================================
            // REPORTED DATE
            // =============================================

            const reportedDate =
              data.reported_date
                ? parseDate(
                    data.reported_date,
                    "Reported date"
                  )
                : maintenanceRecord
                    .reported_date;


            // =============================================
            // FINAL STATUS
            // =============================================

            const finalStatus =
              data.status ??
              maintenanceRecord.status;


            // =============================================
            // COMPLETION DATE
            // =============================================

            let completionDate =
              maintenanceRecord
                .completion_date;


            if (
              data.completion_date
            ) {

              completionDate =
                parseDate(
                  data.completion_date,
                  "Completion date"
                );
            }


            // If final state is In Progress,
            // completion date must not be explicitly
            // supplied.
            if (
              finalStatus ===
                "In Progress"
            ) {

              if (
                data.completion_date
              ) {

                throw new Error(
                  "Completion date should not be provided while maintenance is In Progress."
                );
              }


              // Allows Completed → In Progress
              // if necessary.
              completionDate =
                undefined;
            }


            if (
              finalStatus ===
                "Completed" &&
              !completionDate
            ) {

              throw new Error(
                "Completion date is required when maintenance status is Completed."
              );
            }


            if (
              completionDate &&
              completionDate <
                reportedDate
            ) {

              throw new Error(
                "Completion date cannot be before the reported date."
              );
            }


            // =============================================
            // LABOUR COST
            // =============================================

            const labourCost =
              data.labour_cost ??
              maintenanceRecord
                .labour_cost;


            if (
              !Number.isFinite(
                labourCost
              ) ||
              labourCost < 0
            ) {

              throw new Error(
                "Labour cost cannot be negative."
              );
            }


            // =============================================
            // DOWNTIME
            // =============================================

            const downtimeHours =
              data.downtime_hours ??
              maintenanceRecord
                .downtime_hours;


            if (
              !Number.isFinite(
                downtimeHours
              ) ||
              downtimeHours < 0
            ) {

              throw new Error(
                "Downtime hours cannot be negative."
              );
            }


            // =============================================
            // TOTAL COST
            // =============================================

            const totalRepairCost =
              roundToTwo(
                maintenanceRecord
                  .parts_cost +
                labourCost
              );


            // =============================================
            // UPDATE MAINTENANCE
            // =============================================

            maintenanceRecord
              .reported_date =
                reportedDate;


            maintenanceRecord
              .maintenance_type =
                data.maintenance_type ??
                maintenanceRecord
                  .maintenance_type;


            maintenanceRecord
              .fault_category =
                data.fault_category ??
                maintenanceRecord
                  .fault_category;


            maintenanceRecord
              .fault_description =
                data.fault_description ??
                maintenanceRecord
                  .fault_description;


            maintenanceRecord
              .labour_cost =
                labourCost;


            maintenanceRecord
              .total_repair_cost =
                totalRepairCost;


            maintenanceRecord
              .downtime_hours =
                downtimeHours;


            if (
              data.technician_id !==
              undefined
            ) {

              maintenanceRecord
                .technician_id =
                  data.technician_id;
            }


            maintenanceRecord
              .completion_date =
                completionDate;


            maintenanceRecord
              .status =
                finalStatus;


            await maintenanceRecord.save({
              session
            });


            // =============================================
            // SYNCHRONIZE BUS STATUS
            // =============================================

            await synchronizeBusStatus(
              maintenanceRecord.bus_id,
              session
            );


            return maintenanceRecord;
          }
        );


      return (
        updatedRecord ??
        null
      );

    } finally {

      await session.endSession();

    }
  };


// =========================================================
// DELETE / REVERSE MAINTENANCE
// =========================================================
//
// REAL TRANSACTION:
//
// START
//   ↓
// Find Maintenance
//   ↓
// Verify Parts
//   ↓
// Restore Inventory
//   ↓
// Delete Maintenance
//   ↓
// Synchronize Bus
//   ↓
// COMMIT
//
// Any error:
//
// ABORT
//
// Example:
//
// SP001 stock = 20
// maintenance used 2
// current stock = 18
//
// DELETE maintenance
//
// restore +2
//
// stock = 20
//
// =========================================================

export const deleteMaintenanceRecord =
  async (
    maintenanceId: string
  ) => {

    const normalizedMaintenanceId =
      maintenanceId
        .trim()
        .toUpperCase();


    const session =
      await mongoose.startSession();


    try {

      const deletedRecord =
        await session.withTransaction(
          async () => {

            // =============================================
            // FIND MAINTENANCE
            // =============================================

            const maintenanceRecord =
              await MaintenanceRecord
                .findOne({
                  maintenance_id:
                    normalizedMaintenanceId
                })
                .session(session);


            if (
              !maintenanceRecord
            ) {

              return null;
            }


            // =============================================
            // VERIFY REFERENCED SPARE PARTS
            // =============================================

            for (
              const item of
                maintenanceRecord
                  .parts_used
            ) {

              const part =
                await SparePart
                  .findOne({
                    part_id:
                      item.part_id
                        .toUpperCase()
                  })
                  .session(session);


              if (!part) {

                throw new Error(
                  `Cannot reverse this maintenance record because spare part ${item.part_id} no longer exists.`
                );
              }


              if (
                part.depot_id
                  .toUpperCase() !==
                maintenanceRecord
                  .depot_id
                  .toUpperCase()
              ) {

                throw new Error(
                  `Cannot reverse this maintenance record because spare part ${item.part_id} is no longer assigned to the original depot.`
                );
              }
            }


            // =============================================
            // BUILD STOCK RESTORATION LIST
            // =============================================

            const stockChanges:
              StockChange[] =
                maintenanceRecord
                  .parts_used
                  .map(
                    (
                      item
                    ) => ({
                      part_id:
                        item.part_id,

                      quantity:
                        item.quantity
                    })
                  );


            // =============================================
            // RESTORE INVENTORY
            // =============================================

            await restoreStock(
              stockChanges,
              maintenanceRecord
                .depot_id,
              session
            );


            // =============================================
            // DELETE MAINTENANCE RECORD
            // =============================================

            await MaintenanceRecord
              .deleteOne(
                {
                  maintenance_id:
                    normalizedMaintenanceId
                },
                {
                  session
                }
              );


            // =============================================
            // SYNCHRONIZE BUS STATUS
            // =============================================

            await synchronizeBusStatus(
              maintenanceRecord
                .bus_id,
              session
            );


            return maintenanceRecord;
          }
        );


      return (
        deletedRecord ??
        null
      );

    } finally {

      await session.endSession();

    }
  };