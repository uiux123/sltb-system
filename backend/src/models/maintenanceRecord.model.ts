import mongoose, {
  Schema
} from "mongoose";

import {
  IMaintenanceRecord,
  IMaintenancePartUsed
} from "../types/maintenanceRecord.types";


// =========================================================
// EMBEDDED SPARE PART SCHEMA
// =========================================================

const maintenancePartSchema =
  new Schema<IMaintenancePartUsed>(
    {
      part_id: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },

      part_name: {
        type: String,
        required: true,
        trim: true
      },

      quantity: {
        type: Number,
        required: true,
        min: 1
      },

      unit_cost: {
        type: Number,
        required: true,
        min: 0
      },

      line_total: {
        type: Number,
        required: true,
        min: 0
      }
    },
    {
      _id: false
    }
  );


// =========================================================
// MAINTENANCE RECORD SCHEMA
// =========================================================

const maintenanceRecordSchema =
  new Schema<IMaintenanceRecord>(
    {
      maintenance_id: {
        type: String,
        required: true,
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

      depot_id: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },

      reported_date: {
        type: Date,
        required: true
      },

      maintenance_type: {
        type: String,
        enum: [
          "Preventive",
          "Corrective"
        ],
        required: true
      },

      fault_category: {
        type: String,
        required: true,
        trim: true
      },

      fault_description: {
        type: String,
        required: true,
        trim: true
      },

      parts_used: {
        type: [
          maintenancePartSchema
        ],
        default: []
      },

      parts_cost: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },

      labour_cost: {
        type: Number,
        required: true,
        min: 0
      },

      total_repair_cost: {
        type: Number,
        required: true,
        min: 0
      },

      downtime_hours: {
        type: Number,
        required: true,
        min: 0
      },

      technician_id: {
        type: String,
        trim: true,
        uppercase: true
      },

      completion_date: {
        type: Date
      },

      status: {
        type: String,
        enum: [
          "In Progress",
          "Completed"
        ],
        default:
          "In Progress",
        required: true
      }
    },
    {
      timestamps: true,

      collection:
        "maintenance_records"
    }
  );


// =========================================================
// INDEXES
// =========================================================

maintenanceRecordSchema.index({
  bus_id: 1,
  reported_date: -1
});


maintenanceRecordSchema.index({
  depot_id: 1,
  reported_date: -1
});


maintenanceRecordSchema.index({
  status: 1
});


maintenanceRecordSchema.index({
  "parts_used.part_id": 1
});


// =========================================================
// MODEL
// =========================================================

const MaintenanceRecord =
  mongoose.model<IMaintenanceRecord>(
    "MaintenanceRecord",
    maintenanceRecordSchema
  );


export default MaintenanceRecord;