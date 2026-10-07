import {
  Request,
  Response
} from "express";

import * as ticketSaleService
  from "../services/ticketSale.service";

import {
  CreateTicketSaleInput,
  UpdateTicketSaleInput
} from "../types/ticketSales.types";


// CREATE
export const createTicketSale =
  async (
    req: Request<
      {},
      {},
      CreateTicketSaleInput
    >,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSale =
        await ticketSaleService
          .createTicketSale(
            req.body
          );


      res.status(201).json({
        success: true,
        message:
          "Ticket-sales record created successfully",
        data: ticketSale
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to create ticket-sales record";


      res.status(400).json({
        success: false,
        message
      });

    }

  };


// GET ALL
export const getAllTicketSales =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSales =
        await ticketSaleService
          .getAllTicketSales();


      res.status(200).json({
        success: true,
        count:
          ticketSales.length,
        data:
          ticketSales
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket-sales records"
      });

    }

  };


// GET ONE
export const getTicketSaleById =
  async (
    req: Request<{
      ticketRecordId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSale =
        await ticketSaleService
          .getTicketSaleById(
            req.params.ticketRecordId
          );


      if (!ticketSale) {

        res.status(404).json({
          success: false,
          message:
            "Ticket-sales record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        data: ticketSale
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket-sales record"
      });

    }

  };


// GET BY TRIP
export const getTicketSaleByTrip =
  async (
    req: Request<{
      tripId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSale =
        await ticketSaleService
          .getTicketSaleByTrip(
            req.params.tripId
          );


      if (!ticketSale) {

        res.status(404).json({
          success: false,
          message:
            "No ticket-sales record found for this trip"
        });

        return;
      }


      res.status(200).json({
        success: true,
        data: ticketSale
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket sales for this trip"
      });

    }

  };


// GET BY ROUTE
export const getTicketSalesByRoute =
  async (
    req: Request<{
      routeId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSales =
        await ticketSaleService
          .getTicketSalesByRoute(
            req.params.routeId
          );


      res.status(200).json({
        success: true,
        count:
          ticketSales.length,
        data:
          ticketSales
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket sales for this route"
      });

    }

  };


// GET BY DEPOT
export const getTicketSalesByDepot =
  async (
    req: Request<{
      depotId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSales =
        await ticketSaleService
          .getTicketSalesByDepot(
            req.params.depotId
          );


      res.status(200).json({
        success: true,
        count:
          ticketSales.length,
        data:
          ticketSales
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket sales for this depot"
      });

    }

  };


// GET BY BUS
export const getTicketSalesByBus =
  async (
    req: Request<{
      busId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSales =
        await ticketSaleService
          .getTicketSalesByBus(
            req.params.busId
          );


      res.status(200).json({
        success: true,
        count:
          ticketSales.length,
        data:
          ticketSales
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve ticket sales for this bus"
      });

    }

  };


// UPDATE
export const updateTicketSale =
  async (
    req: Request<
      {
        ticketRecordId: string;
      },
      {},
      UpdateTicketSaleInput
    >,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSale =
        await ticketSaleService
          .updateTicketSale(
            req.params.ticketRecordId,
            req.body
          );


      if (!ticketSale) {

        res.status(404).json({
          success: false,
          message:
            "Ticket-sales record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        message:
          "Ticket-sales record updated successfully",
        data: ticketSale
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update ticket-sales record";


      res.status(400).json({
        success: false,
        message
      });

    }

  };


// DELETE
export const deleteTicketSale =
  async (
    req: Request<{
      ticketRecordId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const ticketSale =
        await ticketSaleService
          .deleteTicketSale(
            req.params.ticketRecordId
          );


      if (!ticketSale) {

        res.status(404).json({
          success: false,
          message:
            "Ticket-sales record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        message:
          "Ticket-sales record deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to delete ticket-sales record"
      });

    }

  };