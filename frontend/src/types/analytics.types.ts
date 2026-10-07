// =========================================================
// ANALYTICS HEALTH
// =========================================================

export interface IAnalyticsCollectionCounts {

  depots: number;

  routes: number;

  buses: number;

  spare_parts: number;

  trips: number;

  fuel_records: number;

  ticket_sales: number;

  maintenance_records: number;

}


export interface IAnalyticsModuleStatus {

  module: string;

  status: string;

  database_access: boolean;

  collections: IAnalyticsCollectionCounts;

  total_documents: number;

}


// =========================================================
// OVERVIEW ANALYTICS
// =========================================================

export interface INetworkOverview {

  total_depots: number;

  total_routes: number;

}


export interface IFleetOverview {

  total_buses: number;

  operational_buses: number;

  under_maintenance_buses: number;

  breakdown_buses: number;

  out_of_service_buses: number;

  fleet_availability_percentage: number;

}


export interface ITripOverview {

  total_trips: number;

  completed_trips: number;

  total_passengers: number;

  average_passengers_per_trip: number;

  average_delay_minutes: number;

  total_operated_km: number;

}


export interface IFuelOverview {

  total_fuel_litres: number;

  total_fuel_cost: number;

  average_km_per_litre: number;

  average_fuel_cost_per_km: number;

}


export interface IRevenueOverview {

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

}


export interface IMaintenanceOverview {

  total_maintenance_records: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_parts_cost: number;

  total_labour_cost: number;

  total_maintenance_cost: number;

  average_repair_cost: number;

  total_downtime_hours: number;

}


export interface IInventoryOverview {

  total_spare_part_records: number;

  available_parts: number;

  low_stock_parts: number;

  out_of_stock_parts: number;

  total_units_in_stock: number;

  total_inventory_value: number;

}


export interface IOverviewAnalytics {

  network: INetworkOverview;

  fleet: IFleetOverview;

  operations: ITripOverview;

  fuel: IFuelOverview;

  revenue: IRevenueOverview;

  maintenance: IMaintenanceOverview;

  inventory: IInventoryOverview;

}


// =========================================================
// FLEET ANALYTICS
// =========================================================

export interface IFleetStatusDistribution {

  status: string;

  count: number;

  percentage: number;

}


export interface IFleetFuelTypeDistribution {

  fuel_type: string;

  count: number;

  percentage: number;

}


export interface IDepotFleetAnalytics {

  depot_id: string;

  depot_name: string;

  total_buses: number;

  operational_buses: number;

  under_maintenance_buses: number;

  breakdown_buses: number;

  out_of_service_buses: number;

  availability_percentage: number;

  average_capacity: number;

  average_odometer_km: number;

}


export interface IFleetAgeUsageSummary {

  average_vehicle_age_years: number;

  oldest_vehicle_age_years: number;

  newest_vehicle_age_years: number;

  average_odometer_km: number;

  maximum_odometer_km: number;

  minimum_odometer_km: number;

  total_passenger_capacity: number;

  average_bus_capacity: number;

}


export interface IHighOdometerBus {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  manufacture_year: number;

  bus_status: string;

  odometer_km: number;

}


export interface IFleetAnalytics {

  summary: IFleetOverview;

  status_distribution: IFleetStatusDistribution[];

  fuel_type_distribution: IFleetFuelTypeDistribution[];

  depot_performance: IDepotFleetAnalytics[];

  age_and_usage: IFleetAgeUsageSummary;

  highest_odometer_buses: IHighOdometerBus[];

}


// =========================================================
// ROUTE / TRIP ANALYTICS
// =========================================================

export interface IRouteTripSummary {

  total_trips: number;

  completed_trips: number;

  total_passengers: number;

  average_passengers_per_trip: number;

  average_delay_minutes: number;

  total_operated_km: number;

  average_load_factor_percentage: number;

}


export interface IRoutePerformance {

  route_id: string;

  route_number: string;

  origin: string;

  destination: string;

  route_type: string;

  route_status: string;

  distance_km: number;

  total_trips: number;

  total_passengers: number;

  average_passengers_per_trip: number;

  average_delay_minutes: number;

  total_operated_km: number;

  average_load_factor_percentage: number;

}


export interface IDelayDistribution {

  delay_range: string;

  count: number;

  percentage: number;

}


export interface IRouteTripAnalytics {

  summary: IRouteTripSummary;

  route_performance: IRoutePerformance[];

  highest_passenger_routes: IRoutePerformance[];

  highest_delay_routes: IRoutePerformance[];

  highest_load_factor_routes: IRoutePerformance[];

  delay_distribution: IDelayDistribution[];

}


// =========================================================
// FUEL ANALYTICS
// =========================================================

export interface IFuelAnalyticsSummary {

  total_fuel_records: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  total_operated_km: number;

  overall_km_per_litre: number;

  overall_fuel_cost_per_km: number;

  average_fuel_price_per_litre: number;

}


export interface IBusFuelPerformance {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  fuel_type: string;

