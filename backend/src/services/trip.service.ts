import Trip
  from "../models/trip.model";

import Bus
  from "../models/bus.model";

import Route
  from "../models/route.model";

import Depot
  from "../models/depot.model";

import FuelRecord
  from "../models/fuelRecord.model";

import TicketSale
  from "../models/ticketSale.model";

import {
  CreateTripInput,
  UpdateTripInput
} from "../types/trip.types";


// =========================================================
// HELPER: PARSE DATE
// =========================================================

const parseDate = (
  value: string | Date,
  fieldName: string
): Date => {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    throw new Error(
      `${fieldName} contains an invalid date or time.`
    );
  }

  return date;
};


// =========================================================
// HELPER: CALCULATE DEPARTURE DELAY
// =========================================================

const calculateDelayMinutes = (
  scheduledDeparture: Date,
  actualDeparture?: Date
): number => {

  if (!actualDeparture) {
    return 0;
  }

  const difference =
    actualDeparture.getTime() -
    scheduledDeparture.getTime();


  const delay =
    Math.floor(
      difference / 60000
    );


  return Math.max(
    0,
    delay
  );
};


// =========================================================
// HELPER: VALIDATE RELATED RECORDS
// =========================================================

const validateTripRelationships =
  async (
    busId: string,
    routeId: string,
    depotId: string
  ): Promise<void> => {

    // -----------------------------------------------------
    // Validate Depot
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // Validate Bus
    // -----------------------------------------------------

    const bus =
      await Bus.findOne({
        bus_id:
          busId
      });


    if (!bus) {

      throw new Error(
        "The selected bus does not exist."
      );
    }


    // -----------------------------------------------------
    // Bus must belong to selected Depot
    // -----------------------------------------------------

    if (
      bus.depot_id
        .toUpperCase() !==
      depotId.toUpperCase()
    ) {

      throw new Error(
        "The selected bus does not belong to the selected depot."
      );
    }


    // -----------------------------------------------------
    // Validate Route
    // -----------------------------------------------------

    const route =
      await Route.findOne({
        route_id:
          routeId
      });


    if (!route) {

      throw new Error(
        "The selected route does not exist."
      );
    }
  };


// =========================================================
// HELPER: VALIDATE TRIP TIMES
// =========================================================

const validateTripTimes = (
  scheduledDeparture: Date,
  scheduledArrival: Date,
  actualDeparture?: Date,
  actualArrival?: Date
): void => {

  // Scheduled arrival must be later than departure.
  if (
    scheduledArrival <=
    scheduledDeparture
  ) {

    throw new Error(
      "Scheduled arrival must be later than scheduled departure."
    );
  }


  // If both actual times exist,
  // actual arrival must be later than departure.
  if (
    actualDeparture &&
    actualArrival &&
    actualArrival <
      actualDeparture
  ) {

    throw new Error(
      "Actual arrival cannot be before actual departure."
    );
  }
};


// =========================================================
// CREATE TRIP
// =========================================================

