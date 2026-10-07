import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

import {
  Banknote,
  BusFront,
  Fuel,
  Gauge,
  LoaderCircle,
  RefreshCw,
  Route,
  TriangleAlert,
  Wrench
} from "lucide-react";

import {
  busPerformanceApi
} from "@/api/busPerformance.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  BusPerformanceTable
} from "@/components/bus-performance/bus-performance-table";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

import {
  Badge
} from "@/components/ui/badge";

import {
  Button
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import {
  Skeleton
} from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import type {
  IBusPerformanceAnalytics,
  IIntegratedBusPerformance
} from "@/types/busPerformance.types";

import {
  formatCurrency,
  formatDecimal,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// REVENUE / COST CHART CONFIG
// =========================================================

const revenueCostConfig = {

  revenue: {

    label:
      "Revenue",

    color:
      "var(--chart-1)"

  },

  cost: {

    label:
      "Operating Cost",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// FUEL EFFICIENCY CHART CONFIG
// =========================================================

const efficiencyConfig = {

  efficiency: {

    label:
      "Fuel Efficiency",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================
// MAINTENANCE COST CHART CONFIG
// =========================================================

const maintenanceConfig = {

  cost: {

    label:
      "Maintenance Cost",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// PASSENGER CHART CONFIG
// =========================================================

const passengerConfig = {

  passengers: {

    label:
      "Passengers",

    color:
      "var(--chart-3)"

  }

} satisfies ChartConfig;


// =========================================================
// BUS PERFORMANCE DASHBOARD
// =========================================================

export default function BusPerformanceDashboard() {

  // =======================================================
  // STATE
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IBusPerformanceAnalytics | null
    >(
      null
    );


  const [
    loading,
    setLoading
  ] =
    useState(
      true
    );


  const [
    error,
    setError
  ] =
    useState<
      string | null
    >(
      null
    );


  // =======================================================
  // LOAD ANALYTICS
  // =======================================================

  const loadAnalytics =
    useCallback(
      async (): Promise<void> => {

        setLoading(
          true
        );


        setError(
          null
        );


        try {

          const result =
            await busPerformanceApi.get();


          setAnalytics(
            result
          );

        } catch (
          requestError
        ) {

          setError(
            getApiErrorMessage(
              requestError
            )
          );

        } finally {

          setLoading(
            false
          );

        }

      },
      []
    );


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(
    () => {

      void loadAnalytics();

    },
    [
      loadAnalytics
    ]
  );


  // =======================================================
  // REVENUE VS OPERATING COST DATA
  // =======================================================

  const revenueCostData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return [
          ...analytics.buses
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
          )
          .map(
            bus => ({

              bus:
                bus.bus_id,

              revenue:
                bus.total_revenue,

              cost:
                bus.total_operating_cost

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // FUEL EFFICIENCY DATA
  // =======================================================

  const efficiencyData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_fuel_efficiency_buses
          .map(
            bus => ({

              bus:
                bus.bus_id,

              efficiency:
                bus.fuel_efficiency_km_per_litre

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // MAINTENANCE COST DATA
  // =======================================================

  const maintenanceData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_maintenance_cost_buses
          .map(
            bus => ({

              bus:
                bus.bus_id,

              cost:
                bus.total_maintenance_cost

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // PASSENGER DATA
  // =======================================================

  const passengerData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return [
          ...analytics.buses
        ]
          .sort(
            (
              first,
              second
            ) =>
              second.total_passengers -
              first.total_passengers
          )
          .slice(
            0,
            10
          )
          .map(
            bus => ({

              bus:
                bus.bus_id,

              passengers:
                bus.total_passengers

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // BUSES WITH ACTIVE MAINTENANCE
  // =======================================================

  const busesWithActiveMaintenance =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return 0;

        }


        return analytics.buses.filter(
          bus =>
            bus.in_progress_maintenance >
            0
        ).length;

      },
      [
        analytics
      ]
    );


  // =======================================================
  // PAGE
  // =======================================================

  return (

    <div
      className="
        grid
        gap-6
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <section
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                border
                bg-background
              "
            >

              <Gauge
                className="size-4"
              />

            </div>


            <Badge
              variant="secondary"
            >
              Integrated Analytics
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Integrated Bus Performance
          </h2>


          <p
            className="
              mt-1
              max-w-4xl
              text-sm
              text-muted-foreground
            "
          >
            Combined operational view of fleet, trip, fuel,
            ticket revenue and maintenance information for
            decision support.
          </p>

        </div>


        <Button
          variant="outline"
          disabled={
            loading
          }
          onClick={
            () => {

              void loadAnalytics();

            }
          }
        >

          {
            loading
              ? (

                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                )
              : (

                  <RefreshCw
                    className="size-4"
                  />

                )
          }

          Refresh

        </Button>

      </section>


      {/* ===================================================
          ERROR
      =================================================== */}

      {
        error && (

          <Alert
            variant="destructive"
          >

            <TriangleAlert
              className="size-4"
            />


            <AlertTitle>
              Unable to load Bus Performance Analytics
            </AlertTitle>


            <AlertDescription>
              {error}
            </AlertDescription>

          </Alert>

        )
      }


      {/* ===================================================
          LOADING / CONTENT
      =================================================== */}

      {
        loading &&
        !analytics
          ? (

              <BusPerformanceLoading />

            )
          : analytics
            ? (

                <>

                  {/* =========================================
                      KPI CARDS
                  ========================================= */}

                  <section
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                      xl:grid-cols-4
                    "
                  >

                    <KpiCard

                      title="Buses Analysed"

                      value={
                        formatNumber(
                          analytics
                            .summary
                            .total_buses
                        )
                      }

                      description={`${formatNumber(
                        analytics
                          .summary
                          .total_trips
                      )} integrated Trip records`}

                      icon={
                        BusFront
                      }

                    />


                    <KpiCard

                      title="Ticket Revenue"

                      value={
                        formatCurrency(
                          analytics
                            .summary
                            .total_revenue
                        )
                      }

                      description="Integrated ticket revenue"

                      icon={
                        Banknote
                      }

                    />


                    <KpiCard

                      title="Operating Cost"

                      value={
                        formatCurrency(
                          analytics
                            .summary
                            .total_operating_cost
                        )
                      }

                      description="Fuel plus maintenance cost"

                      icon={
                        Wrench
                      }

                    />


                    <KpiCard

                      title="Operating Balance"

                      value={
                        formatCurrency(
                          analytics
                            .summary
                            .net_operational_balance
                        )
                      }

                      description="Revenue minus tracked operating cost"

                      icon={
                        Gauge
                      }

                    />

                  </section>


                  {/* =========================================
                      INTEGRATED OPERATIONAL SUMMARY
                  ========================================= */}

                  <Card>

                    <CardHeader>

                      <CardTitle>
                        Integrated Operational Summary
                      </CardTitle>


                      <CardDescription>
                        Combined measures from trips, fuel,
                        revenue and maintenance.
                      </CardDescription>

                    </CardHeader>


                    <CardContent
                      className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                      "
                    >

                      <SummaryMetric

                        label="Passengers"

                        value={
                          formatNumber(
                            analytics
                              .summary
                              .total_passengers
                          )
                        }

                        icon={
                          Route
                        }

                      />


                      <SummaryMetric

                        label="Operated Distance"

                        value={`${formatNumber(
                          analytics
                            .summary
                            .total_operated_km,
                          2
                        )} km`}

                        icon={
                          Route
                        }

                      />


                      <SummaryMetric

                        label="Fuel Used"

                        value={`${formatNumber(
                          analytics
                            .summary
                            .total_fuel_litres,
                          2
                        )} L`}

                        icon={
                          Fuel
                        }

                      />


                      <SummaryMetric

                        label="Fuel Cost"

                        value={
                          formatCurrency(
                            analytics
                              .summary
                              .total_fuel_cost,
                            2
                          )
                        }

                        icon={
                          Fuel
                        }

                      />


                      <SummaryMetric

                        label="Maintenance Cost"

                        value={
                          formatCurrency(
                            analytics
                              .summary
                              .total_maintenance_cost,
                            2
                          )
                        }

                        icon={
                          Wrench
                        }

                      />


                      <SummaryMetric

                        label="Overall Fuel Efficiency"

                        value={`${formatDecimal(
                          analytics
                            .summary
                            .overall_fuel_efficiency,
                          2
                        )} km/L`}

                        icon={
                          Gauge
                        }

                      />


                      <SummaryMetric

                        label="Revenue / km"

                        value={
                          formatCurrency(
                            analytics
                              .summary
                              .average_revenue_per_km,
                            2
                          )
                        }

                        icon={
                          Banknote
                        }

                      />


                      <SummaryMetric

                        label="Operating Cost / km"

                        value={
                          formatCurrency(
                            analytics
                              .summary
                              .average_operating_cost_per_km,
                            2
                          )
                        }

                        icon={
                          Gauge
                        }

                      />

                    </CardContent>

                  </Card>


                  {/* =========================================
                      ACTIVE MAINTENANCE INFORMATION
                  ========================================= */}

                  {
                    busesWithActiveMaintenance >
                      0 && (

                      <Alert>

                        <Wrench
                          className="size-4"
                        />


                        <AlertTitle>
                          Active maintenance information
                        </AlertTitle>


                        <AlertDescription>
                          {
                            formatNumber(
                              busesWithActiveMaintenance
                            )
                          } bus record(s) currently have at
                          least one in-progress maintenance
                          record. This is an operational
                          attention indicator.
                        </AlertDescription>

                      </Alert>

                    )
                  }


                  {/* =========================================
                      REVENUE VS OPERATING COST
                  ========================================= */}

                  <Card>

                    <CardHeader>

                      <CardTitle>
                        Revenue vs Operating Cost
                      </CardTitle>


                      <CardDescription>
                        Comparison for buses with the
                        highest recorded ticket revenue.
                      </CardDescription>

                    </CardHeader>


                    <CardContent>

                      <ChartContainer
                        config={
                          revenueCostConfig
                        }
                        className="
                          h-[360px]
                          w-full
                        "
                      >

                        <BarChart
                          accessibilityLayer
                          data={
                            revenueCostData
                          }
                        >

                          <CartesianGrid
                            vertical={
                              false
                            }
                          />


                          <XAxis
                            dataKey="bus"
                            tickLine={
                              false
                            }
                            axisLine={
                              false
                            }
                          />


                          <YAxis
                            tickLine={
                              false
                            }
                            axisLine={
                              false
                            }
                          />


                          <ChartTooltip
                            content={
                              <ChartTooltipContent />
                            }
                          />


                          <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={
                              4
                            }
                          />


                          <Bar
                            dataKey="cost"
                            fill="var(--color-cost)"
                            radius={
                              4
                            }
                          />

                        </BarChart>

                      </ChartContainer>

                    </CardContent>

                  </Card>


                  {/* =========================================
                      FUEL EFFICIENCY + PASSENGER VOLUME
                  ========================================= */}

                  <section
                    className="
                      grid
                      gap-4
                      xl:grid-cols-2
                    "
                  >

                    {/* =======================================
                        FUEL EFFICIENCY
                    ======================================= */}

                    <Card>

                      <CardHeader>

                        <CardTitle>
                          Fuel Efficiency
                        </CardTitle>


                        <CardDescription>
                          Buses with the highest calculated
                          kilometres-per-litre values.
                        </CardDescription>

                      </CardHeader>


                      <CardContent>

                        <ChartContainer
                          config={
                            efficiencyConfig
                          }
                          className="
                            h-[330px]
                            w-full
                          "
                        >

                          <BarChart
                            accessibilityLayer
                            data={
                              efficiencyData
                            }
                          >

                            <CartesianGrid
                              vertical={
                                false
                              }
                            />


                            <XAxis
                              dataKey="bus"
                              tickLine={
                                false
                              }
                              axisLine={
                                false
                              }
                            />


                            <YAxis
                              tickLine={
                                false
                              }
                              axisLine={
                                false
                              }
                            />


                            <ChartTooltip
                              content={
                                <ChartTooltipContent />
                              }
                            />


                            <Bar
                              dataKey="efficiency"
                              fill="var(--color-efficiency)"
                              radius={
                                5
                              }
                            />

                          </BarChart>

                        </ChartContainer>

                      </CardContent>

                    </Card>


                    {/* =======================================
                        PASSENGER VOLUME
                    ======================================= */}

                    <Card>

                      <CardHeader>

                        <CardTitle>
                          Passenger Volume
                        </CardTitle>


                        <CardDescription>
                          Buses with the highest recorded
                          passenger totals.
                        </CardDescription>

                      </CardHeader>


                      <CardContent>

                        <ChartContainer
                          config={
                            passengerConfig
                          }
                          className="
                            h-[330px]
                            w-full
                          "
                        >

                          <BarChart
                            accessibilityLayer
                            data={
                              passengerData
                            }
                          >

                            <CartesianGrid
                              vertical={
                                false
                              }
                            />


                            <XAxis
                              dataKey="bus"
                              tickLine={
                                false
                              }
                              axisLine={
                                false
                              }
                            />


                            <YAxis
                              allowDecimals={
                                false
                              }
                              tickLine={
                                false
                              }
                              axisLine={
                                false
                              }
                            />


                            <ChartTooltip
                              content={
                                <ChartTooltipContent />
                              }
                            />


                            <Bar
                              dataKey="passengers"
                              fill="var(--color-passengers)"
                              radius={
                                5
                              }
                            />

                          </BarChart>

                        </ChartContainer>

                      </CardContent>

                    </Card>

                  </section>


                  {/* =========================================
                      MAINTENANCE COST
                  ========================================= */}

                  <Card>

                    <CardHeader>

                      <CardTitle>
                        Maintenance Cost by Bus
                      </CardTitle>


                      <CardDescription>
                        Buses with the highest recorded
                        maintenance expenditure.
                      </CardDescription>

                    </CardHeader>


                    <CardContent>

                      <ChartContainer
                        config={
                          maintenanceConfig
                        }
                        className="
                          h-[340px]
                          w-full
                        "
                      >

                        <BarChart
                          accessibilityLayer
                          data={
                            maintenanceData
                          }
                        >

                          <CartesianGrid
                            vertical={
                              false
                            }
                          />


                          <XAxis
                            dataKey="bus"
                            tickLine={
                              false
                            }
                            axisLine={
                              false
                            }
                          />


                          <YAxis
                            tickLine={
                              false
                            }
                            axisLine={
                              false
                            }
                          />


                          <ChartTooltip
                            content={
                              <ChartTooltipContent />
                            }
                          />


                          <Bar
                            dataKey="cost"
                            fill="var(--color-cost)"
                            radius={
                              5
                            }
                          />

                        </BarChart>

                      </ChartContainer>

                    </CardContent>

                  </Card>


                  {/* =========================================
                      HIGHEST REVENUE TABLE
                  ========================================= */}

                  <PerformanceSummaryTable

                    title="Highest Revenue Buses"

                    description="Buses ordered by recorded ticket revenue."

                    records={
                      analytics
                        .highest_revenue_buses
                    }

                  />


                  {/* =========================================
                      HIGHEST OPERATING COST TABLE
                  ========================================= */}

                  <PerformanceSummaryTable

                    title="Highest Operating Cost Buses"

                    description="Buses with the largest combined tracked fuel and maintenance costs."

                    records={
                      analytics
                        .highest_operating_cost_buses
                    }

                  />


                  {/* =========================================
                      COMPLETE PERFORMANCE TABLE
                  ========================================= */}

                  <Card>

                    <CardHeader>

                      <CardTitle>
                        Complete Bus Performance Data
                      </CardTitle>


                      <CardDescription>
                        Search, filter and compare integrated
                        operational measures for all buses.
                      </CardDescription>

                    </CardHeader>


                    <CardContent>

                      <BusPerformanceTable
                        records={
                          analytics.buses
                        }
                      />

                    </CardContent>

                  </Card>

                </>

              )
            : null
      }

    </div>

  );

}


// =========================================================
// SUMMARY METRIC PROPS
// =========================================================

interface ISummaryMetricProps {

  label: string;

  value: string;

  icon:
    ComponentType<{
      className?: string;
    }>;

}


// =========================================================
// SUMMARY METRIC
// =========================================================

function SummaryMetric(
  {
    label,
    value,
    icon: Icon
  }: ISummaryMetricProps
) {

  return (

    <div
      className="
        flex
        items-start
        gap-3
        rounded-lg
        border
        bg-background
        p-4
      "
    >

      <div
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-md
          bg-muted
        "
      >

        <Icon
          className="size-4"
        />

      </div>


      <div>

        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          {label}
        </p>


        <p
          className="
            mt-1
            text-lg
            font-semibold
          "
        >
          {value}
        </p>

      </div>

    </div>

  );

}


// =========================================================
// PERFORMANCE SUMMARY TABLE PROPS
// =========================================================

interface IPerformanceSummaryTableProps {

  title: string;

  description: string;

  records:
    IIntegratedBusPerformance[];

}


// =========================================================
// PERFORMANCE SUMMARY TABLE
// =========================================================

function PerformanceSummaryTable(
  {
    title,
    description,
    records
  }: IPerformanceSummaryTableProps
) {

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          {title}
        </CardTitle>


        <CardDescription>
          {description}
        </CardDescription>

      </CardHeader>


      <CardContent>

        <div
          className="
            overflow-x-auto
          "
        >

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Bus
                </TableHead>

                <TableHead>
                  Depot
                </TableHead>

                <TableHead>
                  Trips
                </TableHead>

                <TableHead>
                  Revenue
                </TableHead>

                <TableHead>
                  Fuel Cost
                </TableHead>

                <TableHead>
                  Maintenance Cost
                </TableHead>

                <TableHead>
                  Operating Cost
                </TableHead>

                <TableHead
                  className="text-right"
                >
                  Balance
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.length >
                  0
                  ? records.map(
                      record => (

                        <TableRow
                          key={
                            record.bus_id
                          }
                        >

                          {/* BUS */}

                          <TableCell>

                            <div
                              className="font-medium"
                            >
                              {record.bus_id}
                            </div>


                            <div
                              className="
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {
                                record.registration_no
                              }
                            </div>

                          </TableCell>


                          {/* DEPOT */}

                          <TableCell>
                            {record.depot_id}
                          </TableCell>


                          {/* TRIPS */}

                          <TableCell>
                            {
                              formatNumber(
                                record.total_trips
                              )
                            }
                          </TableCell>


                          {/* REVENUE */}

                          <TableCell>
                            {
                              formatCurrency(
                                record.total_revenue,
                                2
                              )
                            }
                          </TableCell>


                          {/* FUEL COST */}

                          <TableCell>
                            {
                              formatCurrency(
                                record.total_fuel_cost,
                                2
                              )
                            }
                          </TableCell>


                          {/* MAINTENANCE COST */}

                          <TableCell>
                            {
                              formatCurrency(
                                record.total_maintenance_cost,
                                2
                              )
                            }
                          </TableCell>


                          {/* OPERATING COST */}

                          <TableCell>
                            {
                              formatCurrency(
                                record.total_operating_cost,
                                2
                              )
                            }
                          </TableCell>


                          {/* BALANCE */}

                          <TableCell
                            className="text-right"
                          >
                            {
                              formatCurrency(
                                record.net_operational_balance,
                                2
                              )
                            }
                          </TableCell>

                        </TableRow>

                      )
                    )
                  : (

                      <TableRow>

                        <TableCell
                          colSpan={
                            8
                          }
                          className="
                            h-24
                            text-center
                            text-muted-foreground
                          "
                        >
                          No bus performance data available.
                        </TableCell>

                      </TableRow>

                    )
              }

            </TableBody>

          </Table>

        </div>

      </CardContent>

    </Card>

  );

}


// =========================================================
// LOADING STATE
// =========================================================

function BusPerformanceLoading() {

  return (

    <div
      className="
        grid
        gap-6
      "
    >

      {/* ===================================================
          KPI SKELETONS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {
          Array.from(
            {
              length:
                4
            }
          ).map(
            (
              _,
              index
            ) => (

              <Skeleton
                key={
                  index
                }
                className="
                  h-36
                  w-full
                  rounded-xl
                "
              />

            )
          )
        }

      </div>


      {/* ===================================================
          SUMMARY SKELETON
      =================================================== */}

      <Skeleton
        className="
          h-[260px]
          w-full
          rounded-xl
        "
      />


      {/* ===================================================
          CHART SKELETONS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          xl:grid-cols-2
        "
      >

        <Skeleton
          className="
            h-[390px]
            w-full
            rounded-xl
          "
        />


        <Skeleton
          className="
            h-[390px]
            w-full
            rounded-xl
          "
        />

      </div>

    </div>

  );

}