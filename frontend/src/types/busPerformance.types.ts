// =========================================================
// INTEGRATED BUS PERFORMANCE SUMMARY
// =========================================================

export interface IBusPerformanceSummary {

  total_buses: number;

  total_trips: number;

  total_passengers: number;

  total_operated_km: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  total_revenue: number;

  total_maintenance_cost: number;

  total_operating_cost: number;

  net_operational_balance: number;

  overall_fuel_efficiency: number;

  average_revenue_per_km: number;

  average_operating_cost_per_km: number;

}


// =========================================================
// INDIVIDUAL BUS PERFORMANCE
// =========================================================

export interface IIntegratedBusPerformance {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  bus_status: string;

  fuel_type: string;

  total_trips: number;

  total_passengers: number;

  total_operated_km: number;

  average_delay_minutes: number;

  average_load_factor_percentage: number;

  total_fuel_litres: number;

  total_fuel_cost: number;

  fuel_efficiency_km_per_litre: number;

  fuel_cost_per_km: number;

  total_revenue: number;

  expected_revenue: number;

  revenue_difference: number;

  revenue_per_km: number;

  total_maintenance_records: number;

  in_progress_maintenance: number;

  total_maintenance_cost: number;

  total_downtime_hours: number;

  total_operating_cost: number;

  net_operational_balance: number;

}


// =========================================================
// COMPLETE ANALYTICS RESPONSE
// =========================================================

export interface IBusPerformanceAnalytics {

  summary:
    IBusPerformanceSummary;

  buses:
    IIntegratedBusPerformance[];

  highest_revenue_buses:
    IIntegratedBusPerformance[];

  highest_operating_cost_buses:
    IIntegratedBusPerformance[];

  highest_fuel_efficiency_buses:
    IIntegratedBusPerformance[];

  highest_maintenance_cost_buses:
    IIntegratedBusPerformance[];

}