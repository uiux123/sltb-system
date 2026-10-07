import Trip
  from "../models/trip.model";

import Bus
  from "../models/bus.model";

import Route
  from "../models/route.model";

import Depot
  from "../models/depot.model";

import {
  ITrip
} from "../types/trip.types";


// =========================================================
// CONSTANTS
// =========================================================

const ONE_DAY_MS =
  24 * 60 * 60 * 1000;

const ONE_MINUTE_MS =
  60 * 1000;


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
// HELPER: AVERAGE OPERATING SPEED
// =========================================================
//
// Synthetic average speeds used only to create reasonable
// journey durations.
//
// These are NOT official SLTB measurements.
//
// =========================================================

const getAverageSpeed = (
  routeType: string
): number => {

  switch (
    routeType
  ) {

    case "Urban":
      return 28;

    case "Rural":
      return 36;

    case "Intercity":
      return 45;

    case "School":
      return 25;

    case "Night":
      return 42;

    default:
      return 35;
  }
};


// =========================================================
// HELPER: SCHEDULED JOURNEY DURATION
// =========================================================

const calculateJourneyMinutes = (
  distanceKm: number,
  routeType: string
): number => {

  const averageSpeed =
    getAverageSpeed(
      routeType
    );


  const calculatedMinutes =
    Math.ceil(
      (
        distanceKm /
        averageSpeed
      ) * 60
    );


  // Even very short routes get a sensible
  // minimum scheduled duration.
  return Math.max(
    20,
    calculatedMinutes
  );
};


// =========================================================
// HELPER: PASSENGER COUNT
// =========================================================
//
// Creates load factors approximately between:
//
// 45% - 95%
//
// Passenger count will never exceed bus capacity.
//
// =========================================================

const calculatePassengerCount = (
  capacity: number,
  index: number
): number => {

  const loadPercentage =
    45 +
    (
      (
        index * 7
      ) % 51
    );


  const passengers =
    Math.round(
      capacity *
      (
        loadPercentage / 100
      )
    );


  return Math.min(
    capacity,
    Math.max(
      1,
      passengers
    )
  );
};


// =========================================================
// HELPER: OPERATED DISTANCE
// =========================================================
//
// Creates small variation around the route distance.
//
// Useful later for:
//
// fuel efficiency
// fuel cost/km
// route performance
//
// =========================================================

const calculateOperatedKm = (
  routeDistance: number,
  index: number
): number => {

  const variation =
    (
      (
        index % 7
      ) - 3
    ) * 0.01;


  const multiplier =
    0.98 +
    variation;


  return roundToTwo(
    routeDistance *
    multiplier
  );
};


// =========================================================
// HELPER: DEPARTURE DELAY
// =========================================================
//
// Range:
//
// 0 - 30 minutes
//
// =========================================================

const calculateDelayMinutes = (
  index: number
): number => {

  return (
    (
      index * 7
    ) % 31
  );
};


// =========================================================
// SEED TRIPS
// =========================================================

