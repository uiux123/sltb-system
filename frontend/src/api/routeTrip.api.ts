import {
  apiClient
} from "@/api/apiClient";

import type {
  IRoute,
  IRouteInput,
  ITrip,
  ITripInput
} from "@/types/routeTripManagement.types";


// =========================================================
// LIST RESPONSE
// =========================================================

interface IListResponse<T> {

  success: boolean;

  count?: number;

  data: T[];

}


// =========================================================
// SINGLE RESPONSE
// =========================================================

interface ISingleResponse<T> {

  success: boolean;

  message?: string;

  data: T;

}


// =========================================================
// ACTION RESPONSE
// =========================================================

interface IActionResponse {

  success: boolean;

  message: string;

}


// =========================================================
// ROUTES
// =========================================================

const getRoutes =
  async (): Promise<IRoute[]> => {

    const response =
      await apiClient.get<
        IListResponse<IRoute>
      >(
        "/routes"
      );


    return response.data.data;

  };


// =========================================================

const getRouteById =
  async (
    routeId: string
  ): Promise<IRoute> => {

    const response =
      await apiClient.get<
        ISingleResponse<IRoute>
      >(
        `/routes/${routeId}`
      );


    return response.data.data;

  };


// =========================================================

const createRoute =
  async (
    input: IRouteInput
  ): Promise<IRoute> => {

    const response =
      await apiClient.post<
        ISingleResponse<IRoute>
      >(
        "/routes",
        input
      );


    return response.data.data;

  };


// =========================================================

const updateRoute =
  async (
    routeId: string,
    input: IRouteInput
  ): Promise<IRoute> => {

    const response =
      await apiClient.put<
        ISingleResponse<IRoute>
      >(
        `/routes/${routeId}`,
        input
      );


    return response.data.data;

  };


// =========================================================

const deleteRoute =
  async (
    routeId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/routes/${routeId}`
      );


    return response.data;

  };


// =========================================================
// TRIPS
// =========================================================

const getTrips =
  async (): Promise<ITrip[]> => {

    const response =
      await apiClient.get<
        IListResponse<ITrip>
      >(
        "/trips"
      );


    return response.data.data;

  };


// =========================================================

const getTripById =
  async (
    tripId: string
  ): Promise<ITrip> => {

    const response =
      await apiClient.get<
        ISingleResponse<ITrip>
      >(
        `/trips/${tripId}`
      );


    return response.data.data;

  };


// =========================================================

const createTrip =
  async (
    input: ITripInput
  ): Promise<ITrip> => {

    const response =
      await apiClient.post<
        ISingleResponse<ITrip>
      >(
        "/trips",
        input
      );


    return response.data.data;

  };


// =========================================================

const updateTrip =
  async (
    tripId: string,
    input: ITripInput
  ): Promise<ITrip> => {

    const response =
      await apiClient.put<
        ISingleResponse<ITrip>
      >(
        `/trips/${tripId}`,
        input
      );


    return response.data.data;

  };


// =========================================================

const deleteTrip =
  async (
    tripId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/trips/${tripId}`
      );


    return response.data;

  };


// =========================================================
// EXPORT
// =========================================================

export const routeTripApi = {

  routes: {

    getAll:
      getRoutes,

    getById:
      getRouteById,

    create:
      createRoute,

    update:
      updateRoute,

    delete:
      deleteRoute

  },


  trips: {

    getAll:
      getTrips,

    getById:
      getTripById,

    create:
      createTrip,

    update:
      updateTrip,

    delete:
      deleteTrip

  }

};