// =========================================================
// STOCK STATUS
// =========================================================

export type SparePartStockStatus =
  | "Available"
  | "Low Stock"
  | "Out of Stock";


// =========================================================
// SPARE PART
// =========================================================

export interface ISparePart {

  _id?: string;

  part_id: string;

  part_name: string;

  part_category: string;

  manufacturer?: string;

  compatible_bus_models: string[];

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  unit_cost: number;

  supplier_name?: string;

  last_restock_date: string;

  stock_status: SparePartStockStatus;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// CREATE INPUT
// =========================================================
//
// stock_status is NOT supplied.
// Backend calculates it.
//
// =========================================================

export interface ISparePartCreateInput {

  part_id: string;

  part_name: string;

  part_category: string;

  manufacturer?: string;

  compatible_bus_models: string[];

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  unit_cost: number;

  supplier_name?: string;

  last_restock_date: string;

}


// =========================================================
// UPDATE INPUT
// =========================================================
//
// part_id is immutable.
//
// quantity_in_stock is preserved during normal edit.
// Dedicated restock is available separately.
//
// stock_status remains backend-calculated.
//
// =========================================================

export interface ISparePartUpdateInput {

  part_name: string;

  part_category: string;

  manufacturer?: string;

  compatible_bus_models: string[];

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  unit_cost: number;

  supplier_name?: string;

  last_restock_date: string;

}


// =========================================================
// RESTOCK INPUT
// =========================================================

export interface ISparePartRestockInput {

  quantity: number;

}