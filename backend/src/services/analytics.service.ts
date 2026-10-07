import Depot
  from "../models/depot.model";

import Route
  from "../models/route.model";

import Bus
  from "../models/bus.model";

import SparePart
  from "../models/sparePart.model";

import Trip
  from "../models/trip.model";

import FuelRecord
  from "../models/fuelRecord.model";

import TicketSale
  from "../models/ticketSale.model";

import MaintenanceRecord
  from "../models/maintenanceRecord.model";

import {
  IAnalyticsModuleStatus,
  IOverviewAnalytics,
  INetworkOverview,
  IFleetOverview,
  ITripOverview,
  IFuelOverview,
  IRevenueOverview,
  IMaintenanceOverview,
  IInventoryOverview,

  IFleetAnalytics,
  IFleetStatusDistribution,
  IFleetFuelTypeDistribution,
  IDepotFleetAnalytics,
  IFleetAgeUsageSummary,
  IHighOdometerBus,

  IRouteTripAnalytics,
  IRouteTripSummary,
  IRoutePerformance,
  IDelayDistribution,

  IFuelAnalytics,
  IFuelAnalyticsSummary,
  IBusFuelPerformance,
  IDepotFuelPerformance,
  IFuelTrendPoint,

  IRevenueAnalytics,
  IRevenueAnalyticsSummary,
  IRouteRevenuePerformance,
  IDepotRevenuePerformance,
  IRevenueTrendPoint
} from "../types/analytics.types";


// =========================================================
// STEP 1
// ANALYTICS MODULE STATUS
// =========================================================

export const getAnalyticsModuleStatus =
  async (): Promise<IAnalyticsModuleStatus> => {

    const [
      depotCount,
      routeCount,
      busCount,
      sparePartCount,
      tripCount,
      fuelRecordCount,
      ticketSaleCount,
      maintenanceRecordCount
    ] = await Promise.all([

      Depot.countDocuments(),

      Route.countDocuments(),

      Bus.countDocuments(),

      SparePart.countDocuments(),

      Trip.countDocuments(),

      FuelRecord.countDocuments(),

      TicketSale.countDocuments(),

      MaintenanceRecord.countDocuments()

    ]);


    const totalDocuments =
      depotCount +
      routeCount +
      busCount +
      sparePartCount +
      tripCount +
      fuelRecordCount +
      ticketSaleCount +
      maintenanceRecordCount;


    return {

      module:
        "SLTB Decision Analytics",

      status:
        "Ready",

      database_access:
        true,

      collections: {

        depots:
          depotCount,

        routes:
          routeCount,

        buses:
          busCount,

        spare_parts:
          sparePartCount,

        trips:
          tripCount,

        fuel_records:
          fuelRecordCount,

        ticket_sales:
          ticketSaleCount,

        maintenance_records:
          maintenanceRecordCount

      },

      total_documents:
        totalDocuments

    };

  };


// =========================================================
// STEP 2
// OVERVIEW / KPI ANALYTICS
// =========================================================

