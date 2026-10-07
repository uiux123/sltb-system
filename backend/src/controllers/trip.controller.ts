import {
  Request,
  Response
} from "express";

import * as tripService
  from "../services/trip.service";

import {
  CreateTripInput,
  UpdateTripInput
} from "../types/trip.types";


// =========================================================
// CREATE TRIP
// =========================================================

export const createTrip = async (
  req: Request<
    {},
    {},
    CreateTripInput
  >,
  res: Response
): Promise<void> => {

  try {

    const trip =
      await tripService
        .createTrip(
          req.body
        );


    res.status(201).json({
      success: true,
      message:
        "Trip created successfully",
      data:
        trip
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create trip";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ALL TRIPS
// =========================================================

export const getAllTrips = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const trips =
      await tripService
        .getAllTrips();


    res.status(200).json({
      success: true,
      count:
        trips.length,
      data:
        trips
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve trips";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET ONE TRIP
// =========================================================

export const getTripById = async (
  req: Request<{
    tripId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const trip =
      await tripService
        .getTripById(
          req.params.tripId
        );


    if (!trip) {

      res.status(404).json({
        success: false,
        message:
          "Trip not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      data:
        trip
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve trip";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET TRIPS BY DEPOT
// =========================================================

export const getTripsByDepot = async (
  req: Request<{
    depotId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const trips =
      await tripService
        .getTripsByDepot(
          req.params.depotId
        );


    res.status(200).json({
      success: true,
      count:
        trips.length,
      data:
        trips
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve trips for this depot";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET TRIPS BY ROUTE
// =========================================================

export const getTripsByRoute = async (
  req: Request<{
    routeId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const trips =
      await tripService
        .getTripsByRoute(
          req.params.routeId
        );


    res.status(200).json({
      success: true,
      count:
        trips.length,
      data:
        trips
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve trips for this route";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// GET TRIPS BY BUS
// =========================================================

export const getTripsByBus = async (
  req: Request<{
    busId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const trips =
      await tripService
        .getTripsByBus(
          req.params.busId
        );


    res.status(200).json({
      success: true,
      count:
        trips.length,
      data:
        trips
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve trips for this bus";


    res.status(500).json({
      success: false,
      message
    });

  }
};


// =========================================================
// UPDATE TRIP
// =========================================================

export const updateTrip = async (
  req: Request<
    {
      tripId: string;
    },
    {},
    UpdateTripInput
  >,
  res: Response
): Promise<void> => {

  try {

    const trip =
      await tripService
        .updateTrip(
          req.params.tripId,
          req.body
        );


    if (!trip) {

      res.status(404).json({
        success: false,
        message:
          "Trip not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Trip updated successfully",
      data:
        trip
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update trip";


    res.status(400).json({
      success: false,
      message
    });

  }
};


// =========================================================
// DELETE TRIP
// =========================================================
//
// Safe-delete behavior:
//
// Trip deletion is blocked when either:
//
// - fuel_records contains this trip_id
// - ticket_sales contains this trip_id
//
// This prevents orphaned operational records.
//
// =========================================================

export const deleteTrip = async (
  req: Request<{
    tripId: string;
  }>,
  res: Response
): Promise<void> => {

  try {

    const trip =
      await tripService
        .deleteTrip(
          req.params.tripId
        );


    if (!trip) {

      res.status(404).json({
        success: false,
        message:
          "Trip not found"
      });

      return;
    }


    res.status(200).json({
      success: true,
      message:
        "Trip deleted successfully"
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete trip";


    res.status(400).json({
      success: false,
      message
    });

  }
};