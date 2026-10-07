import Bus
  from "../models/bus.model";

import Depot
  from "../models/depot.model";

import Trip
  from "../models/trip.model";

import FuelRecord
  from "../models/fuelRecord.model";

import TicketSale
  from "../models/ticketSale.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  CreateBusInput,
  UpdateBusInput
} from "../types/bus.types";


// =========================================================
// CREATE BUS
// =========================================================

export const createBus =
  async (
    data: CreateBusInput
  ) => {

    const busId =
      data.bus_id
        .trim()
        .toUpperCase();


    const registrationNo =
      data.registration_no
        .trim()
        .toUpperCase();


    const depotId =
      data.depot_id
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Check duplicate Bus ID
    // -----------------------------------------------------

    const existingBus =
      await Bus.findOne({
        bus_id: busId
      });


    if (existingBus) {

      throw new Error(
        "A bus with this Bus ID already exists."
      );
    }


    // -----------------------------------------------------
    // Check duplicate registration number
    // -----------------------------------------------------

    const existingRegistration =
      await Bus.findOne({
        registration_no:
          registrationNo
      });


    if (existingRegistration) {

      throw new Error(
        "A bus with this registration number already exists."
      );
    }


    // -----------------------------------------------------
    // Validate Depot
    // -----------------------------------------------------

    const depot =
      await Depot.findOne({
        depot_id: depotId
      });


    if (!depot) {

      throw new Error(
        "The selected depot does not exist."
      );
    }


    // -----------------------------------------------------
    // Create Bus
    // -----------------------------------------------------

    const bus =
      await Bus.create({

        ...data,

        bus_id:
          busId,

        registration_no:
          registrationNo,

        depot_id:
          depotId

      });


    return bus;
  };


// =========================================================
// GET ALL BUSES
// =========================================================

export const getAllBuses =
  async () => {

    return Bus
      .find()
      .sort({
        bus_id: 1
      });
  };


// =========================================================
// GET BUS BY ID
// =========================================================

export const getBusById =
  async (
    busId: string
  ) => {

    return Bus.findOne({
      bus_id:
        busId
          .trim()
          .toUpperCase()
    });
  };


// =========================================================
// GET BUSES BY DEPOT
// =========================================================

export const getBusesByDepot =
  async (
    depotId: string
  ) => {

    return Bus
      .find({
        depot_id:
          depotId
            .trim()
            .toUpperCase()
      })
      .sort({
        bus_id: 1
      });
  };


// =========================================================
// UPDATE BUS
// =========================================================

export const updateBus =
  async (
    busId: string,
    data: UpdateBusInput
  ) => {

    const normalizedBusId =
      busId
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Check whether bus exists
    // -----------------------------------------------------

    const existingBus =
      await Bus.findOne({
        bus_id:
          normalizedBusId
      });


    if (!existingBus) {

      return null;
    }


    // -----------------------------------------------------
    // If Depot is being changed, validate it
    // -----------------------------------------------------

    if (data.depot_id) {

      const depotId =
        data.depot_id
          .trim()
          .toUpperCase();


      const depot =
        await Depot.findOne({
          depot_id:
            depotId
        });


      if (!depot) {

        throw new Error(
          "The selected depot does not exist."
        );
      }


      data.depot_id =
        depotId;
    }


    // -----------------------------------------------------
    // If registration number changes, ensure uniqueness
    // -----------------------------------------------------

    if (
      data.registration_no
    ) {

      const registrationNo =
        data.registration_no
          .trim()
          .toUpperCase();


      const duplicateRegistration =
        await Bus.findOne({
          registration_no:
            registrationNo,

          bus_id: {
            $ne:
              normalizedBusId
          }
        });


      if (
        duplicateRegistration
      ) {

        throw new Error(
          "Another bus already uses this registration number."
        );
      }


      data.registration_no =
        registrationNo;
    }


    // -----------------------------------------------------
    // Update Bus
    // -----------------------------------------------------

    return Bus.findOneAndUpdate(
      {
        bus_id:
          normalizedBusId
      },
      data,
      {
        new: true,
        runValidators: true
      }
    );
  };


// =========================================================
// DELETE BUS WITH RELATIONSHIP PROTECTION
// =========================================================
//
// IMPORTANT:
//
// MongoDB does not automatically enforce foreign keys.
//
// Therefore:
//
// BUS101 must not be deleted if related operational
// documents still reference BUS101.
//
// Collections checked:
//
// trips
// fuel_records
// ticket_sales
// maintenance_records
//
// =========================================================

export const deleteBus =
  async (
    busId: string
  ) => {

    const normalizedBusId =
      busId
        .trim()
        .toUpperCase();


    // -----------------------------------------------------
    // Check whether Bus exists
    // -----------------------------------------------------

    const bus =
      await Bus.findOne({
        bus_id:
          normalizedBusId
      });


    if (!bus) {

      return null;
    }


    // =====================================================
    // CHECK RELATED TRIPS
    // =====================================================

    const tripExists =
      await Trip.exists({
        bus_id:
          normalizedBusId
      });


    if (tripExists) {

      throw new Error(
        `Cannot delete ${normalizedBusId} because trip records are linked to this bus. Mark the bus as Out of Service instead.`
      );
    }


    // =====================================================
    // CHECK RELATED FUEL RECORDS
    // =====================================================

    const fuelRecordExists =
      await FuelRecord.exists({
        bus_id:
          normalizedBusId
      });


    if (
      fuelRecordExists
    ) {

      throw new Error(
        `Cannot delete ${normalizedBusId} because fuel records are linked to this bus. Mark the bus as Out of Service instead.`
      );
    }


    // =====================================================
    // CHECK RELATED TICKET SALES
    // =====================================================

    const ticketSaleExists =
      await TicketSale.exists({
        bus_id:
          normalizedBusId
      });


    if (
      ticketSaleExists
    ) {

      throw new Error(
        `Cannot delete ${normalizedBusId} because ticket sales records are linked to this bus. Mark the bus as Out of Service instead.`
      );
    }


    // =====================================================
    // CHECK RELATED MAINTENANCE RECORDS
    // =====================================================

    const maintenanceExists =
      await MaintenanceRecord.exists({
        bus_id:
          normalizedBusId
      });


    if (
      maintenanceExists
    ) {

      throw new Error(
        `Cannot delete ${normalizedBusId} because maintenance records are linked to this bus. Mark the bus as Out of Service instead.`
      );
    }


    // =====================================================
    // SAFE TO DELETE
    // =====================================================
    //
    // At this point there are no known operational
    // documents referencing this bus.
    //
    // =====================================================

    return Bus.findOneAndDelete({
      bus_id:
        normalizedBusId
    });
  };