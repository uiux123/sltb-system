import FuelRecord
  from "../models/fuelRecord.model";

import Trip
  from "../models/trip.model";

import Bus
  from "../models/bus.model";

import {
  IFuelRecord
} from "../types/fuelRecord.types";


// =========================================================
// HELPER: ROUND TO TWO DECIMAL PLACES
// =========================================================

const roundToTwo = (
  value: number
): number => {

  return Math.round(
    (
      value +
      Number.EPSILON
    ) * 100
  ) / 100;
};


// =========================================================
// HELPER: TARGET FUEL EFFICIENCY
// =========================================================
//
// Generates realistic synthetic variation.
//
// Diesel buses:
//
// approximately 2.70 - 4.00 km/L
//
// Hybrid buses:
//
// approximately 3.80 - 4.60 km/L
//
// These are application test values, not official
// SLTB measurements.
//
// =========================================================

const getTargetKmPerLitre = (
  fuelType: string,
  index: number
): number => {

  if (
    fuelType === "Hybrid"
  ) {

    return roundToTwo(
      3.8 +
      (
        (
          index % 5
        ) * 0.2
      )
    );
  }


  return roundToTwo(
    2.7 +
    (
      (
        index % 7
      ) * 0.2
    )
  );
};


// =========================================================
// HELPER: FUEL COST PER LITRE
// =========================================================
//
// Deterministic synthetic prices.
//
// Approximate generated range:
//
// LKR 300 - 330 per litre
//
// This must not be described as an official historical
// diesel-price series.
//
// =========================================================

const getFuelCostPerLitre = (
  index: number
): number => {

  const priceLevels =
    [
      300,
      305,
      310,
      315,
      320,
      325,
      330
    ];


  return priceLevels[
    index %
    priceLevels.length
  ];
};


// =========================================================
// HELPER: RECORDED BY
// =========================================================

const getRecordedBy = (
  index: number
): string => {

  const officerNumber =
    (
      index % 12
    ) + 1;


  return `FUEL-OFFICER-${String(
    officerNumber
  ).padStart(
    2,
    "0"
  )}`;
};


// =========================================================
// SEED FUEL RECORDS
// =========================================================

