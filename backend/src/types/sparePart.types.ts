export type StockStatus =
  | "Available"
  | "Low Stock"
  | "Out of Stock";


export interface ISparePart {
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

  last_restock_date?: Date;

  stock_status: StockStatus;
}


export interface CreateSparePartInput {
  part_id: string;

  part_name: string;
  part_category: string;

  manufacturer?: string;

  compatible_bus_models?: string[];

  depot_id: string;

  quantity_in_stock: number;
  reorder_level: number;

  unit_cost: number;

  supplier_name?: string;

  last_restock_date?: string | Date;
}


export type UpdateSparePartInput =
  Partial<
    Omit<
      CreateSparePartInput,
      "part_id"
    >
  >;