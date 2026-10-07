// =========================================================
// ROUTE TYPES
// =========================================================

export type RouteStatus =
  | "Active"
  | "Inactive";


export type RouteType =
  | "Urban"
  | "Intercity"
  | "Rural"
  | "School"
  | "Night"
  | "Other";


// =========================================================
// ROUTE
// =========================================================

export interface IRoute {

  _id?: string;

  route_id: string;

  route_number: string;

  origin: string;

  destination: string;

  distance_km: number;

  route_type: RouteType;

  scheduled_trips_per_day: number;

  average_fare: number;

  social_service_route: boolean;

  status: RouteStatus;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// ROUTE INPUT
// =========================================================

export interface IRouteInput {

  route_id: string;

  route_number: string;

  origin: string;

  destination: string;

  distance_km: number;

  route_type: RouteType;

  scheduled_trips_per_day: number;

  average_fare: number;

  social_service_route: boolean;

  status: RouteStatus;

}


// =========================================================
// TRIP STATUS
// =========================================================

export type TripStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Missed";


// =========================================================
// TRIP
// =========================================================

export interface ITrip {

  _id?: string;

  trip_id: string;

  bus_id: string;

  route_id: string;

  depot_id: string;

  trip_date: string;

  scheduled_departure: string;

  actual_departure?: string | null;

  scheduled_arrival: string;

  actual_arrival?: string | null;

  passenger_count: number;

  operated_km: number;

  trip_status: TripStatus;

  delay_minutes: number;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// TRIP INPUT
// =========================================================
//
// delay_minutes is deliberately excluded.
//
// The backend remains responsible for calculating delay.
//
// =========================================================

export interface ITripInput {

  trip_id: string;

  bus_id: string;

  route_id: string;

  depot_id: string;

  trip_date: string;

  scheduled_departure: string;

  actual_departure?: string;

  scheduled_arrival: string;

  actual_arrival?: string;

  passenger_count: number;

  operated_km: number;

  trip_status: TripStatus;

}