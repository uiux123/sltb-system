import {
  Request,
  Response
} from "express";

import * as fuelRecordService
  from "../services/fuelRecord.service";

import {
  CreateFuelRecordInput,
  UpdateFuelRecordInput
} from "../types/fuelRecord.types";


// CREATE
export const createFuelRecord =
  async (
    req: Request<
      {},
      {},
      CreateFuelRecordInput
    >,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecord =
        await fuelRecordService
          .createFuelRecord(
            req.body
          );


      res.status(201).json({
        success: true,
        message:
          "Fuel record created successfully",
        data: fuelRecord
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to create fuel record";


      res.status(400).json({
        success: false,
        message
      });

    }

  };


// GET ALL
export const getAllFuelRecords =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecords =
        await fuelRecordService
          .getAllFuelRecords();


      res.status(200).json({
        success: true,
        count:
          fuelRecords.length,
        data:
          fuelRecords
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve fuel records"
      });

    }

  };


// GET ONE
export const getFuelRecordById =
  async (
    req: Request<{
      fuelRecordId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecord =
        await fuelRecordService
          .getFuelRecordById(
            req.params.fuelRecordId
          );


      if (!fuelRecord) {

        res.status(404).json({
          success: false,
          message:
            "Fuel record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        data: fuelRecord
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve fuel record"
      });

    }

  };


// GET BY TRIP
export const getFuelRecordByTrip =
  async (
    req: Request<{
      tripId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecord =
        await fuelRecordService
          .getFuelRecordByTrip(
            req.params.tripId
          );


      if (!fuelRecord) {

        res.status(404).json({
          success: false,
          message:
            "No fuel record found for this trip"
        });

        return;
      }


      res.status(200).json({
        success: true,
        data: fuelRecord
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve fuel record for this trip"
      });

    }

  };


// GET BY BUS
export const getFuelRecordsByBus =
  async (
    req: Request<{
      busId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecords =
        await fuelRecordService
          .getFuelRecordsByBus(
            req.params.busId
          );


      res.status(200).json({
        success: true,
        count:
          fuelRecords.length,
        data:
          fuelRecords
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve fuel records for this bus"
      });

    }

  };


// GET BY DEPOT
export const getFuelRecordsByDepot =
  async (
    req: Request<{
      depotId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecords =
        await fuelRecordService
          .getFuelRecordsByDepot(
            req.params.depotId
          );


      res.status(200).json({
        success: true,
        count:
          fuelRecords.length,
        data:
          fuelRecords
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to retrieve fuel records for this depot"
      });

    }

  };


// UPDATE
export const updateFuelRecord =
  async (
    req: Request<
      {
        fuelRecordId: string;
      },
      {},
      UpdateFuelRecordInput
    >,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecord =
        await fuelRecordService
          .updateFuelRecord(
            req.params.fuelRecordId,
            req.body
          );


      if (!fuelRecord) {

        res.status(404).json({
          success: false,
          message:
            "Fuel record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        message:
          "Fuel record updated successfully",
        data: fuelRecord
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update fuel record";


      res.status(400).json({
        success: false,
        message
      });

    }

  };


// DELETE
export const deleteFuelRecord =
  async (
    req: Request<{
      fuelRecordId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const fuelRecord =
        await fuelRecordService
          .deleteFuelRecord(
            req.params.fuelRecordId
          );


      if (!fuelRecord) {

        res.status(404).json({
          success: false,
          message:
            "Fuel record not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        message:
          "Fuel record deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Unable to delete fuel record"
      });

    }

  };