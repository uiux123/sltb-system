import {
  apiClient
} from "@/api/apiClient";

import type {
  IBus,
  IBusInput,
  IDepot
} from "@/types/fleetManagement.types";


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
// GET ALL BUSES
// =========================================================

export const getBuses =
  async (): Promise<IBus[]> => {

    const response =
      await apiClient.get<
        IListResponse<IBus>
      >(
        "/buses"
      );


    return response.data.data;

  };


// =========================================================
// GET ONE BUS
// =========================================================

export const getBusById =
  async (
    busId: string
  ): Promise<IBus> => {

    const response =
      await apiClient.get<
        ISingleResponse<IBus>
      >(
        `/buses/${busId}`
      );


    return response.data.data;

  };


// =========================================================
// CREATE BUS
// =========================================================

export const createBus =
  async (
    input: IBusInput
  ): Promise<IBus> => {

    const response =
      await apiClient.post<
        ISingleResponse<IBus>
      >(
        "/buses",
        input
      );


    return response.data.data;

  };


// =========================================================
// UPDATE BUS
// =========================================================

export const updateBus =
  async (
    busId: string,
    input: IBusInput
  ): Promise<IBus> => {

    const response =
      await apiClient.put<
        ISingleResponse<IBus>
      >(
        `/buses/${busId}`,
        input
      );


    return response.data.data;

  };


// =========================================================
// DELETE BUS
// =========================================================

export const deleteBus =
  async (
    busId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/buses/${busId}`
      );


    return response.data;

  };


// =========================================================
// GET DEPOTS
// =========================================================

export const getDepots =
  async (): Promise<IDepot[]> => {

    const response =
      await apiClient.get<
        IListResponse<IDepot>
      >(
        "/depots"
      );


    return response.data.data;

  };


// =========================================================
// EXPORTED API OBJECT
// =========================================================

export const busesApi = {

  getAll:
    getBuses,

  getById:
    getBusById,

  create:
    createBus,

  update:
    updateBus,

  delete:
    deleteBus,

  getDepots

};