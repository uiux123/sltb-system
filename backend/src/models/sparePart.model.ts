import mongoose, {
  Schema,
  Model
} from "mongoose";

import {
  ISparePart
} from "../types/sparePart.types";


const sparePartSchema =
  new Schema<ISparePart>(
    {
      part_id: {
        type: String,
        required: [
          true,
          "Part ID is required"
        ],
        unique: true,
        trim: true,
        uppercase: true
      },


      part_name: {
        type: String,
        required: [
          true,
          "Part name is required"
        ],
        trim: true
      },


      part_category: {
        type: String,
        required: [
          true,
          "Part category is required"
        ],
        trim: true
      },


      manufacturer: {
        type: String,
        trim: true
      },


      compatible_bus_models: {
        type: [String],
        default: []
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


      quantity_in_stock: {
        type: Number,
        required: [
          true,
          "Quantity in stock is required"
        ],
        min: [
          0,
          "Stock quantity cannot be negative"
        ]
      },


      reorder_level: {
        type: Number,
        required: [
          true,
          "Reorder level is required"
        ],
        min: [
          0,
          "Reorder level cannot be negative"
        ]
      },


      unit_cost: {
        type: Number,
        required: [
          true,
          "Unit cost is required"
        ],
        min: [
          0,
          "Unit cost cannot be negative"
        ]
      },


      supplier_name: {
        type: String,
        trim: true
      },


      last_restock_date: {
        type: Date
      },


      stock_status: {
        type: String,
        enum: {
          values: [
            "Available",
            "Low Stock",
            "Out of Stock"
          ],
          message:
            "{VALUE} is not a valid stock status"
        },
        required: true
      }
    },
    {
      timestamps: true,
      collection: "spare_parts"
    }
  );


// Useful indexes
sparePartSchema.index({
  depot_id: 1
});

sparePartSchema.index({
  part_category: 1
});

sparePartSchema.index({
  stock_status: 1
});


const SparePart: Model<ISparePart> =
  mongoose.model<ISparePart>(
    "SparePart",
    sparePartSchema
  );


export default SparePart;