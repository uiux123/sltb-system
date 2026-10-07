import {
  Request,
  Response
} from "express";

import * as busService
  from "../services/bus.service";

import {
  CreateBusInput,
  UpdateBusInput
} from "../types/bus.types";


// =========================================================
// CREATE BUS
// =========================================================

export const createBus = async (
  req: Request<
    {},
    {},
    CreateBusInput
  >,
  res: Response
): Promise<void> => {

  try {

    const bus =
      await busService.createBus(
        req.body
      );


    res.status(201).json({
      success: true,
      message:
        "Bus created successfully",
      data: bus
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create bus";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ALL BUSES
// =========================================================

export const getAllBuses = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const buses =
      await busService
        .getAllBuses();


    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve buses";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ONE BUS
// =========================================================

export const getBusById = async (
  req: Request<{
    busId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const bus =
      await busService
        .getBusById(
          req.params.busId
        );


    if (!bus) {

      res.status(404).json({
        success: false,
        message:
          "Bus not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      data: bus
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve bus";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET BUSES BY DEPOT
// =========================================================

export const getBusesByDepot = async (
  req: Request<{
    depotId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const buses =
      await busService
        .getBusesByDepot(
          req.params.depotId
        );


    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve buses for this depot";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// UPDATE BUS
// =========================================================

export const updateBus = async (
  req: Request<
    {
      busId: string;
    },
    {},
    UpdateBusInput
  >,
  res: Response
): Promise<void> => {

  try {

    const bus =
      await busService
        .updateBus(
          req.params.busId,
          req.body
        );


    if (!bus) {

      res.status(404).json({
        success: false,
        message:
          "Bus not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Bus updated successfully",
      data: bus
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update bus";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// DELETE BUS
// =========================================================
//
// Safe-delete behavior:
//
// If related records exist in:
//
// - trips
// - fuel_records
// - ticket_sales
// - maintenance_records
//
// bus.service.ts will throw an error.
//
// The controller returns that business-rule error as
// HTTP 400 instead of deleting the bus.
//
// =========================================================

export const deleteBus = async (
  req: Request<{
    busId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const bus =
      await busService
        .deleteBus(
          req.params.busId
        );


    if (!bus) {

      res.status(404).json({
        success: false,
        message:
          "Bus not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Bus deleted successfully"
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete bus";


    res.status(400).json({
      success: false,
      message
    });

  }
};