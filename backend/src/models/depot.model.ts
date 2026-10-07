import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  IDepot
} from "../types/depot.types";

const depotSchema = new Schema<IDepot>(
  {
    depot_id: {
      type: String,
      required: [true, "Depot ID is required"],
      unique: true,
      trim: true,
      uppercase: true
    },

    depot_name: {
      type: String,
      required: [true, "Depot name is required"],
      trim: true
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },

    total_staff: {
      type: Number,
      required: [true, "Total staff is required"],
      min: [0, "Total staff cannot be negative"]
    },

    monthly_fixed_cost: {
      type: Number,
      required: [true, "Monthly fixed cost is required"],
      min: [0, "Monthly fixed cost cannot be negative"]
    },

    manager_name: {
      type: String,
      trim: true
    },

    contact_number: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "{VALUE} is not a valid depot status"
      },
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const Depot: Model<IDepot> =
  mongoose.model<IDepot>(
    "Depot",
    depotSchema
  );

export default Depot;