// =========================================================
// FUEL RECORD
// =========================================================

export interface IFuelRecord {

  _id?: string;

  fuel_record_id: string;

  trip_id: string;

  bus_id: string;

  depot_id: string;

  fuel_date: string;

  fuel_litres: number;

  fuel_cost_per_litre: number;

  total_fuel_cost: number;

  operated_km: number;

  km_per_litre: number;

  fuel_cost_per_km: number;

  recorded_by?: string;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// CREATE INPUT
// =========================================================
//
// Only these values are supplied by the frontend.
//
// bus_id
// depot_id
// fuel_date
// operated_km
// total_fuel_cost
// km_per_litre
// fuel_cost_per_km
//
// are calculated / derived by the backend.
//
// =========================================================

export interface IFuelRecordCreateInput {

  fuel_record_id: string;

  trip_id: string;

  fuel_litres: number;

  fuel_cost_per_litre: number;

  recorded_by?: string;

}


// =========================================================
// UPDATE INPUT
// =========================================================
//
// trip_id cannot be changed after a Fuel Record has been
// created.
//
// The backend uses the existing Trip and recalculates:
// total_fuel_cost
// operated_km
// km_per_litre
// fuel_cost_per_km
//
// =========================================================

export interface IFuelRecordUpdateInput {

  fuel_litres: number;

  fuel_cost_per_litre: number;

  recorded_by?: string;

}