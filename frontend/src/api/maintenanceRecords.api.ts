import {
  apiClient
} from "@/api/apiClient";

import type {
  IMaintenanceCreateInput,
  IMaintenanceRecord,
  IMaintenanceUpdateInput
} from "@/types/maintenanceManagement.types";


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
// GET ALL
// =========================================================

const getMaintenanceRecords =
  async (): Promise<IMaintenanceRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IMaintenanceRecord>
      >(
        "/maintenance-records"
      );


    return response.data.data;

  };


// =========================================================
// GET ONE
// =========================================================

const getMaintenanceRecordById =
  async (
    maintenanceId: string
  ): Promise<IMaintenanceRecord> => {

    const response =
      await apiClient.get<
        ISingleResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/${maintenanceId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY BUS
// =========================================================

const getMaintenanceRecordsByBus =
  async (
    busId: string
  ): Promise<IMaintenanceRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/bus/${busId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY DEPOT
// =========================================================

const getMaintenanceRecordsByDepot =
  async (
    depotId: string
  ): Promise<IMaintenanceRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/depot/${depotId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY STATUS
// =========================================================

const getMaintenanceRecordsByStatus =
  async (
    status: string
  ): Promise<IMaintenanceRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/status/${encodeURIComponent(
          status
        )}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY PART
// =========================================================

const getMaintenanceRecordsByPart =
  async (
    partId: string
  ): Promise<IMaintenanceRecord[]> => {

    const response =
      await apiClient.get<
        IListResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/part/${partId}`
      );


    return response.data.data;

  };


// =========================================================
// CREATE
// =========================================================

const createMaintenanceRecord =
  async (
    input:
      IMaintenanceCreateInput
  ): Promise<IMaintenanceRecord> => {

    const response =
      await apiClient.post<
        ISingleResponse<IMaintenanceRecord>
      >(
        "/maintenance-records",
        input
      );


    return response.data.data;

  };


// =========================================================
// UPDATE
// =========================================================

const updateMaintenanceRecord =
  async (
    maintenanceId: string,
    input:
      IMaintenanceUpdateInput
  ): Promise<IMaintenanceRecord> => {

    const response =
      await apiClient.put<
        ISingleResponse<IMaintenanceRecord>
      >(
        `/maintenance-records/${maintenanceId}`,
        input
      );


    return response.data.data;

  };


// =========================================================
// DELETE
// =========================================================
//
// Backend transaction:
// 1. Restore spare-part quantities.
// 2. Delete maintenance record.
// 3. Synchronize bus status.
// 4. Commit or roll back together.
//
// =========================================================

const deleteMaintenanceRecord =
  async (
    maintenanceId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/maintenance-records/${maintenanceId}`
      );


    return response.data;

  };


// =========================================================
// EXPORT
// =========================================================

export const maintenanceRecordsApi = {

  getAll:
    getMaintenanceRecords,

  getById:
    getMaintenanceRecordById,

  getByBus:
    getMaintenanceRecordsByBus,

  getByDepot:
    getMaintenanceRecordsByDepot,

  getByStatus:
    getMaintenanceRecordsByStatus,

  getByPart:
    getMaintenanceRecordsByPart,

  create:
    createMaintenanceRecord,

  update:
    updateMaintenanceRecord,

  delete:
    deleteMaintenanceRecord

};