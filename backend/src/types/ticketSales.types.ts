export interface ITicketSale {
  ticket_record_id: string;

  trip_id: string;
  bus_id: string;
  route_id: string;
  depot_id: string;

  sale_date: Date;

  tickets_sold: number;
  full_fare_tickets: number;
  concession_tickets: number;

  total_revenue: number;
  expected_revenue: number;
  revenue_difference: number;

  conductor_id?: string;
}


export interface CreateTicketSaleInput {
  ticket_record_id: string;

  trip_id: string;

  full_fare_tickets: number;
  concession_tickets: number;

  total_revenue: number;
  expected_revenue: number;

  conductor_id?: string;
}


export type UpdateTicketSaleInput =
  Partial<
    Pick<
      CreateTicketSaleInput,
      | "full_fare_tickets"
      | "concession_tickets"
      | "total_revenue"
      | "expected_revenue"
      | "conductor_id"
    >
  >;