export const seedTrips =
  async (): Promise<void> => {

    console.log(
      "Seeding trips..."
    );


    // =====================================================
    // LOAD EXISTING MASTER DATA
    // =====================================================

    const buses =
      await Bus
        .find()
        .sort({
          bus_id: 1
        });


    const routes =
      await Route
        .find()
        .sort({
          route_id: 1
        });


    const depots =
      await Depot
        .find()
        .sort({
          depot_id: 1
        });


    // =====================================================
    // VERIFY MASTER DATA
    // =====================================================

    if (
      buses.length !== 100
    ) {

      throw new Error(
        `Trip seed expected 100 buses but found ${buses.length}.`
      );
    }


    if (
      routes.length !== 100
    ) {

      throw new Error(
        `Trip seed expected 100 routes but found ${routes.length}.`
      );
    }


    if (
      depots.length !== 100
    ) {

      throw new Error(
        `Trip seed expected 100 depots but found ${depots.length}.`
      );
    }


    // =====================================================
    // VALID DEPOT IDS
    // =====================================================

    const validDepotIds =
      new Set(
        depots.map(
          depot =>
            depot.depot_id
        )
      );


    // =====================================================
    // BASE DATE
    // =====================================================
    //
    // First seeded trip:
    //
    // 05 January 2026
    //
    // Then one new date for each trip.
    //
    // =====================================================

    const baseTripDate =
      new Date(
        "2026-01-05T00:00:00+05:30"
      );


    // =====================================================
    // GENERATE EXACTLY 100 TRIPS
    // =====================================================

    const tripSeedData:
      ITrip[] =
        Array.from(
          {
            length: 100
          },
          (
            _,
            index
          ): ITrip => {

            const number =
              index + 1;


            // ---------------------------------------------
            // Assign one Bus
            // ---------------------------------------------

            const bus =
              buses[index];


            // ---------------------------------------------
            // Assign one Route
            // ---------------------------------------------

            const route =
              routes[index];


            if (
              !bus ||
              !route
            ) {

              throw new Error(
                `Unable to generate Trip ${number}. Bus or Route is missing.`
              );
            }


            // ---------------------------------------------
            // Verify Bus's Depot exists
            // ---------------------------------------------

            if (
              !validDepotIds.has(
                bus.depot_id
              )
            ) {

              throw new Error(
                `Cannot seed trip because ${bus.bus_id} references invalid depot ${bus.depot_id}.`
              );
            }


            // ---------------------------------------------
            // TRIP ID
            // ---------------------------------------------

            const tripId =
              `TRP${String(
                number
              ).padStart(
                4,
                "0"
              )}`;


            // ---------------------------------------------
            // TRIP DATE
            // ---------------------------------------------

            const tripDate =
              new Date(
                baseTripDate.getTime() +
                (
                  index *
                  ONE_DAY_MS
                )
              );


            // ---------------------------------------------
            // SCHEDULED DEPARTURE
            // ---------------------------------------------
            //
            // Departure hours vary from:
            //
            // 05:00 - 18:45
            //
            // ---------------------------------------------

            const departureHour =
              5 +
              (
                index % 14
              );


            const departureMinuteOptions =
              [
                0,
                15,
                30,
                45
              ];


            const departureMinute =
              departureMinuteOptions[
                index %
                departureMinuteOptions.length
              ];


            const scheduledDeparture =
              new Date(
                tripDate.getTime() +
                (
                  (
                    departureHour * 60
                  ) +
                  departureMinute
                ) *
                ONE_MINUTE_MS
              );


            // ---------------------------------------------
            // JOURNEY DURATION
            // ---------------------------------------------

            const journeyMinutes =
              calculateJourneyMinutes(
                route.distance_km,
                route.route_type
              );


            // ---------------------------------------------
            // SCHEDULED ARRIVAL
            // ---------------------------------------------

            const scheduledArrival =
              new Date(
                scheduledDeparture.getTime() +
                (
                  journeyMinutes *
                  ONE_MINUTE_MS
                )
              );


            // ---------------------------------------------
            // DEPARTURE DELAY
            // ---------------------------------------------

            const delayMinutes =
              calculateDelayMinutes(
                index
              );


            // ---------------------------------------------
            // ACTUAL DEPARTURE
            // ---------------------------------------------

            const actualDeparture =
              new Date(
                scheduledDeparture.getTime() +
                (
                  delayMinutes *
                  ONE_MINUTE_MS
                )
              );


            // ---------------------------------------------
            // ADDITIONAL JOURNEY DELAY
            // ---------------------------------------------
            //
            // 0 - 20 additional minutes.
            //
            // ---------------------------------------------

            const additionalJourneyDelay =
              (
                (
                  index * 11
                ) % 21
              );


            // ---------------------------------------------
            // ACTUAL ARRIVAL
            // ---------------------------------------------

            const actualArrival =
              new Date(
                scheduledArrival.getTime() +
                (
                  (
                    delayMinutes +
                    additionalJourneyDelay
                  ) *
                  ONE_MINUTE_MS
                )
              );


            // ---------------------------------------------
            // PASSENGERS
            // ---------------------------------------------

            const passengerCount =
              calculatePassengerCount(
                bus.capacity,
                index
              );


            // ---------------------------------------------
            // OPERATED KM
            // ---------------------------------------------

            const operatedKm =
              calculateOperatedKm(
                route.distance_km,
                index
              );


            // ---------------------------------------------
            // CREATE TRIP OBJECT
            // ---------------------------------------------

            return {

              trip_id:
                tripId,

              bus_id:
                bus.bus_id,

              route_id:
                route.route_id,

              // Very important:
              //
              // Depot always comes from the selected Bus.
              depot_id:
                bus.depot_id,

              trip_date:
                tripDate,

              scheduled_departure:
                scheduledDeparture,

              actual_departure:
                actualDeparture,

              scheduled_arrival:
                scheduledArrival,

              actual_arrival:
                actualArrival,

              passenger_count:
                passengerCount,

              operated_km:
                operatedKm,

              // All trips are completed so Step 6 and
              // Step 7 can create one fuel/ticket record
              // for every trip.
              trip_status:
                "Completed",

              delay_minutes:
                delayMinutes

            };

          }
        );


    // =====================================================
    // VERIFY GENERATED COUNT
    // =====================================================

    if (
      tripSeedData.length !==
      100
    ) {

      throw new Error(
        `Trip seed requires exactly 100 documents. Generated: ${tripSeedData.length}`
      );
    }


    // =====================================================
    // DELETE EXISTING TRIPS
    // =====================================================

    await Trip.deleteMany({});


    // =====================================================
    // INSERT TRIPS
    // =====================================================

    await Trip.insertMany(
      tripSeedData
    );


    // =====================================================
    // VERIFY COUNT
    // =====================================================

    const count =
      await Trip.countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Trip seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    // =====================================================
    // VERIFY RELATIONSHIPS
    // =====================================================

    const validBusIds =
      new Set(
        buses.map(
          bus =>
            bus.bus_id
        )
      );


    const validRouteIds =
      new Set(
        routes.map(
          route =>
            route.route_id
        )
      );


    const seededTrips =
      await Trip.find();


    for (
      const trip of seededTrips
    ) {

      // ---------------------------------------------
      // Bus relationship
      // ---------------------------------------------

      if (
        !validBusIds.has(
          trip.bus_id
        )
      ) {

        throw new Error(
          `Trip ${trip.trip_id} references invalid Bus ${trip.bus_id}.`
        );
      }


      // ---------------------------------------------
      // Route relationship
      // ---------------------------------------------

      if (
        !validRouteIds.has(
          trip.route_id
        )
      ) {

        throw new Error(
          `Trip ${trip.trip_id} references invalid Route ${trip.route_id}.`
        );
      }


      // ---------------------------------------------
      // Depot relationship
      // ---------------------------------------------

      if (
        !validDepotIds.has(
          trip.depot_id
        )
      ) {

        throw new Error(
          `Trip ${trip.trip_id} references invalid Depot ${trip.depot_id}.`
        );
      }


      // ---------------------------------------------
      // Verify Trip Depot matches Bus Depot
      // ---------------------------------------------

      const relatedBus =
        buses.find(
          bus =>
            bus.bus_id ===
            trip.bus_id
        );


      if (
        !relatedBus
      ) {

        throw new Error(
          `Unable to find Bus ${trip.bus_id} while validating Trip ${trip.trip_id}.`
        );
      }


      if (
        relatedBus.depot_id !==
        trip.depot_id
      ) {

        throw new Error(
          `Trip ${trip.trip_id} has Depot ${trip.depot_id}, but Bus ${trip.bus_id} belongs to ${relatedBus.depot_id}.`
        );
      }


      // ---------------------------------------------
      // Passenger count cannot exceed capacity
      // ---------------------------------------------

      if (
        trip.passenger_count >
        relatedBus.capacity
      ) {

        throw new Error(
          `Trip ${trip.trip_id} passenger count exceeds Bus ${relatedBus.bus_id} capacity.`
        );
      }


      // ---------------------------------------------
      // All Trips must be Completed
      // ---------------------------------------------

      if (
        trip.trip_status !==
        "Completed"
      ) {

        throw new Error(
          `Trip ${trip.trip_id} is not Completed. Fuel and ticket seeding requires completed trips.`
        );
      }

    }


    console.log(
      `Trips seeded successfully: ${count}`
    );


    console.log(
      "Trip Bus/Route/Depot relationships verified."
    );


    console.log(
      "All seeded trips are Completed."
    );

  };