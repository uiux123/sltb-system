import {
  Request,
  Response
} from "express";

import * as maintenanceService
  from "../services/maintenanceRecord.service";

import {
  CreateMaintenanceRecordInput,
  UpdateMaintenanceRecordInput
} from "../types/maintenanceRecord.types";


// =========================================================
// ROUTE PARAMETER TYPES
// =========================================================

interface MaintenanceIdParams {
  maintenanceId: string;
}

interface BusIdParams {
  busId: string;
}

interface DepotIdParams {
  depotId: string;
}

interface StatusParams {
  status: string;
}

interface PartIdParams {
  partId: string;
}


// =========================================================
// CREATE
// POST /api/maintenance-records
// =========================================================

export const createMaintenanceRecord =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const data =
        req.body as
          CreateMaintenanceRecordInput;


      const maintenanceRecord =
        await maintenanceService
          .createMaintenanceRecord(
            data
          );


      res.status(201).json({
        success: true,

        message:
          "Maintenance record created successfully.",

        data:
          maintenanceRecord
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to create maintenance record.";


      res.status(400).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET ALL
// GET /api/maintenance-records
// =========================================================

export const getAllMaintenanceRecords =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const records =
        await maintenanceService
          .getAllMaintenanceRecords();


      res.status(200).json({
        success: true,

        count:
          records.length,

        data:
          records
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance records.";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET BY MAINTENANCE ID
// GET /api/maintenance-records/:maintenanceId
// =========================================================

export const getMaintenanceRecordById =
  async (
    req: Request<MaintenanceIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        maintenanceId
      } = req.params;


      const record =
        await maintenanceService
          .getMaintenanceRecordById(
            maintenanceId
          );


      if (!record) {

        res.status(404).json({
          success: false,

          message:
            "Maintenance record not found."
        });

        return;
      }


      res.status(200).json({
        success: true,

        data:
          record
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance record.";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET BY BUS
// GET /api/maintenance-records/bus/:busId
// =========================================================

export const getMaintenanceRecordsByBus =
  async (
    req: Request<BusIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        busId
      } = req.params;


      const records =
        await maintenanceService
          .getMaintenanceRecordsByBus(
            busId
          );


      res.status(200).json({
        success: true,

        count:
          records.length,

        data:
          records
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance records.";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET BY DEPOT
// GET /api/maintenance-records/depot/:depotId
// =========================================================

export const getMaintenanceRecordsByDepot =
  async (
    req: Request<DepotIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        depotId
      } = req.params;


      const records =
        await maintenanceService
          .getMaintenanceRecordsByDepot(
            depotId
          );


      res.status(200).json({
        success: true,

        count:
          records.length,

        data:
          records
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance records.";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET BY STATUS
// GET /api/maintenance-records/status/:status
// =========================================================

export const getMaintenanceRecordsByStatus =
  async (
    req: Request<StatusParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        status: encodedStatus
      } = req.params;


      const status =
        decodeURIComponent(
          encodedStatus
        );


      const records =
        await maintenanceService
          .getMaintenanceRecordsByStatus(
            status
          );


      res.status(200).json({
        success: true,

        count:
          records.length,

        data:
          records
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance records.";


      res.status(400).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET BY SPARE PART
// GET /api/maintenance-records/part/:partId
// =========================================================

export const getMaintenanceRecordsByPart =
  async (
    req: Request<PartIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        partId
      } = req.params;


      const records =
        await maintenanceService
          .getMaintenanceRecordsByPart(
            partId
          );


      res.status(200).json({
        success: true,

        count:
          records.length,

        data:
          records
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve maintenance records.";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// UPDATE
// PUT /api/maintenance-records/:maintenanceId
// =========================================================

export const updateMaintenanceRecord =
  async (
    req: Request<MaintenanceIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        maintenanceId
      } = req.params;


      const data =
        req.body as
          UpdateMaintenanceRecordInput;


      const updatedRecord =
        await maintenanceService
          .updateMaintenanceRecord(
            maintenanceId,
            data
          );


      if (!updatedRecord) {

        res.status(404).json({
          success: false,

          message:
            "Maintenance record not found."
        });

        return;
      }


      res.status(200).json({
        success: true,

        message:
          "Maintenance record updated successfully.",

        data:
          updatedRecord
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update maintenance record.";


      res.status(400).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// DELETE / REVERSE
// DELETE /api/maintenance-records/:maintenanceId
// =========================================================

export const deleteMaintenanceRecord =
  async (
    req: Request<MaintenanceIdParams>,
    res: Response
  ): Promise<void> => {

    try {

      const {
        maintenanceId
      } = req.params;


      const deletedRecord =
        await maintenanceService
          .deleteMaintenanceRecord(
            maintenanceId
          );


      if (!deletedRecord) {

        res.status(404).json({
          success: false,

          message:
            "Maintenance record not found."
        });

        return;
      }


      res.status(200).json({
        success: true,

        message:
          "Maintenance record reversed and deleted successfully."
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete maintenance record.";


      res.status(400).json({
        success: false,
        message
      });

    }
  };