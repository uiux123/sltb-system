import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  ITicketSale
} from "../types/ticketSales.types";


const ticketSaleSchema =
  new Schema<ITicketSale>(
    {
      ticket_record_id: {
        type: String,
        required: [
          true,
          "Ticket Record ID is required"
        ],
        unique: true,
        trim: true,
        uppercase: true
      },


      trip_id: {
        type: String,
        required: [
          true,
          "Trip ID is required"
        ],
        unique: true,
        trim: true,
        uppercase: true
      },


      bus_id: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },


      route_id: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },


      depot_id: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },


      sale_date: {
        type: Date,
        required: [
          true,
          "Sale date is required"
        ]
      },


      tickets_sold: {
        type: Number,
        required: true,
        min: [
          0,
          "Tickets sold cannot be negative"
        ]
      },


      full_fare_tickets: {
        type: Number,
        required: [
          true,
          "Full-fare ticket count is required"
        ],
        min: [
          0,
          "Full-fare ticket count cannot be negative"
        ]
      },


      concession_tickets: {
        type: Number,
        required: [
          true,
          "Concession ticket count is required"
        ],
        min: [
          0,
          "Concession ticket count cannot be negative"
        ]
      },


      total_revenue: {
        type: Number,
        required: [
          true,
          "Total revenue is required"
        ],
        min: [
          0,
          "Total revenue cannot be negative"
        ]
      },


      expected_revenue: {
        type: Number,
        required: [
          true,
          "Expected revenue is required"
        ],
        min: [
          0,
          "Expected revenue cannot be negative"
        ]
      },


      revenue_difference: {
        type: Number,
        required: true
      },


      conductor_id: {
        type: String,
        trim: true,
        uppercase: true
      }
    },
    {
      timestamps: true,
      collection: "ticket_sales"
    }
  );


// Analytics indexes
ticketSaleSchema.index({
  route_id: 1,
  sale_date: 1
});

ticketSaleSchema.index({
  depot_id: 1,
  sale_date: 1
});

ticketSaleSchema.index({
  bus_id: 1,
  sale_date: 1
});


const TicketSale: Model<ITicketSale> =
  mongoose.model<ITicketSale>(
    "TicketSale",
    ticketSaleSchema
  );


export default TicketSale;