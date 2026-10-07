import Depot
  from "../models/depot.model";

import Bus
  from "../models/bus.model";

import Route
  from "../models/route.model";

import Trip
  from "../models/trip.model";

import FuelRecord
  from "../models/fuelRecord.model";

import TicketSale
  from "../models/ticketSale.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  IAnalyticsFilterOptions,
  IFilteredAnalytics,
  IFilteredFleetSummary,
  IFilteredOperationsSummary,
  IFilteredFuelSummary,
  IFilteredRevenueSummary,
  IFilteredMaintenanceSummary,
  IParsedAnalyticsFilters
} from "../types/analyticsFilter.types";

import {
  AnalyticsFilterValidationError
} from "../utils/analyticsFilter.utils";


// =========================================================
// BUILD DATE CONDITION
// =========================================================

const buildDateCondition =
  (
    filters:
      IParsedAnalyticsFilters
  ): Record<string, Date> | undefined => {

    const condition:
      Record<string, Date> = {};


    if (
      filters.start_date_value
    ) {

      condition.$gte =
        filters.start_date_value;

    }


    if (
      filters.end_date_exclusive_value
    ) {

      condition.$lt =
        filters.end_date_exclusive_value;

    }


    if (
      Object.keys(
        condition
      ).length ===
      0
    ) {

      return undefined;

    }


    return condition;

  };


// =========================================================
// GET FILTER OPTIONS
// =========================================================
//
// Used by frontend dropdowns later.
//
// =========================================================

export const getAnalyticsFilterOptions =
  async (): Promise<IAnalyticsFilterOptions> => {

    const [
      depots,
      buses,
      routes
    ] = await Promise.all([

      Depot.find(
        {},
        {
          _id:
            0,

          depot_id:
            1,

          depot_name:
            1
        }
      )
        .sort({
          depot_id:
            1
        })
        .lean(),


      Bus.find(
        {},
        {
          _id:
            0,

          bus_id:
            1,

          registration_no:
            1,

          depot_id:
            1
        }
      )
        .sort({
          bus_id:
            1
        })
        .lean(),


      Route.find(
        {},
        {
          _id:
            0,

          route_id:
            1,

          route_number:
            1,

          origin:
            1,

          destination:
            1
        }
      )
        .sort({
          route_id:
            1
        })
        .lean()

    ]);


    return {

      depots:
        depots as IAnalyticsFilterOptions["depots"],

      buses:
        buses as IAnalyticsFilterOptions["buses"],

      routes:
        routes as IAnalyticsFilterOptions["routes"]

    };

  };


// =========================================================
// VALIDATE REFERENCED MASTER DATA
// =========================================================

const validateFilterEntities =
  async (
    filters:
      IParsedAnalyticsFilters
  ): Promise<void> => {

    const [
      depot,
      bus,
      route
    ] = await Promise.all([

      filters.depot_id

        ? Depot.findOne(
            {
              depot_id:
                filters.depot_id
            }
          )
            .select({
              _id:
                0,

              depot_id:
                1
            })
            .lean()

        : Promise.resolve(
            null
          ),


      filters.bus_id

        ? Bus.findOne(
            {
              bus_id:
                filters.bus_id
            }
          )
            .select({
              _id:
                0,

              bus_id:
                1,

              depot_id:
                1
            })
            .lean()

        : Promise.resolve(
            null
          ),


      filters.route_id

        ? Route.findOne(
            {
              route_id:
                filters.route_id
            }
          )
            .select({
              _id:
                0,

              route_id:
                1
            })
            .lean()

        : Promise.resolve(
            null
          )

    ]);


    // =====================================================
    // DEPOT MUST EXIST
    // =====================================================

    if (
      filters.depot_id &&
      !depot
    ) {

      throw new AnalyticsFilterValidationError(
        `Depot ${filters.depot_id} does not exist.`
      );

    }


    // =====================================================
    // BUS MUST EXIST
    // =====================================================

    if (
      filters.bus_id &&
      !bus
    ) {

      throw new AnalyticsFilterValidationError(
        `Bus ${filters.bus_id} does not exist.`
      );

    }


    // =====================================================
    // ROUTE MUST EXIST
    // =====================================================

    if (
      filters.route_id &&
      !route
    ) {

      throw new AnalyticsFilterValidationError(
        `Route ${filters.route_id} does not exist.`
      );

    }


    // =====================================================
    // BUS / DEPOT COMBINATION VALIDATION
    // =====================================================

    if (
      filters.bus_id &&
      filters.depot_id &&
      bus &&
      bus.depot_id !==
      filters.depot_id
    ) {

      throw new AnalyticsFilterValidationError(
        `Bus ${filters.bus_id} does not belong to Depot ${filters.depot_id}.`
      );

    }

  };


