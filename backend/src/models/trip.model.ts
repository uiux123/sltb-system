import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  ITrip
} from "../types/trip.types";


const tripSchema = new Schema<ITrip>(
  {
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
      required: [
        true,
        "Bus ID is required"
      ],
      trim: true,
      uppercase: true
    },


    route_id: {
      type: String,
      required: [
        true,
        "Route ID is required"
      ],
      trim: true,
      uppercase: true
    },


    depot_id: {
      type: String,
      required: [
        true,
        "Depot ID is required"
      ],
      trim: true,
      uppercase: true
    },


    trip_date: {
      type: Date,
      required: [
        true,
        "Trip date is required"
      ]
    },


    scheduled_departure: {
      type: Date,
      required: [
        true,
        "Scheduled departure time is required"
      ]
    },


    actual_departure: {
      type: Date
    },


    scheduled_arrival: {
      type: Date,
      required: [
        true,
        "Scheduled arrival time is required"
      ]
    },


    actual_arrival: {
      type: Date
    },


    passenger_count: {
      type: Number,
      required: [
        true,
        "Passenger count is required"
      ],
      min: [
        0,
        "Passenger count cannot be negative"
      ]
    },


    operated_km: {
      type: Number,
      required: [
        true,
        "Operated kilometres is required"
      ],
      min: [
        0,
        "Operated kilometres cannot be negative"
      ]
    },


    trip_status: {
      type: String,
      enum: {
        values: [
          "Scheduled",
          "Completed",
          "Cancelled",
          "Missed"
        ],
        message:
          "{VALUE} is not a valid trip status"
      },
      default: "Scheduled"
    },


    delay_minutes: {
      type: Number,
      min: [
        0,
        "Delay minutes cannot be negative"
      ],
      default: 0
    }
  },
  {
    timestamps: true
  }
);


// Useful indexes for future analytics
tripSchema.index({
  trip_date: 1
});

tripSchema.index({
  depot_id: 1,
  trip_date: 1
});

tripSchema.index({
  route_id: 1,
  trip_date: 1
});

tripSchema.index({
  bus_id: 1,
  trip_date: 1
});


const Trip: Model<ITrip> =
  mongoose.model<ITrip>(
    "Trip",
    tripSchema
  );


export default Trip;