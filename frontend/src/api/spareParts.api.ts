import {
  apiClient
} from "@/api/apiClient";

import type {
  ISparePart,
  ISparePartCreateInput,
  ISparePartRestockInput,
  ISparePartUpdateInput
} from "@/types/sparePartManagement.types";


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

const getSpareParts =
  async (): Promise<ISparePart[]> => {

    const response =
      await apiClient.get<
        IListResponse<ISparePart>
      >(
        "/spare-parts"
      );


    return response.data.data;

  };


// =========================================================
// GET ONE
// =========================================================

const getSparePartById =
  async (
    partId: string
  ): Promise<ISparePart> => {

    const response =
      await apiClient.get<
        ISingleResponse<ISparePart>
      >(
        `/spare-parts/${partId}`
      );


    return response.data.data;

  };


// =========================================================
// GET LOW STOCK
// =========================================================

const getLowStockParts =
  async (): Promise<ISparePart[]> => {

    const response =
      await apiClient.get<
        IListResponse<ISparePart>
      >(
        "/spare-parts/low-stock"
      );


    return response.data.data;

  };


// =========================================================
// GET BY DEPOT
// =========================================================

const getSparePartsByDepot =
  async (
    depotId: string
  ): Promise<ISparePart[]> => {

    const response =
      await apiClient.get<
        IListResponse<ISparePart>
      >(
        `/spare-parts/depot/${depotId}`
      );


    return response.data.data;

  };


// =========================================================
// CREATE
// =========================================================

const createSparePart =
  async (
    input:
      ISparePartCreateInput
  ): Promise<ISparePart> => {

    const response =
      await apiClient.post<
        ISingleResponse<ISparePart>
      >(
        "/spare-parts",
        input
      );


    return response.data.data;

  };


// =========================================================
// UPDATE
// =========================================================

const updateSparePart =
  async (
    partId: string,
    input:
      ISparePartUpdateInput
  ): Promise<ISparePart> => {

    const response =
      await apiClient.put<
        ISingleResponse<ISparePart>
      >(
        `/spare-parts/${partId}`,
        input
      );


    return response.data.data;

  };


// =========================================================
// RESTOCK
// =========================================================

const restockSparePart =
  async (
    partId: string,
    input:
      ISparePartRestockInput
  ): Promise<ISparePart> => {

    const response =
      await apiClient.patch<
        ISingleResponse<ISparePart>
      >(
        `/spare-parts/${partId}/restock`,
        input
      );


    return response.data.data;

  };


// =========================================================
// DELETE
// =========================================================

const deleteSparePart =
  async (
    partId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/spare-parts/${partId}`
      );


    return response.data;

  };


// =========================================================
// EXPORT
// =========================================================

export const sparePartsApi = {

  getAll:
    getSpareParts,

  getById:
    getSparePartById,

  getLowStock:
    getLowStockParts,

  getByDepot:
    getSparePartsByDepot,

  create:
    createSparePart,

  update:
    updateSparePart,

  restock:
    restockSparePart,

  delete:
    deleteSparePart

};