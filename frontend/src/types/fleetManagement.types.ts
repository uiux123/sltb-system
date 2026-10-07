// =========================================================
// BUS ENUM TYPES
// =========================================================

export type BusStatus =
  | "Operational"
  | "Under Maintenance"
  | "Breakdown"
  | "Out of Service";


export type FuelType =
  | "Diesel"
  | "Electric"
  | "Hybrid";


// =========================================================
// BUS
// =========================================================

export interface IBus {

  _id?: string;

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  manufacture_year: number;

  capacity: number;

  fuel_type: FuelType;

  odometer_km: number;

  bus_status: BusStatus;

  last_service_date: string;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// BUS CREATE / UPDATE INPUT
// =========================================================

export interface IBusInput {

  bus_id: string;

  registration_no: string;

  depot_id: string;

  manufacturer: string;

  model: string;

  manufacture_year: number;

  capacity: number;

  fuel_type: FuelType;

  odometer_km: number;

  bus_status: BusStatus;

  last_service_date: string;

}


// =========================================================
// DEPOT
// =========================================================

export interface IDepot {

  _id?: string;

  depot_id: string;

  depot_name: string;

  region: string;

  location: string;

  total_staff: number;

  monthly_fixed_cost: number;

  manager_name?: string;

  contact_number?: string;

  status: "Active" | "Inactive";

  createdAt?: string;

  updatedAt?: string;

}