import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  IMaintenanceAnalytics,
  IMaintenanceAnalyticsSummary,
  IMaintenanceTypeDistribution,
  IMaintenanceStatusDistribution,
  IFaultCategoryAnalytics,
  IBusMaintenancePerformance,
  IDepotMaintenancePerformance,
  IMaintenanceTrendPoint
} from "../types/analytics.types";


// =========================================================
// STEP 7
// MAINTENANCE ANALYTICS
// =========================================================

export const getMaintenanceAnalytics =
  async (): Promise<IMaintenanceAnalytics> => {

    const [
      summaryResult,
      typeDistributionResult,
      statusDistributionResult,
      faultCategoryResult,
      busPerformanceResult,
      depotPerformanceResult,
      monthlyTrendResult
    ] = await Promise.all([


      // ===================================================
      // 1. OVERALL MAINTENANCE SUMMARY
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $group: {

            _id:
              null,


            // ---------------------------------------------
            // Total Records
            // ---------------------------------------------

            total_maintenance_records: {
              $sum:
                1
            },


            // ---------------------------------------------
            // Preventive Maintenance
            // ---------------------------------------------

            preventive_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Preventive"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            // ---------------------------------------------
            // Corrective Maintenance
            // ---------------------------------------------

            corrective_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Corrective"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            // ---------------------------------------------
            // Completed
            // ---------------------------------------------

            completed_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Completed"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            // ---------------------------------------------
            // In Progress
            // ---------------------------------------------

            in_progress_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "In Progress"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            // ---------------------------------------------
            // Cost Calculations
            // ---------------------------------------------

            total_parts_cost: {
              $sum:
                "$parts_cost"
            },

            total_labour_cost: {
              $sum:
                "$labour_cost"
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            average_repair_cost: {
              $avg:
                "$total_repair_cost"
            },


            // ---------------------------------------------
            // Downtime
            // ---------------------------------------------

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            },

            average_downtime_hours: {
              $avg:
                "$downtime_hours"
            }

          }
        },


        // -------------------------------------------------
        // Format Result
        // -------------------------------------------------

        {
          $project: {

            _id:
              0,

            total_maintenance_records:
              1,

            preventive_maintenance:
              1,

            corrective_maintenance:
              1,

            completed_maintenance:
              1,

            in_progress_maintenance:
              1,

            total_parts_cost: {
              $round: [
                "$total_parts_cost",
                2
              ]
            },

            total_labour_cost: {
              $round: [
                "$total_labour_cost",
                2
              ]
            },

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            average_repair_cost: {
              $round: [
                "$average_repair_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            },

            average_downtime_hours: {
              $round: [
                "$average_downtime_hours",
                2
              ]
            }

          }
        }

      ]),


      // ===================================================
      // 2. MAINTENANCE TYPE DISTRIBUTION
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $group: {

            _id:
              "$maintenance_type",

            count: {
              $sum:
                1
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            average_maintenance_cost: {
              $avg:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            maintenance_type:
              "$_id",

            count:
              1,

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            average_maintenance_cost: {
              $round: [
                "$average_maintenance_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            }

          }
        },


        {
          $sort: {
            count:
              -1
          }
        }

      ]),


      // ===================================================
      // 3. MAINTENANCE STATUS DISTRIBUTION
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $group: {

            _id:
              "$status",

            count: {
              $sum:
                1
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            status:
              "$_id",

            count:
              1,

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            }

          }
        },


        {
          $sort: {
            count:
              -1
          }
        }

      ]),


      // ===================================================
      // 4. FAULT CATEGORY ANALYTICS
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $group: {

            _id:
              "$fault_category",

            maintenance_count: {
              $sum:
                1
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            average_maintenance_cost: {
              $avg:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            },

            average_downtime_hours: {
              $avg:
                "$downtime_hours"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            fault_category:
              "$_id",

            maintenance_count:
              1,

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            average_maintenance_cost: {
              $round: [
                "$average_maintenance_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            },

            average_downtime_hours: {
              $round: [
                "$average_downtime_hours",
                2
              ]
            }

          }
        },


        // -------------------------------------------------
        // Most frequently occurring faults first
        // -------------------------------------------------

        {
          $sort: {

            maintenance_count:
              -1,

            total_maintenance_cost:
              -1

          }
        }

      ]),


      // ===================================================
      // 5. MAINTENANCE PERFORMANCE BY BUS
      // ===================================================

      MaintenanceRecord.aggregate([

        // -------------------------------------------------
        // Group Maintenance Records by Bus
        // -------------------------------------------------

        {
          $group: {

            _id:
              "$bus_id",

            total_maintenance_records: {
              $sum:
                1
            },

            preventive_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Preventive"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            corrective_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Corrective"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            completed_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Completed"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            in_progress_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "In Progress"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            total_parts_cost: {
              $sum:
                "$parts_cost"
            },

            total_labour_cost: {
              $sum:
                "$labour_cost"
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            average_repair_cost: {
              $avg:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            },

            average_downtime_hours: {
              $avg:
                "$downtime_hours"
            }

          }
        },


        // -------------------------------------------------
        // Join Bus Details
        // -------------------------------------------------

        {
          $lookup: {

            from:
              "buses",

            localField:
              "_id",

            foreignField:
              "bus_id",

            as:
              "bus"

          }
        },


        {
          $unwind:
            "$bus"
        },


        // -------------------------------------------------
        // Format Bus Maintenance Result
        // -------------------------------------------------

        {
          $project: {

            _id:
              0,

            bus_id:
              "$_id",

            registration_no:
              "$bus.registration_no",

            depot_id:
              "$bus.depot_id",

            manufacturer:
              "$bus.manufacturer",

            model:
              "$bus.model",

            bus_status:
              "$bus.bus_status",

            total_maintenance_records:
              1,

            preventive_maintenance:
              1,

            corrective_maintenance:
              1,

            completed_maintenance:
              1,

            in_progress_maintenance:
              1,

            total_parts_cost: {
              $round: [
                "$total_parts_cost",
                2
              ]
            },

            total_labour_cost: {
              $round: [
                "$total_labour_cost",
                2
              ]
            },

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            average_repair_cost: {
              $round: [
                "$average_repair_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            },

            average_downtime_hours: {
              $round: [
                "$average_downtime_hours",
                2
              ]
            }

          }
        },


        // -------------------------------------------------
        // Highest Maintenance Cost First
        // -------------------------------------------------

        {
          $sort: {

            total_maintenance_cost:
              -1,

            bus_id:
              1

          }
        }

      ]),


      // ===================================================
      // 6. MAINTENANCE PERFORMANCE BY DEPOT
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $group: {

            _id:
              "$depot_id",

            total_maintenance_records: {
              $sum:
                1
            },

            preventive_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Preventive"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            corrective_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Corrective"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            completed_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Completed"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            in_progress_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$status",
                      "In Progress"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            total_parts_cost: {
              $sum:
                "$parts_cost"
            },

            total_labour_cost: {
              $sum:
                "$labour_cost"
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            average_repair_cost: {
              $avg:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            },

            average_downtime_hours: {
              $avg:
                "$downtime_hours"
            }

          }
        },


        // -------------------------------------------------
        // Join Depot Details
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


        // -------------------------------------------------
        // Format Result
        // -------------------------------------------------

        {
          $project: {

            _id:
              0,

            depot_id:
              "$_id",

            depot_name:
              "$depot.depot_name",

            total_maintenance_records:
              1,

            preventive_maintenance:
              1,

            corrective_maintenance:
              1,

            completed_maintenance:
              1,

            in_progress_maintenance:
              1,

            total_parts_cost: {
              $round: [
                "$total_parts_cost",
                2
              ]
            },

            total_labour_cost: {
              $round: [
                "$total_labour_cost",
                2
              ]
            },

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            average_repair_cost: {
              $round: [
                "$average_repair_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            },

            average_downtime_hours: {
              $round: [
                "$average_downtime_hours",
                2
              ]
            }

          }
        },


        // -------------------------------------------------
        // Highest Maintenance Cost first
        // -------------------------------------------------

        {
          $sort: {

            total_maintenance_cost:
              -1,

            depot_id:
              1

          }
        }

      ]),


      // ===================================================
      // 7. MONTHLY MAINTENANCE TREND
      // ===================================================

      MaintenanceRecord.aggregate([

        // -------------------------------------------------
        // Group by Year-Month
        // -------------------------------------------------

        {
          $group: {

            _id: {

              $dateToString: {

                format:
                  "%Y-%m",

                date:
                  "$reported_date",

                timezone:
                  "Asia/Colombo"

              }

            },

            maintenance_records: {
              $sum:
                1
            },

            preventive_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Preventive"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            corrective_maintenance: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$maintenance_type",
                      "Corrective"
                    ]
                  },
                  1,
                  0
                ]

              }

            },

            total_parts_cost: {
              $sum:
                "$parts_cost"
            },

            total_labour_cost: {
              $sum:
                "$labour_cost"
            },

            total_maintenance_cost: {
              $sum:
                "$total_repair_cost"
            },

            total_downtime_hours: {
              $sum:
                "$downtime_hours"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            month:
              "$_id",

            maintenance_records:
              1,

            preventive_maintenance:
              1,

            corrective_maintenance:
              1,

            total_parts_cost: {
              $round: [
                "$total_parts_cost",
                2
              ]
            },

            total_labour_cost: {
              $round: [
                "$total_labour_cost",
                2
              ]
            },

            total_maintenance_cost: {
              $round: [
                "$total_maintenance_cost",
                2
              ]
            },

            total_downtime_hours: {
              $round: [
                "$total_downtime_hours",
                2
              ]
            }

          }
        },


        // -------------------------------------------------
        // Oldest Month → Newest Month
        // -------------------------------------------------

        {
          $sort: {
            month:
              1
          }
        }

      ])

    ]);


    // =====================================================
    // SUMMARY
    // =====================================================

    const summary:
      IMaintenanceAnalyticsSummary =
        summaryResult[0] ?? {

          total_maintenance_records:
            0,

          preventive_maintenance:
            0,

          corrective_maintenance:
            0,

          completed_maintenance:
            0,

          in_progress_maintenance:
            0,

          total_parts_cost:
            0,

          total_labour_cost:
            0,

          total_maintenance_cost:
            0,

          average_repair_cost:
            0,

          total_downtime_hours:
            0,

          average_downtime_hours:
            0

        };


    const totalMaintenanceRecords =
      summary.total_maintenance_records;


    // =====================================================
    // TYPE DISTRIBUTION + PERCENTAGES
    // =====================================================

    const typeDistribution:
      IMaintenanceTypeDistribution[] =
        typeDistributionResult.map(
          item => ({

            maintenance_type:
              item.maintenance_type,

            count:
              item.count,

            percentage:
              totalMaintenanceRecords > 0
                ? Math.round(
                    (
                      item.count /
                      totalMaintenanceRecords *
                      100
                    ) *
                    100
                  ) / 100
                : 0,

            total_maintenance_cost:
              item.total_maintenance_cost,

            average_maintenance_cost:
              item.average_maintenance_cost,

            total_downtime_hours:
              item.total_downtime_hours

          })
        );


    // =====================================================
    // STATUS DISTRIBUTION + PERCENTAGES
    // =====================================================

    const statusDistribution:
      IMaintenanceStatusDistribution[] =
        statusDistributionResult.map(
          item => ({

            status:
              item.status,

            count:
              item.count,

            percentage:
              totalMaintenanceRecords > 0
                ? Math.round(
                    (
                      item.count /
                      totalMaintenanceRecords *
                      100
                    ) *
                    100
                  ) / 100
                : 0,

            total_maintenance_cost:
              item.total_maintenance_cost,

            total_downtime_hours:
              item.total_downtime_hours

          })
        );


    // =====================================================
    // FAULT CATEGORIES
    // =====================================================

    const faultCategories:
      IFaultCategoryAnalytics[] =
        faultCategoryResult;


    // =====================================================
    // BUS PERFORMANCE
    // =====================================================

    const busPerformance:
      IBusMaintenancePerformance[] =
        busPerformanceResult;


    // =====================================================
    // DEPOT PERFORMANCE
    // =====================================================

    const depotPerformance:
      IDepotMaintenancePerformance[] =
        depotPerformanceResult;


    // =====================================================
    // MONTHLY TREND
    // =====================================================

    const monthlyTrend:
      IMaintenanceTrendPoint[] =
        monthlyTrendResult;


    // =====================================================
    // TOP 10 HIGHEST MAINTENANCE COST BUSES
    // =====================================================

    const highestMaintenanceCostBuses:
      IBusMaintenancePerformance[] =
        [...busPerformance]
          .sort(
            (a, b) =>
              b.total_maintenance_cost -
              a.total_maintenance_cost
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // TOP 10 HIGHEST DOWNTIME BUSES
    // =====================================================

    const highestDowntimeBuses:
      IBusMaintenancePerformance[] =
        [...busPerformance]
          .sort(
            (a, b) =>
              b.total_downtime_hours -
              a.total_downtime_hours
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // RETURN COMPLETE MAINTENANCE ANALYTICS
    // =====================================================

    return {

      summary,

      type_distribution:
        typeDistribution,

      status_distribution:
        statusDistribution,

      fault_categories:
        faultCategories,

      bus_performance:
        busPerformance,

      depot_performance:
        depotPerformance,

      monthly_trend:
        monthlyTrend,

      highest_maintenance_cost_buses:
        highestMaintenanceCostBuses,

      highest_downtime_buses:
        highestDowntimeBuses

    };

  };