// =========================================================
// GET FILTERED ANALYTICS
// =========================================================

export const getFilteredAnalytics =
  async (
    filters:
      IParsedAnalyticsFilters
  ): Promise<IFilteredAnalytics> => {

    // =====================================================
    // VALIDATE IDS AGAINST DATABASE
    // =====================================================

    await validateFilterEntities(
      filters
    );


    const dateCondition =
      buildDateCondition(
        filters
      );


    // =====================================================
    // FLEET MATCH
    // =====================================================
    //
    // Fleet has no Route or historical date field.
    //
    // Therefore only:
    //
    // depot_id
    // bus_id
    //
    // apply.
    //
    // =====================================================

    const fleetMatch:
      Record<string, unknown> = {};


    if (
      filters.depot_id
    ) {

      fleetMatch.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      fleetMatch.bus_id =
        filters.bus_id;

    }


    // =====================================================
    // TRIP MATCH
    // =====================================================

    const tripMatch:
      Record<string, unknown> = {};


    if (
      filters.depot_id
    ) {

      tripMatch.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      tripMatch.bus_id =
        filters.bus_id;

    }


    if (
      filters.route_id
    ) {

      tripMatch.route_id =
        filters.route_id;

    }


    if (
      dateCondition
    ) {

      tripMatch.trip_date =
        dateCondition;

    }


    // =====================================================
    // FUEL MATCH
    // =====================================================

    const fuelMatch:
      Record<string, unknown> = {};


    if (
      filters.depot_id
    ) {

      fuelMatch.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      fuelMatch.bus_id =
        filters.bus_id;

    }


    if (
      dateCondition
    ) {

      fuelMatch.fuel_date =
        dateCondition;

    }


    // =====================================================
    // REVENUE MATCH
    // =====================================================

    const revenueMatch:
      Record<string, unknown> = {};


    if (
      filters.depot_id
    ) {

      revenueMatch.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      revenueMatch.bus_id =
        filters.bus_id;

    }


    if (
      filters.route_id
    ) {

      revenueMatch.route_id =
        filters.route_id;

    }


    if (
      dateCondition
    ) {

      revenueMatch.sale_date =
        dateCondition;

    }


    // =====================================================
    // MAINTENANCE MATCH
    // =====================================================
    //
    // Maintenance has no Route relationship.
    //
    // Therefore route_id is intentionally NOT applied.
    //
    // =====================================================

    const maintenanceMatch:
      Record<string, unknown> = {};


    if (
      filters.depot_id
    ) {

      maintenanceMatch.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      maintenanceMatch.bus_id =
        filters.bus_id;

    }


    if (
      dateCondition
    ) {

      maintenanceMatch.reported_date =
        dateCondition;

    }


    // =====================================================
    // FUEL PIPELINE
    // =====================================================
    //
    // FuelRecord has trip_id but not route_id.
    //
    // Therefore if route_id is supplied:
    //
    // FuelRecord
    //    ↓
    // $lookup Trip
    //    ↓
    // Match Trip.route_id
    //
    // =====================================================

    const fuelPipeline:
      any[] = [

        {
          $match:
            fuelMatch
        }

      ];


    if (
      filters.route_id
    ) {

      fuelPipeline.push(

        {
          $lookup: {

            from:
              "trips",

            localField:
              "trip_id",

            foreignField:
              "trip_id",

            as:
              "trip"

          }
        },


        {
          $unwind:
            "$trip"
        },


        {
          $match: {

            "trip.route_id":
              filters.route_id

          }
        }

      );

    }


    fuelPipeline.push(

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

          total_operated_km: {
            $sum:
              "$operated_km"
          }

        }
      },


      {
        $project: {

          _id:
            0,

          total_fuel_records:
            1,

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

          total_operated_km: {
            $round: [
              "$total_operated_km",
              2
            ]
          },


          overall_km_per_litre: {

            $cond: [

              {
                $gt: [
                  "$total_fuel_litres",
                  0
                ]
              },

              {
                $round: [
                  {
                    $divide: [
                      "$total_operated_km",
                      "$total_fuel_litres"
                    ]
                  },
                  2
                ]
              },

              0

            ]

          },


          overall_fuel_cost_per_km: {

            $cond: [

              {
                $gt: [
                  "$total_operated_km",
                  0
                ]
              },

              {
                $round: [
                  {
                    $divide: [
                      "$total_fuel_cost",
                      "$total_operated_km"
                    ]
                  },
                  2
                ]
              },

              0

            ]

          }

        }
      }

    );


    // =====================================================
    // RUN FILTERED AGGREGATIONS
    // =====================================================

    const [
      fleetResult,
      operationsResult,
      fuelResult,
      revenueResult,
      maintenanceResult
    ] = await Promise.all([


      // ===================================================
      // 1. FILTERED FLEET
      // ===================================================

      Bus.aggregate([

        {
          $match:
            fleetMatch
        },


        {
          $group: {

            _id:
              null,

            total_buses: {
              $sum:
                1
            },


            operational_buses: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$bus_status",
                      "Operational"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            under_maintenance_buses: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$bus_status",
                      "Under Maintenance"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            breakdown_buses: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$bus_status",
                      "Breakdown"
                    ]
                  },
                  1,
                  0
                ]

              }

            },


            out_of_service_buses: {

              $sum: {

                $cond: [
                  {
                    $eq: [
                      "$bus_status",
                      "Out of Service"
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

            total_buses:
              1,

            operational_buses:
              1,

            under_maintenance_buses:
              1,

            breakdown_buses:
              1,

            out_of_service_buses:
              1,


            fleet_availability_percentage: {

              $cond: [

                {
                  $gt: [
                    "$total_buses",
                    0
                  ]
                },

                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$operational_buses",
                            "$total_buses"
                          ]
                        },
                        100
                      ]
                    },
                    2
                  ]
                },

                0

              ]

            }

          }
        }

      ]),


      // ===================================================
      // 2. FILTERED OPERATIONS
      // ===================================================

      Trip.aggregate([

        {
          $match:
            tripMatch
        },


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


            total_passengers: {
              $sum:
                "$passenger_count"
            },


            average_passengers_per_trip: {
              $avg:
                "$passenger_count"
            },


            average_delay_minutes: {
              $avg:
                "$delay_minutes"
            },


            total_operated_km: {
              $sum:
                "$operated_km"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            total_trips:
              1,

            completed_trips:
              1,

            total_passengers:
              1,

            average_passengers_per_trip: {
              $round: [
                "$average_passengers_per_trip",
                2
              ]
            },

            average_delay_minutes: {
              $round: [
                "$average_delay_minutes",
                2
              ]
            },

            total_operated_km: {
              $round: [
                "$total_operated_km",
                2
              ]
            }

          }
        }

      ]),


      // ===================================================
      // 3. FILTERED FUEL
      // ===================================================

      FuelRecord.aggregate(
        fuelPipeline
      ),


      // ===================================================
      // 4. FILTERED REVENUE
      // ===================================================

      TicketSale.aggregate([

        {
          $match:
            revenueMatch
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
        },


        {
          $project: {

            _id:
              0,

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

              $cond: [

                {
                  $gt: [
                    "$total_expected_revenue",
                    0
                  ]
                },

                {
                  $round: [
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
                    2
                  ]
                },

                0

              ]

            }

          }
        }

      ]),


      // ===================================================
      // 5. FILTERED MAINTENANCE
      // ===================================================

      MaintenanceRecord.aggregate([

        {
          $match:
            maintenanceMatch
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

            total_maintenance_records:
              1,

            completed_maintenance:
              1,

            in_progress_maintenance:
              1,

            preventive_maintenance:
              1,

            corrective_maintenance:
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
        }

      ])

    ]);


    // =====================================================
    // SAFE DEFAULT VALUES
    // =====================================================

    const fleet:
      IFilteredFleetSummary =
        fleetResult[0] ?? {

          total_buses:
            0,

          operational_buses:
            0,

          under_maintenance_buses:
            0,

          breakdown_buses:
            0,

          out_of_service_buses:
            0,

          fleet_availability_percentage:
            0

        };


    const operations:
      IFilteredOperationsSummary =
        operationsResult[0] ?? {

          total_trips:
            0,

          completed_trips:
            0,

          total_passengers:
            0,

          average_passengers_per_trip:
            0,

          average_delay_minutes:
            0,

          total_operated_km:
            0

        };


    const fuel:
      IFilteredFuelSummary =
        fuelResult[0] ?? {

          total_fuel_records:
            0,

          total_fuel_litres:
            0,

          total_fuel_cost:
            0,

          total_operated_km:
            0,

          overall_km_per_litre:
            0,

          overall_fuel_cost_per_km:
            0

        };


    const revenue:
      IFilteredRevenueSummary =
        revenueResult[0] ?? {

          total_ticket_records:
            0,

          total_tickets_sold:
            0,

          total_actual_revenue:
            0,

          total_expected_revenue:
            0,

          total_revenue_difference:
            0,

          revenue_achievement_percentage:
            0

        };


    const maintenance:
      IFilteredMaintenanceSummary =
        maintenanceResult[0] ?? {

          total_maintenance_records:
            0,

          completed_maintenance:
            0,

          in_progress_maintenance:
            0,

          preventive_maintenance:
            0,

          corrective_maintenance:
            0,

          total_maintenance_cost:
            0,

          total_downtime_hours:
            0

        };


    // =====================================================
    // RETURN ONLY USER-FACING FILTER VALUES
    // =====================================================

    const appliedFilters = {

      ...(filters.depot_id && {
        depot_id:
          filters.depot_id
      }),

      ...(filters.bus_id && {
        bus_id:
          filters.bus_id
      }),

      ...(filters.route_id && {
        route_id:
          filters.route_id
      }),

      ...(filters.start_date && {
        start_date:
          filters.start_date
      }),

      ...(filters.end_date && {
        end_date:
          filters.end_date
      })

    };


    // =====================================================
    // RETURN COMPLETE FILTERED ANALYTICS
    // =====================================================

    return {

      applied_filters:
        appliedFilters,

      filter_scope: {

        fleet: [
          "depot_id",
          "bus_id"
        ],

        operations: [
          "depot_id",
          "bus_id",
          "route_id",
          "start_date",
          "end_date"
        ],

        fuel: [
          "depot_id",
          "bus_id",
          "route_id via trip_id",
          "start_date",
          "end_date"
        ],

        revenue: [
          "depot_id",
          "bus_id",
          "route_id",
          "start_date",
          "end_date"
        ],

        maintenance: [
          "depot_id",
          "bus_id",
          "start_date",
          "end_date"
        ]

      },

      fleet,

      operations,

      fuel,

      revenue,

      maintenance

    };

  };