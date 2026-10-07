import {
  apiClient
} from "@/api/apiClient";

import type {
  IFuelRecord,
  IFuelRecordCreateInput,
  IFuelRecordUpdateInput
} from "@/types/fuelManagement.types";


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
// GET ALL FUEL RECORDS
// =========================================================

const getFuelRecords =
  async (): Promise<IFuelRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IFuelRecord>
      >(
        "/fuel-records"
      );


    return response.data.data;

  };


// =========================================================
// GET ONE FUEL RECORD
// =========================================================

const getFuelRecordById =
  async (
    fuelRecordId: string
  ): Promise<IFuelRecord> => {

    const response =
      await apiClient.get<
        ISingleResponse<IFuelRecord>
      >(
        `/fuel-records/${fuelRecordId}`
      );


    return response.data.data;

  };


// =========================================================
// GET FUEL RECORD BY TRIP
// =========================================================

const getFuelRecordByTrip =
  async (
    tripId: string
  ): Promise<IFuelRecord> => {

    const response =
      await apiClient.get<
        ISingleResponse<IFuelRecord>
      >(
        `/fuel-records/trip/${tripId}`
      );


    return response.data.data;

  };


// =========================================================
// GET FUEL RECORDS BY BUS
// =========================================================

const getFuelRecordsByBus =
  async (
    busId: string
  ): Promise<IFuelRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IFuelRecord>
      >(
        `/fuel-records/bus/${busId}`
      );


    return response.data.data;

  };


// =========================================================
// GET FUEL RECORDS BY DEPOT
// =========================================================

const getFuelRecordsByDepot =
  async (
    depotId: string
  ): Promise<IFuelRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IFuelRecord>
      >(
        `/fuel-records/depot/${depotId}`
      );


    return response.data.data;

  };


// =========================================================
// CREATE FUEL RECORD
// =========================================================

const createFuelRecord =
  async (
    input:
      IFuelRecordCreateInput
  ): Promise<IFuelRecord> => {

    const response =
      await apiClient.post<
        ISingleResponse<IFuelRecord>
      >(
        "/fuel-records",
        input
      );


    return response.data.data;

  };


// =========================================================
// UPDATE FUEL RECORD
// =========================================================

const updateFuelRecord =
  async (
    fuelRecordId: string,
    input:
      IFuelRecordUpdateInput
  ): Promise<IFuelRecord> => {

    const response =
      await apiClient.put<
        ISingleResponse<IFuelRecord>
      >(
        `/fuel-records/${fuelRecordId}`,
        input
      );


    return response.data.data;

  };


// =========================================================
// DELETE FUEL RECORD
// =========================================================

const deleteFuelRecord =
  async (
    fuelRecordId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/fuel-records/${fuelRecordId}`
      );


    return response.data;

  };


// =========================================================
// EXPORT
// =========================================================

export const fuelRecordsApi = {

  getAll:
    getFuelRecords,

  getById:
    getFuelRecordById,

  getByTrip:
    getFuelRecordByTrip,

  getByBus:
    getFuelRecordsByBus,

  getByDepot:
    getFuelRecordsByDepot,

  create:
    createFuelRecord,

  update:
    updateFuelRecord,

  delete:
    deleteFuelRecord

};