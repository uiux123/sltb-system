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

export interface IRoute {
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

export type CreateRouteInput = IRoute;

export type UpdateRouteInput = Partial<
  Omit<IRoute, "route_id">
>;