import {
  apiClient
} from "@/api/apiClient";

import type {
  ITicketSale,
  ITicketSaleCreateInput,
  ITicketSaleUpdateInput
} from "@/types/ticketSalesManagement.types";


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

const getTicketSales =
  async (): Promise<ITicketSale[]> => {

    const response =
      await apiClient.get<
        IListResponse<ITicketSale>
      >(
        "/ticket-sales"
      );


    return response.data.data;

  };


// =========================================================
// GET BY ID
// =========================================================

const getTicketSaleById =
  async (
    ticketRecordId: string
  ): Promise<ITicketSale> => {

    const response =
      await apiClient.get<
        ISingleResponse<ITicketSale>
      >(
        `/ticket-sales/${ticketRecordId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY TRIP
// =========================================================

const getTicketSaleByTrip =
  async (
    tripId: string
  ): Promise<ITicketSale> => {

    const response =
      await apiClient.get<
        ISingleResponse<ITicketSale>
      >(
        `/ticket-sales/trip/${tripId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY ROUTE
// =========================================================

const getTicketSalesByRoute =
  async (
    routeId: string
  ): Promise<ITicketSale[]> => {

    const response =
      await apiClient.get<
        IListResponse<ITicketSale>
      >(
        `/ticket-sales/route/${routeId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY DEPOT
// =========================================================

const getTicketSalesByDepot =
  async (
    depotId: string
  ): Promise<ITicketSale[]> => {

    const response =
      await apiClient.get<
        IListResponse<ITicketSale>
      >(
        `/ticket-sales/depot/${depotId}`
      );


    return response.data.data;

  };


// =========================================================
// GET BY BUS
// =========================================================

const getTicketSalesByBus =
  async (
    busId: string
  ): Promise<ITicketSale[]> => {

    const response =
      await apiClient.get<
        IListResponse<ITicketSale>
      >(
        `/ticket-sales/bus/${busId}`
      );


    return response.data.data;

  };


// =========================================================
// CREATE
// =========================================================

const createTicketSale =
  async (
    input:
      ITicketSaleCreateInput
  ): Promise<ITicketSale> => {

    const response =
      await apiClient.post<
        ISingleResponse<ITicketSale>
      >(
        "/ticket-sales",
        input
      );


    return response.data.data;

  };


// =========================================================
// UPDATE
// =========================================================

const updateTicketSale =
  async (
    ticketRecordId: string,
    input:
      ITicketSaleUpdateInput
  ): Promise<ITicketSale> => {

    const response =
      await apiClient.put<
        ISingleResponse<ITicketSale>
      >(
        `/ticket-sales/${ticketRecordId}`,
        input
      );


    return response.data.data;

  };


// =========================================================
// DELETE
// =========================================================

const deleteTicketSale =
  async (
    ticketRecordId: string
  ): Promise<IActionResponse> => {

    const response =
      await apiClient.delete<
        IActionResponse
      >(
        `/ticket-sales/${ticketRecordId}`
      );


    return response.data;

  };


// =========================================================
// EXPORT
// =========================================================

export const ticketSalesApi = {

  getAll:
    getTicketSales,

  getById:
    getTicketSaleById,

  getByTrip:
    getTicketSaleByTrip,

  getByRoute:
    getTicketSalesByRoute,

  getByDepot:
    getTicketSalesByDepot,

  getByBus:
    getTicketSalesByBus,

  create:
    createTicketSale,

  update:
    updateTicketSale,

  delete:
    deleteTicketSale

};