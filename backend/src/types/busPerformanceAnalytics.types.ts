// =========================================================
// STEP 9
// INTEGRATED BUS PERFORMANCE ANALYTICS TYPES
// =========================================================


// =========================================================
// DATA PRESENCE
// =========================================================
//
// Shows whether a Bus has related operational records.
//
// Useful because future databases may contain Buses that
// have not yet operated a Trip or received Maintenance.
//
// =========================================================

export interface IBusAnalyticsDataPresence {

  has_trip_data: boolean;

  has_fuel_data: boolean;

  has_revenue_data: boolean;

  has_maintenance_data: boolean;

}


// =========================================================
// INDIVIDUAL BUS PERFORMANCE
// =========================================================

export interface IIntegratedBusPerformance {

  // -------------------------------------------------------
  // Bus Identity
  // -------------------------------------------------------

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


  // -------------------------------------------------------
  // Trip / Operational Analytics
  // -------------------------------------------------------

  total_trips: number;

  completed_trips: number;

  total_passengers: number;

  total_operated_km: number;

  average_delay_minutes: number;

  average_load_factor_percentage: number;


  // -------------------------------------------------------
  // Fuel Analytics
  // -------------------------------------------------------

  total_fuel_records: number;

  fuel_operated_km: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  km_per_litre: number;

  fuel_cost_per_km: number;


  // -------------------------------------------------------
  // Revenue Analytics
  // -------------------------------------------------------

  total_ticket_records: number;

  total_tickets_sold: number;

  total_actual_revenue: number;

  total_expected_revenue: number;

  total_revenue_difference: number;

  revenue_achievement_percentage: number;


  // -------------------------------------------------------
  // Maintenance Analytics
  // -------------------------------------------------------

  total_maintenance_records: number;

  completed_maintenance: number;

  in_progress_maintenance: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;


  // -------------------------------------------------------
  // Integrated Cost Indicators
  // -------------------------------------------------------
  //
  // tracked_operating_cost =
  // Fuel Cost + Maintenance Cost
  //
  // It is NOT total organisational operating cost.
  //
  // -------------------------------------------------------

  tracked_operating_cost: number;

  revenue_less_tracked_costs: number;

  tracked_cost_to_revenue_percentage: number;


  // -------------------------------------------------------
  // Data Availability
  // -------------------------------------------------------

  data_presence: IBusAnalyticsDataPresence;

}


// =========================================================
// INTEGRATED SUMMARY
// =========================================================

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


// =========================================================
// COMPLETE STEP 9 RESPONSE
// =========================================================

export interface IIntegratedBusAnalytics {

  summary: IIntegratedBusAnalyticsSummary;

  bus_performance: IIntegratedBusPerformance[];

  highest_passenger_buses: IIntegratedBusPerformance[];

  highest_revenue_buses: IIntegratedBusPerformance[];

  highest_fuel_cost_buses: IIntegratedBusPerformance[];

  highest_maintenance_cost_buses: IIntegratedBusPerformance[];

  highest_downtime_buses: IIntegratedBusPerformance[];

}