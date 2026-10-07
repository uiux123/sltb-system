import SparePart
  from "../models/sparePart.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  IInventoryAnalytics,
  IInventoryAnalyticsSummary,
  IStockStatusDistribution,
  IInventoryCategoryPerformance,
  IDepotInventoryPerformance,
  ISparePartUsage,
  IReorderAttentionItem
} from "../types/inventoryAnalytics.types";


// =========================================================
// STEP 8
// INVENTORY / SPARE PART ANALYTICS
// =========================================================

export const getInventoryAnalytics =
  async (): Promise<IInventoryAnalytics> => {

    const [

      inventorySummaryResult,

      usageSummaryResult,

      stockStatusResult,

      categoryResult,

      depotResult,

      partUsageResult,

      reorderAttentionResult

    ] = await Promise.all([


      // ===================================================
      // 1. OVERALL INVENTORY SUMMARY
      // ===================================================

      SparePart.aggregate([

        {
          $group: {

            _id:
              null,


            // ---------------------------------------------
            // Number of spare-part documents
            // ---------------------------------------------

            total_part_records: {
              $sum:
                1
            },


            // ---------------------------------------------
            // Total physical units currently in stock
            // ---------------------------------------------

            total_units_in_stock: {
              $sum:
                "$quantity_in_stock"
            },


            // ---------------------------------------------
            // Current Inventory Value
            //
            // Quantity × Unit Cost
            // ---------------------------------------------

            total_inventory_value: {

              $sum: {

                $multiply: [
                  "$quantity_in_stock",
                  "$unit_cost"
                ]

              }

            },


            // ---------------------------------------------
            // Available Parts
            // ---------------------------------------------

            available_part_records: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Available"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            // ---------------------------------------------
            // Low Stock Parts
            // ---------------------------------------------

            low_stock_part_records: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Low Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            // ---------------------------------------------
            // Out-of-Stock Parts
            // ---------------------------------------------

            out_of_stock_part_records: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Out of Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            }

          }
        },


        {
          $project: {

            _id:
              0,

            total_part_records:
              1,

            total_units_in_stock:
              1,

            available_part_records:
              1,

            low_stock_part_records:
              1,

            out_of_stock_part_records:
              1,


            total_inventory_value: {

              $round: [
                "$total_inventory_value",
                2
              ]

            },


            // ---------------------------------------------
            // Parts requiring management attention
            //
            // Low Stock + Out of Stock
            // ---------------------------------------------

            reorder_attention_records: {

              $add: [
                "$low_stock_part_records",
                "$out_of_stock_part_records"
              ]

            }

          }
        }

      ]),


      // ===================================================
      // 2. PART USAGE SUMMARY
      // ===================================================
      //
      // Maintenance contains:
      //
      // parts_used: [
      //   {
      //      part_id,
      //      part_name,
      //      quantity,
      //      unit_cost,
      //      line_total
      //   }
      // ]
      //
      // $unwind converts every array element into
      // an individual aggregation document.
      //
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $unwind:
            "$parts_used"
        },


        {
          $group: {

            _id:
              null,


            total_parts_used_units: {
              $sum:
                "$parts_used.quantity"
            },


            total_parts_usage_cost: {
              $sum:
                "$parts_used.line_total"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            total_parts_used_units:
              1,

            total_parts_usage_cost: {

              $round: [
                "$total_parts_usage_cost",
                2
              ]

            }

          }
        }

      ]),


      // ===================================================
      // 3. STOCK STATUS DISTRIBUTION
      // ===================================================

      SparePart.aggregate([

        {
          $group: {

            _id:
              "$stock_status",


            part_records: {
              $sum:
                1
            },


            total_units_in_stock: {
              $sum:
                "$quantity_in_stock"
            },


            inventory_value: {

              $sum: {

                $multiply: [
                  "$quantity_in_stock",
                  "$unit_cost"
                ]

              }

            }

          }
        },


        {
          $project: {

            _id:
              0,

            stock_status:
              "$_id",

            part_records:
              1,

            total_units_in_stock:
              1,


            inventory_value: {

              $round: [
                "$inventory_value",
                2
              ]

            }

          }
        },


        {
          $sort: {
            part_records:
              -1
          }
        }

      ]),


      // ===================================================
      // 4. INVENTORY ANALYTICS BY PART CATEGORY
      // ===================================================

      SparePart.aggregate([

        {
          $group: {

            _id:
              "$part_category",


            part_records: {
              $sum:
                1
            },


            total_units_in_stock: {
              $sum:
                "$quantity_in_stock"
            },


            average_unit_cost: {
              $avg:
                "$unit_cost"
            },


            inventory_value: {

              $sum: {

                $multiply: [
                  "$quantity_in_stock",
                  "$unit_cost"
                ]

              }

            },


            available_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Available"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            low_stock_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Low Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            out_of_stock_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Out of Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            }

          }
        },


        {
          $project: {

            _id:
              0,

            part_category:
              "$_id",

            part_records:
              1,

            total_units_in_stock:
              1,

            available_parts:
              1,

            low_stock_parts:
              1,

            out_of_stock_parts:
              1,


            average_unit_cost: {

              $round: [
                "$average_unit_cost",
                2
              ]

            },


            inventory_value: {

              $round: [
                "$inventory_value",
                2
              ]

            }

          }
        },


        // -------------------------------------------------
        // Highest Inventory Value first
        // -------------------------------------------------

        {
          $sort: {
            inventory_value:
              -1
          }
        }

      ]),


      // ===================================================
      // 5. INVENTORY ANALYTICS BY DEPOT
      // ===================================================

      SparePart.aggregate([

        {
          $group: {

            _id:
              "$depot_id",


            part_records: {
              $sum:
                1
            },


            total_units_in_stock: {
              $sum:
                "$quantity_in_stock"
            },


            inventory_value: {

              $sum: {

                $multiply: [
                  "$quantity_in_stock",
                  "$unit_cost"
                ]

              }

            },


            available_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Available"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            low_stock_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Low Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            },


            out_of_stock_parts: {

              $sum: {

                $cond: [

                  {
                    $eq: [
                      "$stock_status",
                      "Out of Stock"
                    ]
                  },

                  1,

                  0

                ]

              }

            }

          }
        },


        // -------------------------------------------------
        // Join Depot information
        // -------------------------------------------------

        {
          $lookup: {

            from:
              "depots",

            localField:
              "_id",

            foreignField:
              "depot_id",

            as:
              "depot"

          }
        },


        {
          $unwind:
            "$depot"
        },


        {
          $project: {

            _id:
              0,

            depot_id:
              "$_id",

            depot_name:
              "$depot.depot_name",

            part_records:
              1,

            total_units_in_stock:
              1,

            available_parts:
              1,

            low_stock_parts:
              1,

            out_of_stock_parts:
              1,


            inventory_value: {

              $round: [
                "$inventory_value",
                2
              ]

            }

          }
        },


        // -------------------------------------------------
        // Highest Inventory Value first
        // -------------------------------------------------

        {
          $sort: {

            inventory_value:
              -1,

            depot_id:
              1

          }
        }

      ]),


      // ===================================================
      // 6. HISTORICAL SPARE-PART USAGE
      // ===================================================
      //
      // This is the important NoSQL embedded-array
      // aggregation for Step 8.
      //
      // ===================================================

      MaintenanceRecord.aggregate([

        // -------------------------------------------------
        // Before:
        //
        // parts_used: [
        //   { part_id: "SP001", quantity: 2 },
        //   { part_id: "SP002", quantity: 1 }
        // ]
        //
        // After $unwind:
        //
        // Document 1 → SP001
        // Document 2 → SP002
        //
        // -------------------------------------------------

        {
          $unwind:
            "$parts_used"
        },


        // -------------------------------------------------
        // Group usage by Part
        // -------------------------------------------------

        {
          $group: {

            _id:
              "$parts_used.part_id",


            part_name: {
              $first:
                "$parts_used.part_name"
            },


            usage_occurrences: {
              $sum:
                1
            },


            total_quantity_used: {
              $sum:
                "$parts_used.quantity"
            },


            total_usage_cost: {
              $sum:
                "$parts_used.line_total"
            }

          }
        },


        // -------------------------------------------------
        // Join Current Spare-Part Information
        // -------------------------------------------------

        {
          $lookup: {

            from:
              "spare_parts",

            localField:
              "_id",

            foreignField:
              "part_id",

            as:
              "current_part"

          }
        },


        {
          $unwind:
            "$current_part"
        },


        // -------------------------------------------------
        // Create Final Usage Result
        // -------------------------------------------------

        {
          $project: {

            _id:
              0,

            part_id:
              "$_id",

            part_name:
              1,

            part_category:
              "$current_part.part_category",

            depot_id:
              "$current_part.depot_id",

            current_quantity_in_stock:
              "$current_part.quantity_in_stock",

            reorder_level:
              "$current_part.reorder_level",

            stock_status:
              "$current_part.stock_status",

            usage_occurrences:
              1,

            total_quantity_used:
              1,


            total_usage_cost: {

              $round: [
                "$total_usage_cost",
                2
              ]

            }

          }
        },


        // -------------------------------------------------
        // Highest usage first
        // -------------------------------------------------

        {
          $sort: {

            total_quantity_used:
              -1,

            usage_occurrences:
              -1,

            part_id:
              1

          }
        }

      ]),


      // ===================================================
      // 7. LOW / OUT-OF-STOCK ATTENTION LIST
      // ===================================================

      SparePart.aggregate([

        // -------------------------------------------------
        // Only Parts needing attention
        // -------------------------------------------------

        {
          $match: {

            stock_status: {

              $in: [
                "Low Stock",
                "Out of Stock"
              ]

            }

          }
        },


        // -------------------------------------------------
        // Calculate Gap to Reorder Level
        // -------------------------------------------------

        {
          $set: {

            reorder_gap_units: {

              $cond: [

                {
                  $gt: [
                    "$reorder_level",
                    "$quantity_in_stock"
                  ]
                },

                {
                  $subtract: [
                    "$reorder_level",
                    "$quantity_in_stock"
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Out of Stock gets higher display priority
            // ---------------------------------------------

            status_priority: {

              $cond: [

                {
                  $eq: [
                    "$stock_status",
                    "Out of Stock"
                  ]
                },

                1,

                2

              ]

            }

          }
        },


        {
          $project: {

            _id:
              0,

            part_id:
              1,

            part_name:
              1,

            part_category:
              1,

            depot_id:
              1,

            quantity_in_stock:
              1,

            reorder_level:
              1,

            reorder_gap_units:
              1,

            unit_cost:
              1,

            stock_status:
              1,

            status_priority:
              1

          }
        },


        // -------------------------------------------------
        // Out of Stock first
        //
        // Then largest stock gap
        // -------------------------------------------------

        {
          $sort: {

            status_priority:
              1,

            reorder_gap_units:
              -1,

            quantity_in_stock:
              1

          }
        },


        // -------------------------------------------------
        // Remove internal sorting field
        // -------------------------------------------------

        {
          $project: {
            status_priority:
              0
          }
        }

      ])

    ]);


    // =====================================================
    // INVENTORY SUMMARY
    // =====================================================

    const inventorySummary =

      inventorySummaryResult[0] ??

      {

        total_part_records:
          0,

        total_units_in_stock:
          0,

        total_inventory_value:
          0,

        available_part_records:
          0,

        low_stock_part_records:
          0,

        out_of_stock_part_records:
          0,

        reorder_attention_records:
          0

      };


    // =====================================================
    // USAGE SUMMARY
    // =====================================================

    const usageSummary =

      usageSummaryResult[0] ??

      {

        total_parts_used_units:
          0,

        total_parts_usage_cost:
          0

      };


    // =====================================================
    // COMBINE SUMMARY RESULTS
    // =====================================================

    const summary:
      IInventoryAnalyticsSummary = {

        total_part_records:
          inventorySummary.total_part_records,

        total_units_in_stock:
          inventorySummary.total_units_in_stock,

        total_inventory_value:
          inventorySummary.total_inventory_value,

        available_part_records:
          inventorySummary.available_part_records,

        low_stock_part_records:
          inventorySummary.low_stock_part_records,

        out_of_stock_part_records:
          inventorySummary.out_of_stock_part_records,

        reorder_attention_records:
          inventorySummary.reorder_attention_records,

        total_parts_used_units:
          usageSummary.total_parts_used_units,

        total_parts_usage_cost:
          usageSummary.total_parts_usage_cost

      };


    // =====================================================
    // STOCK STATUS DISTRIBUTION
    // =====================================================

    const totalPartRecords =
      summary.total_part_records;


    const stockStatusDistribution:
      IStockStatusDistribution[] =

        stockStatusResult.map(
          item => ({

            stock_status:
              item.stock_status,

            part_records:
              item.part_records,

            percentage:
              totalPartRecords > 0
                ? Math.round(
                    (
                      item.part_records /
                      totalPartRecords *
                      100
                    ) *
                    100
                  ) / 100
                : 0,

            total_units_in_stock:
              item.total_units_in_stock,

            inventory_value:
              item.inventory_value

          })
        );


    // =====================================================
    // CATEGORY PERFORMANCE
    // =====================================================

    const categoryPerformance:
      IInventoryCategoryPerformance[] =
        categoryResult;


    // =====================================================
    // DEPOT PERFORMANCE
    // =====================================================

    const depotPerformance:
      IDepotInventoryPerformance[] =
        depotResult;


    // =====================================================
    // PART USAGE
    // =====================================================

    const partUsage:
      ISparePartUsage[] =
        partUsageResult;


    // =====================================================
    // TOP 10 MOST-USED PARTS
    // =====================================================

    const mostUsedParts:
      ISparePartUsage[] =

        [...partUsage]
          .sort(
            (
              a,
              b
            ) =>
              b.total_quantity_used -
              a.total_quantity_used
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // REORDER ATTENTION
    // =====================================================

    const reorderAttention:
      IReorderAttentionItem[] =
        reorderAttentionResult;


    // =====================================================
    // RETURN COMPLETE INVENTORY ANALYTICS
    // =====================================================

    return {

      summary,

      stock_status_distribution:
        stockStatusDistribution,

      category_performance:
        categoryPerformance,

      depot_performance:
        depotPerformance,

      part_usage:
        partUsage,

      most_used_parts:
        mostUsedParts,

      reorder_attention:
        reorderAttention

    };

  };