  total_fuel_records: number;

  total_operated_km: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  km_per_litre: number;

  fuel_cost_per_km: number;

}


export interface IDepotFuelPerformance {

  depot_id: string;

  depot_name: string;

  total_fuel_records: number;

  total_operated_km: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  km_per_litre: number;

  fuel_cost_per_km: number;

}


export interface IFuelTrendPoint {

  date: string;

  fuel_records: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  total_operated_km: number;

  km_per_litre: number;

  fuel_cost_per_km: number;

}


export interface IFuelAnalytics {

  summary: IFuelAnalyticsSummary;

  bus_performance: IBusFuelPerformance[];

  depot_performance: IDepotFuelPerformance[];

  daily_trend: IFuelTrendPoint[];

  highest_efficiency_buses: IBusFuelPerformance[];

  lowest_efficiency_buses: IBusFuelPerformance[];

  highest_fuel_cost_buses: IBusFuelPerformance[];

}


// =========================================================
// REVENUE ANALYTICS
// =========================================================

export interface IRevenueAnalyticsSummary {

  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;

  average_revenue_per_ticket: number;

  average_revenue_per_trip: number;

}


export interface IRouteRevenuePerformance {

  route_id: string;

  route_number: string;

  origin: string;

  destination: string;

  route_type: string;

  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;

  average_revenue_per_ticket: number;

}


export interface IDepotRevenuePerformance {

  depot_id: string;

  depot_name: string;

  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;

  average_revenue_per_ticket: number;

}


export interface IRevenueTrendPoint {

  date: string;

  ticket_records: number;

  tickets_sold: number;

  actual_revenue: number;

  expected_revenue: number;

  revenue_difference: number;

  revenue_achievement_percentage: number;

}


export interface IRevenueAnalytics {

  summary: IRevenueAnalyticsSummary;

  route_performance: IRouteRevenuePerformance[];

  depot_performance: IDepotRevenuePerformance[];

  daily_trend: IRevenueTrendPoint[];

  highest_revenue_routes: IRouteRevenuePerformance[];

  largest_revenue_shortfall_routes:
    IRouteRevenuePerformance[];

  highest_revenue_depots:
    IDepotRevenuePerformance[];

}


// =========================================================
// MAINTENANCE ANALYTICS
// =========================================================

export interface IMaintenanceAnalyticsSummary {

  total_maintenance_records: number;

  preventive_maintenance: number;

  corrective_maintenance: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_parts_cost: number;

  total_labour_cost: number;

  total_maintenance_cost: number;

  average_repair_cost: number;

  total_downtime_hours: number;

  average_downtime_hours: number;

}


export interface IMaintenanceTypeDistribution {

  maintenance_type: string;

  count: number;

  percentage: number;

  total_maintenance_cost: number;

  average_maintenance_cost: number;

  total_downtime_hours: number;

}


export interface IMaintenanceStatusDistribution {

  status: string;

  count: number;

  percentage: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;

}


export interface IFaultCategoryAnalytics {

  fault_category: string;

  maintenance_count: number;

  total_maintenance_cost: number;

  average_maintenance_cost: number;

  total_downtime_hours: number;

  average_downtime_hours: number;

}


export interface IBusMaintenancePerformance {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  bus_status: string;

  total_maintenance_records: number;

  preventive_maintenance: number;

  corrective_maintenance: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_parts_cost: number;

  total_labour_cost: number;

  total_maintenance_cost: number;

  average_repair_cost: number;

  total_downtime_hours: number;

  average_downtime_hours: number;

}


export interface IDepotMaintenancePerformance {

  depot_id: string;

  depot_name: string;

  total_maintenance_records: number;

  preventive_maintenance: number;

  corrective_maintenance: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_parts_cost: number;

  total_labour_cost: number;

  total_maintenance_cost: number;

  average_repair_cost: number;

  total_downtime_hours: number;

  average_downtime_hours: number;

}


export interface IMaintenanceTrendPoint {

  month: string;

  maintenance_records: number;

  preventive_maintenance: number;

  corrective_maintenance: number;

  total_parts_cost: number;

  total_labour_cost: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;

}


export interface IMaintenanceAnalytics {

  summary: IMaintenanceAnalyticsSummary;

  type_distribution:
    IMaintenanceTypeDistribution[];

  status_distribution:
    IMaintenanceStatusDistribution[];

  fault_categories:
    IFaultCategoryAnalytics[];

  bus_performance:
    IBusMaintenancePerformance[];

  depot_performance:
    IDepotMaintenancePerformance[];

  monthly_trend:
    IMaintenanceTrendPoint[];

  highest_maintenance_cost_buses:
    IBusMaintenancePerformance[];

  highest_downtime_buses:
    IBusMaintenancePerformance[];

}


// =========================================================
// INVENTORY ANALYTICS
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


export interface IStockStatusDistribution {

  stock_status: string;

  part_records: number;

  percentage: number;

  total_units_in_stock: number;

