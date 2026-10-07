import Depot
  from "../models/depot.model";

import Bus
  from "../models/bus.model";

import Trip
  from "../models/trip.model";

import FuelRecord
  from "../models/fuelRecord.model";

import TicketSale
  from "../models/ticketSale.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import SparePart
  from "../models/sparePart.model";

import {
  CreateDepotInput,
  UpdateDepotInput
} from "../types/depot.types";


// =========================================================
// CREATE DEPOT
// =========================================================

export const createDepot = async (
  data: CreateDepotInput
) => {

  const depotId =
    data.depot_id
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check duplicate Depot ID
  // -----------------------------------------------------

  const existingDepot =
    await Depot.findOne({
      depot_id: depotId
    });


  if (existingDepot) {

    throw new Error(
      "A depot with this Depot ID already exists."
    );
  }


  // -----------------------------------------------------
  // Create Depot
  // -----------------------------------------------------

  const depot =
    await Depot.create({
      ...data,

      depot_id:
        depotId
    });


  return depot;
};


// =========================================================
// GET ALL DEPOTS
// =========================================================

export const getAllDepots =
  async () => {

    return Depot
      .find()
      .sort({
        depot_name: 1
      });
  };


// =========================================================
// GET DEPOT BY ID
// =========================================================

export const getDepotById = async (
  depotId: string
) => {

  const normalizedDepotId =
    depotId
      .trim()
      .toUpperCase();


  return Depot.findOne({
    depot_id:
      normalizedDepotId
  });
};


// =========================================================
// UPDATE DEPOT
// =========================================================

export const updateDepot = async (
  depotId: string,
  data: UpdateDepotInput
) => {

  const normalizedDepotId =
    depotId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check whether Depot exists
  // -----------------------------------------------------

  const existingDepot =
    await Depot.findOne({
      depot_id:
        normalizedDepotId
    });


  if (!existingDepot) {

    return null;
  }


  // -----------------------------------------------------
  // Update Depot
  // -----------------------------------------------------

  return Depot.findOneAndUpdate(
    {
      depot_id:
        normalizedDepotId
    },
    data,
    {
      new: true,
      runValidators: true
    }
  );
};


// =========================================================
// DELETE DEPOT WITH RELATIONSHIP PROTECTION
// =========================================================
//
// MongoDB does not automatically enforce foreign keys.
//
// A depot must not be deleted if other operational or
// historical documents still reference its depot_id.
//
// Collections checked:
//
// buses
// trips
// fuel_records
// ticket_sales
// maintenance_records
// spare_parts
//
// If a reference exists:
//
// DELETE IS BLOCKED.
//
// The depot should normally be changed to:
//
// status = "Inactive"
//
// =========================================================

export const deleteDepot = async (
  depotId: string
) => {

  const normalizedDepotId =
    depotId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check whether Depot exists
  // -----------------------------------------------------

  const depot =
    await Depot.findOne({
      depot_id:
        normalizedDepotId
    });


  if (!depot) {

    return null;
  }


  // =====================================================
  // CHECK RELATED BUSES
  // =====================================================

  const busExists =
    await Bus.exists({
      depot_id:
        normalizedDepotId
    });


  if (busExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because bus records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED TRIPS
  // =====================================================

  const tripExists =
    await Trip.exists({
      depot_id:
        normalizedDepotId
    });


  if (tripExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because trip records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED FUEL RECORDS
  // =====================================================

  const fuelRecordExists =
    await FuelRecord.exists({
      depot_id:
        normalizedDepotId
    });


  if (fuelRecordExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because fuel records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED TICKET SALES
  // =====================================================

  const ticketSaleExists =
    await TicketSale.exists({
      depot_id:
        normalizedDepotId
    });


  if (ticketSaleExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because ticket sales records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED MAINTENANCE RECORDS
  // =====================================================

  const maintenanceRecordExists =
    await MaintenanceRecord.exists({
      depot_id:
        normalizedDepotId
    });


  if (maintenanceRecordExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because maintenance records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // CHECK RELATED SPARE PARTS
  // =====================================================

  const sparePartExists =
    await SparePart.exists({
      depot_id:
        normalizedDepotId
    });


  if (sparePartExists) {

    throw new Error(
      `Cannot delete ${normalizedDepotId} because spare-part inventory records are linked to this depot. Mark the depot as Inactive instead.`
    );
  }


  // =====================================================
  // SAFE TO DELETE
  // =====================================================
  //
  // No known collection references this depot.
  //
  // =====================================================

  return Depot.findOneAndDelete({
    depot_id:
      normalizedDepotId
  });
};