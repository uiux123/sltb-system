import SparePart
  from "../models/sparePart.model";

import Depot
  from "../models/depot.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  CreateSparePartInput,
  UpdateSparePartInput,
  StockStatus
} from "../types/sparePart.types";


// =========================================================
// HELPER: CALCULATE STOCK STATUS
// =========================================================

const calculateStockStatus = (
  quantity: number,
  reorderLevel: number
): StockStatus => {

  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= reorderLevel) {
    return "Low Stock";
  }

  return "Available";
};


// =========================================================
// HELPER: PARSE DATE
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
      `${fieldName} contains an invalid date.`
    );
  }


  return date;
};


// =========================================================
// CREATE SPARE PART
// =========================================================

export const createSparePart = async (
  data: CreateSparePartInput
) => {

  const partId =
    data.part_id
      .trim()
      .toUpperCase();


  const depotId =
    data.depot_id
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check duplicate Part ID
  // -----------------------------------------------------

  const existingPart =
    await SparePart.findOne({
      part_id:
        partId
    });


  if (existingPart) {

    throw new Error(
      "A spare part with this Part ID already exists."
    );
  }


  // -----------------------------------------------------
  // Validate Depot
  // -----------------------------------------------------

  const depot =
    await Depot.findOne({
      depot_id:
        depotId
    });


  if (!depot) {

    throw new Error(
      "The selected depot does not exist."
    );
  }


  // -----------------------------------------------------
  // Validate quantity
  // -----------------------------------------------------

  if (
    !Number.isInteger(
      data.quantity_in_stock
    ) ||
    data.quantity_in_stock < 0
  ) {

    throw new Error(
      "Quantity in stock must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Validate reorder level
  // -----------------------------------------------------

  if (
    !Number.isInteger(
      data.reorder_level
    ) ||
    data.reorder_level < 0
  ) {

    throw new Error(
      "Reorder level must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Validate unit cost
  // -----------------------------------------------------

  if (
    !Number.isFinite(
      data.unit_cost
    ) ||
    data.unit_cost < 0
  ) {

    throw new Error(
      "Unit cost cannot be negative."
    );
  }


  // -----------------------------------------------------
  // Last restock date
  // -----------------------------------------------------

  let lastRestockDate:
    Date | undefined;


  if (
    data.last_restock_date
  ) {

    lastRestockDate =
      parseDate(
        data.last_restock_date,
        "Last restock date"
      );
  }


  // -----------------------------------------------------
  // Calculate stock status automatically
  // -----------------------------------------------------

  const stockStatus =
    calculateStockStatus(
      data.quantity_in_stock,
      data.reorder_level
    );


  // -----------------------------------------------------
  // Create Spare Part
  // -----------------------------------------------------

  const sparePart =
    await SparePart.create({

      part_id:
        partId,

      part_name:
        data.part_name,

      part_category:
        data.part_category,

      manufacturer:
        data.manufacturer,

      compatible_bus_models:
        data.compatible_bus_models ?? [],

      depot_id:
        depotId,

      quantity_in_stock:
        data.quantity_in_stock,

      reorder_level:
        data.reorder_level,

      unit_cost:
        data.unit_cost,

      supplier_name:
        data.supplier_name,

      last_restock_date:
        lastRestockDate,

      stock_status:
        stockStatus

    });


  return sparePart;
};


// =========================================================
// GET ALL SPARE PARTS
// =========================================================

export const getAllSpareParts =
  async () => {

    return SparePart
      .find()
      .sort({
        part_id: 1
      });
  };


// =========================================================
// GET SPARE PART BY ID
// =========================================================

export const getSparePartById = async (
  partId: string
) => {

  const normalizedPartId =
    partId
      .trim()
      .toUpperCase();


  return SparePart.findOne({
    part_id:
      normalizedPartId
  });
};


// =========================================================
// GET SPARE PARTS BY DEPOT
// =========================================================

export const getSparePartsByDepot =
  async (
    depotId: string
  ) => {

    const normalizedDepotId =
      depotId
        .trim()
        .toUpperCase();


    return SparePart
      .find({
        depot_id:
          normalizedDepotId
      })
      .sort({
        part_name: 1
      });
  };


// =========================================================
// GET LOW-STOCK / OUT-OF-STOCK PARTS
// =========================================================

export const getLowStockSpareParts =
  async () => {

    return SparePart
      .find({
        stock_status: {
          $in: [
            "Low Stock",
            "Out of Stock"
          ]
        }
      })
      .sort({
        quantity_in_stock: 1
      });
  };


// =========================================================
// UPDATE SPARE PART
// =========================================================

export const updateSparePart = async (
  partId: string,
  data: UpdateSparePartInput
) => {

  const normalizedPartId =
    partId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Find existing Spare Part
  // -----------------------------------------------------

  const existingPart =
    await SparePart.findOne({
      part_id:
        normalizedPartId
    });


  if (!existingPart) {

    return null;
  }


  // -----------------------------------------------------
  // Determine final Depot
  // -----------------------------------------------------

  const depotId =
    (
      data.depot_id ??
      existingPart.depot_id
    )
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Validate Depot
  // -----------------------------------------------------

  const depot =
    await Depot.findOne({
      depot_id:
        depotId
    });


  if (!depot) {

    throw new Error(
      "The selected depot does not exist."
    );
  }


  // -----------------------------------------------------
  // Determine final quantity
  // -----------------------------------------------------

  const quantityInStock =
    data.quantity_in_stock ??
    existingPart.quantity_in_stock;


  if (
    !Number.isInteger(
      quantityInStock
    ) ||
    quantityInStock < 0
  ) {

    throw new Error(
      "Quantity in stock must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Determine final reorder level
  // -----------------------------------------------------

  const reorderLevel =
    data.reorder_level ??
    existingPart.reorder_level;


  if (
    !Number.isInteger(
      reorderLevel
    ) ||
    reorderLevel < 0
  ) {

    throw new Error(
      "Reorder level must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Determine final unit cost
  // -----------------------------------------------------

  const unitCost =
    data.unit_cost ??
    existingPart.unit_cost;


  if (
    !Number.isFinite(
      unitCost
    ) ||
    unitCost < 0
  ) {

    throw new Error(
      "Unit cost cannot be negative."
    );
  }


  // -----------------------------------------------------
  // Last restock date
  // -----------------------------------------------------

  let lastRestockDate =
    existingPart.last_restock_date;


  if (
    data.last_restock_date !==
    undefined
  ) {

    lastRestockDate =
      parseDate(
        data.last_restock_date,
        "Last restock date"
      );
  }


  // -----------------------------------------------------
  // Recalculate stock status
  // -----------------------------------------------------

  const stockStatus =
    calculateStockStatus(
      quantityInStock,
      reorderLevel
    );


  // -----------------------------------------------------
  // Update Spare Part
  // -----------------------------------------------------

  return SparePart.findOneAndUpdate(
    {
      part_id:
        normalizedPartId
    },
    {
      part_name:
        data.part_name ??
        existingPart.part_name,

      part_category:
        data.part_category ??
        existingPart.part_category,

      manufacturer:
        data.manufacturer ??
        existingPart.manufacturer,

      compatible_bus_models:
        data.compatible_bus_models ??
        existingPart.compatible_bus_models,

      depot_id:
        depotId,

      quantity_in_stock:
        quantityInStock,

      reorder_level:
        reorderLevel,

      unit_cost:
        unitCost,

      supplier_name:
        data.supplier_name ??
        existingPart.supplier_name,

      last_restock_date:
        lastRestockDate,

      stock_status:
        stockStatus
    },
    {
      new: true,
      runValidators: true
    }
  );
};


// =========================================================
// RESTOCK SPARE PART
// =========================================================

export const restockSparePart =
  async (
    partId: string,
    quantity: number
  ) => {

    const normalizedPartId =
      partId
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Quantity added must be positive
    // -----------------------------------------------------

    if (
      !Number.isInteger(
        quantity
      ) ||
      quantity <= 0
    ) {

      throw new Error(
        "Restock quantity must be a positive whole number."
      );
    }


    // -----------------------------------------------------
    // Find Spare Part
    // -----------------------------------------------------

    const sparePart =
      await SparePart.findOne({
        part_id:
          normalizedPartId
      });


    if (!sparePart) {

      return null;
    }


    // -----------------------------------------------------
    // Add inventory
    // -----------------------------------------------------

    sparePart.quantity_in_stock +=
      quantity;


    // -----------------------------------------------------
    // Record restock date
    // -----------------------------------------------------

    sparePart.last_restock_date =
      new Date();


    // -----------------------------------------------------
    // Recalculate status
    // -----------------------------------------------------

    sparePart.stock_status =
      calculateStockStatus(
        sparePart.quantity_in_stock,
        sparePart.reorder_level
      );


    await sparePart.save();


    return sparePart;
  };


// =========================================================
// DELETE SPARE PART WITH RELATIONSHIP PROTECTION
// =========================================================
//
// IMPORTANT:
//
// maintenance_records embeds spare-part usage:
//
// parts_used: [
//   {
//     part_id: "SP001",
//     quantity: 2,
//     ...
//   }
// ]
//
// Therefore we query:
//
// "parts_used.part_id": "SP001"
//
// If a historical maintenance record references the part,
// deletion is blocked.
//
// =========================================================

export const deleteSparePart =
  async (
    partId: string
  ) => {

    const normalizedPartId =
      partId
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Check whether Spare Part exists
    // -----------------------------------------------------

    const sparePart =
      await SparePart.findOne({
        part_id:
          normalizedPartId
      });


    if (!sparePart) {

      return null;
    }


    // =====================================================
    // CHECK MAINTENANCE HISTORY
    // =====================================================
    //
    // MongoDB searches inside the embedded array:
    //
    // maintenance_records
    //       ↓
    // parts_used[]
    //       ↓
    // part_id
    //
    // =====================================================

    const maintenanceExists =
      await MaintenanceRecord.exists({
        "parts_used.part_id":
          normalizedPartId
      });


    if (maintenanceExists) {

      throw new Error(
        `Cannot delete ${normalizedPartId} because this spare part is referenced by maintenance records. Historical maintenance data must be preserved.`
      );
    }


    // =====================================================
    // SAFE TO DELETE
    // =====================================================

    return SparePart.findOneAndDelete({
      part_id:
        normalizedPartId
    });
  };