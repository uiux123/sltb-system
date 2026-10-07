import mongoose
  from "mongoose";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import Bus
  from "../models/bus.model";

import Depot
  from "../models/depot.model";

import SparePart
  from "../models/sparePart.model";

import {
  IMaintenanceRecord,
  IMaintenancePartUsed,
  MaintenanceType,
  MaintenanceStatus
} from "../types/maintenanceRecord.types";


// =========================================================
// CONSTANTS
// =========================================================

const ONE_DAY_MS =
  24 * 60 * 60 * 1000;


// =========================================================
// HELPER: ROUND TO TWO DECIMAL PLACES
// =========================================================

const roundToTwo = (
  value: number
): number => {

  return Math.round(
    (
      value +
      Number.EPSILON
    ) * 100
  ) / 100;
};


// =========================================================
// HELPER: STOCK STATUS
// =========================================================

const calculateStockStatus = (
  quantity: number,
  reorderLevel: number
): "Available" | "Low Stock" | "Out of Stock" => {

  if (
    quantity <= 0
  ) {

    return "Out of Stock";
  }


  if (
    quantity <= reorderLevel
  ) {

    return "Low Stock";
  }


  return "Available";
};


// =========================================================
// HELPER: MAINTENANCE DESCRIPTION
// =========================================================

const getFaultDescription = (
  category: string,
  maintenanceType: MaintenanceType
): string => {

  if (
    maintenanceType === "Preventive"
  ) {

    return `Scheduled preventive inspection and servicing of the ${category.toLowerCase()}.`;
  }


  const descriptions:
    Record<string, string> = {

      "Braking System":
        "Brake performance issue detected during operation and corrective repair was required.",

      "Engine":
        "Engine performance issue reported and corrective inspection and repair were carried out.",

      "Fuel System":
        "Fuel-system performance issue identified during operation.",

      "Cooling System":
        "Cooling-system issue identified requiring inspection and corrective maintenance.",

      "Transmission":
        "Transmission performance issue reported and corrective maintenance was required.",

      "Electrical":
        "Electrical-system fault reported and investigated by the maintenance team.",

      "Body":
        "Bus body or related external component required corrective maintenance.",

      "Suspension":
        "Suspension-related issue identified during inspection or operation.",

      "Tyres":
        "Tyre condition required replacement or corrective attention.",

      "General Inspection":
        "Operational issue reported and a general mechanical inspection was carried out."

    };


  return (
    descriptions[category] ??
    "Vehicle fault reported and corrective maintenance was carried out."
  );
};


// =========================================================
// HELPER: TECHNICIAN ID
// =========================================================

const getTechnicianId = (
  index: number
): string => {

  const technicianNumber =
    (
      index % 20
    ) + 1;


  return `TECH${String(
    technicianNumber
  ).padStart(
    3,
    "0"
  )}`;
};


// =========================================================
// HELPER: LABOUR COST
// =========================================================

const getLabourCost = (
  maintenanceType: MaintenanceType,
  index: number
): number => {

  if (
    maintenanceType === "Preventive"
  ) {

    return (
      3500 +
      (
        (
          index % 6
        ) * 500
      )
    );
  }


  return (
    6000 +
    (
      (
        index % 8
      ) * 750
    )
  );
};


// =========================================================
// HELPER: DOWNTIME
// =========================================================

const getDowntimeHours = (
  maintenanceType: MaintenanceType,
  status: MaintenanceStatus,
  index: number
): number => {

  if (
    status === "In Progress"
  ) {

    return (
      8 +
      (
        index % 13
      )
    );
  }


  if (
    maintenanceType === "Preventive"
  ) {

    return (
      2 +
      (
        index % 6
      )
    );
  }


  return (
    5 +
    (
      index % 11
    )
  );
};


// =========================================================
// SEED MAINTENANCE RECORDS
// =========================================================

