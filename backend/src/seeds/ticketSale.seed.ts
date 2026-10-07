import TicketSale
  from "../models/ticketSale.model";

import Trip
  from "../models/trip.model";

import Route
  from "../models/route.model";

import {
  ITicketSale
} from "../types/ticketSales.types";


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
// HELPER: ROUND TO NEAREST 10 LKR
// =========================================================

const roundToNearestTen = (
  value: number
): number => {

  return Math.round(
    value / 10
  ) * 10;
};


// =========================================================
// HELPER: CONCESSION TICKET COUNT
// =========================================================
//
// Creates approximately 5% - 25% concession tickets.
//
// Full-fare + concession will always equal tickets sold.
//
// =========================================================

const calculateConcessionTickets = (
  passengerCount: number,
  index: number
): number => {

  const concessionPercentage =
    5 +
    (
      (
        index * 5
      ) % 21
    );


  const concessionTickets =
    Math.round(
      passengerCount *
      (
        concessionPercentage / 100
      )
    );


  return Math.min(
    passengerCount,
    Math.max(
      0,
      concessionTickets
    )
  );
};


// =========================================================
// HELPER: REVENUE VARIATION
// =========================================================
//
// Creates small synthetic differences between:
//
// expected revenue
// and
// actual recorded revenue.
//
// Range approximately:
//
// -3% to +2%
//
// A revenue difference is only a discrepancy indicator.
// It does NOT by itself indicate fraud.
//
// =========================================================

const getRevenueVariation = (
  index: number
): number => {

  const variations =
    [
      -0.03,
      -0.02,
      -0.01,
      0,
      0,
      0.01,
      0.02
    ];


  return variations[
    index %
    variations.length
  ];
};


// =========================================================
// HELPER: CONDUCTOR ID
// =========================================================
//
// Creates 20 synthetic conductor IDs.
//
// =========================================================

const getConductorId = (
  index: number
): string => {

  const conductorNumber =
    (
      index % 20
    ) + 1;


  return `COND${String(
    conductorNumber
  ).padStart(
    3,
    "0"
  )}`;
};


// =========================================================
// SEED TICKET SALES
// =========================================================

