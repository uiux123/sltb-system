// =========================================================
// STEP 10
// ANALYTICS FILTER TYPES
// =========================================================


// =========================================================
// RAW FILTER INPUT
// =========================================================

export interface IAnalyticsFilterInput {

  depot_id?: string;

  bus_id?: string;

  route_id?: string;

  start_date?: string;

  end_date?: string;

}


// =========================================================
// PARSED INTERNAL FILTERS
// =========================================================
//
// Date objects are used internally for MongoDB matching.
//
// end_date_exclusive means:
//
// User:
// end_date = 2026-01-31
//
// MongoDB:
// < 2026-02-01 00:00
//
// This includes the entire selected end date.
//
// =========================================================

export interface IParsedAnalyticsFilters
  extends IAnalyticsFilterInput {

  start_date_value?: Date;

  end_date_exclusive_value?: Date;

}


// =========================================================
// FILTER OPTION TYPES
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
// FILTER SCOPE
// =========================================================
//
// Not every filter logically applies to every collection.
//
// Example:
//
// route_id applies to Trips, Fuel and Revenue.
//
// Maintenance is Bus/Depot based rather than Route based.
//
// =========================================================

export interface IAnalyticsFilterScope {

  fleet: string[];

  operations: string[];

  fuel: string[];

  revenue: string[];

  maintenance: string[];

}


// =========================================================
// FILTERED FLEET SUMMARY
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
// FILTERED OPERATIONS SUMMARY
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
// FILTERED FUEL SUMMARY
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
// FILTERED REVENUE SUMMARY
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
// FILTERED MAINTENANCE SUMMARY
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
// COMPLETE FILTERED ANALYTICS RESPONSE
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