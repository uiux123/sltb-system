export type TripStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Missed";


export interface ITrip {
  trip_id: string;

  bus_id: string;
  route_id: string;
  depot_id: string;

  trip_date: Date;

  scheduled_departure: Date;
  actual_departure?: Date;

  scheduled_arrival: Date;
  actual_arrival?: Date;

  passenger_count: number;

  operated_km: number;

  trip_status: TripStatus;

  delay_minutes: number;
}


export interface CreateTripInput {
  trip_id: string;

  bus_id: string;
  route_id: string;
  depot_id: string;

  trip_date: string | Date;

  scheduled_departure: string | Date;
  actual_departure?: string | Date;

  scheduled_arrival: string | Date;
  actual_arrival?: string | Date;

  passenger_count: number;

  operated_km: number;

  trip_status: TripStatus;
}


export type UpdateTripInput = Partial<
  Omit<CreateTripInput, "trip_id">
>;