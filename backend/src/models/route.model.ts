import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  IRoute
} from "../types/route.types";


const routeSchema = new Schema<IRoute>(
  {
    route_id: {
      type: String,
      required: [
        true,
        "Route ID is required"
      ],
      unique: true,
      trim: true,
      uppercase: true
    },

    route_number: {
      type: String,
      required: [
        true,
        "Route number is required"
      ],
      trim: true,
      uppercase: true
    },

    origin: {
      type: String,
      required: [
        true,
        "Origin is required"
      ],
      trim: true
    },

    destination: {
      type: String,
      required: [
        true,
        "Destination is required"
      ],
      trim: true
    },

    distance_km: {
      type: Number,
      required: [
        true,
        "Route distance is required"
      ],
      min: [
        0.1,
        "Route distance must be greater than zero"
      ]
    },

    route_type: {
      type: String,
      required: [
        true,
        "Route type is required"
      ],
      enum: {
        values: [
          "Urban",
          "Intercity",
          "Rural",
          "School",
          "Night",
          "Other"
        ],
        message:
          "{VALUE} is not a valid route type"
      }
    },

    scheduled_trips_per_day: {
      type: Number,
      required: [
        true,
        "Scheduled trips per day is required"
      ],
      min: [
        0,
        "Scheduled trips cannot be negative"
      ]
    },

    average_fare: {
      type: Number,
      required: [
        true,
        "Average fare is required"
      ],
      min: [
        0,
        "Average fare cannot be negative"
      ]
    },

    social_service_route: {
      type: Boolean,
      required: true,
      default: false
    },

    status: {
      type: String,
      enum: {
        values: [
          "Active",
          "Inactive"
        ],
        message:
          "{VALUE} is not a valid route status"
      },
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);


const Route: Model<IRoute> =
  mongoose.model<IRoute>(
    "Route",
    routeSchema
  );


export default Route;