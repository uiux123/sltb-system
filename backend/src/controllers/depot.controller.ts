import {
  Request,
  Response
} from "express";

import * as depotService
  from "../services/depot.service";

import {
  CreateDepotInput,
  UpdateDepotInput
} from "../types/depot.types";


// =========================================================
// CREATE DEPOT
// =========================================================

export const createDepot = async (
  req: Request<
    {},
    {},
    CreateDepotInput
  >,
  res: Response
): Promise<void> => {

  try {

    const depot =
      await depotService
        .createDepot(
          req.body
        );


    res.status(201).json({
      success: true,
      message:
        "Depot created successfully",
      data:
        depot
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create depot";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ALL DEPOTS
// =========================================================

export const getAllDepots = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const depots =
      await depotService
        .getAllDepots();


    res.status(200).json({
      success: true,
      count:
        depots.length,
      data:
        depots
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve depots";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ONE DEPOT
// =========================================================

export const getDepotById = async (
  req: Request<{
    depotId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const depot =
      await depotService
        .getDepotById(
          req.params.depotId
        );


    if (!depot) {

      res.status(404).json({
        success: false,
        message:
          "Depot not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      data:
        depot
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve depot";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// UPDATE DEPOT
// =========================================================

export const updateDepot = async (
  req: Request<
    {
      depotId: string;
    },
    {},
    UpdateDepotInput
  >,
  res: Response
): Promise<void> => {

  try {

    const depot =
      await depotService
        .updateDepot(
          req.params.depotId,
          req.body
        );


    if (!depot) {

      res.status(404).json({
        success: false,
        message:
          "Depot not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Depot updated successfully",
      data:
        depot
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update depot";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// DELETE DEPOT
// =========================================================
//
// Safe-delete behavior:
//
// Deletion is blocked when this depot is referenced by:
//
// - buses
// - trips
// - fuel_records
// - ticket_sales
// - maintenance_records
// - spare_parts
//
// In that situation, the service throws a business-rule
// error and this controller returns HTTP 400.
//
// =========================================================

export const deleteDepot = async (
  req: Request<{
    depotId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const depot =
      await depotService
        .deleteDepot(
          req.params.depotId
        );


    if (!depot) {

      res.status(404).json({
        success: false,
        message:
          "Depot not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Depot deleted successfully"
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete depot";


    res.status(400).json({
      success: false,
      message
    });

  }
};