export const createTrip = async (
  data: CreateTripInput
) => {

  const tripId =
    data.trip_id
      .trim()
      .toUpperCase();


  const busId =
    data.bus_id
      .trim()
      .toUpperCase();


  const routeId =
    data.route_id
      .trim()
      .toUpperCase();


  const depotId =
    data.depot_id
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Duplicate Trip ID
  // -----------------------------------------------------

  const existingTrip =
    await Trip.findOne({
      trip_id:
        tripId
    });


  if (existingTrip) {

    throw new Error(
      "A trip with this Trip ID already exists."
    );
  }


  // -----------------------------------------------------
  // Validate relationships
  // -----------------------------------------------------

  await validateTripRelationships(
    busId,
    routeId,
    depotId
  );


  // -----------------------------------------------------
  // Parse dates
  // -----------------------------------------------------

  const tripDate =
    parseDate(
      data.trip_date,
      "Trip date"
    );


  const scheduledDeparture =
    parseDate(
      data.scheduled_departure,
      "Scheduled departure"
    );


  const scheduledArrival =
    parseDate(
      data.scheduled_arrival,
      "Scheduled arrival"
    );


  let actualDeparture:
    Date | undefined;


  let actualArrival:
    Date | undefined;


  if (
    data.actual_departure
  ) {

    actualDeparture =
      parseDate(
        data.actual_departure,
        "Actual departure"
      );
  }


  if (
    data.actual_arrival
  ) {

    actualArrival =
      parseDate(
        data.actual_arrival,
        "Actual arrival"
      );
  }


  // -----------------------------------------------------
  // Validate times
  // -----------------------------------------------------

  validateTripTimes(
    scheduledDeparture,
    scheduledArrival,
    actualDeparture,
    actualArrival
  );


  // -----------------------------------------------------
  // Validate passenger count
  // -----------------------------------------------------

  if (
    !Number.isInteger(
      data.passenger_count
    ) ||
    data.passenger_count < 0
  ) {

    throw new Error(
      "Passenger count must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Validate operated kilometres
  // -----------------------------------------------------

  if (
    !Number.isFinite(
      data.operated_km
    ) ||
    data.operated_km < 0
  ) {

    throw new Error(
      "Operated kilometres cannot be negative."
    );
  }


  // -----------------------------------------------------
  // Calculate delay automatically
  // -----------------------------------------------------

  const delayMinutes =
    calculateDelayMinutes(
      scheduledDeparture,
      actualDeparture
    );


  // -----------------------------------------------------
  // Create Trip
  // -----------------------------------------------------

  const trip =
    await Trip.create({

      trip_id:
        tripId,

      bus_id:
        busId,

      route_id:
        routeId,

      depot_id:
        depotId,

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
        data.passenger_count,

      operated_km:
        data.operated_km,

      trip_status:
        data.trip_status,

      delay_minutes:
        delayMinutes

    });


  return trip;
};


// =========================================================
// GET ALL TRIPS
// =========================================================

export const getAllTrips =
  async () => {

    return Trip
      .find()
      .sort({
        trip_date: -1,
        scheduled_departure: -1
      });
  };


// =========================================================
// GET TRIP BY ID
// =========================================================

export const getTripById = async (
  tripId: string
) => {

  return Trip.findOne({
    trip_id:
      tripId
        .trim()
        .toUpperCase()
  });
};


// =========================================================
// GET TRIPS BY DEPOT
// =========================================================

export const getTripsByDepot = async (
  depotId: string
) => {

  return Trip
    .find({
      depot_id:
        depotId
          .trim()
          .toUpperCase()
    })
    .sort({
      trip_date: -1
    });
};


// =========================================================
// GET TRIPS BY ROUTE
// =========================================================

export const getTripsByRoute = async (
  routeId: string
) => {

  return Trip
    .find({
      route_id:
        routeId
          .trim()
          .toUpperCase()
    })
    .sort({
      trip_date: -1
    });
};


// =========================================================
// GET TRIPS BY BUS
// =========================================================

export const getTripsByBus = async (
  busId: string
) => {

  return Trip
    .find({
      bus_id:
        busId
          .trim()
          .toUpperCase()
    })
    .sort({
      trip_date: -1
    });
};


// =========================================================
// UPDATE TRIP
// =========================================================

export const updateTrip = async (
  tripId: string,
  data: UpdateTripInput
) => {

  const normalizedTripId =
    tripId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Find existing Trip
  // -----------------------------------------------------

  const existingTrip =
    await Trip.findOne({
      trip_id:
        normalizedTripId
    });


  if (!existingTrip) {

    return null;
  }


  // -----------------------------------------------------
  // Determine final relationship values
  // -----------------------------------------------------

  const busId =
    (
      data.bus_id ??
      existingTrip.bus_id
    )
      .trim()
      .toUpperCase();


  const routeId =
    (
      data.route_id ??
      existingTrip.route_id
    )
      .trim()
      .toUpperCase();


  const depotId =
    (
      data.depot_id ??
      existingTrip.depot_id
    )
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Revalidate relationships
  // -----------------------------------------------------

  await validateTripRelationships(
    busId,
    routeId,
    depotId
  );


  // -----------------------------------------------------
  // Determine final dates
  // -----------------------------------------------------

  const tripDate =
    data.trip_date
      ? parseDate(
          data.trip_date,
          "Trip date"
        )
      : existingTrip
          .trip_date;


  const scheduledDeparture =
    data.scheduled_departure
      ? parseDate(
          data.scheduled_departure,
          "Scheduled departure"
        )
      : existingTrip
          .scheduled_departure;


  const scheduledArrival =
    data.scheduled_arrival
      ? parseDate(
          data.scheduled_arrival,
          "Scheduled arrival"
        )
      : existingTrip
          .scheduled_arrival;


  let actualDeparture =
    existingTrip
      .actual_departure;


  let actualArrival =
    existingTrip
      .actual_arrival;


  if (
    data.actual_departure !==
    undefined
  ) {

    actualDeparture =
      parseDate(
        data.actual_departure,
        "Actual departure"
      );
  }


  if (
    data.actual_arrival !==
    undefined
  ) {

    actualArrival =
      parseDate(
        data.actual_arrival,
        "Actual arrival"
      );
  }


  // -----------------------------------------------------
  // Validate times
  // -----------------------------------------------------

  validateTripTimes(
    scheduledDeparture,
    scheduledArrival,
    actualDeparture,
    actualArrival
  );


  // -----------------------------------------------------
  // Passenger count
  // -----------------------------------------------------

  const passengerCount =
    data.passenger_count ??
    existingTrip
      .passenger_count;


  if (
    !Number.isInteger(
      passengerCount
    ) ||
    passengerCount < 0
  ) {

    throw new Error(
      "Passenger count must be a non-negative whole number."
    );
  }


  // -----------------------------------------------------
  // Operated kilometres
  // -----------------------------------------------------

  const operatedKm =
    data.operated_km ??
    existingTrip
      .operated_km;


  if (
    !Number.isFinite(
      operatedKm
    ) ||
    operatedKm < 0
  ) {

    throw new Error(
      "Operated kilometres cannot be negative."
    );
  }


  // -----------------------------------------------------
  // Recalculate delay
  // -----------------------------------------------------

  const delayMinutes =
    calculateDelayMinutes(
      scheduledDeparture,
      actualDeparture
    );


  // -----------------------------------------------------
  // Update Trip
  // -----------------------------------------------------

  return Trip.findOneAndUpdate(
    {
      trip_id:
        normalizedTripId
    },
    {
      bus_id:
        busId,

      route_id:
        routeId,

      depot_id:
        depotId,

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

      trip_status:
        data.trip_status ??
        existingTrip
          .trip_status,

      delay_minutes:
        delayMinutes
    },
    {
      new: true,
      runValidators: true
    }
  );
};


// =========================================================
// DELETE TRIP WITH RELATIONSHIP PROTECTION
// =========================================================
//
// A trip cannot be deleted if downstream operational
// records already reference it.
//
// Collections checked:
//
// fuel_records
// ticket_sales
//
// Example:
//
// TRP1001
//    ├── FUEL001
//    └── TKT001
//
// Deleting TRP1001 in that situation would create
// orphaned records.
//
// =========================================================

export const deleteTrip = async (
  tripId: string
) => {

  const normalizedTripId =
    tripId
      .trim()
      .toUpperCase();


  // -----------------------------------------------------
  // Check whether Trip exists
  // -----------------------------------------------------

  const trip =
    await Trip.findOne({
      trip_id:
        normalizedTripId
    });


  if (!trip) {

    return null;
  }


  // =====================================================
  // CHECK FUEL RECORD
  // =====================================================

  const fuelRecordExists =
    await FuelRecord.exists({
      trip_id:
        normalizedTripId
    });


  if (fuelRecordExists) {

    throw new Error(
      `Cannot delete ${normalizedTripId} because a fuel record is linked to this trip.`
    );
  }


  // =====================================================
  // CHECK TICKET-SALES RECORD
  // =====================================================

  const ticketSaleExists =
    await TicketSale.exists({
      trip_id:
        normalizedTripId
    });


  if (ticketSaleExists) {

    throw new Error(
      `Cannot delete ${normalizedTripId} because a ticket-sales record is linked to this trip.`
    );
  }


  // =====================================================
  // SAFE TO DELETE
  // =====================================================

  return Trip.findOneAndDelete({
    trip_id:
      normalizedTripId
  });
};