export const seedMaintenanceRecords =
  async (): Promise<void> => {

    console.log(
      "Seeding maintenance records..."
    );


    // =====================================================
    // START TRANSACTION SESSION
    // =====================================================

    const session =
      await mongoose.startSession();


    try {

      await session.withTransaction(
        async () => {

          // =================================================
          // LOAD BUSES
          // =================================================

          const buses =
            await Bus
              .find()
              .sort({
                bus_id: 1
              })
              .session(
                session
              );


          if (
            buses.length !== 100
          ) {

            throw new Error(
              `Maintenance seed expected 100 buses but found ${buses.length}.`
            );
          }


          // =================================================
          // LOAD DEPOTS
          // =================================================

          const depots =
            await Depot
              .find()
              .session(
                session
              );


          if (
            depots.length !== 100
          ) {

            throw new Error(
              `Maintenance seed expected 100 depots but found ${depots.length}.`
            );
          }


          const validDepotIds =
            new Set(
              depots.map(
                depot =>
                  depot.depot_id
              )
            );


          // =================================================
          // LOAD SPARE PARTS
          // =================================================

          const spareParts =
            await SparePart
              .find()
              .sort({
                part_id: 1
              })
              .session(
                session
              );


          if (
            spareParts.length !== 100
          ) {

            throw new Error(
              `Maintenance seed expected 100 spare parts but found ${spareParts.length}.`
            );
          }


          // =================================================
          // REMOVE OLD MAINTENANCE RECORDS
          // =================================================
          //
          // This is safe here because:
          //
          // sparePart.seed.ts has already recreated the
          // inventory before this function executes.
          //
          // =================================================

          await MaintenanceRecord
            .deleteMany({})
            .session(
              session
            );


          // =================================================
          // GROUP PARTS BY DEPOT
          // =================================================

          const partsByDepot =
            new Map<
              string,
              typeof spareParts
            >();


          for (
            const part of spareParts
          ) {

            const currentParts =
              partsByDepot.get(
                part.depot_id
              ) ?? [];


            currentParts.push(
              part
            );


            partsByDepot.set(
              part.depot_id,
              currentParts
            );

          }


          // =================================================
          // TRACK AVAILABLE STOCK IN MEMORY
          // =================================================

          const remainingStock =
            new Map<
              string,
              number
            >();


          for (
            const part of spareParts
          ) {

            remainingStock.set(
              part.part_id,
              part.quantity_in_stock
            );

          }


          // =================================================
          // GENERATED MAINTENANCE RECORDS
          // =================================================

          const maintenanceSeedData:
            IMaintenanceRecord[] =
              [];


          // =================================================
          // BASE DATE
          // =================================================
          //
          // 100 records are spread from June to September
          // 2026.
          //
          // Records 86-100 remain In Progress so they are
          // recent active maintenance jobs.
          //
          // =================================================

          const baseDate =
            new Date(
              "2026-06-08T08:00:00+05:30"
            );


          // =================================================
          // GENERATE ONE MAINTENANCE RECORD PER BUS
          // =================================================

          for (
            let index = 0;
            index < buses.length;
            index++
          ) {

            const bus =
              buses[index];


            const number =
              index + 1;


            // -----------------------------------------------
            // Validate Bus Depot
            // -----------------------------------------------

            if (
              !validDepotIds.has(
                bus.depot_id
              )
            ) {

              throw new Error(
                `Bus ${bus.bus_id} references invalid Depot ${bus.depot_id}.`
              );
            }


            // ===============================================
            // MAINTENANCE ID
            // ===============================================

            const maintenanceId =
              `MNT${String(
                number
              ).padStart(
                3,
                "0"
              )}`;


            // ===============================================
            // REPORTED DATE
            // ===============================================

            const reportedDate =
              new Date(
                baseDate.getTime() +
                (
                  index *
                  ONE_DAY_MS
                )
              );


            // ===============================================
            // STATUS
            // ===============================================
            //
            // First 85:
            // Completed
            //
            // Last 15:
            // In Progress
            //
            // ===============================================

            const status:
              MaintenanceStatus =
                number <= 85
                  ? "Completed"
                  : "In Progress";


            // ===============================================
            // INITIAL MAINTENANCE TYPE
            // ===============================================

            let maintenanceType:
              MaintenanceType =
                number % 3 === 0
                  ? "Preventive"
                  : "Corrective";


            // ===============================================
            // PARTS AVAILABLE AT BUS DEPOT
            // ===============================================

            const depotParts =
              partsByDepot.get(
                bus.depot_id
              ) ?? [];


            // ===============================================
            // SELECT A PART
            // ===============================================
            //
            // Around 75% of records attempt to use a part.
            //
            // The selected part must:
            //
            // 1. belong to Bus Depot
            // 2. currently have stock
            //
            // ===============================================

            const shouldUsePart =
              number % 4 !== 0;


            let selectedPart:
              (typeof spareParts)[number] |
              undefined;


            if (
              shouldUsePart
            ) {

              const availableParts =
                depotParts.filter(
                  part =>
                    (
                      remainingStock.get(
                        part.part_id
                      ) ?? 0
                    ) > 0
                );


              if (
                availableParts.length >
                0
              ) {

                selectedPart =
                  availableParts[
                    index %
                    availableParts.length
                  ];

              }

            }


            // ===============================================
            // EMBEDDED PARTS USED
            // ===============================================

            const partsUsed:
              IMaintenancePartUsed[] =
                [];


            let faultCategory =
              "General Inspection";


            // ===============================================
            // IF A PART IS USED
            // ===============================================

            if (
              selectedPart
            ) {

              const currentQuantity =
                remainingStock.get(
                  selectedPart.part_id
                ) ?? 0;


              // ---------------------------------------------
              // Usually 1 unit.
              //
              // Every 7th maintenance may use 2 units if
              // sufficient stock is available.
              // ---------------------------------------------

              const requestedQuantity =
                number % 7 === 0
                  ? 2
                  : 1;


              const quantityUsed =
                Math.min(
                  requestedQuantity,
                  currentQuantity
                );


              if (
                quantityUsed > 0
              ) {

                const lineTotal =
                  roundToTwo(
                    quantityUsed *
                    selectedPart.unit_cost
                  );


                partsUsed.push({

                  part_id:
                    selectedPart.part_id,

                  part_name:
                    selectedPart.part_name,

                  quantity:
                    quantityUsed,

                  unit_cost:
                    selectedPart.unit_cost,

                  line_total:
                    lineTotal

                });


                // -------------------------------------------
                // Reduce in-memory stock
                // -------------------------------------------

                remainingStock.set(
                  selectedPart.part_id,
                  currentQuantity -
                  quantityUsed
                );


                // -------------------------------------------
                // Fault category follows the actual part
                // category where possible.
                // -------------------------------------------

                faultCategory =
                  selectedPart.part_category;

              }

            }


            // ===============================================
            // NO PART USED
            // ===============================================
            //
            // Treat these as preventive/general inspection
            // records to keep the data logically sensible.
            //
            // ===============================================

            if (
              partsUsed.length === 0
            ) {

              maintenanceType =
                "Preventive";

              faultCategory =
                "General Inspection";

            }


            // ===============================================
            // PARTS COST
            // ===============================================

            const partsCost =
              roundToTwo(
                partsUsed.reduce(
                  (
                    total,
                    part
                  ) =>
                    total +
                    part.line_total,
                  0
                )
              );


            // ===============================================
            // LABOUR COST
            // ===============================================

            const labourCost =
              getLabourCost(
                maintenanceType,
                index
              );


            // ===============================================
            // TOTAL REPAIR COST
            // ===============================================

            const totalRepairCost =
              roundToTwo(
                partsCost +
                labourCost
              );


            // ===============================================
            // DOWNTIME
            // ===============================================

            const downtimeHours =
              getDowntimeHours(
                maintenanceType,
                status,
                index
              );


            // ===============================================
            // COMPLETION DATE
            // ===============================================

            const completionDate =
              status === "Completed"
                ? new Date(
                    reportedDate.getTime() +
                    (
                      (
                        1 +
                        (
                          index % 3
                        )
                      ) *
                      ONE_DAY_MS
                    )
                  )
                : undefined;


            // ===============================================
            // CREATE RECORD
            // ===============================================

            maintenanceSeedData.push({

              maintenance_id:
                maintenanceId,

              bus_id:
                bus.bus_id,

              depot_id:
                bus.depot_id,

              reported_date:
                reportedDate,

              maintenance_type:
                maintenanceType,

              fault_category:
                faultCategory,

              fault_description:
                getFaultDescription(
                  faultCategory,
                  maintenanceType
                ),

              parts_used:
                partsUsed,

              parts_cost:
                partsCost,

              labour_cost:
                labourCost,

              total_repair_cost:
                totalRepairCost,

              downtime_hours:
                downtimeHours,

              technician_id:
                getTechnicianId(
                  index
                ),

              completion_date:
                completionDate,

              status

            });

          }


          // =================================================
          // VERIFY GENERATED COUNT
          // =================================================

          if (
            maintenanceSeedData.length !==
            100
          ) {

            throw new Error(
              `Maintenance seed requires exactly 100 records. Generated: ${maintenanceSeedData.length}.`
            );
          }


          // =================================================
          // UPDATE SPARE-PART STOCK
          // =================================================

          for (
            const part of spareParts
          ) {

            const newQuantity =
              remainingStock.get(
                part.part_id
              );


            if (
              newQuantity ===
              undefined
            ) {

              throw new Error(
                `Unable to calculate remaining stock for ${part.part_id}.`
              );
            }


            if (
              newQuantity < 0
            ) {

              throw new Error(
                `Maintenance seed would create negative stock for ${part.part_id}.`
              );
            }


            part.quantity_in_stock =
              newQuantity;


            part.stock_status =
              calculateStockStatus(
                newQuantity,
                part.reorder_level
              );


            await part.save({
              session
            });

          }


          // =================================================
          // INSERT MAINTENANCE RECORDS
          // =================================================

          await MaintenanceRecord.insertMany(
            maintenanceSeedData,
            {
              session
            }
          );


          // =================================================
          // SYNCHRONIZE BUS STATUS
          // =================================================
          //
          // Same principle as application maintenance logic:
          //
          // In Progress exists:
          //     Bus → Under Maintenance
          //
          // No active maintenance and currently
          // Under Maintenance:
          //     Bus → Operational
          //
          // Breakdown and Out of Service remain unchanged
          // when no active maintenance exists.
          //
          // =================================================

          const inProgressBusIds =
            new Set(
              maintenanceSeedData
                .filter(
                  record =>
                    record.status ===
                    "In Progress"
                )
                .map(
                  record =>
                    record.bus_id
                )
            );


          for (
            const bus of buses
          ) {

            if (
              inProgressBusIds.has(
                bus.bus_id
              )
            ) {

              bus.bus_status =
                "Under Maintenance";


              await bus.save({
                session
              });


              continue;
            }


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

          }

        }
      );


      // ===================================================
      // TRANSACTION COMMITTED
      // ===================================================

      const count =
        await MaintenanceRecord
          .countDocuments();


      if (
        count !== 100
      ) {

        throw new Error(
          `Maintenance seeding failed. Expected 100 documents but found ${count}.`
        );
      }


      // ===================================================
      // POST-COMMIT VALIDATION
      // ===================================================

      const maintenanceRecords =
        await MaintenanceRecord
          .find()
          .sort({
            maintenance_id: 1
          });


      const buses =
        await Bus.find();


      const spareParts =
        await SparePart.find();


      const busMap =
        new Map(
          buses.map(
            bus => [
              bus.bus_id,
              bus
            ]
          )
        );


      const sparePartMap =
        new Map(
          spareParts.map(
            part => [
              part.part_id,
              part
            ]
          )
        );


      // ===================================================
      // VERIFY MAINTENANCE DOCUMENTS
      // ===================================================

      for (
        const record of
          maintenanceRecords
      ) {

        // -------------------------------------------------
        // Bus must exist
        // -------------------------------------------------

        const bus =
          busMap.get(
            record.bus_id
          );


        if (!bus) {

          throw new Error(
            `Maintenance ${record.maintenance_id} references invalid Bus ${record.bus_id}.`
          );
        }


        // -------------------------------------------------
        // Depot must match Bus
        // -------------------------------------------------

        if (
          record.depot_id !==
          bus.depot_id
        ) {

          throw new Error(
            `Maintenance ${record.maintenance_id} Depot does not match Bus ${record.bus_id}.`
          );
        }


        // -------------------------------------------------
        // Parts Cost
        // -------------------------------------------------

        const calculatedPartsCost =
          roundToTwo(
            record.parts_used.reduce(
              (
                total,
                part
              ) =>
                total +
                part.line_total,
              0
            )
          );


        if (
          record.parts_cost !==
          calculatedPartsCost
        ) {

          throw new Error(
            `Maintenance ${record.maintenance_id} has an invalid parts cost.`
          );
        }


        // -------------------------------------------------
        // Total Cost
        // -------------------------------------------------

        const calculatedTotalCost =
          roundToTwo(
            record.parts_cost +
            record.labour_cost
          );


        if (
          record.total_repair_cost !==
          calculatedTotalCost
        ) {

          throw new Error(
            `Maintenance ${record.maintenance_id} has an invalid total repair cost.`
          );
        }


        // -------------------------------------------------
        // Embedded Spare Parts
        // -------------------------------------------------

        for (
          const usedPart of
            record.parts_used
        ) {

          const currentPart =
            sparePartMap.get(
              usedPart.part_id
            );


          if (!currentPart) {

            throw new Error(
              `Maintenance ${record.maintenance_id} references missing Spare Part ${usedPart.part_id}.`
            );
          }


          if (
            currentPart.depot_id !==
            record.depot_id
          ) {

            throw new Error(
              `Maintenance ${record.maintenance_id} uses Spare Part ${usedPart.part_id} from a different Depot.`
            );
          }


          const expectedLineTotal =
            roundToTwo(
              usedPart.quantity *
              usedPart.unit_cost
            );


          if (
            usedPart.line_total !==
            expectedLineTotal
          ) {

            throw new Error(
              `Maintenance ${record.maintenance_id} contains an invalid line total for ${usedPart.part_id}.`
            );
          }

        }


        // -------------------------------------------------
        // In Progress Bus Status
        // -------------------------------------------------

        if (
          record.status ===
          "In Progress" &&
          bus.bus_status !==
          "Under Maintenance"
        ) {

          throw new Error(
            `Bus ${bus.bus_id} should be Under Maintenance because ${record.maintenance_id} is In Progress.`
          );
        }

      }


      // ===================================================
      // VERIFY NO NEGATIVE INVENTORY
      // ===================================================

      const negativeStock =
        spareParts.find(
          part =>
            part.quantity_in_stock <
            0
        );


      if (
        negativeStock
      ) {

        throw new Error(
          `Negative stock detected for ${negativeStock.part_id}.`
        );
      }


      // ===================================================
      // SUMMARY COUNTS
      // ===================================================

      const completedCount =
        await MaintenanceRecord
          .countDocuments({
            status:
              "Completed"
          });


      const inProgressCount =
        await MaintenanceRecord
          .countDocuments({
            status:
              "In Progress"
          });


      const preventiveCount =
        await MaintenanceRecord
          .countDocuments({
            maintenance_type:
              "Preventive"
          });


      const correctiveCount =
        await MaintenanceRecord
          .countDocuments({
            maintenance_type:
              "Corrective"
          });


      const recordsUsingParts =
        await MaintenanceRecord
          .countDocuments({
            "parts_used.0": {
              $exists:
                true
            }
          });


      // ===================================================
      // SUCCESS
      // ===================================================

      console.log(
        `Maintenance records seeded successfully: ${count}`
      );


      console.log(
        `Completed maintenance: ${completedCount}`
      );


      console.log(
        `In-progress maintenance: ${inProgressCount}`
      );


      console.log(
        `Preventive maintenance: ${preventiveCount}`
      );


      console.log(
        `Corrective maintenance: ${correctiveCount}`
      );


      console.log(
        `Maintenance records using spare parts: ${recordsUsingParts}`
      );


      console.log(
        "Maintenance Bus/Depot/Spare-Part relationships verified."
      );


      console.log(
        "Spare-part stock deductions verified."
      );


      console.log(
        "Maintenance cost calculations verified."
      );


      console.log(
        "Bus maintenance statuses synchronized."
      );


      console.log(
        "Maintenance transaction committed successfully."
      );


    } catch (error) {

      console.error(
        "Maintenance seed transaction failed."
      );


      console.error(
        "MongoDB rolled back the maintenance seed transaction."
      );


      throw error;

    } finally {

      await session.endSession();

    }

  };