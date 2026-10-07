import FuelRecord
  from "../models/fuelRecord.model";

import Trip
  from "../models/trip.model";

import {
  CreateFuelRecordInput,
  UpdateFuelRecordInput
} from "../types/fuelRecord.types";


// Round numerical calculations
// to two decimal places
const roundToTwo = (
  value: number
): number => {

  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;

};


// Calculate fuel analytical values
const calculateFuelMetrics = (
  fuelLitres: number,
  fuelCostPerLitre: number,
  operatedKm: number
) => {

  if (fuelLitres <= 0) {
    throw new Error(
      "Fuel litres must be greater than zero."
    );
  }


  if (fuelCostPerLitre <= 0) {
    throw new Error(
      "Fuel cost per litre must be greater than zero."
    );
  }


  if (operatedKm <= 0) {
    throw new Error(
      "Operated kilometres must be greater than zero."
    );
  }


  const totalFuelCost =
    roundToTwo(
      fuelLitres *
      fuelCostPerLitre
    );


  const kmPerLitre =
    roundToTwo(
      operatedKm /
      fuelLitres
    );


  const fuelCostPerKm =
    roundToTwo(
      totalFuelCost /
      operatedKm
    );


  return {
    totalFuelCost,
    kmPerLitre,
    fuelCostPerKm
  };
};


// CREATE FUEL RECORD
export const createFuelRecord =
  async (
    data: CreateFuelRecordInput
  ) => {

    const normalizedFuelRecordId =
      data.fuel_record_id.toUpperCase();

    const normalizedTripId =
      data.trip_id.toUpperCase();


    // Check duplicate Fuel Record ID
    const existingFuelRecordId =
      await FuelRecord.findOne({
        fuel_record_id:
          normalizedFuelRecordId
      });

    if (existingFuelRecordId) {
      throw new Error(
        "A fuel record with this Fuel Record ID already exists."
      );
    }


    // Check whether this trip
    // already has a fuel record
    const existingTripFuelRecord =
      await FuelRecord.findOne({
        trip_id:
          normalizedTripId
      });

    if (existingTripFuelRecord) {
      throw new Error(
        "A fuel record already exists for this trip."
      );
    }


    // Find Trip
    const trip =
      await Trip.findOne({
        trip_id:
          normalizedTripId
      });

    if (!trip) {
      throw new Error(
        "The selected trip does not exist."
      );
    }


    // Only completed trips should
    // generate operational fuel records
    if (
      trip.trip_status !==
      "Completed"
    ) {
      throw new Error(
        "Fuel records can only be created for completed trips."
      );
    }


    if (
      trip.operated_km <= 0
    ) {
      throw new Error(
        "The selected trip has no valid operated kilometres."
      );
    }


    // Calculate analytical values
    const metrics =
      calculateFuelMetrics(
        data.fuel_litres,
        data.fuel_cost_per_litre,
        trip.operated_km
      );


    // Create Fuel Record
    const fuelRecord =
      await FuelRecord.create({
        fuel_record_id:
          normalizedFuelRecordId,

        trip_id:
          normalizedTripId,

        bus_id:
          trip.bus_id.toUpperCase(),

        depot_id:
          trip.depot_id.toUpperCase(),

        fuel_date:
          trip.trip_date,

        fuel_litres:
          data.fuel_litres,

        fuel_cost_per_litre:
          data.fuel_cost_per_litre,

        total_fuel_cost:
          metrics.totalFuelCost,

        operated_km:
          trip.operated_km,

        km_per_litre:
          metrics.kmPerLitre,

        fuel_cost_per_km:
          metrics.fuelCostPerKm,

        recorded_by:
          data.recorded_by
      });


    return fuelRecord;

  };


// GET ALL FUEL RECORDS
export const getAllFuelRecords =
  async () => {

    return FuelRecord.find().sort({
      fuel_date: -1
    });

  };


// GET ONE FUEL RECORD
export const getFuelRecordById =
  async (
    fuelRecordId: string
  ) => {

    return FuelRecord.findOne({
      fuel_record_id:
        fuelRecordId.toUpperCase()
    });

  };


// GET FUEL RECORD BY TRIP
export const getFuelRecordByTrip =
  async (
    tripId: string
  ) => {

    return FuelRecord.findOne({
      trip_id:
        tripId.toUpperCase()
    });

  };


// GET FUEL RECORDS BY BUS
export const getFuelRecordsByBus =
  async (
    busId: string
  ) => {

    return FuelRecord.find({
      bus_id:
        busId.toUpperCase()
    }).sort({
      fuel_date: -1
    });

  };


// GET FUEL RECORDS BY DEPOT
export const getFuelRecordsByDepot =
  async (
    depotId: string
  ) => {

    return FuelRecord.find({
      depot_id:
        depotId.toUpperCase()
    }).sort({
      fuel_date: -1
    });

  };


// UPDATE FUEL RECORD
export const updateFuelRecord =
  async (
    fuelRecordId: string,
    data: UpdateFuelRecordInput
  ) => {

    const existingFuelRecord =
      await FuelRecord.findOne({
        fuel_record_id:
          fuelRecordId.toUpperCase()
      });

    if (!existingFuelRecord) {
      return null;
    }


    // Retrieve the original trip
    const trip =
      await Trip.findOne({
        trip_id:
          existingFuelRecord.trip_id
      });

    if (!trip) {
      throw new Error(
        "The trip connected to this fuel record no longer exists."
      );
    }


    const finalFuelLitres =
      data.fuel_litres ??
      existingFuelRecord.fuel_litres;


    const finalFuelCostPerLitre =
      data.fuel_cost_per_litre ??
      existingFuelRecord
        .fuel_cost_per_litre;


    // Recalculate all derived values
    const metrics =
      calculateFuelMetrics(
        finalFuelLitres,
        finalFuelCostPerLitre,
        trip.operated_km
      );


    return FuelRecord.findOneAndUpdate(
      {
        fuel_record_id:
          fuelRecordId.toUpperCase()
      },
      {
        fuel_litres:
          finalFuelLitres,

        fuel_cost_per_litre:
          finalFuelCostPerLitre,

        total_fuel_cost:
          metrics.totalFuelCost,

        operated_km:
          trip.operated_km,

        km_per_litre:
          metrics.kmPerLitre,

        fuel_cost_per_km:
          metrics.fuelCostPerKm,

        recorded_by:
          data.recorded_by ??
          existingFuelRecord.recorded_by
      },
      {
        new: true,
        runValidators: true
      }
    );

  };


// DELETE FUEL RECORD
export const deleteFuelRecord =
  async (
    fuelRecordId: string
  ) => {

    return FuelRecord.findOneAndDelete({
      fuel_record_id:
        fuelRecordId.toUpperCase()
    });

  };