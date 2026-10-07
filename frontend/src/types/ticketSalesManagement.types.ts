// =========================================================
// TICKET SALE
// =========================================================

export interface ITicketSale {

  _id?: string;

  ticket_record_id: string;

  trip_id: string;

  bus_id: string;

  route_id: string;

  depot_id: string;

  sale_date: string;

  tickets_sold: number;

  full_fare_tickets: number;

  concession_tickets: number;

  total_revenue: number;

  expected_revenue: number;

  revenue_difference: number;

  conductor_id?: string;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// CREATE INPUT
// =========================================================
//
// The frontend supplies these values.
//
// The backend derives:
// bus_id
// route_id
// depot_id
// sale_date
// tickets_sold
// revenue_difference
//
// =========================================================

export interface ITicketSaleCreateInput {

  ticket_record_id: string;

  trip_id: string;

  full_fare_tickets: number;

  concession_tickets: number;

  total_revenue: number;

  expected_revenue: number;

  conductor_id?: string;

}


// =========================================================
// UPDATE INPUT
// =========================================================
//
// ticket_record_id and trip_id cannot be changed.
//
// The backend recalculates:
// tickets_sold
// revenue_difference
//
// =========================================================

export interface ITicketSaleUpdateInput {

  full_fare_tickets?: number;

  concession_tickets?: number;

  total_revenue?: number;

  expected_revenue?: number;

  conductor_id?: string;

}