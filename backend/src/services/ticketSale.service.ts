import TicketSale
  from "../models/ticketSale.model";

import Trip
  from "../models/trip.model";

import {
  CreateTicketSaleInput,
  UpdateTicketSaleInput
} from "../types/ticketSales.types";


// Round monetary calculations
const roundToTwo = (
  value: number
): number => {

  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;

};


// Validate ticket information
const validateTicketData = (
  fullFareTickets: number,
  concessionTickets: number,
  passengerCount: number
): number => {

  if (fullFareTickets < 0) {
    throw new Error(
      "Full-fare ticket count cannot be negative."
    );
  }


  if (concessionTickets < 0) {
    throw new Error(
      "Concession ticket count cannot be negative."
    );
  }


  const ticketsSold =
    fullFareTickets +
    concessionTickets;


  if (
    ticketsSold >
    passengerCount
  ) {
    throw new Error(
      "Tickets sold cannot exceed the passenger count recorded for the trip."
    );
  }


  return ticketsSold;
};


// Calculate revenue difference
const calculateRevenueDifference = (
  expectedRevenue: number,
  totalRevenue: number
): number => {

  if (expectedRevenue < 0) {
    throw new Error(
      "Expected revenue cannot be negative."
    );
  }


  if (totalRevenue < 0) {
    throw new Error(
      "Total revenue cannot be negative."
    );
  }


  return roundToTwo(
    expectedRevenue -
    totalRevenue
  );
};


// CREATE TICKET SALE
export const createTicketSale =
  async (
    data: CreateTicketSaleInput
  ) => {

    const normalizedTicketRecordId =
      data.ticket_record_id.toUpperCase();

    const normalizedTripId =
      data.trip_id.toUpperCase();


    // Check duplicate Ticket Record ID
    const existingTicketRecord =
      await TicketSale.findOne({
        ticket_record_id:
          normalizedTicketRecordId
      });


    if (existingTicketRecord) {
      throw new Error(
        "A ticket-sales record with this Ticket Record ID already exists."
      );
    }


    // Ensure one ticket-sales summary per trip
    const existingTripSale =
      await TicketSale.findOne({
        trip_id:
          normalizedTripId
      });


    if (existingTripSale) {
      throw new Error(
        "A ticket-sales record already exists for this trip."
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


    // Revenue should be recorded
    // only for completed trips
    if (
      trip.trip_status !==
      "Completed"
    ) {
      throw new Error(
        "Ticket-sales records can only be created for completed trips."
      );
    }


    // Calculate total tickets
    const ticketsSold =
      validateTicketData(
        data.full_fare_tickets,
        data.concession_tickets,
        trip.passenger_count
      );


    // Calculate revenue variance
    const revenueDifference =
      calculateRevenueDifference(
        data.expected_revenue,
        data.total_revenue
      );


    // Create document
    const ticketSale =
      await TicketSale.create({
        ticket_record_id:
          normalizedTicketRecordId,

        trip_id:
          normalizedTripId,

        bus_id:
          trip.bus_id.toUpperCase(),

        route_id:
          trip.route_id.toUpperCase(),

        depot_id:
          trip.depot_id.toUpperCase(),

        sale_date:
          trip.trip_date,

        tickets_sold:
          ticketsSold,

        full_fare_tickets:
          data.full_fare_tickets,

        concession_tickets:
          data.concession_tickets,

        total_revenue:
          data.total_revenue,

        expected_revenue:
          data.expected_revenue,

        revenue_difference:
          revenueDifference,

        conductor_id:
          data.conductor_id
      });


    return ticketSale;

  };


// GET ALL
export const getAllTicketSales =
  async () => {

    return TicketSale.find().sort({
      sale_date: -1
    });

  };


// GET ONE
export const getTicketSaleById =
  async (
    ticketRecordId: string
  ) => {

    return TicketSale.findOne({
      ticket_record_id:
        ticketRecordId.toUpperCase()
    });

  };


// GET BY TRIP
export const getTicketSaleByTrip =
  async (
    tripId: string
  ) => {

    return TicketSale.findOne({
      trip_id:
        tripId.toUpperCase()
    });

  };


// GET BY ROUTE
export const getTicketSalesByRoute =
  async (
    routeId: string
  ) => {

    return TicketSale.find({
      route_id:
        routeId.toUpperCase()
    }).sort({
      sale_date: -1
    });

  };


// GET BY DEPOT
export const getTicketSalesByDepot =
  async (
    depotId: string
  ) => {

    return TicketSale.find({
      depot_id:
        depotId.toUpperCase()
    }).sort({
      sale_date: -1
    });

  };


// GET BY BUS
export const getTicketSalesByBus =
  async (
    busId: string
  ) => {

    return TicketSale.find({
      bus_id:
        busId.toUpperCase()
    }).sort({
      sale_date: -1
    });

  };


// UPDATE
export const updateTicketSale =
  async (
    ticketRecordId: string,
    data: UpdateTicketSaleInput
  ) => {

    const existingTicketSale =
      await TicketSale.findOne({
        ticket_record_id:
          ticketRecordId.toUpperCase()
      });


    if (!existingTicketSale) {
      return null;
    }


    // Retrieve linked trip
    const trip =
      await Trip.findOne({
        trip_id:
          existingTicketSale.trip_id
      });


    if (!trip) {
      throw new Error(
        "The trip connected to this ticket-sales record no longer exists."
      );
    }


    const finalFullFareTickets =
      data.full_fare_tickets ??
      existingTicketSale
        .full_fare_tickets;


    const finalConcessionTickets =
      data.concession_tickets ??
      existingTicketSale
        .concession_tickets;


    const finalTicketsSold =
      validateTicketData(
        finalFullFareTickets,
        finalConcessionTickets,
        trip.passenger_count
      );


    const finalTotalRevenue =
      data.total_revenue ??
      existingTicketSale
        .total_revenue;


    const finalExpectedRevenue =
      data.expected_revenue ??
      existingTicketSale
        .expected_revenue;


    const revenueDifference =
      calculateRevenueDifference(
        finalExpectedRevenue,
        finalTotalRevenue
      );


    return TicketSale.findOneAndUpdate(
      {
        ticket_record_id:
          ticketRecordId.toUpperCase()
      },
      {
        full_fare_tickets:
          finalFullFareTickets,

        concession_tickets:
          finalConcessionTickets,

        tickets_sold:
          finalTicketsSold,

        total_revenue:
          finalTotalRevenue,

        expected_revenue:
          finalExpectedRevenue,

        revenue_difference:
          revenueDifference,

        conductor_id:
          data.conductor_id ??
          existingTicketSale.conductor_id
      },
      {
        new: true,
        runValidators: true
      }
    );

  };


// DELETE
export const deleteTicketSale =
  async (
    ticketRecordId: string
  ) => {

    return TicketSale.findOneAndDelete({
      ticket_record_id:
        ticketRecordId.toUpperCase()
    });

  };