  inventory_value: number;

}


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


// =========================================================
// INTEGRATED BUS PERFORMANCE
// =========================================================

export interface IBusAnalyticsDataPresence {

  has_trip_data: boolean;

  has_fuel_data: boolean;

  has_revenue_data: boolean;

  has_maintenance_data: boolean;

}


export interface IIntegratedBusPerformance {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  depot_name: string;

  manufacturer: string;

  model: string;

  manufacture_year: number;

  fuel_type: string;

  bus_status: string;

  capacity: number;

  odometer_km: number;


  total_trips: number;

  completed_trips: number;

  total_passengers: number;

  total_operated_km: number;

  average_delay_minutes: number;

  average_load_factor_percentage: number;


  total_fuel_records: number;

  fuel_operated_km: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  km_per_litre: number;

  fuel_cost_per_km: number;


  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;


  total_maintenance_records: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;


  tracked_operating_cost: number;

  revenue_less_tracked_costs: number;

  tracked_cost_to_revenue_percentage: number;


  data_presence: IBusAnalyticsDataPresence;

}


export interface IIntegratedBusAnalyticsSummary {

  total_buses: number;

  buses_with_trip_data: number;

  buses_with_fuel_data: number;

  buses_with_revenue_data: number;

  buses_with_maintenance_data: number;

  total_trips: number;

  total_passengers: number;

  total_operated_km: number;

  average_load_factor_percentage: number;

  total_ticket_revenue: number;

  total_expected_revenue: number;

  total_fuel_cost: number;

  total_maintenance_cost: number;

  total_tracked_operating_cost: number;

  revenue_less_tracked_costs: number;

  tracked_cost_to_revenue_percentage: number;

  total_downtime_hours: number;

}


export interface IIntegratedBusAnalytics {

  summary: IIntegratedBusAnalyticsSummary;

  bus_performance:
    IIntegratedBusPerformance[];

  highest_passenger_buses:
    IIntegratedBusPerformance[];

  highest_revenue_buses:
    IIntegratedBusPerformance[];

  highest_fuel_cost_buses:
    IIntegratedBusPerformance[];

  highest_maintenance_cost_buses:
    IIntegratedBusPerformance[];

  highest_downtime_buses:
    IIntegratedBusPerformance[];

}


// =========================================================
// ANALYTICS FILTER OPTIONS
// =========================================================

export interface IAnalyticsDepotOption {

  depot_id: string;

  depot_name: string;

}


export interface IAnalyticsBusOption {

  bus_id: string;

  registration_no: string;

  depot_id: string;

}


export interface IAnalyticsRouteOption {

  route_id: string;

  route_number: string;

  origin: string;

  destination: string;

}


export interface IAnalyticsFilterOptions {

  depots: IAnalyticsDepotOption[];

  buses: IAnalyticsBusOption[];

  routes: IAnalyticsRouteOption[];

}


// =========================================================
// FILTER INPUT
// =========================================================

export interface IAnalyticsFilterInput {

  depot_id?: string;

  bus_id?: string;

  route_id?: string;

  start_date?: string;

  end_date?: string;

}


// =========================================================
// FILTER SCOPE
// =========================================================

export interface IAnalyticsFilterScope {

  fleet: string[];

  operations: string[];

  fuel: string[];

  revenue: string[];

  maintenance: string[];

}


// =========================================================
// FILTERED FLEET
// =========================================================

export interface IFilteredFleetSummary {

  total_buses: number;

  operational_buses: number;

  under_maintenance_buses: number;

  breakdown_buses: number;

  out_of_service_buses: number;

  fleet_availability_percentage: number;

}


// =========================================================
// FILTERED OPERATIONS
// =========================================================

export interface IFilteredOperationsSummary {

  total_trips: number;

  completed_trips: number;

  total_passengers: number;

  average_passengers_per_trip: number;

  average_delay_minutes: number;

  total_operated_km: number;

}


// =========================================================
// FILTERED FUEL
// =========================================================

export interface IFilteredFuelSummary {

  total_fuel_records: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  total_operated_km: number;

  overall_km_per_litre: number;

  overall_fuel_cost_per_km: number;

}


// =========================================================
// FILTERED REVENUE
// =========================================================

export interface IFilteredRevenueSummary {

  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;

}


// =========================================================
// FILTERED MAINTENANCE
// =========================================================

export interface IFilteredMaintenanceSummary {

  total_maintenance_records: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  preventive_maintenance: number;

  corrective_maintenance: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;

}


// =========================================================
// COMPLETE FILTERED ANALYTICS
// =========================================================

export interface IFilteredAnalytics {

  applied_filters: IAnalyticsFilterInput;

  filter_scope: IAnalyticsFilterScope;

  fleet: IFilteredFleetSummary;

  operations: IFilteredOperationsSummary;

  fuel: IFilteredFuelSummary;

  revenue: IFilteredRevenueSummary;

  maintenance: IFilteredMaintenanceSummary;

}