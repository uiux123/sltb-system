import Route
  from "../models/route.model";

import Trip
  from "../models/trip.model";

import TicketSale
  from "../models/ticketSale.model";

import {
  CreateRouteInput,
  UpdateRouteInput
} from "../types/route.types";


// =========================================================
// CREATE ROUTE
// =========================================================

export const createRoute = async (
  data: CreateRouteInput
) => {

  const routeId =
    data.route_id
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check duplicate Route ID
  // -----------------------------------------------------

  const existingRoute =
    await Route.findOne({
      route_id: routeId
    });


  if (existingRoute) {

    throw new Error(
      "A route with this Route ID already exists."
    );
  }


  // -----------------------------------------------------
  // Origin and destination cannot be identical
  // -----------------------------------------------------

  if (
    data.origin
      .trim()
      .toLowerCase() ===
    data.destination
      .trim()
      .toLowerCase()
  ) {

    throw new Error(
      "Origin and destination cannot be the same."
    );
  }


  // -----------------------------------------------------
  // Create Route
  // -----------------------------------------------------

  const route =
    await Route.create({
      ...data,
      route_id: routeId
    });


  return route;
};


// =========================================================
// GET ALL ROUTES
// =========================================================

export const getAllRoutes =
  async () => {

    return Route
      .find()
      .sort({
        route_id: 1
      });
  };


// =========================================================
// GET ROUTE BY ID
// =========================================================

export const getRouteById = async (
  routeId: string
) => {

  const normalizedRouteId =
    routeId
      .trim()
      .toUpperCase();


  return Route.findOne({
    route_id:
      normalizedRouteId
  });
};


// =========================================================
// GET SOCIAL SERVICE ROUTES
// =========================================================

export const getSocialServiceRoutes =
  async () => {

    return Route
      .find({
        social_service_route: true
      })
      .sort({
        route_id: 1
      });
  };


// =========================================================
// UPDATE ROUTE
// =========================================================

export const updateRoute = async (
  routeId: string,
  data: UpdateRouteInput
) => {

  const normalizedRouteId =
    routeId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check whether route exists
  // -----------------------------------------------------

  const existingRoute =
    await Route.findOne({
      route_id:
        normalizedRouteId
    });


  if (!existingRoute) {

    return null;
  }


  // -----------------------------------------------------
  // Determine final origin and destination
  // -----------------------------------------------------

  const origin =
    data.origin ??
    existingRoute.origin;


  const destination =
    data.destination ??
    existingRoute.destination;


  // -----------------------------------------------------
  // Origin and destination cannot be identical
  // -----------------------------------------------------

  if (
    origin
      .trim()
      .toLowerCase() ===
    destination
      .trim()
      .toLowerCase()
  ) {

    throw new Error(
      "Origin and destination cannot be the same."
    );
  }


  // -----------------------------------------------------
  // Update Route
  // -----------------------------------------------------

  return Route.findOneAndUpdate(
    {
      route_id:
        normalizedRouteId
    },
    data,
    {
      new: true,
      runValidators: true
    }
  );
};


// =========================================================
// DELETE ROUTE WITH RELATIONSHIP PROTECTION
// =========================================================
//
// MongoDB does not automatically enforce foreign keys.
//
// A route must not be deleted if historical or operational
// records still reference it.
//
// Collections checked:
//
// trips
// ticket_sales
//
// If references exist:
//
// DELETE IS BLOCKED.
//
// Instead, the route can be changed to:
//
// status = "Inactive"
//
// =========================================================

export const deleteRoute = async (
  routeId: string
) => {

  const normalizedRouteId =
    routeId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check whether Route exists
  // -----------------------------------------------------

  const route =
    await Route.findOne({
      route_id:
        normalizedRouteId
    });


  if (!route) {

    return null;
  }


  // =====================================================
  // CHECK RELATED TRIPS
  // =====================================================

  const tripExists =
    await Trip.exists({
      route_id:
        normalizedRouteId
    });


  if (tripExists) {

    throw new Error(
      `Cannot delete ${normalizedRouteId} because trip records are linked to this route. Mark the route as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED TICKET SALES
  // =====================================================

  const ticketSaleExists =
    await TicketSale.exists({
      route_id:
        normalizedRouteId
    });


  if (ticketSaleExists) {

    throw new Error(
      `Cannot delete ${normalizedRouteId} because ticket sales records are linked to this route. Mark the route as Inactive instead.`
    );
  }


  // =====================================================
  // SAFE TO DELETE
  // =====================================================

  return Route.findOneAndDelete({
    route_id:
      normalizedRouteId
  });
};