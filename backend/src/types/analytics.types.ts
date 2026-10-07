// =========================================================
// STEP 1
// ANALYTICS COLLECTION COUNTS
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


// =========================================================
// ANALYTICS MODULE STATUS
// =========================================================

export interface IAnalyticsModuleStatus {
  module: string;
  status: string;
  database_access: boolean;
  collections: IAnalyticsCollectionCounts;
  total_documents: number;
}


// =========================================================
// STEP 2
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
// STEP 3
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
// STEP 4
// ROUTE & TRIP ANALYTICS
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
// STEP 5
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
// STEP 6
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
  largest_revenue_shortfall_routes: IRouteRevenuePerformance[];
  highest_revenue_depots: IDepotRevenuePerformance[];
}


// =========================================================
// STEP 7
// MAINTENANCE ANALYTICS SUMMARY
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


// =========================================================
// MAINTENANCE TYPE DISTRIBUTION
// =========================================================

export interface IMaintenanceTypeDistribution {
  maintenance_type: string;

  count: number;

  percentage: number;

  total_maintenance_cost: number;

  average_maintenance_cost: number;

  total_downtime_hours: number;
}


// =========================================================
// MAINTENANCE STATUS DISTRIBUTION
// =========================================================

export interface IMaintenanceStatusDistribution {
  status: string;

  count: number;

  percentage: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;
}


// =========================================================
// FAULT CATEGORY ANALYTICS
// =========================================================

export interface IFaultCategoryAnalytics {
  fault_category: string;

  maintenance_count: number;

  total_maintenance_cost: number;

  average_maintenance_cost: number;

  total_downtime_hours: number;

  average_downtime_hours: number;
}


// =========================================================
// BUS MAINTENANCE PERFORMANCE
// =========================================================

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


// =========================================================
// DEPOT MAINTENANCE PERFORMANCE
// =========================================================

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


// =========================================================
// MAINTENANCE MONTHLY TREND
// =========================================================

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


// =========================================================
// COMPLETE MAINTENANCE ANALYTICS
// =========================================================

export interface IMaintenanceAnalytics {
  summary: IMaintenanceAnalyticsSummary;

  type_distribution: IMaintenanceTypeDistribution[];

  status_distribution: IMaintenanceStatusDistribution[];

  fault_categories: IFaultCategoryAnalytics[];

  bus_performance: IBusMaintenancePerformance[];

  depot_performance: IDepotMaintenancePerformance[];

  monthly_trend: IMaintenanceTrendPoint[];

  highest_maintenance_cost_buses: IBusMaintenancePerformance[];

  highest_downtime_buses: IBusMaintenancePerformance[];
}