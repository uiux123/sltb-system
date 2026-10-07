export type BusStatus =
  | "Operational"
  | "Under Maintenance"
  | "Breakdown"
  | "Out of Service";

export type FuelType =
  | "Diesel"
  | "Electric"
  | "Hybrid";

export interface IBus {
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

  last_service_date?: Date;
}

export type CreateBusInput = IBus;

export type UpdateBusInput = Partial<
  Omit<IBus, "bus_id">
>;