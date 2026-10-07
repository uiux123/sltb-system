import {
  apiClient
} from "@/api/apiClient";

import type {
  IBusPerformanceAnalytics,
  IBusPerformanceSummary,
  IIntegratedBusPerformance
} from "@/types/busPerformance.types";


// =========================================================
// API RESPONSE
// =========================================================

interface IBusPerformanceResponse {

  success: boolean;

  message?: string;

  data: unknown;

}


// =========================================================
// GENERIC RECORD
// =========================================================

type UnknownRecord =
  Record<string, unknown>;


// =========================================================
// AS RECORD
// =========================================================

function asRecord(
  value: unknown
): UnknownRecord {

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(
      value
    )
  ) {

    return value as UnknownRecord;

  }


  return {};

}


// =========================================================
// READ STRING
// =========================================================

function readString(
  record: UnknownRecord,
  keys: string[],
  fallback = ""
): string {

  for (
    const key of keys
  ) {

    const value =
      record[key];


    if (
      typeof value ===
      "string"
    ) {

      return value;

    }

  }


  return fallback;

}


// =========================================================
// READ NUMBER
// =========================================================

function readNumber(
  record: UnknownRecord,
  keys: string[],
  fallback = 0
): number {

  for (
    const key of keys
  ) {

    const value =
      record[key];


    if (
      typeof value ===
        "number" &&
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  return fallback;

}


// =========================================================
// READ OPTIONAL NUMBER
// =========================================================

function readOptionalNumber(
  record: UnknownRecord,
  keys: string[]
): number | undefined {

  for (
    const key of keys
  ) {

    const value =
      record[key];


    if (
      typeof value ===
        "number" &&
      Number.isFinite(
        value
      )
    ) {

      return value;

    }

  }


  return undefined;

}


// =========================================================
// READ ARRAY
// =========================================================

function readArray(
  record: UnknownRecord,
  key: string
): unknown[] {

  const value =
    record[key];


  return Array.isArray(
    value
  )
    ? value
    : [];

}


// =========================================================
// SAFE DIVIDE
// =========================================================

function safeDivide(
  numerator: number,
  denominator: number
): number {

  if (
    denominator <=
    0
  ) {

    return 0;

  }


  return Number(
    (
      numerator /
      denominator
    ).toFixed(
      2
    )
  );

}


// =========================================================
// NORMALIZE ONE BUS
// =========================================================

function normalizeBus(
  value: unknown
): IIntegratedBusPerformance {

  const record =
    asRecord(
      value
    );


  const totalOperatedKm =
    readNumber(
      record,
      [
        "total_operated_km",
        "operated_km"
      ]
    );


  const totalFuelLitres =
    readNumber(
      record,
      [
        "total_fuel_litres",
        "fuel_litres"
      ]
    );


  const totalFuelCost =
    readNumber(
      record,
      [
        "total_fuel_cost",
        "fuel_cost"
      ]
    );


  const totalMaintenanceCost =
    readNumber(
      record,
      [
        "total_maintenance_cost",
        "maintenance_cost"
      ]
    );


  const totalRevenue =
    readNumber(
      record,
      [
        "total_revenue",
        "total_ticket_revenue",
        "ticket_revenue"
      ]
    );


  const expectedRevenue =
    readNumber(
      record,
      [
        "expected_revenue",
        "total_expected_revenue"
      ]
    );


  const providedOperatingCost =
    readOptionalNumber(
      record,
      [
        "total_operating_cost",
        "total_operational_cost",
        "operating_cost"
      ]
    );


  const totalOperatingCost =

    providedOperatingCost ??
    (
      totalFuelCost +
      totalMaintenanceCost
    );


  const providedBalance =
    readOptionalNumber(
      record,
      [
        "net_operational_balance",
        "operational_balance",
        "net_balance"
      ]
    );


  const netOperationalBalance =

    providedBalance ??
    (
      totalRevenue -
      totalOperatingCost
    );


  const providedFuelEfficiency =
    readOptionalNumber(
      record,
      [
        "fuel_efficiency_km_per_litre",
        "km_per_litre",
        "average_km_per_litre"
      ]
    );


  const fuelEfficiency =

    providedFuelEfficiency ??
    safeDivide(
      totalOperatedKm,
      totalFuelLitres
    );


  const providedFuelCostPerKm =
    readOptionalNumber(
      record,
      [
        "fuel_cost_per_km"
      ]
    );


  const fuelCostPerKm =

    providedFuelCostPerKm ??
    safeDivide(
      totalFuelCost,
      totalOperatedKm
    );


  const providedRevenuePerKm =
    readOptionalNumber(
      record,
      [
        "revenue_per_km"
      ]
    );


  const revenuePerKm =

    providedRevenuePerKm ??
    safeDivide(
      totalRevenue,
      totalOperatedKm
    );


  const providedRevenueDifference =
    readOptionalNumber(
      record,
      [
        "revenue_difference",
        "total_revenue_difference"
      ]
    );


  const revenueDifference =

    providedRevenueDifference ??
    (
      expectedRevenue -
      totalRevenue
    );


  return {

    bus_id:
      readString(
        record,
        [
          "bus_id"
        ]
      ),

    registration_no:
      readString(
        record,
        [
          "registration_no"
        ],
        "-"
      ),

    depot_id:
      readString(
        record,
        [
          "depot_id"
        ],
        "-"
      ),

    manufacturer:
      readString(
        record,
        [
          "manufacturer"
        ],
        "-"
      ),

    model:
      readString(
        record,
        [
          "model"
        ],
        "-"
      ),

    bus_status:
      readString(
        record,
        [
          "bus_status",
          "status"
        ],
        "Unknown"
      ),

    fuel_type:
      readString(
        record,
        [
          "fuel_type"
        ],
        "-"
      ),

    total_trips:
      readNumber(
        record,
        [
          "total_trips",
          "trip_count"
        ]
      ),

    total_passengers:
      readNumber(
        record,
        [
          "total_passengers",
          "passenger_count"
        ]
      ),

    total_operated_km:
      totalOperatedKm,

    average_delay_minutes:
      readNumber(
        record,
        [
          "average_delay_minutes",
          "avg_delay_minutes",
          "average_delay"
        ]
      ),

    average_load_factor_percentage:
      readNumber(
        record,
        [
          "average_load_factor_percentage",
          "average_load_factor",
          "load_factor_percentage"
        ]
      ),

    total_fuel_litres:
      totalFuelLitres,

    total_fuel_cost:
      totalFuelCost,

    fuel_efficiency_km_per_litre:
      fuelEfficiency,

    fuel_cost_per_km:
      fuelCostPerKm,

    total_revenue:
      totalRevenue,

    expected_revenue:
      expectedRevenue,

    revenue_difference:
      revenueDifference,

    revenue_per_km:
      revenuePerKm,

    total_maintenance_records:
      readNumber(
        record,
        [
          "total_maintenance_records",
          "maintenance_count"
        ]
      ),

    in_progress_maintenance:
      readNumber(
        record,
        [
          "in_progress_maintenance",
          "active_maintenance"
        ]
      ),

    total_maintenance_cost:
      totalMaintenanceCost,

    total_downtime_hours:
      readNumber(
        record,
        [
          "total_downtime_hours",
          "downtime_hours"
        ]
      ),

    total_operating_cost:
      totalOperatingCost,

    net_operational_balance:
      netOperationalBalance

  };

}


// =========================================================
// COLLECT BUS ARRAY
// =========================================================

function collectBusRecords(
  value: unknown
): IIntegratedBusPerformance[] {

  if (
    Array.isArray(
      value
    )
  ) {

    return value
      .map(
        normalizeBus
      )
      .filter(
        bus =>
          bus.bus_id.length >
          0
      );

  }


  const root =
    asRecord(
      value
    );


  const candidateKeys = [

    "bus_performance",

    "bus_performance_data",

    "integrated_bus_performance",

    "performance",

    "buses",

    "all_buses",

    "highest_revenue_buses",

    "highest_operating_cost_buses",

    "highest_fuel_efficiency_buses",

    "highest_maintenance_cost_buses"

  ];


  const allItems:
    unknown[] = [];


  for (
    const key of candidateKeys
  ) {

    allItems.push(
      ...readArray(
        root,
        key
      )
    );

  }


  const normalized =
    allItems
      .map(
        normalizeBus
      )
      .filter(
        bus =>
          bus.bus_id.length >
          0
      );


  const unique =
    new Map<
      string,
      IIntegratedBusPerformance
    >();


  for (
    const bus of normalized
  ) {

    if (
      !unique.has(
        bus.bus_id
      )
    ) {

      unique.set(
        bus.bus_id,
        bus
      );

    }

  }


  return Array.from(
    unique.values()
  );

}


// =========================================================
// DERIVE SUMMARY
// =========================================================

function deriveSummary(
  buses:
    IIntegratedBusPerformance[]
): IBusPerformanceSummary {

  const totals =
    buses.reduce(
      (
        result,
        bus
      ) => {

        result.total_trips +=
          bus.total_trips;

        result.total_passengers +=
          bus.total_passengers;

        result.total_operated_km +=
          bus.total_operated_km;

        result.total_fuel_litres +=
          bus.total_fuel_litres;

        result.total_fuel_cost +=
          bus.total_fuel_cost;

        result.total_revenue +=
          bus.total_revenue;

        result.total_maintenance_cost +=
          bus.total_maintenance_cost;

        result.total_operating_cost +=
          bus.total_operating_cost;

        result.net_operational_balance +=
          bus.net_operational_balance;


        return result;

      },
      {

        total_trips:
          0,

        total_passengers:
          0,

        total_operated_km:
          0,

        total_fuel_litres:
          0,

        total_fuel_cost:
          0,

        total_revenue:
          0,

        total_maintenance_cost:
          0,

        total_operating_cost:
          0,

        net_operational_balance:
          0

      }
    );


  return {

    total_buses:
      buses.length,

    ...totals,

    overall_fuel_efficiency:
      safeDivide(
        totals.total_operated_km,
        totals.total_fuel_litres
      ),

    average_revenue_per_km:
      safeDivide(
        totals.total_revenue,
        totals.total_operated_km
      ),

    average_operating_cost_per_km:
      safeDivide(
        totals.total_operating_cost,
        totals.total_operated_km
      )

  };

}


// =========================================================
// NORMALIZE SUMMARY
// =========================================================

function normalizeSummary(
  value: unknown,
  derived:
    IBusPerformanceSummary
): IBusPerformanceSummary {

  const root =
    asRecord(
      value
    );


  const summary =
    asRecord(
      root.summary
    );


  return {

    total_buses:
      readNumber(
        summary,
        [
          "total_buses"
        ],
        derived.total_buses
      ),

    total_trips:
      readNumber(
        summary,
        [
          "total_trips"
        ],
        derived.total_trips
      ),

    total_passengers:
      readNumber(
        summary,
        [
          "total_passengers"
        ],
        derived.total_passengers
      ),

    total_operated_km:
      readNumber(
        summary,
        [
          "total_operated_km"
        ],
        derived.total_operated_km
      ),

    total_fuel_litres:
      readNumber(
        summary,
        [
          "total_fuel_litres"
        ],
        derived.total_fuel_litres
      ),

    total_fuel_cost:
      readNumber(
        summary,
        [
          "total_fuel_cost"
        ],
        derived.total_fuel_cost
      ),

    total_revenue:
      readNumber(
        summary,
        [
          "total_revenue",
          "total_ticket_revenue"
        ],
        derived.total_revenue
      ),

    total_maintenance_cost:
      readNumber(
        summary,
        [
          "total_maintenance_cost"
        ],
        derived.total_maintenance_cost
      ),

    total_operating_cost:
      readNumber(
        summary,
        [
          "total_operating_cost",
          "total_operational_cost"
        ],
        derived.total_operating_cost
      ),

    net_operational_balance:
      readNumber(
        summary,
        [
          "net_operational_balance",
          "operational_balance"
        ],
        derived.net_operational_balance
      ),

    overall_fuel_efficiency:
      readNumber(
        summary,
        [
          "overall_fuel_efficiency",
          "overall_km_per_litre"
        ],
        derived.overall_fuel_efficiency
      ),

    average_revenue_per_km:
      readNumber(
        summary,
        [
          "average_revenue_per_km",
          "revenue_per_km"
        ],
        derived.average_revenue_per_km
      ),

    average_operating_cost_per_km:
      readNumber(
        summary,
        [
          "average_operating_cost_per_km",
          "operating_cost_per_km"
        ],
        derived.average_operating_cost_per_km
      )

  };

}


// =========================================================
// NORMALIZE COMPLETE ANALYTICS
// =========================================================

function normalizeBusPerformanceAnalytics(
  value: unknown
): IBusPerformanceAnalytics {

  const buses =
    collectBusRecords(
      value
    );


  const derivedSummary =
    deriveSummary(
      buses
    );


  const summary =
    normalizeSummary(
      value,
      derivedSummary
    );


  const highestRevenueBuses =
    [
      ...buses
    ]
      .sort(
        (
          first,
          second
        ) =>
          second.total_revenue -
          first.total_revenue
      )
      .slice(
        0,
        10
      );


  const highestOperatingCostBuses =
    [
      ...buses
    ]
      .sort(
        (
          first,
          second
        ) =>
          second.total_operating_cost -
          first.total_operating_cost
      )
      .slice(
        0,
        10
      );


  const highestFuelEfficiencyBuses =
    buses
      .filter(
        bus =>
          bus.fuel_efficiency_km_per_litre >
          0
      )
      .sort(
        (
          first,
          second
        ) =>
          second.fuel_efficiency_km_per_litre -
          first.fuel_efficiency_km_per_litre
      )
      .slice(
        0,
        10
      );


  const highestMaintenanceCostBuses =
    [
      ...buses
    ]
      .sort(
        (
          first,
          second
        ) =>
          second.total_maintenance_cost -
          first.total_maintenance_cost
      )
      .slice(
        0,
        10
      );


  return {

    summary,

    buses,

    highest_revenue_buses:
      highestRevenueBuses,

    highest_operating_cost_buses:
      highestOperatingCostBuses,

    highest_fuel_efficiency_buses:
      highestFuelEfficiencyBuses,

    highest_maintenance_cost_buses:
      highestMaintenanceCostBuses

  };

}


// =========================================================
// GET BUS PERFORMANCE
// =========================================================

const getBusPerformance =
  async (): Promise<IBusPerformanceAnalytics> => {

    const response =
      await apiClient.get<
        IBusPerformanceResponse
      >(
        "/analytics/bus-performance"
      );


    return normalizeBusPerformanceAnalytics(
      response.data.data
    );

  };


// =========================================================
// EXPORT
// =========================================================

export const busPerformanceApi = {

  get:
    getBusPerformance

};