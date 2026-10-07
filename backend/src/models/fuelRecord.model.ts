import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  IFuelRecord
} from "../types/fuelRecord.types";


const fuelRecordSchema =
  new Schema<IFuelRecord>(
    {
      fuel_record_id: {
        type: String,
        required: [
          true,
          "Fuel Record ID is required"
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
        required: [
          true,
          "Bus ID is required"
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


      fuel_date: {
        type: Date,
        required: [
          true,
          "Fuel date is required"
        ]
      },


      fuel_litres: {
        type: Number,
        required: [
          true,
          "Fuel litres is required"
        ],
        min: [
          0.01,
          "Fuel litres must be greater than zero"
        ]
      },


      fuel_cost_per_litre: {
        type: Number,
        required: [
          true,
          "Fuel cost per litre is required"
        ],
        min: [
          0.01,
          "Fuel cost per litre must be greater than zero"
        ]
      },


      total_fuel_cost: {
        type: Number,
        required: true,
        min: [
          0,
          "Total fuel cost cannot be negative"
        ]
      },


      operated_km: {
        type: Number,
        required: true,
        min: [
          0.01,
          "Operated kilometres must be greater than zero"
        ]
      },


      km_per_litre: {
        type: Number,
        required: true,
        min: [
          0,
          "Fuel efficiency cannot be negative"
        ]
      },


      fuel_cost_per_km: {
        type: Number,
        required: true,
        min: [
          0,
          "Fuel cost per kilometre cannot be negative"
        ]
      },


      recorded_by: {
        type: String,
        trim: true,
        uppercase: true
      }
    },
    {
      timestamps: true,

      // Explicit MongoDB collection name
      collection: "fuel_records"
    }
  );


// Useful analytics indexes
fuelRecordSchema.index({
  bus_id: 1,
  fuel_date: 1
});

fuelRecordSchema.index({
  depot_id: 1,
  fuel_date: 1
});


const FuelRecord: Model<IFuelRecord> =
  mongoose.model<IFuelRecord>(
    "FuelRecord",
    fuelRecordSchema
  );


export default FuelRecord;