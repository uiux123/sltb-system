// =========================================================
// STEP 8
// INVENTORY ANALYTICS TYPES
// =========================================================


// =========================================================
// INVENTORY SUMMARY
// =========================================================

export interface IInventoryAnalyticsSummary {

  total_part_records: number;

  total_units_in_stock: number;

  total_inventory_value: number;

  available_part_records: number;

  low_stock_part_records: number;

  out_of_stock_part_records: number;

  reorder_attention_records: number;

  total_parts_used_units: number;

  total_parts_usage_cost: number;

}


// =========================================================
// STOCK STATUS DISTRIBUTION
// =========================================================

export interface IStockStatusDistribution {

  stock_status: string;

  part_records: number;

  percentage: number;

  total_units_in_stock: number;

  inventory_value: number;

}


// =========================================================
// INVENTORY BY CATEGORY
// =========================================================

export interface IInventoryCategoryPerformance {

  part_category: string;

  part_records: number;

  total_units_in_stock: number;

  average_unit_cost: number;

  inventory_value: number;

  available_parts: number;

  low_stock_parts: number;

  out_of_stock_parts: number;

}


// =========================================================
// INVENTORY BY DEPOT
// =========================================================

export interface IDepotInventoryPerformance {

  depot_id: string;

  depot_name: string;

  part_records: number;

  total_units_in_stock: number;

  inventory_value: number;

  available_parts: number;

  low_stock_parts: number;

  out_of_stock_parts: number;

}


// =========================================================
// SPARE-PART USAGE
// =========================================================

export interface ISparePartUsage {

  part_id: string;

  part_name: string;

  part_category: string;

  depot_id: string;

  current_quantity_in_stock: number;

  reorder_level: number;

  stock_status: string;

  usage_occurrences: number;

  total_quantity_used: number;

  total_usage_cost: number;

}


// =========================================================
// REORDER ATTENTION ITEM
// =========================================================
//
// This does NOT automatically order anything.
//
// It identifies parts that are currently:
// - Low Stock
// - Out of Stock
//
// =========================================================

export interface IReorderAttentionItem {

  part_id: string;

  part_name: string;

  part_category: string;

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  reorder_gap_units: number;

  unit_cost: number;

  stock_status: string;

}


// =========================================================
// COMPLETE INVENTORY ANALYTICS
// =========================================================

export interface IInventoryAnalytics {

  summary: IInventoryAnalyticsSummary;

  stock_status_distribution:
    IStockStatusDistribution[];

  category_performance:
    IInventoryCategoryPerformance[];

  depot_performance:
    IDepotInventoryPerformance[];

  part_usage:
    ISparePartUsage[];

  most_used_parts:
    ISparePartUsage[];

  reorder_attention:
    IReorderAttentionItem[];

}