export const getOverviewAnalytics =
  async (): Promise<IOverviewAnalytics> => {

    const [
      depotResult,
      routeResult,
      fleetResult,
      tripResult,
      fuelResult,
      revenueResult,
      maintenanceResult,
      inventoryResult
    ] = await Promise.all([


      // ===================================================
      // DEPOTS
      // ===================================================

      Depot.aggregate([
        {
          $count:
            "total_depots"
        }
      ]),


      // ===================================================
      // ROUTES
      // ===================================================

      Route.aggregate([
        {
          $count:
            "total_routes"
        }
      ]),


      // ===================================================
      // FLEET
      // ===================================================

      Bus.aggregate([

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
                  $eq: [
                    "$total_buses",
                    0
                  ]
                },

                0,

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
                }

              ]

            }

          }
        }

      ]),


      // ===================================================
      // TRIPS
      // ===================================================

      Trip.aggregate([

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
      // FUEL
      // ===================================================

      FuelRecord.aggregate([

        {
          $group: {

            _id:
              null,

            total_fuel_litres: {
              $sum:
                "$fuel_litres"
            },

            total_fuel_cost: {
              $sum:
                "$total_fuel_cost"
            },

            average_km_per_litre: {
              $avg:
                "$km_per_litre"
            },

            average_fuel_cost_per_km: {
              $avg:
                "$fuel_cost_per_km"
            }

          }
        },

        {
          $project: {

            _id:
              0,

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

            average_km_per_litre: {
              $round: [
                "$average_km_per_litre",
                2
              ]
            },

            average_fuel_cost_per_km: {
              $round: [
                "$average_fuel_cost_per_km",
                2
              ]
            }

          }
        }

      ]),


      // ===================================================
      // REVENUE
      // ===================================================

      TicketSale.aggregate([

        {
          $group: {

            _id:
              null,

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
            }

          }
        }

      ]),


      // ===================================================
      // MAINTENANCE
      // ===================================================

      MaintenanceRecord.aggregate([

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
            }

          }
        }

      ]),


      // ===================================================
      // INVENTORY
      // ===================================================

      SparePart.aggregate([

        {
          $group: {

            _id:
              null,

            total_spare_part_records: {
              $sum:
                1
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
            },

            total_units_in_stock: {
              $sum:
                "$quantity_in_stock"
            },

            total_inventory_value: {
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

            total_spare_part_records:
              1,

            available_parts:
              1,

            low_stock_parts:
              1,

            out_of_stock_parts:
              1,

            total_units_in_stock:
              1,

            total_inventory_value: {
              $round: [
                "$total_inventory_value",
                2
              ]
            }

          }
        }

      ])

    ]);


    const network:
      INetworkOverview = {

        total_depots:
          depotResult[0]?.total_depots ?? 0,

        total_routes:
          routeResult[0]?.total_routes ?? 0

      };


    const fleet:
      IFleetOverview =
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
      ITripOverview =
        tripResult[0] ?? {

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
      IFuelOverview =
        fuelResult[0] ?? {

          total_fuel_litres:
            0,

          total_fuel_cost:
            0,

          average_km_per_litre:
            0,

          average_fuel_cost_per_km:
            0

        };


    const revenue:
      IRevenueOverview =
        revenueResult[0] ?? {

          total_tickets_sold:
            0,

          total_actual_revenue:
            0,

          total_expected_revenue:
            0,

          total_revenue_difference:
            0

        };


    const maintenance:
      IMaintenanceOverview =
        maintenanceResult[0] ?? {

          total_maintenance_records:
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
            0

        };


    const inventory:
      IInventoryOverview =
        inventoryResult[0] ?? {

          total_spare_part_records:
            0,

          available_parts:
            0,

          low_stock_parts:
            0,

          out_of_stock_parts:
            0,

          total_units_in_stock:
            0,

          total_inventory_value:
            0

        };


    return {

      network,

      fleet,

      operations,

      fuel,

      revenue,

      maintenance,

      inventory

    };

  };


// =========================================================
// STEP 3
// FLEET ANALYTICS
// =========================================================

