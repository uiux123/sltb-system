import {
  Request,
  Response
} from "express";

import * as routeService
  from "../services/route.service";

import {
  CreateRouteInput,
  UpdateRouteInput
} from "../types/route.types";


// =========================================================
// CREATE ROUTE
// =========================================================

export const createRoute = async (
  req: Request<
    {},
    {},
    CreateRouteInput
  >,
  res: Response
): Promise<void> => {

  try {

    const route =
      await routeService
        .createRoute(
          req.body
        );


    res.status(201).json({
      success: true,
      message:
        "Route created successfully",
      data: route
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create route";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ALL ROUTES
// =========================================================

export const getAllRoutes = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const routes =
      await routeService
        .getAllRoutes();


    res.status(200).json({
      success: true,
      count:
        routes.length,
      data:
        routes
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve routes";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET SOCIAL SERVICE ROUTES
// =========================================================

export const getSocialServiceRoutes =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const routes =
        await routeService
          .getSocialServiceRoutes();


      res.status(200).json({
        success: true,
        count:
          routes.length,
        data:
          routes
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve social service routes";


      res.status(500).json({
        success: false,
        message
      });

    }
  };


// =========================================================
// GET ONE ROUTE
// =========================================================

export const getRouteById = async (
  req: Request<{
    routeId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const route =
      await routeService
        .getRouteById(
          req.params.routeId
        );


    if (!route) {

      res.status(404).json({
        success: false,
        message:
          "Route not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      data:
        route
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve route";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// UPDATE ROUTE
// =========================================================

export const updateRoute = async (
  req: Request<
    {
      routeId: string;
    },
    {},
    UpdateRouteInput
  >,
  res: Response
): Promise<void> => {

  try {

    const route =
      await routeService
        .updateRoute(
          req.params.routeId,
          req.body
        );


    if (!route) {

      res.status(404).json({
        success: false,
        message:
          "Route not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Route updated successfully",
      data:
        route
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update route";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// DELETE ROUTE
// =========================================================
//
// Safe-delete behavior:
//
// If related records exist in:
//
// - trips
// - ticket_sales
//
// route.service.ts throws an error.
//
// The controller returns HTTP 400 and preserves the route.
//
// =========================================================

export const deleteRoute = async (
  req: Request<{
    routeId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const route =
      await routeService
        .deleteRoute(
          req.params.routeId
        );


    if (!route) {

      res.status(404).json({
        success: false,
        message:
          "Route not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Route deleted successfully"
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete route";


    res.status(400).json({
      success: false,
      message
    });

  }
};