export const seedFuelRecords =
  async (): Promise<void> => {

    console.log(
      "Seeding fuel records..."
    );


    // =====================================================
    // LOAD COMPLETED TRIPS
    // =====================================================

    const trips =
      await Trip
        .find({
          trip_status:
            "Completed"
        })
        .sort({
          trip_id: 1
        });


    if (
      trips.length !== 100
    ) {

      throw new Error(
        `Fuel-record seed expected exactly 100 completed trips but found ${trips.length}.`
      );
    }


    // =====================================================
    // LOAD BUSES
    // =====================================================

    const buses =
      await Bus
        .find()
        .sort({
          bus_id: 1
        });


    if (
      buses.length !== 100
    ) {

      throw new Error(
        `Fuel-record seed expected 100 buses but found ${buses.length}.`
      );
    }


    // =====================================================
    // BUS LOOKUP MAP
    // =====================================================

    const busMap =
      new Map(
        buses.map(
          bus => [
            bus.bus_id,
            bus
          ]
        )
      );


    // =====================================================
    // GENERATE 100 FUEL RECORDS
    // =====================================================

    const fuelRecordSeedData:
      IFuelRecord[] =
        trips.map(
          (
            trip,
            index
          ): IFuelRecord => {

            const number =
              index + 1;


            // ---------------------------------------------
            // Find related Bus
            // ---------------------------------------------

            const bus =
              busMap.get(
                trip.bus_id
              );


            if (!bus) {

              throw new Error(
                `Fuel seed cannot find Bus ${trip.bus_id} for Trip ${trip.trip_id}.`
              );
            }


            // ---------------------------------------------
            // Prevent invalid Electric fuel records
            // ---------------------------------------------

            if (
              bus.fuel_type ===
              "Electric"
            ) {

              throw new Error(
                `Trip ${trip.trip_id} uses Electric Bus ${bus.bus_id}. The current fuel schema cannot represent electric energy consumption.`
              );
            }


            // ---------------------------------------------
            // Operated distance must be positive
            // ---------------------------------------------

            if (
              trip.operated_km <= 0
            ) {

              throw new Error(
                `Trip ${trip.trip_id} has invalid operated kilometres for fuel seeding.`
              );
            }


            // ---------------------------------------------
            // Fuel Record ID
            // ---------------------------------------------

            const fuelRecordId =
              `FUEL${String(
                number
              ).padStart(
                3,
                "0"
              )}`;


            // ---------------------------------------------
            // Target efficiency
            // ---------------------------------------------

            const targetKmPerLitre =
              getTargetKmPerLitre(
                bus.fuel_type,
                index
              );


            // ---------------------------------------------
            // Fuel consumed
            //
            // litres =
            // distance / efficiency
            // ---------------------------------------------

            const fuelLitres =
              roundToTwo(
                trip.operated_km /
                targetKmPerLitre
              );


            if (
              fuelLitres <= 0
            ) {

              throw new Error(
                `Fuel calculation produced invalid litres for ${trip.trip_id}.`
              );
            }


            // ---------------------------------------------
            // Cost per litre
            // ---------------------------------------------

            const fuelCostPerLitre =
              getFuelCostPerLitre(
                index
              );


            // ---------------------------------------------
            // Total Fuel Cost
            // ---------------------------------------------

            const totalFuelCost =
              roundToTwo(
                fuelLitres *
                fuelCostPerLitre
              );


            // ---------------------------------------------
            // Actual km/L
            //
            // Recalculate using rounded litres so stored
            // metrics remain internally consistent.
            // ---------------------------------------------

            const kmPerLitre =
              roundToTwo(
                trip.operated_km /
                fuelLitres
              );


            // ---------------------------------------------
            // Fuel Cost per km
            // ---------------------------------------------

            const fuelCostPerKm =
              roundToTwo(
                totalFuelCost /
                trip.operated_km
              );


            // ---------------------------------------------
            // Fuel Date
            //
            // Derived from Trip date.
            // ---------------------------------------------

            const fuelDate =
              new Date(
                trip.trip_date
              );


            // ---------------------------------------------
            // Build document
            // ---------------------------------------------

            return {

              fuel_record_id:
                fuelRecordId,

              trip_id:
                trip.trip_id,

              bus_id:
                trip.bus_id,

              depot_id:
                trip.depot_id,

              fuel_date:
                fuelDate,

              fuel_litres:
                fuelLitres,

              fuel_cost_per_litre:
                fuelCostPerLitre,

              total_fuel_cost:
                totalFuelCost,

              operated_km:
                trip.operated_km,

              km_per_litre:
                kmPerLitre,

              fuel_cost_per_km:
                fuelCostPerKm,

              recorded_by:
                getRecordedBy(
                  index
                )

            };

          }
        );


    // =====================================================
    // VERIFY GENERATED COUNT
    // =====================================================

    if (
      fuelRecordSeedData.length !==
      100
    ) {

      throw new Error(
        `Fuel-record seed requires exactly 100 records. Generated: ${fuelRecordSeedData.length}.`
      );
    }


    // =====================================================
    // DELETE EXISTING FUEL RECORDS
    // =====================================================

    await FuelRecord.deleteMany({});


    // =====================================================
    // INSERT FUEL RECORDS
    // =====================================================

    await FuelRecord.insertMany(
      fuelRecordSeedData
    );


    // =====================================================
    // VERIFY COUNT
    // =====================================================

    const count =
      await FuelRecord
        .countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Fuel-record seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    // =====================================================
    // VERIFY RELATIONSHIPS AND CALCULATIONS
    // =====================================================

    const seededRecords =
      await FuelRecord.find();


    const tripMap =
      new Map(
        trips.map(
          trip => [
            trip.trip_id,
            trip
          ]
        )
      );


    for (
      const record of
        seededRecords
    ) {

      // ---------------------------------------------
      // Trip must exist
      // ---------------------------------------------

      const trip =
        tripMap.get(
          record.trip_id
        );


      if (!trip) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} references invalid Trip ${record.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Bus must match Trip
      // ---------------------------------------------

      if (
        record.bus_id !==
        trip.bus_id
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} Bus does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Depot must match Trip
      // ---------------------------------------------

      if (
        record.depot_id !==
        trip.depot_id
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} Depot does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Operated distance must match Trip
      // ---------------------------------------------

      if (
        record.operated_km !==
        trip.operated_km
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} operated distance does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Total Fuel Cost validation
      // ---------------------------------------------

      const expectedTotalCost =
        roundToTwo(
          record.fuel_litres *
          record.fuel_cost_per_litre
        );


      if (
        record.total_fuel_cost !==
        expectedTotalCost
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} has an invalid total fuel cost.`
        );
      }


      // ---------------------------------------------
      // km/L validation
      // ---------------------------------------------

      const expectedKmPerLitre =
        roundToTwo(
          record.operated_km /
          record.fuel_litres
        );


      if (
        record.km_per_litre !==
        expectedKmPerLitre
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} has an invalid km-per-litre value.`
        );
      }


      // ---------------------------------------------
      // Fuel cost / km validation
      // ---------------------------------------------

      const expectedCostPerKm =
        roundToTwo(
          record.total_fuel_cost /
          record.operated_km
        );


      if (
        record.fuel_cost_per_km !==
        expectedCostPerKm
      ) {

        throw new Error(
          `Fuel Record ${record.fuel_record_id} has an invalid fuel-cost-per-km value.`
        );
      }

    }


    console.log(
      `Fuel records seeded successfully: ${count}`
    );


    console.log(
      "Fuel Trip/Bus/Depot relationships verified."
    );


    console.log(
      "Fuel cost and efficiency calculations verified."
    );

  };