export const getFleetAnalytics =
  async (): Promise<IFleetAnalytics> => {

    const [
      summaryResult,
      statusResult,
      fuelTypeResult,
      depotResult,
      ageUsageResult,
      highOdometerResult
    ] = await Promise.all([


      // ===================================================
      // SUMMARY
      // ===================================================

      Bus.aggregate([

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
                  $eq: [
                    "$total_buses",
                    0
                  ]
                },

                0,

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
                }

              ]

            }

          }
        }

      ]),


      // ===================================================
      // STATUS DISTRIBUTION
      // ===================================================

      Bus.aggregate([
        {
          $group: {
            _id:
              "$bus_status",
            count: {
              $sum:
                1
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
      // FUEL TYPE DISTRIBUTION
      // ===================================================

      Bus.aggregate([
        {
          $group: {
            _id:
              "$fuel_type",
            count: {
              $sum:
                1
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
      // DEPOT PERFORMANCE
      // ===================================================

      Bus.aggregate([

        {
          $group: {

            _id:
              "$depot_id",

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
            },

            average_capacity: {
              $avg:
                "$capacity"
            },

            average_odometer_km: {
              $avg:
                "$odometer_km"
            }

          }
        },

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

            availability_percentage: {

              $cond: [
                {
                  $eq: [
                    "$total_buses",
                    0
                  ]
                },
                0,
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
                }
              ]

            },

            average_capacity: {
              $round: [
                "$average_capacity",
                2
              ]
            },

            average_odometer_km: {
              $round: [
                "$average_odometer_km",
                2
              ]
            }

          }
        },

        {
          $sort: {
            availability_percentage:
              1,
            depot_id:
              1
          }
        }

      ]),


      // ===================================================
      // AGE AND USAGE
      // ===================================================

      Bus.aggregate([

        {
          $project: {

            vehicle_age: {
              $subtract: [
                {
                  $year:
                    "$$NOW"
                },
                "$manufacture_year"
              ]
            },

            odometer_km:
              1,

            capacity:
              1

          }
        },

        {
          $group: {

            _id:
              null,

            average_vehicle_age_years: {
              $avg:
                "$vehicle_age"
            },

            oldest_vehicle_age_years: {
              $max:
                "$vehicle_age"
            },

            newest_vehicle_age_years: {
              $min:
                "$vehicle_age"
            },

            average_odometer_km: {
              $avg:
                "$odometer_km"
            },

            maximum_odometer_km: {
              $max:
                "$odometer_km"
            },

            minimum_odometer_km: {
              $min:
                "$odometer_km"
            },

            total_passenger_capacity: {
              $sum:
                "$capacity"
            },

            average_bus_capacity: {
              $avg:
                "$capacity"
            }

          }
        },

        {
          $project: {

            _id:
              0,

            average_vehicle_age_years: {
              $round: [
                "$average_vehicle_age_years",
                2
              ]
            },

            oldest_vehicle_age_years:
              1,

            newest_vehicle_age_years:
              1,

            average_odometer_km: {
              $round: [
                "$average_odometer_km",
                2
              ]
            },

            maximum_odometer_km:
              1,

            minimum_odometer_km:
              1,

            total_passenger_capacity:
              1,

            average_bus_capacity: {
              $round: [
                "$average_bus_capacity",
                2
              ]
            }

          }
        }

      ]),


      // ===================================================
      // HIGHEST ODOMETER BUSES
      // ===================================================

      Bus.aggregate([
        {
          $sort: {
            odometer_km:
              -1
          }
        },
        {
          $limit:
            10
        },
        {
          $project: {

            _id:
              0,

            bus_id:
              1,

            registration_no:
              1,

            depot_id:
              1,

            manufacturer:
              1,

            model:
              1,

            manufacture_year:
              1,

            bus_status:
              1,

            odometer_km:
              1

          }
        }
      ])

    ]);


    const summary:
      IFleetOverview =
        summaryResult[0] ?? {

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


    const totalBuses =
      summary.total_buses;


    const statusDistribution:
      IFleetStatusDistribution[] =
        statusResult.map(
          item => ({

            status:
              item._id,

            count:
              item.count,

            percentage:
              totalBuses > 0
                ? Math.round(
                    (
                      item.count /
                      totalBuses *
                      100
                    ) * 100
                  ) / 100
                : 0

          })
        );


    const fuelTypeDistribution:
      IFleetFuelTypeDistribution[] =
        fuelTypeResult.map(
          item => ({

            fuel_type:
              item._id,

            count:
              item.count,

            percentage:
              totalBuses > 0
                ? Math.round(
                    (
                      item.count /
                      totalBuses *
                      100
                    ) * 100
                  ) / 100
                : 0

          })
        );


    const depotPerformance:
      IDepotFleetAnalytics[] =
        depotResult;


    const ageAndUsage:
      IFleetAgeUsageSummary =
        ageUsageResult[0] ?? {

          average_vehicle_age_years:
            0,

          oldest_vehicle_age_years:
            0,

          newest_vehicle_age_years:
            0,

          average_odometer_km:
            0,

          maximum_odometer_km:
            0,

          minimum_odometer_km:
            0,

          total_passenger_capacity:
            0,

          average_bus_capacity:
            0

        };


    const highestOdometerBuses:
      IHighOdometerBus[] =
        highOdometerResult;


    return {

      summary,

      status_distribution:
        statusDistribution,

      fuel_type_distribution:
        fuelTypeDistribution,

      depot_performance:
        depotPerformance,

      age_and_usage:
        ageAndUsage,

      highest_odometer_buses:
        highestOdometerBuses

    };

  };


// =========================================================
// STEP 4
// ROUTE & TRIP ANALYTICS
// =========================================================

export const getRouteTripAnalytics =
  async (): Promise<IRouteTripAnalytics> => {

    const [
      summaryResult,
      routePerformanceResult,
      delayDistributionResult
    ] = await Promise.all([


      // ===================================================
      // SUMMARY
      // ===================================================

      Trip.aggregate([

        {
          $lookup: {
            from:
              "buses",
            localField:
              "bus_id",
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

        {
          $set: {

            load_factor_percentage: {

              $cond: [
                {
                  $gt: [
                    "$bus.capacity",
                    0
                  ]
                },
                {
                  $multiply: [
                    {
                      $divide: [
                        "$passenger_count",
                        "$bus.capacity"
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
            },

            average_load_factor_percentage: {
              $avg:
                "$load_factor_percentage"
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
            },

            average_load_factor_percentage: {
              $round: [
                "$average_load_factor_percentage",
                2
              ]
            }

          }
        }

      ]),


      // ===================================================
      // ROUTE PERFORMANCE
      // ===================================================

      Trip.aggregate([

        {
          $lookup: {
            from:
              "routes",
            localField:
              "route_id",
            foreignField:
              "route_id",
            as:
              "route"
          }
        },

        {
          $unwind:
            "$route"
        },

        {
          $lookup: {
            from:
              "buses",
            localField:
              "bus_id",
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

        {
          $set: {

            load_factor_percentage: {

              $cond: [
                {
                  $gt: [
                    "$bus.capacity",
                    0
                  ]
                },
                {
                  $multiply: [
                    {
                      $divide: [
                        "$passenger_count",
                        "$bus.capacity"
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

        {
          $group: {

            _id:
              "$route_id",

            route_number: {
              $first:
                "$route.route_number"
            },

            origin: {
              $first:
                "$route.origin"
            },

            destination: {
              $first:
                "$route.destination"
            },

            route_type: {
              $first:
                "$route.route_type"
            },

            route_status: {
              $first:
                "$route.status"
            },

            distance_km: {
              $first:
                "$route.distance_km"
            },

            total_trips: {
              $sum:
                1
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
            },

            average_load_factor_percentage: {
              $avg:
                "$load_factor_percentage"
            }

          }
        },

        {
          $project: {

            _id:
              0,

            route_id:
              "$_id",

            route_number:
              1,

            origin:
              1,

            destination:
              1,

            route_type:
              1,

            route_status:
              1,

            distance_km:
              1,

            total_trips:
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
            },

            average_load_factor_percentage: {
              $round: [
                "$average_load_factor_percentage",
                2
              ]
            }

          }
        },

        {
          $sort: {
            route_id:
              1
          }
        }

      ]),


      // ===================================================
      // DELAY DISTRIBUTION
      // ===================================================

      Trip.aggregate([

        {
          $project: {

            delay_range: {

              $switch: {

                branches: [

                  {
                    case: {
                      $eq: [
                        "$delay_minutes",
                        0
                      ]
                    },
                    then:
                      "No Delay"
                  },

                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            "$delay_minutes",
                            1
                          ]
                        },
                        {
                          $lte: [
                            "$delay_minutes",
                            10
                          ]
                        }
                      ]
                    },
                    then:
                      "1 - 10 Minutes"
                  },

                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            "$delay_minutes",
                            11
                          ]
                        },
                        {
                          $lte: [
                            "$delay_minutes",
                            20
                          ]
                        }
                      ]
                    },
                    then:
                      "11 - 20 Minutes"
                  }

                ],

                default:
                  "More Than 20 Minutes"

              }

            },

            sort_order: {

              $switch: {

                branches: [

                  {
                    case: {
                      $eq: [
                        "$delay_minutes",
                        0
                      ]
                    },
                    then:
                      1
                  },

                  {
                    case: {
                      $lte: [
                        "$delay_minutes",
                        10
                      ]
                    },
                    then:
                      2
                  },

                  {
                    case: {
                      $lte: [
                        "$delay_minutes",
                        20
                      ]
                    },
                    then:
                      3
                  }

                ],

                default:
                  4

              }

            }

          }
        },

        {
          $group: {

            _id: {
              delay_range:
                "$delay_range",
              sort_order:
                "$sort_order"
            },

            count: {
              $sum:
                1
            }

          }
        },

        {
          $sort: {
            "_id.sort_order":
              1
          }
        },

        {
          $project: {

            _id:
              0,

            delay_range:
              "$_id.delay_range",

            count:
              1

          }
        }

      ])

    ]);


    const summary:
      IRouteTripSummary =
        summaryResult[0] ?? {

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
            0,

          average_load_factor_percentage:
            0

        };


    const routePerformance:
      IRoutePerformance[] =
        routePerformanceResult;


    const highestPassengerRoutes:
      IRoutePerformance[] =
        [...routePerformance]
          .sort(
            (a, b) =>
              b.total_passengers -
              a.total_passengers
          )
          .slice(
            0,
            10
          );


    const highestDelayRoutes:
      IRoutePerformance[] =
        [...routePerformance]
          .sort(
            (a, b) =>
              b.average_delay_minutes -
              a.average_delay_minutes
          )
          .slice(
            0,
            10
          );


    const highestLoadFactorRoutes:
      IRoutePerformance[] =
        [...routePerformance]
          .sort(
            (a, b) =>
              b.average_load_factor_percentage -
              a.average_load_factor_percentage
          )
          .slice(
            0,
            10
          );


    const totalTrips =
      summary.total_trips;


    const delayDistribution:
      IDelayDistribution[] =
        delayDistributionResult.map(
          item => ({

            delay_range:
              item.delay_range,

            count:
              item.count,

            percentage:
              totalTrips > 0
                ? Math.round(
                    (
                      item.count /
                      totalTrips *
                      100
                    ) * 100
                  ) / 100
                : 0

          })
        );


    return {

      summary,

      route_performance:
        routePerformance,

      highest_passenger_routes:
        highestPassengerRoutes,

      highest_delay_routes:
        highestDelayRoutes,

      highest_load_factor_routes:
        highestLoadFactorRoutes,

      delay_distribution:
        delayDistribution

    };

  };


// =========================================================
// STEP 5
// FUEL ANALYTICS
// =========================================================

export const getFuelAnalytics =
  async (): Promise<IFuelAnalytics> => {

    const [
      summaryResult,
      busPerformanceResult,
      depotPerformanceResult,
      dailyTrendResult
    ] = await Promise.all([


      // ===================================================
      // 1. OVERALL FUEL SUMMARY
      // ===================================================

      FuelRecord.aggregate([

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


            // ---------------------------------------------
            // Weighted fleet fuel efficiency
            //
            // Total Distance / Total Fuel
            // ---------------------------------------------

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


            // ---------------------------------------------
            // Overall fuel cost per km
            // ---------------------------------------------

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

            },


            // ---------------------------------------------
            // Average effective fuel price
            //
            // Total Fuel Cost / Total Litres
            // ---------------------------------------------

            average_fuel_price_per_litre: {

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
                        "$total_fuel_cost",
                        "$total_fuel_litres"
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
      // 2. FUEL PERFORMANCE BY BUS
      // ===================================================

      FuelRecord.aggregate([

        // -------------------------------------------------
        // Combine all fuel records belonging to same Bus
        // -------------------------------------------------

        {
          $group: {

            _id:
              "$bus_id",

            total_fuel_records: {
              $sum:
                1
            },

            total_operated_km: {
              $sum:
                "$operated_km"
            },

            total_fuel_litres: {
              $sum:
                "$fuel_litres"
            },

            total_fuel_cost: {
              $sum:
                "$total_fuel_cost"
            }

          }
        },


        // -------------------------------------------------
        // Join Bus details
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
        // Build result
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

            fuel_type:
              "$bus.fuel_type",

            total_fuel_records:
              1,

            total_operated_km: {
              $round: [
                "$total_operated_km",
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

            fuel_cost_per_km: {

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
        },

        {
          $sort: {
            bus_id:
              1
          }
        }

      ]),


      // ===================================================
      // 3. FUEL PERFORMANCE BY DEPOT
      // ===================================================

      FuelRecord.aggregate([

        {
          $group: {

            _id:
              "$depot_id",

            total_fuel_records: {
              $sum:
                1
            },

            total_operated_km: {
              $sum:
                "$operated_km"
            },

            total_fuel_litres: {
              $sum:
                "$fuel_litres"
            },

            total_fuel_cost: {
              $sum:
                "$total_fuel_cost"
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

            total_fuel_records:
              1,

            total_operated_km: {
              $round: [
                "$total_operated_km",
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

            fuel_cost_per_km: {

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
        },

        // -------------------------------------------------
        // Highest depot fuel expenditure first
        // -------------------------------------------------

        {
          $sort: {
            total_fuel_cost:
              -1
          }
        }

      ]),


      // ===================================================
      // 4. DAILY FUEL TREND
      // ===================================================

      FuelRecord.aggregate([

        // -------------------------------------------------
        // Group records by local Sri Lankan date
        // -------------------------------------------------

        {
          $group: {

            _id: {

              $dateToString: {

                format:
                  "%Y-%m-%d",

                date:
                  "$fuel_date",

                timezone:
                  "Asia/Colombo"

              }

            },

            fuel_records: {
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

            date:
              "$_id",

            fuel_records:
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

            km_per_litre: {

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

            fuel_cost_per_km: {

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
        },

        {
          $sort: {
            date:
              1
          }
        }

      ])

    ]);


    // =====================================================
    // SAFE SUMMARY
    // =====================================================

    const summary:
      IFuelAnalyticsSummary =
        summaryResult[0] ?? {

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
            0,

          average_fuel_price_per_litre:
            0

        };


    // =====================================================
    // BUS PERFORMANCE
    // =====================================================

    const busPerformance:
      IBusFuelPerformance[] =
        busPerformanceResult;


    // =====================================================
    // DEPOT PERFORMANCE
    // =====================================================

    const depotPerformance:
      IDepotFuelPerformance[] =
        depotPerformanceResult;


    // =====================================================
    // DAILY TREND
    // =====================================================

    const dailyTrend:
      IFuelTrendPoint[] =
        dailyTrendResult;


    // =====================================================
    // TOP 10 HIGHEST EFFICIENCY BUSES
    // =====================================================

    const highestEfficiencyBuses:
      IBusFuelPerformance[] =
        [...busPerformance]
          .sort(
            (a, b) =>
              b.km_per_litre -
              a.km_per_litre
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // TOP 10 LOWEST EFFICIENCY BUSES
    // =====================================================

    const lowestEfficiencyBuses:
      IBusFuelPerformance[] =
        [...busPerformance]
          .sort(
            (a, b) =>
              a.km_per_litre -
              b.km_per_litre
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // TOP 10 HIGHEST FUEL-COST BUSES
    // =====================================================

    const highestFuelCostBuses:
      IBusFuelPerformance[] =
        [...busPerformance]
          .sort(
            (a, b) =>
              b.total_fuel_cost -
              a.total_fuel_cost
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // RETURN COMPLETE FUEL ANALYTICS
    // =====================================================

    return {

      summary,

      bus_performance:
        busPerformance,

      depot_performance:
        depotPerformance,

      daily_trend:
        dailyTrend,

      highest_efficiency_buses:
        highestEfficiencyBuses,

      lowest_efficiency_buses:
        lowestEfficiencyBuses,

      highest_fuel_cost_buses:
        highestFuelCostBuses

    };

    

  };

  // =========================================================
// STEP 6
// REVENUE ANALYTICS
// =========================================================

export const getRevenueAnalytics =
  async (): Promise<IRevenueAnalytics> => {

    const [
      summaryResult,
      routePerformanceResult,
      depotPerformanceResult,
      dailyTrendResult
    ] = await Promise.all([


      // ===================================================
      // 1. OVERALL REVENUE SUMMARY
      // ===================================================

      TicketSale.aggregate([

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


        // -------------------------------------------------
        // Calculate overall revenue indicators
        // -------------------------------------------------

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


            // ---------------------------------------------
            // Actual / Expected × 100
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

            },


            // ---------------------------------------------
            // Revenue per ticket
            // ---------------------------------------------

            average_revenue_per_ticket: {

              $cond: [

                {
                  $gt: [
                    "$total_tickets_sold",
                    0
                  ]
                },

                {
                  $round: [

                    {
                      $divide: [
                        "$total_actual_revenue",
                        "$total_tickets_sold"
                      ]
                    },

                    2

                  ]
                },

                0

              ]

            },


            // ---------------------------------------------
            // One ticket-sales summary per trip
            //
            // Actual Revenue / Ticket Record Count
            // ---------------------------------------------

            average_revenue_per_trip: {

              $cond: [

                {
                  $gt: [
                    "$total_ticket_records",
                    0
                  ]
                },

                {
                  $round: [

                    {
                      $divide: [
                        "$total_actual_revenue",
                        "$total_ticket_records"
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
      // 2. REVENUE PERFORMANCE BY ROUTE
      // ===================================================

      TicketSale.aggregate([

        // -------------------------------------------------
        // Group Ticket Sales by Route
        // -------------------------------------------------

        {
          $group: {

            _id:
              "$route_id",

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


        // -------------------------------------------------
        // Join Route details
        // -------------------------------------------------

        {
          $lookup: {

            from:
              "routes",

            localField:
              "_id",

            foreignField:
              "route_id",

            as:
              "route"

          }
        },


        {
          $unwind:
            "$route"
        },


        // -------------------------------------------------
        // Create formatted Route revenue result
        // -------------------------------------------------

        {
          $project: {

            _id:
              0,

            route_id:
              "$_id",

            route_number:
              "$route.route_number",

            origin:
              "$route.origin",

            destination:
              "$route.destination",

            route_type:
              "$route.route_type",

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

            },


            average_revenue_per_ticket: {

              $cond: [

                {
                  $gt: [
                    "$total_tickets_sold",
                    0
                  ]
                },

                {
                  $round: [

                    {
                      $divide: [
                        "$total_actual_revenue",
                        "$total_tickets_sold"
                      ]
                    },

                    2

                  ]
                },

                0

              ]

            }

          }
        },


        // -------------------------------------------------
        // Stable route ordering
        // -------------------------------------------------

        {
          $sort: {
            route_id:
              1
          }
        }

      ]),


      // ===================================================
      // 3. REVENUE PERFORMANCE BY DEPOT
      // ===================================================

      TicketSale.aggregate([

        {
          $group: {

            _id:
              "$depot_id",

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

            },


            average_revenue_per_ticket: {

              $cond: [

                {
                  $gt: [
                    "$total_tickets_sold",
                    0
                  ]
                },

                {
                  $round: [

                    {
                      $divide: [
                        "$total_actual_revenue",
                        "$total_tickets_sold"
                      ]
                    },

                    2

                  ]
                },

                0

              ]

            }

          }
        },


        // -------------------------------------------------
        // Highest revenue first
        // -------------------------------------------------

        {
          $sort: {
            total_actual_revenue:
              -1
          }
        }

      ]),


      // ===================================================
      // 4. DAILY REVENUE TREND
      // ===================================================

      TicketSale.aggregate([

        // -------------------------------------------------
        // Group Ticket Sales by Date
        // -------------------------------------------------

        {
          $group: {

            _id: {

              $dateToString: {

                format:
                  "%Y-%m-%d",

                date:
                  "$sale_date",

                timezone:
                  "Asia/Colombo"

              }

            },

            ticket_records: {
              $sum:
                1
            },

            tickets_sold: {
              $sum:
                "$tickets_sold"
            },

            actual_revenue: {
              $sum:
                "$total_revenue"
            },

            expected_revenue: {
              $sum:
                "$expected_revenue"
            },

            revenue_difference: {
              $sum:
                "$revenue_difference"
            }

          }
        },


        {
          $project: {

            _id:
              0,

            date:
              "$_id",

            ticket_records:
              1,

            tickets_sold:
              1,

            actual_revenue: {
              $round: [
                "$actual_revenue",
                2
              ]
            },

            expected_revenue: {
              $round: [
                "$expected_revenue",
                2
              ]
            },

            revenue_difference: {
              $round: [
                "$revenue_difference",
                2
              ]
            },


            revenue_achievement_percentage: {

              $cond: [

                {
                  $gt: [
                    "$expected_revenue",
                    0
                  ]
                },

                {
                  $round: [

                    {
                      $multiply: [

                        {
                          $divide: [
                            "$actual_revenue",
                            "$expected_revenue"
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
        },


        // -------------------------------------------------
        // Oldest date → newest date
        // -------------------------------------------------

        {
          $sort: {
            date:
              1
          }
        }

      ])

    ]);


    // =====================================================
    // SAFE SUMMARY
    // =====================================================

    const summary:
      IRevenueAnalyticsSummary =
        summaryResult[0] ?? {

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
            0,

          average_revenue_per_ticket:
            0,

          average_revenue_per_trip:
            0

        };


    // =====================================================
    // ROUTE PERFORMANCE
    // =====================================================

    const routePerformance:
      IRouteRevenuePerformance[] =
        routePerformanceResult;


    // =====================================================
    // DEPOT PERFORMANCE
    // =====================================================

    const depotPerformance:
      IDepotRevenuePerformance[] =
        depotPerformanceResult;


    // =====================================================
    // DAILY TREND
    // =====================================================

    const dailyTrend:
      IRevenueTrendPoint[] =
        dailyTrendResult;


    // =====================================================
    // TOP 10 HIGHEST REVENUE ROUTES
    // =====================================================

    const highestRevenueRoutes:
      IRouteRevenuePerformance[] =
        [...routePerformance]
          .sort(
            (a, b) =>
              b.total_actual_revenue -
              a.total_actual_revenue
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // ROUTES WITH LARGEST NEGATIVE REVENUE DIFFERENCE
    // =====================================================
    //
    // Only negative differences are included.
    //
    // Example:
    //
    // -5000 = larger shortfall than -1000
    //
    // =====================================================

    const largestRevenueShortfallRoutes:
      IRouteRevenuePerformance[] =
        [...routePerformance]
          .filter(
            route =>
              route.total_revenue_difference <
              0
          )
          .sort(
            (a, b) =>
              a.total_revenue_difference -
              b.total_revenue_difference
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // TOP 10 HIGHEST REVENUE DEPOTS
    // =====================================================

    const highestRevenueDepots:
      IDepotRevenuePerformance[] =
        [...depotPerformance]
          .sort(
            (a, b) =>
              b.total_actual_revenue -
              a.total_actual_revenue
          )
          .slice(
            0,
            10
          );


    // =====================================================
    // RETURN COMPLETE REVENUE ANALYTICS
    // =====================================================

    return {

      summary,

      route_performance:
        routePerformance,

      depot_performance:
        depotPerformance,

      daily_trend:
        dailyTrend,

      highest_revenue_routes:
        highestRevenueRoutes,

      largest_revenue_shortfall_routes:
        largestRevenueShortfallRoutes,

      highest_revenue_depots:
        highestRevenueDepots

    };

  };