export const seedTicketSales =
  async (): Promise<void> => {

    console.log(
      "Seeding ticket sales..."
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
        `Ticket-sale seed expected exactly 100 completed trips but found ${trips.length}.`
      );
    }


    // =====================================================
    // LOAD ROUTES
    // =====================================================

    const routes =
      await Route
        .find()
        .sort({
          route_id: 1
        });


    if (
      routes.length !== 100
    ) {

      throw new Error(
        `Ticket-sale seed expected 100 routes but found ${routes.length}.`
      );
    }


    // =====================================================
    // CREATE ROUTE LOOKUP MAP
    // =====================================================

    const routeMap =
      new Map(
        routes.map(
          route => [
            route.route_id,
            route
          ]
        )
      );


    // =====================================================
    // GENERATE EXACTLY 100 TICKET SALES
    // =====================================================

    const ticketSaleSeedData:
      ITicketSale[] =
        trips.map(
          (
            trip,
            index
          ): ITicketSale => {

            const number =
              index + 1;


            // ---------------------------------------------
            // Find Trip's Route
            // ---------------------------------------------

            const route =
              routeMap.get(
                trip.route_id
              );


            if (!route) {

              throw new Error(
                `Ticket-sale seed cannot find Route ${trip.route_id} for Trip ${trip.trip_id}.`
              );
            }


            // ---------------------------------------------
            // Passenger Count Validation
            // ---------------------------------------------

            if (
              trip.passenger_count < 0
            ) {

              throw new Error(
                `Trip ${trip.trip_id} has an invalid passenger count.`
              );
            }


            // =================================================
            // TICKET RECORD ID
            // =================================================

            const ticketRecordId =
              `TKT${String(
                number
              ).padStart(
                3,
                "0"
              )}`;


            // =================================================
            // TICKETS SOLD
            // =================================================
            //
            // For the seed dataset:
            //
            // one passenger = one ticket
            //
            // =================================================

            const ticketsSold =
              trip.passenger_count;


            // =================================================
            // CONCESSION TICKETS
            // =================================================

            const concessionTickets =
              calculateConcessionTickets(
                ticketsSold,
                index
              );


            // =================================================
            // FULL-FARE TICKETS
            // =================================================

            const fullFareTickets =
              ticketsSold -
              concessionTickets;


            // =================================================
            // FARES
            // =================================================
            //
            // route.average_fare is the synthetic average
            // full fare created during route seeding.
            //
            // For this test dataset, concession fare is 50%
            // of the average full fare.
            //
            // =================================================

            const fullFare =
              route.average_fare;


            const concessionFare =
              roundToNearestTen(
                fullFare *
                0.5
              );


            // =================================================
            // EXPECTED REVENUE
            // =================================================

            const expectedRevenue =
              roundToTwo(
                (
                  fullFareTickets *
                  fullFare
                ) +
                (
                  concessionTickets *
                  concessionFare
                )
              );


            // =================================================
            // ACTUAL TOTAL REVENUE
            // =================================================

            const revenueVariation =
              getRevenueVariation(
                index
              );


            const totalRevenue =
              Math.max(
                0,
                roundToNearestTen(
                  expectedRevenue *
                  (
                    1 +
                    revenueVariation
                  )
                )
              );


            // =================================================
            // REVENUE DIFFERENCE
            // =================================================
            //
            // Positive:
            // recorded > expected
            //
            // Negative:
            // recorded < expected
            //
            // Zero:
            // exact match
            //
            // =================================================

            const revenueDifference =
              roundToTwo(
                totalRevenue -
                expectedRevenue
              );


            // =================================================
            // SALE DATE
            // =================================================

            const saleDate =
              new Date(
                trip.trip_date
              );


            // =================================================
            // BUILD DOCUMENT
            // =================================================

            return {

              ticket_record_id:
                ticketRecordId,

              trip_id:
                trip.trip_id,

              bus_id:
                trip.bus_id,

              route_id:
                trip.route_id,

              depot_id:
                trip.depot_id,

              sale_date:
                saleDate,

              tickets_sold:
                ticketsSold,

              full_fare_tickets:
                fullFareTickets,

              concession_tickets:
                concessionTickets,

              total_revenue:
                totalRevenue,

              expected_revenue:
                expectedRevenue,

              revenue_difference:
                revenueDifference,

              conductor_id:
                getConductorId(
                  index
                )

            };

          }
        );


    // =====================================================
    // VERIFY GENERATED COUNT
    // =====================================================

    if (
      ticketSaleSeedData.length !==
      100
    ) {

      throw new Error(
        `Ticket-sale seed requires exactly 100 records. Generated: ${ticketSaleSeedData.length}.`
      );
    }


    // =====================================================
    // REMOVE EXISTING TICKET SALES
    // =====================================================

    await TicketSale.deleteMany({});


    // =====================================================
    // INSERT TICKET SALES
    // =====================================================

    await TicketSale.insertMany(
      ticketSaleSeedData
    );


    // =====================================================
    // VERIFY DATABASE COUNT
    // =====================================================

    const count =
      await TicketSale
        .countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Ticket-sale seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    // =====================================================
    // CREATE TRIP LOOKUP
    // =====================================================

    const tripMap =
      new Map(
        trips.map(
          trip => [
            trip.trip_id,
            trip
          ]
        )
      );


    // =====================================================
    // VERIFY EACH INSERTED DOCUMENT
    // =====================================================

    const seededTicketSales =
      await TicketSale.find();


    for (
      const sale of
        seededTicketSales
    ) {

      // ---------------------------------------------
      // Trip must exist
      // ---------------------------------------------

      const trip =
        tripMap.get(
          sale.trip_id
        );


      if (!trip) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} references invalid Trip ${sale.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Bus relationship
      // ---------------------------------------------

      if (
        sale.bus_id !==
        trip.bus_id
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} Bus does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Route relationship
      // ---------------------------------------------

      if (
        sale.route_id !==
        trip.route_id
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} Route does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Depot relationship
      // ---------------------------------------------

      if (
        sale.depot_id !==
        trip.depot_id
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} Depot does not match Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Tickets cannot exceed passengers
      // ---------------------------------------------

      if (
        sale.tickets_sold >
        trip.passenger_count
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} tickets sold exceeds passenger count for Trip ${trip.trip_id}.`
        );
      }


      // ---------------------------------------------
      // Full + concession = tickets sold
      // ---------------------------------------------

      if (
        (
          sale.full_fare_tickets +
          sale.concession_tickets
        ) !==
        sale.tickets_sold
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} has inconsistent ticket counts.`
        );
      }


      // ---------------------------------------------
      // Validate revenue difference
      // ---------------------------------------------

      const expectedDifference =
        roundToTwo(
          sale.total_revenue -
          sale.expected_revenue
        );


      if (
        sale.revenue_difference !==
        expectedDifference
      ) {

        throw new Error(
          `Ticket Sale ${sale.ticket_record_id} has an invalid revenue difference.`
        );
      }

    }


    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      `Ticket sales seeded successfully: ${count}`
    );


    console.log(
      "Ticket Trip/Bus/Route/Depot relationships verified."
    );


    console.log(
      "Ticket counts verified against Trip passenger counts."
    );


    console.log(
      "Ticket revenue calculations verified."
    );

  };