import Bus
  from "../models/bus.model";

import {
  IIntegratedBusAnalytics,
  IIntegratedBusAnalyticsSummary,
  IIntegratedBusPerformance
} from "../types/busPerformanceAnalytics.types";


// =========================================================
// HELPER
// ROUND NUMBER TO 2 DECIMAL PLACES
// =========================================================

const round2 =
  (
    value: number
  ): number => {

    return Math.round(
      (
        value +
        Number.EPSILON
      ) *
      100
    ) / 100;

  };


// =========================================================
// STEP 9
// INTEGRATED BUS PERFORMANCE ANALYTICS
// =========================================================

export const getIntegratedBusAnalytics =
  async (): Promise<IIntegratedBusAnalytics> => {

    // =====================================================
    // START FROM BUS COLLECTION
    // =====================================================
    //
    // Every result row represents one Bus.
    //
    // We then use $lookup to aggregate:
    //
    // trips
    // fuel_records
    // ticket_sales
    // maintenance_records
    // depots
    //
    // =====================================================

    const busPerformanceResult =
      await Bus.aggregate([


        // =================================================
        // 1. JOIN / AGGREGATE TRIP DATA
        // =================================================

        {
          $lookup: {

            from:
              "trips",

            let: {
              current_bus_id:
                "$bus_id"
            },

            pipeline: [

              // -------------------------------------------
              // Find Trips belonging to current Bus
              // -------------------------------------------

              {
                $match: {

                  $expr: {

                    $eq: [
                      "$bus_id",
                      "$$current_bus_id"
                    ]

                  }

                }
              },


              // -------------------------------------------
              // Aggregate Trip values
              // -------------------------------------------

              {
                $group: {

                  _id:
                    null,


                  total_trips: {
                    $sum:
                      1
                  },


                  completed_trips: {

                    $sum: {

                      $cond: [

                        {
                          $eq: [
                            "$trip_status",
                            "Completed"
                          ]
                        },

                        1,

                        0

                      ]

                    }

                  },


                  // ---------------------------------------
                  // Count passenger data from completed
                  // Trips only.
                  // ---------------------------------------

                  total_passengers: {

                    $sum: {

                      $cond: [

                        {
                          $eq: [
                            "$trip_status",
                            "Completed"
                          ]
                        },

                        "$passenger_count",

                        0

                      ]

                    }

                  },


                  // ---------------------------------------
                  // Completed operated distance
                  // ---------------------------------------

                  total_operated_km: {

                    $sum: {

                      $cond: [

                        {
                          $eq: [
                            "$trip_status",
                            "Completed"
                          ]
                        },

                        "$operated_km",

                        0

                      ]

                    }

                  },


                  // ---------------------------------------
                  // Average delay of completed Trips
                  //
                  // null values are ignored by $avg.
                  // ---------------------------------------

                  average_delay_minutes: {

                    $avg: {

                      $cond: [

                        {
                          $eq: [
                            "$trip_status",
                            "Completed"
                          ]
                        },

                        "$delay_minutes",

                        null

                      ]

                    }

                  }

                }
              }

            ],

            as:
              "trip_analytics"

          }
        },


        // =================================================
        // 2. JOIN / AGGREGATE FUEL DATA
        // =================================================

        {
          $lookup: {

            from:
              "fuel_records",

            let: {
              current_bus_id:
                "$bus_id"
            },

            pipeline: [

              {
                $match: {

                  $expr: {

                    $eq: [
                      "$bus_id",
                      "$$current_bus_id"
                    ]

                  }

                }
              },


              {
                $group: {

                  _id:
                    null,


                  total_fuel_records: {
                    $sum:
                      1
                  },


                  total_fuel_litres: {
                    $sum:
                      "$fuel_litres"
                  },


                  total_fuel_cost: {
                    $sum:
                      "$total_fuel_cost"
                  },


                  fuel_operated_km: {
                    $sum:
                      "$operated_km"
                  }

                }
              }

            ],

            as:
              "fuel_analytics"

          }
        },


        // =================================================
        // 3. JOIN / AGGREGATE TICKET REVENUE
        // =================================================

        {
          $lookup: {

            from:
              "ticket_sales",

            let: {
              current_bus_id:
                "$bus_id"
            },

            pipeline: [

              {
                $match: {

                  $expr: {

                    $eq: [
                      "$bus_id",
                      "$$current_bus_id"
                    ]

                  }

                }
              },


              {
                $group: {

                  _id:
                    null,


                  total_ticket_records: {
                    $sum:
                      1
                  },


                  total_tickets_sold: {
                    $sum:
                      "$tickets_sold"
                  },


                  total_actual_revenue: {
                    $sum:
                      "$total_revenue"
                  },


                  total_expected_revenue: {
                    $sum:
                      "$expected_revenue"
                  },


                  total_revenue_difference: {
                    $sum:
                      "$revenue_difference"
                  }

                }
              }

            ],

            as:
              "revenue_analytics"

          }
        },


        // =================================================
        // 4. JOIN / AGGREGATE MAINTENANCE DATA
        // =================================================

        {
          $lookup: {

            from:
              "maintenance_records",

            let: {
              current_bus_id:
                "$bus_id"
            },

            pipeline: [

              {
                $match: {

                  $expr: {

                    $eq: [
                      "$bus_id",
                      "$$current_bus_id"
                    ]

                  }

                }
              },


              {
                $group: {

                  _id:
                    null,


                  total_maintenance_records: {
                    $sum:
                      1
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


                  total_maintenance_cost: {
                    $sum:
                      "$total_repair_cost"
                  },


                  total_downtime_hours: {
                    $sum:
                      "$downtime_hours"
                  }

                }
              }

            ],

            as:
              "maintenance_analytics"

          }
        },


        // =================================================
        // 5. JOIN DEPOT INFORMATION
        // =================================================

        {
          $lookup: {

            from:
              "depots",

            localField:
              "depot_id",

            foreignField:
              "depot_id",

            as:
              "depot"

          }
        },


        {
          $unwind: {

            path:
              "$depot",

            preserveNullAndEmptyArrays:
              true

          }
        },


        // =================================================
        // 6. FLATTEN TRIP / FUEL / REVENUE /
        //    MAINTENANCE RESULTS
        // =================================================

        {
          $set: {


            // ---------------------------------------------
            // Trip
            // ---------------------------------------------

            total_trips: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$trip_analytics.total_trips",
                    0
                  ]
                },

                0

              ]

            },


            completed_trips: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$trip_analytics.completed_trips",
                    0
                  ]
                },

                0

              ]

            },


            total_passengers: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$trip_analytics.total_passengers",
                    0
                  ]
                },

                0

              ]

            },


            total_operated_km: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$trip_analytics.total_operated_km",
                    0
                  ]
                },

                0

              ]

            },


            average_delay_minutes: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$trip_analytics.average_delay_minutes",
                    0
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Fuel
            // ---------------------------------------------

            total_fuel_records: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$fuel_analytics.total_fuel_records",
                    0
                  ]
                },

                0

              ]

            },


            total_fuel_litres: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$fuel_analytics.total_fuel_litres",
                    0
                  ]
                },

                0

              ]

            },


            total_fuel_cost: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$fuel_analytics.total_fuel_cost",
                    0
                  ]
                },

                0

              ]

            },


            fuel_operated_km: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$fuel_analytics.fuel_operated_km",
                    0
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Revenue
            // ---------------------------------------------

            total_ticket_records: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$revenue_analytics.total_ticket_records",
                    0
                  ]
                },

                0

              ]

            },


            total_tickets_sold: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$revenue_analytics.total_tickets_sold",
                    0
                  ]
                },

                0

              ]

            },


            total_actual_revenue: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$revenue_analytics.total_actual_revenue",
                    0
                  ]
                },

                0

              ]

            },


            total_expected_revenue: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$revenue_analytics.total_expected_revenue",
                    0
                  ]
                },

                0

              ]

            },


            total_revenue_difference: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$revenue_analytics.total_revenue_difference",
                    0
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Maintenance
            // ---------------------------------------------

            total_maintenance_records: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$maintenance_analytics.total_maintenance_records",
                    0
                  ]
                },

                0

              ]

            },


            completed_maintenance: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$maintenance_analytics.completed_maintenance",
                    0
                  ]
                },

                0

              ]

            },


            in_progress_maintenance: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$maintenance_analytics.in_progress_maintenance",
                    0
                  ]
                },

                0

              ]

            },


            total_maintenance_cost: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$maintenance_analytics.total_maintenance_cost",
                    0
                  ]
                },

                0

              ]

            },


            total_downtime_hours: {

              $ifNull: [

                {
                  $arrayElemAt: [
                    "$maintenance_analytics.total_downtime_hours",
                    0
                  ]
                },

                0

              ]

            }

          }
        },


        // =================================================
        // 7. CALCULATE CROSS-COLLECTION METRICS
        // =================================================

        {
          $set: {


            // ---------------------------------------------
            // Load Factor
            //
            // Total Passengers
            // ------------------------- × 100
            // Completed Trips × Capacity
            // ---------------------------------------------

            average_load_factor_percentage: {

              $cond: [

                {
                  $and: [

                    {
                      $gt: [
                        "$completed_trips",
                        0
                      ]
                    },

                    {
                      $gt: [
                        "$capacity",
                        0
                      ]
                    }

                  ]
                },

                {
                  $multiply: [

                    {
                      $divide: [

                        "$total_passengers",

                        {
                          $multiply: [
                            "$completed_trips",
                            "$capacity"
                          ]
                        }

                      ]
                    },

                    100

                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Fuel Efficiency
            // ---------------------------------------------

            km_per_litre: {

              $cond: [

                {
                  $gt: [
                    "$total_fuel_litres",
                    0
                  ]
                },

                {
                  $divide: [
                    "$fuel_operated_km",
                    "$total_fuel_litres"
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Fuel Cost Per Km
            // ---------------------------------------------

            fuel_cost_per_km: {

              $cond: [

                {
                  $gt: [
                    "$fuel_operated_km",
                    0
                  ]
                },

                {
                  $divide: [
                    "$total_fuel_cost",
                    "$fuel_operated_km"
                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Revenue Achievement
            // ---------------------------------------------

            revenue_achievement_percentage: {

              $cond: [

                {
                  $gt: [
                    "$total_expected_revenue",
                    0
                  ]
                },

                {
                  $multiply: [

                    {
                      $divide: [
                        "$total_actual_revenue",
                        "$total_expected_revenue"
                      ]
                    },

                    100

                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // Tracked Operating Cost
            //
            // Fuel + Maintenance
            // ---------------------------------------------

            tracked_operating_cost: {

              $add: [
                "$total_fuel_cost",
                "$total_maintenance_cost"
              ]

            },


            // ---------------------------------------------
            // Revenue less tracked costs
            //
            // This is NOT profit.
            // ---------------------------------------------

            revenue_less_tracked_costs: {

              $subtract: [

                "$total_actual_revenue",

                {
                  $add: [
                    "$total_fuel_cost",
                    "$total_maintenance_cost"
                  ]
                }

              ]

            },


            // ---------------------------------------------
            // Related Data Availability
            // ---------------------------------------------

            data_presence: {

              has_trip_data: {
                $gt: [
                  "$total_trips",
                  0
                ]
              },

              has_fuel_data: {
                $gt: [
                  "$total_fuel_records",
                  0
                ]
              },

              has_revenue_data: {
                $gt: [
                  "$total_ticket_records",
                  0
                ]
              },

              has_maintenance_data: {
                $gt: [
                  "$total_maintenance_records",
                  0
                ]
              }

            }

          }
        },


        // =================================================
        // 8. TRACKED COST / REVENUE %
        // =================================================
        //
        // Separate stage because tracked_operating_cost was
        // created in the previous stage.
        //
        // =================================================

        {
          $set: {

            tracked_cost_to_revenue_percentage: {

              $cond: [

                {
                  $gt: [
                    "$total_actual_revenue",
                    0
                  ]
                },

                {
                  $multiply: [

                    {
                      $divide: [
                        "$tracked_operating_cost",
                        "$total_actual_revenue"
                      ]
                    },

                    100

                  ]
                },

                0

              ]

            }

          }
        },


        // =================================================
        // 9. FINAL OUTPUT
        // =================================================

        {
          $project: {

            _id:
              0,


            // ---------------------------------------------
            // Bus
            // ---------------------------------------------

            bus_id:
              1,

            registration_no:
              1,

            depot_id:
              1,

            depot_name: {

              $ifNull: [
                "$depot.depot_name",
                "Unknown Depot"
              ]

            },

            manufacturer:
              1,

            model:
              1,

            manufacture_year:
              1,

            fuel_type:
              1,

            bus_status:
              1,

            capacity:
              1,

            odometer_km:
              1,


            // ---------------------------------------------
            // Trips
            // ---------------------------------------------

            total_trips:
              1,

            completed_trips:
              1,

            total_passengers:
              1,


            total_operated_km: {

              $round: [
                "$total_operated_km",
                2
              ]

            },


            average_delay_minutes: {

              $round: [
                "$average_delay_minutes",
                2
              ]

            },


            average_load_factor_percentage: {

              $round: [
                "$average_load_factor_percentage",
                2
              ]

            },


            // ---------------------------------------------
            // Fuel
            // ---------------------------------------------

            total_fuel_records:
              1,


            fuel_operated_km: {

              $round: [
                "$fuel_operated_km",
                2
              ]

            },


            total_fuel_litres: {

              $round: [
                "$total_fuel_litres",
                2
              ]

            },


            total_fuel_cost: {

              $round: [
                "$total_fuel_cost",
                2
              ]

            },


            km_per_litre: {

              $round: [
                "$km_per_litre",
                2
              ]

            },


            fuel_cost_per_km: {

              $round: [
                "$fuel_cost_per_km",
                2
              ]

            },


            // ---------------------------------------------
            // Revenue
            // ---------------------------------------------

            total_ticket_records:
              1,

            total_tickets_sold:
              1,


            total_actual_revenue: {

              $round: [
                "$total_actual_revenue",
                2
              ]

            },


            total_expected_revenue: {

              $round: [
                "$total_expected_revenue",
                2
              ]

            },


            total_revenue_difference: {

              $round: [
                "$total_revenue_difference",
                2
              ]

            },


            revenue_achievement_percentage: {

              $round: [
                "$revenue_achievement_percentage",
                2
              ]

            },


            // ---------------------------------------------
            // Maintenance
            // ---------------------------------------------

            total_maintenance_records:
              1,

            completed_maintenance:
              1,

            in_progress_maintenance:
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

            },


            // ---------------------------------------------
            // Integrated
            // ---------------------------------------------

            tracked_operating_cost: {

              $round: [
                "$tracked_operating_cost",
                2
              ]

            },


            revenue_less_tracked_costs: {

              $round: [
                "$revenue_less_tracked_costs",
                2
              ]

            },


            tracked_cost_to_revenue_percentage: {

              $round: [
                "$tracked_cost_to_revenue_percentage",
                2
              ]

            },


            data_presence:
              1

          }
        },


        // =================================================
        // 10. STABLE BUS ORDER
        // =================================================

        {
          $sort: {
            bus_id:
              1
          }
        }

      ]);


    // =====================================================
    // TYPE RESULT
    // =====================================================

    const busPerformance:
      IIntegratedBusPerformance[] =
        busPerformanceResult;


    // =====================================================
    // BUILD INTEGRATED SUMMARY
    // =====================================================

    let busesWithTripData =
      0;

    let busesWithFuelData =
      0;

    let busesWithRevenueData =
      0;

    let busesWithMaintenanceData =
      0;

    let totalTrips =
      0;

    let totalPassengers =
      0;

    let totalOperatedKm =
      0;

    let totalSeatCapacity =
      0;

    let totalTicketRevenue =
      0;

    let totalExpectedRevenue =
      0;

    let totalFuelCost =
      0;

    let totalMaintenanceCost =
      0;

    let totalDowntimeHours =
      0;


    for (
      const bus of busPerformance
    ) {

      // ---------------------------------------------------
      // Data Availability
      // ---------------------------------------------------

      if (
        bus.data_presence.has_trip_data
      ) {
        busesWithTripData++;
      }


      if (
        bus.data_presence.has_fuel_data
      ) {
        busesWithFuelData++;
      }


      if (
        bus.data_presence.has_revenue_data
      ) {
        busesWithRevenueData++;
      }


      if (
        bus.data_presence.has_maintenance_data
      ) {
        busesWithMaintenanceData++;
      }


      // ---------------------------------------------------
      // Operational Totals
      // ---------------------------------------------------

      totalTrips +=
        bus.total_trips;

      totalPassengers +=
        bus.total_passengers;

      totalOperatedKm +=
        bus.total_operated_km;


      // ---------------------------------------------------
      // Available seat capacity for completed Trips
      // ---------------------------------------------------

      totalSeatCapacity +=

        bus.completed_trips *
        bus.capacity;


      // ---------------------------------------------------
      // Financial Totals
      // ---------------------------------------------------

      totalTicketRevenue +=
        bus.total_actual_revenue;

      totalExpectedRevenue +=
        bus.total_expected_revenue;

      totalFuelCost +=
        bus.total_fuel_cost;

      totalMaintenanceCost +=
        bus.total_maintenance_cost;

      totalDowntimeHours +=
        bus.total_downtime_hours;

    }


    // =====================================================
    // NETWORK LOAD FACTOR
    // =====================================================

    const averageLoadFactor =
      totalSeatCapacity > 0

        ? (
            totalPassengers /
            totalSeatCapacity
          ) *
          100

        : 0;


    // =====================================================
    // TRACKED COST TOTALS
    // =====================================================

    const totalTrackedOperatingCost =

      totalFuelCost +
      totalMaintenanceCost;


    const revenueLessTrackedCosts =

      totalTicketRevenue -
      totalTrackedOperatingCost;


    const trackedCostToRevenuePercentage =

      totalTicketRevenue > 0

        ? (
            totalTrackedOperatingCost /
            totalTicketRevenue
          ) *
          100

        : 0;


    // =====================================================
    // SUMMARY OBJECT
    // =====================================================

    const summary:
      IIntegratedBusAnalyticsSummary = {

        total_buses:
          busPerformance.length,

        buses_with_trip_data:
          busesWithTripData,

        buses_with_fuel_data:
          busesWithFuelData,

        buses_with_revenue_data:
          busesWithRevenueData,

        buses_with_maintenance_data:
          busesWithMaintenanceData,

        total_trips:
          totalTrips,

        total_passengers:
          totalPassengers,

        total_operated_km:
          round2(
            totalOperatedKm
          ),

        average_load_factor_percentage:
          round2(
            averageLoadFactor
          ),

        total_ticket_revenue:
          round2(
            totalTicketRevenue
          ),

        total_expected_revenue:
          round2(
            totalExpectedRevenue
          ),

        total_fuel_cost:
          round2(
            totalFuelCost
          ),

        total_maintenance_cost:
          round2(
            totalMaintenanceCost
          ),

        total_tracked_operating_cost:
          round2(
            totalTrackedOperatingCost
          ),

        revenue_less_tracked_costs:
          round2(
            revenueLessTrackedCosts
          ),

        tracked_cost_to_revenue_percentage:
          round2(
            trackedCostToRevenuePercentage
          ),

        total_downtime_hours:
          round2(
            totalDowntimeHours
          )

      };


    // =====================================================
    // HIGHEST PASSENGER BUSES
    // =====================================================

    const highestPassengerBuses:
      IIntegratedBusPerformance[] =

        [...busPerformance]

          .filter(
            bus =>
              bus.total_trips >
              0
          )

          .sort(
            (
              a,
              b
            ) =>
              b.total_passengers -
              a.total_passengers
          )

          .slice(
            0,
            10
          );


    // =====================================================
    // HIGHEST REVENUE BUSES
    // =====================================================

    const highestRevenueBuses:
      IIntegratedBusPerformance[] =

        [...busPerformance]

          .filter(
            bus =>
              bus.total_ticket_records >
              0
          )

          .sort(
            (
              a,
              b
            ) =>
              b.total_actual_revenue -
              a.total_actual_revenue
          )

          .slice(
            0,
            10
          );


    // =====================================================
    // HIGHEST FUEL-COST BUSES
    // =====================================================

    const highestFuelCostBuses:
      IIntegratedBusPerformance[] =

        [...busPerformance]

          .filter(
            bus =>
              bus.total_fuel_records >
              0
          )

          .sort(
            (
              a,
              b
            ) =>
              b.total_fuel_cost -
              a.total_fuel_cost
          )

          .slice(
            0,
            10
          );


    // =====================================================
    // HIGHEST MAINTENANCE-COST BUSES
    // =====================================================

    const highestMaintenanceCostBuses:
      IIntegratedBusPerformance[] =

        [...busPerformance]

          .filter(
            bus =>
              bus.total_maintenance_records >
              0
          )

          .sort(
            (
              a,
              b
            ) =>
              b.total_maintenance_cost -
              a.total_maintenance_cost
          )

          .slice(
            0,
            10
          );


    // =====================================================
    // HIGHEST DOWNTIME BUSES
    // =====================================================

    const highestDowntimeBuses:
      IIntegratedBusPerformance[] =

        [...busPerformance]

          .filter(
            bus =>
              bus.total_maintenance_records >
              0
          )

          .sort(
            (
              a,
              b
            ) =>
              b.total_downtime_hours -
              a.total_downtime_hours
          )

          .slice(
            0,
            10
          );


    // =====================================================
    // RETURN STEP 9 ANALYTICS
    // =====================================================

    return {

      summary,

      bus_performance:
        busPerformance,

      highest_passenger_buses:
        highestPassengerBuses,

      highest_revenue_buses:
        highestRevenueBuses,

      highest_fuel_cost_buses:
        highestFuelCostBuses,

      highest_maintenance_cost_buses:
        highestMaintenanceCostBuses,

      highest_downtime_buses:
        highestDowntimeBuses

    };

  };