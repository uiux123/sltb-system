import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  IBus
} from "../types/bus.types";


const busSchema = new Schema<IBus>(
  {
    bus_id: {
      type: String,
      required: [
        true,
        "Bus ID is required"
      ],
      unique: true,
      trim: true,
      uppercase: true
    },

    registration_no: {
      type: String,
      required: [
        true,
        "Registration number is required"
      ],
      unique: true,
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

    manufacturer: {
      type: String,
      required: [
        true,
        "Manufacturer is required"
      ],
      trim: true
    },

    model: {
      type: String,
      required: [
        true,
        "Bus model is required"
      ],
      trim: true
    },

    manufacture_year: {
      type: Number,
      required: [
        true,
        "Manufacture year is required"
      ],
      min: [
        1950,
        "Invalid manufacture year"
      ]
    },

    capacity: {
      type: Number,
      required: [
        true,
        "Bus capacity is required"
      ],
      min: [
        1,
        "Bus capacity must be at least 1"
      ]
    },

    fuel_type: {
      type: String,
      enum: {
        values: [
          "Diesel",
          "Electric",
          "Hybrid"
        ],
        message:
          "{VALUE} is not a valid fuel type"
      },
      default: "Diesel"
    },

    odometer_km: {
      type: Number,
      required: [
        true,
        "Odometer value is required"
      ],
      min: [
        0,
        "Odometer cannot be negative"
      ]
    },

    bus_status: {
      type: String,
      enum: {
        values: [
          "Operational",
          "Under Maintenance",
          "Breakdown",
          "Out of Service"
        ],
        message:
          "{VALUE} is not a valid bus status"
      },
      default: "Operational"
    },

    last_service_date: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);


const Bus: Model<IBus> =
  mongoose.model<IBus>(
    "Bus",
    busSchema
  );


export default Bus;