import {
  Request,
  Response
} from "express";

import * as sparePartService
  from "../services/sparePart.service";

import {
  CreateSparePartInput,
  UpdateSparePartInput
} from "../types/sparePart.types";


// =========================================================
// RESTOCK BODY TYPE
// =========================================================

interface RestockBody {
  quantity: number;
}


// =========================================================
// CREATE SPARE PART
// =========================================================

export const createSparePart = async (
  req: Request<
    {},
    {},
    CreateSparePartInput
  >,
  res: Response
): Promise<void> => {

  try {

    const sparePart =
      await sparePartService
        .createSparePart(
          req.body
        );


    res.status(201).json({
      success: true,
      message:
        "Spare part created successfully",
      data:
        sparePart
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create spare part";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ALL SPARE PARTS
// =========================================================

export const getAllSpareParts =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const spareParts =
        await sparePartService
          .getAllSpareParts();


      res.status(200).json({
        success: true,
        count:
          spareParts.length,
        data:
          spareParts
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve spare parts";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET LOW-STOCK PARTS
// =========================================================

export const getLowStockSpareParts =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const spareParts =
        await sparePartService
          .getLowStockSpareParts();


      res.status(200).json({
        success: true,
        count:
          spareParts.length,
        data:
          spareParts
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve low-stock spare parts";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET SPARE PARTS BY DEPOT
// =========================================================

export const getSparePartsByDepot =
  async (
    req: Request<{
      depotId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const spareParts =
        await sparePartService
          .getSparePartsByDepot(
            req.params.depotId
          );


      res.status(200).json({
        success: true,
        count:
          spareParts.length,
        data:
          spareParts
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve spare parts for this depot";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET ONE SPARE PART
// =========================================================

export const getSparePartById =
  async (
    req: Request<{
      partId: string;
    }>,
    res: Response
  ): Promise<void> => {

    try {

      const sparePart =
        await sparePartService
          .getSparePartById(
            req.params.partId
          );


      if (!sparePart) {

        res.status(404).json({
          success: false,
          message:
            "Spare part not found"
        });

        return;
      }


      res.status(200).json({
        success: true,
        data:
          sparePart
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve spare part";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// UPDATE SPARE PART
// =========================================================

export const updateSparePart = async (
  req: Request<
    {
      partId: string;
    },
    {},
    UpdateSparePartInput
  >,
  res: Response
): Promise<void> => {

  try {

    const sparePart =
      await sparePartService
        .updateSparePart(
          req.params.partId,
          req.body
        );


    if (!sparePart) {

      res.status(404).json({
        success: false,
        message:
          "Spare part not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Spare part updated successfully",
      data:
        sparePart
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update spare part";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// RESTOCK SPARE PART
// =========================================================

export const restockSparePart = async (
  req: Request<
    {
      partId: string;
    },
    {},
    RestockBody
  >,
  res: Response
): Promise<void> => {

  try {

    const sparePart =
      await sparePartService
        .restockSparePart(
          req.params.partId,
          req.body.quantity
        );


    if (!sparePart) {

      res.status(404).json({
        success: false,
        message:
          "Spare part not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Spare part restocked successfully",
      data:
        sparePart
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to restock spare part";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// DELETE SPARE PART
// =========================================================
//
// Safe-delete rule:
//
// If maintenance_records contains:
//
// parts_used.part_id = requested partId
//
// deletion is blocked.
//
// =========================================================

export const deleteSparePart = async (
  req: Request<{
    partId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const sparePart =
      await sparePartService
        .deleteSparePart(
          req.params.partId
        );


    if (!sparePart) {

      res.status(404).json({
        success: false,
        message:
          "Spare part not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Spare part deleted successfully"
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete spare part";


    res.status(400).json({
      success: false,
      message
    });

  }
};