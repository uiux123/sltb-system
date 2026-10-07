export interface IFuelRecord {
  fuel_record_id: string;

  trip_id: string;
  bus_id: string;
  depot_id: string;

  fuel_date: Date;

  fuel_litres: number;
  fuel_cost_per_litre: number;

  total_fuel_cost: number;

  operated_km: number;

  km_per_litre: number;
  fuel_cost_per_km: number;

  recorded_by?: string;
}


export interface CreateFuelRecordInput {
  fuel_record_id: string;

  trip_id: string;

  fuel_litres: number;
  fuel_cost_per_litre: number;

  recorded_by?: string;
}


export type UpdateFuelRecordInput =
  Partial<
    Pick<
      CreateFuelRecordInput,
      | "fuel_litres"
      | "fuel_cost_per_litre"
      | "recorded_by"
    >
  >;