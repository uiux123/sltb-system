import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";

import {
  Banknote,
  BusFront,
  Clock3,
  Fuel,
  Gauge,
  LayoutDashboard,
  LoaderCircle,
  MapPinned,
  PackageSearch,
  RefreshCw,
  Route,
  Ticket,
  TriangleAlert,
  Users,
  Wrench
} from "lucide-react";

import {
  analyticsApi
} from "@/api/analytics.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

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

import type {
  IOverviewAnalytics
} from "@/types/analytics.types";

import {
  formatCurrency,
  formatDecimal,
  formatHours,
  formatKilometres,
  formatNumber,
  formatPercentage
} from "@/utils/formatters";


// =========================================================
// CHART CONFIGURATIONS
// =========================================================

const fleetChartConfig = {

  operational: {

    label:
      "Operational",

    color:
      "var(--chart-1)"

  },

  underMaintenance: {

    label:
      "Under Maintenance",

    color:
      "var(--chart-2)"

  },

  breakdown: {

    label:
      "Breakdown",

    color:
      "var(--chart-3)"

  },

  outOfService: {

    label:
      "Out of Service",

    color:
      "var(--chart-4)"

  }

} satisfies ChartConfig;


// =========================================================

const maintenanceChartConfig = {

  completed: {

    label:
      "Completed",

    color:
      "var(--chart-1)"

  },

  inProgress: {

    label:
      "In Progress",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================

const inventoryChartConfig = {

  count: {

    label:
      "Part Records",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const revenueChartConfig = {

  actual: {

    label:
      "Actual Revenue",

    color:
      "var(--chart-1)"

  },

  expected: {

    label:
      "Expected Revenue",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// OVERVIEW DASHBOARD
// =========================================================

export default function OverviewDashboard() {

  const [
    overview,
    setOverview
  ] =
    useState<
      IOverviewAnalytics | null
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
  // LOAD OVERVIEW ANALYTICS
  // =======================================================

  const loadOverview =
    useCallback(
      async () => {

        setLoading(
          true
        );

        setError(
          null
        );


        try {

          const result =
            await analyticsApi.getOverview();


          setOverview(
            result
          );

        } catch (
          requestError
        ) {

          setOverview(
            null
          );


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

      void loadOverview();

    },
    [
      loadOverview
    ]
  );


  // =======================================================
  // FLEET CHART DATA
  // =======================================================

  const fleetStatusData =
    useMemo(
      () => {

        if (
          !overview
        ) {

          return [];

        }


        return [

          {
            status:
              "operational",

            count:
              overview
                .fleet
                .operational_buses,

            fill:
              "var(--color-operational)"
          },

          {
            status:
              "underMaintenance",

            count:
              overview
                .fleet
                .under_maintenance_buses,

            fill:
              "var(--color-underMaintenance)"
          },

          {
            status:
              "breakdown",

            count:
              overview
                .fleet
                .breakdown_buses,

            fill:
              "var(--color-breakdown)"
          },

          {
            status:
              "outOfService",

            count:
              overview
                .fleet
                .out_of_service_buses,

            fill:
              "var(--color-outOfService)"
          }

        ].filter(
          item =>
            item.count >
            0
        );

      },
      [
        overview
      ]
    );


  // =======================================================
  // MAINTENANCE CHART DATA
  // =======================================================

  const maintenanceStatusData =
    useMemo(
      () => {

        if (
          !overview
        ) {

          return [];

        }


        return [

          {
            status:
              "completed",

            count:
              overview
                .maintenance
                .completed_maintenance,

            fill:
              "var(--color-completed)"
          },

          {
            status:
              "inProgress",

            count:
              overview
                .maintenance
                .in_progress_maintenance,

            fill:
              "var(--color-inProgress)"
          }

        ];

      },
      [
        overview
      ]
    );


  // =======================================================
  // INVENTORY CHART DATA
  // =======================================================

  const inventoryStatusData =
    useMemo(
      () => {

        if (
          !overview
        ) {

          return [];

        }


        return [

          {
            status:
              "Available",

            count:
              overview
                .inventory
                .available_parts
          },

          {
            status:
              "Low Stock",

            count:
              overview
                .inventory
                .low_stock_parts
          },

          {
            status:
              "Out of Stock",

            count:
              overview
                .inventory
                .out_of_stock_parts
          }

        ];

      },
      [
        overview
      ]
    );


  // =======================================================
  // REVENUE CHART DATA
  // =======================================================

  const revenueComparisonData =
    useMemo(
      () => {

        if (
          !overview
        ) {

          return [];

        }


        return [

          {
            category:
              "Revenue",

            actual:
              overview
                .revenue
                .total_actual_revenue,

            expected:
              overview
                .revenue
                .total_expected_revenue
          }

        ];

      },
      [
        overview
      ]
    );


  // =======================================================
  // LOADING SCREEN
  // =======================================================

  if (
    loading &&
    !overview
  ) {

    return (

      <OverviewLoading />

    );

  }


  // =======================================================
  // ERROR SCREEN
  // =======================================================

  if (
    error &&
    !overview
  ) {

    return (

      <div
        className="
          grid
          gap-6
        "
      >

        <PageHeading
          refreshing={
            false
          }
          onRefresh={
            () => {

              void loadOverview();

            }
          }
        />


        <Alert
          variant="destructive"
        >

          <TriangleAlert
            className="size-4"
          />


          <AlertTitle>
            Unable to load overview analytics
          </AlertTitle>


          <AlertDescription
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span>
              {error}
            </span>


            <Button
              variant="outline"
              size="sm"
              onClick={
                () => {

                  void loadOverview();

                }
              }
            >

              <RefreshCw
                className="size-4"
              />

              Retry

            </Button>

          </AlertDescription>

        </Alert>

      </div>

    );

  }


  // =======================================================
  // SAFETY
  // =======================================================

  if (
    !overview
  ) {

    return null;

  }


  // =======================================================
  // DASHBOARD
  // =======================================================

  return (

    <div
      className="
        grid
        gap-6
      "
    >

      {/* ===================================================
          PAGE HEADING
      =================================================== */}

      <PageHeading
        refreshing={
          loading
        }
        onRefresh={
          () => {

            void loadOverview();

          }
        }
      />


      {/* ===================================================
          REFRESH ERROR
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
              Refresh failed
            </AlertTitle>


            <AlertDescription>
              {error}
            </AlertDescription>

          </Alert>

        )
      }


      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <section
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <KpiCard

          title="Total Depots"

          value={
            formatNumber(
              overview
                .network
                .total_depots
            )
          }

          description="Depots represented in the operational database"

          icon={
            MapPinned
          }

        />


        <KpiCard

          title="Total Routes"

          value={
            formatNumber(
              overview
                .network
                .total_routes
            )
          }

          description="Routes available for network analysis"

          icon={
            Route
          }

        />


        <KpiCard

          title="Total Buses"

          value={
            formatNumber(
              overview
                .fleet
                .total_buses
            )
          }

          description="Vehicles represented in the fleet dataset"

          icon={
            BusFront
          }

        />


        <KpiCard

          title="Fleet Availability"

          value={
            formatPercentage(
              overview
                .fleet
                .fleet_availability_percentage
            )
          }

          description="Percentage of buses currently marked Operational"

          icon={
            Gauge
          }

        />


        <KpiCard

          title="Total Trips"

          value={
            formatNumber(
              overview
                .operations
                .total_trips
            )
          }

          description={`${formatNumber(
            overview
              .operations
              .completed_trips
          )} completed trips`}

          icon={
            LayoutDashboard
          }

        />


        <KpiCard

          title="Passengers"

          value={
            formatNumber(
              overview
                .operations
                .total_passengers
            )
          }

          description="Total passenger count across recorded trips"

          icon={
            Users
          }

        />


        <KpiCard

          title="Ticket Revenue"

          value={
            formatCurrency(
              overview
                .revenue
                .total_actual_revenue
            )
          }

          description={`${formatNumber(
            overview
              .revenue
              .total_tickets_sold
          )} recorded tickets sold`}

          icon={
            Banknote
          }

        />


        <KpiCard

          title="Inventory Value"

          value={
            formatCurrency(
              overview
                .inventory
                .total_inventory_value
            )
          }

          description={`${formatNumber(
            overview
              .inventory
              .total_units_in_stock
          )} spare-part units currently in stock`}

          icon={
            PackageSearch
          }

        />

      </section>


      {/* ===================================================
          CHART ROW 1
      =================================================== */}

      <section
        className="
          grid
          gap-4
          xl:grid-cols-2
        "
      >

        {/* =================================================
            FLEET STATUS
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle>
              Fleet Status
            </CardTitle>


            <CardDescription>
              Current distribution of buses by operational
              status.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <ChartContainer
              config={
                fleetChartConfig
              }
              className="
                mx-auto
                h-[280px]
                w-full
                max-w-[420px]
              "
            >

              <PieChart>

                <ChartTooltip
                  cursor={
                    false
                  }
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="status"
                    />
                  }
                />


                <Pie
                  data={
                    fleetStatusData
                  }
                  dataKey="count"
                  nameKey="status"
                  innerRadius={
                    65
                  }
                  outerRadius={
                    100
                  }
                  strokeWidth={
                    4
                  }
                />

              </PieChart>

            </ChartContainer>


            <div
              className="
                mt-4
                grid
                gap-2
                sm:grid-cols-2
              "
            >

              <StatusItem
                label="Operational"
                value={
                  overview
                    .fleet
                    .operational_buses
                }
              />


              <StatusItem
                label="Under Maintenance"
                value={
                  overview
                    .fleet
                    .under_maintenance_buses
                }
              />


              <StatusItem
                label="Breakdown"
                value={
                  overview
                    .fleet
                    .breakdown_buses
                }
              />


              <StatusItem
                label="Out of Service"
                value={
                  overview
                    .fleet
                    .out_of_service_buses
                }
              />

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            REVENUE COMPARISON
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle>
              Actual vs Expected Revenue
            </CardTitle>


            <CardDescription>
              Comparison of recorded ticket revenue with
              expected revenue.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <ChartContainer
              config={
                revenueChartConfig
              }
              className="
                h-[280px]
                w-full
              "
            >

              <BarChart
                accessibilityLayer
                data={
                  revenueComparisonData
                }
              >

                <CartesianGrid
                  vertical={
                    false
                  }
                />


                <XAxis
                  dataKey="category"
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
                  tickFormatter={
                    value =>
                      formatNumber(
                        Number(
                          value
                        )
                      )
                  }
                />


                <ChartTooltip
                  content={
                    <ChartTooltipContent />
                  }
                />


                <Bar
                  dataKey="actual"
                  fill="var(--color-actual)"
                  radius={
                    6
                  }
                />


                <Bar
                  dataKey="expected"
                  fill="var(--color-expected)"
                  radius={
                    6
                  }
                />

              </BarChart>

            </ChartContainer>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-3
              "
            >

              <CompactMetric

                label="Actual"

                value={
                  formatCurrency(
                    overview
                      .revenue
                      .total_actual_revenue
                  )
                }

              />


              <CompactMetric

                label="Expected"

                value={
                  formatCurrency(
                    overview
                      .revenue
                      .total_expected_revenue
                  )
                }

              />


              <CompactMetric

                label="Difference"

                value={
                  formatCurrency(
                    overview
                      .revenue
                      .total_revenue_difference
                  )
                }

              />

            </div>

          </CardContent>

        </Card>

      </section>


      {/* ===================================================
          CHART ROW 2
      =================================================== */}

      <section
        className="
          grid
          gap-4
          xl:grid-cols-2
        "
      >

        {/* =================================================
            MAINTENANCE STATUS
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle>
              Maintenance Status
            </CardTitle>


            <CardDescription>
              Completed and currently in-progress
              maintenance records.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <ChartContainer
              config={
                maintenanceChartConfig
              }
              className="
                mx-auto
                h-[260px]
                w-full
                max-w-[380px]
              "
            >

              <PieChart>

                <ChartTooltip
                  cursor={
                    false
                  }
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="status"
                    />
                  }
                />


                <Pie
                  data={
                    maintenanceStatusData
                  }
                  dataKey="count"
                  nameKey="status"
                  innerRadius={
                    60
                  }
                  outerRadius={
                    95
                  }
                  strokeWidth={
                    4
                  }
                />

              </PieChart>

            </ChartContainer>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <CompactMetric

                label="Completed"

                value={
                  formatNumber(
                    overview
                      .maintenance
                      .completed_maintenance
                  )
                }

              />


              <CompactMetric

                label="In Progress"

                value={
                  formatNumber(
                    overview
                      .maintenance
                      .in_progress_maintenance
                  )
                }

              />

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            INVENTORY STATUS
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle>
              Spare-Part Stock Status
            </CardTitle>


            <CardDescription>
              Current spare-part records grouped by stock
              availability.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <ChartContainer
              config={
                inventoryChartConfig
              }
              className="
                h-[260px]
                w-full
              "
            >

              <BarChart
                accessibilityLayer
                data={
                  inventoryStatusData
                }
                layout="vertical"
                margin={{
                  left:
                    10
                }}
              >

                <CartesianGrid
                  horizontal={
                    false
                  }
                />


                <XAxis
                  type="number"
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                  allowDecimals={
                    false
                  }
                />


                <YAxis
                  dataKey="status"
                  type="category"
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                  width={
                    95
                  }
                />


                <ChartTooltip
                  content={
                    <ChartTooltipContent />
                  }
                />


                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={
                    5
                  }
                />

              </BarChart>

            </ChartContainer>

          </CardContent>

        </Card>

      </section>


      {/* ===================================================
          OPERATIONAL SNAPSHOT
      =================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            Operational Snapshot
          </CardTitle>


          <CardDescription>
            Additional high-level indicators from the
            current analytics dataset.
          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            <SnapshotMetric

              icon={
                Users
              }

              label="Average Passengers / Trip"

              value={
                formatDecimal(
                  overview
                    .operations
                    .average_passengers_per_trip
                )
              }

            />


            <SnapshotMetric

              icon={
                Clock3
              }

              label="Average Delay"

              value={`${formatDecimal(
                overview
                  .operations
                  .average_delay_minutes
              )} min`}

            />


            <SnapshotMetric

              icon={
                Route
              }

              label="Operated Distance"

              value={
                formatKilometres(
                  overview
                    .operations
                    .total_operated_km
                )
              }

            />


            <SnapshotMetric

              icon={
                Fuel
              }

              label="Fuel Consumed"

              value={`${formatNumber(
                overview
                  .fuel
                  .total_fuel_litres,
                2
              )} L`}

            />


            <SnapshotMetric

              icon={
                Gauge
              }

              label="Average Fuel Efficiency"

              value={`${formatDecimal(
                overview
                  .fuel
                  .average_km_per_litre
              )} km/L`}

            />


            <SnapshotMetric

              icon={
                Fuel
              }

              label="Fuel Cost"

              value={
                formatCurrency(
                  overview
                    .fuel
                    .total_fuel_cost
                )
              }

            />


            <SnapshotMetric

              icon={
                Wrench
              }

              label="Maintenance Cost"

              value={
                formatCurrency(
                  overview
                    .maintenance
                    .total_maintenance_cost
                )
              }

            />


            <SnapshotMetric

              icon={
                Clock3
              }

              label="Maintenance Downtime"

              value={
                formatHours(
                  overview
                    .maintenance
                    .total_downtime_hours
                )
              }

            />


            <SnapshotMetric

              icon={
                Ticket
              }

              label="Tickets Sold"

              value={
                formatNumber(
                  overview
                    .revenue
                    .total_tickets_sold
                )
              }

            />


            <SnapshotMetric

              icon={
                Wrench
              }

              label="Average Repair Cost"

              value={
                formatCurrency(
                  overview
                    .maintenance
                    .average_repair_cost
                )
              }

            />


            <SnapshotMetric

              icon={
                PackageSearch
              }

              label="Low Stock Parts"

              value={
                formatNumber(
                  overview
                    .inventory
                    .low_stock_parts
                )
              }

            />


            <SnapshotMetric

              icon={
                PackageSearch
              }

              label="Out of Stock Parts"

              value={
                formatNumber(
                  overview
                    .inventory
                    .out_of_stock_parts
                )
              }

            />

          </div>

        </CardContent>

      </Card>

    </div>

  );

}


// =========================================================
// PAGE HEADING
// =========================================================

interface IPageHeadingProps {

  refreshing: boolean;

  onRefresh: () => void;

}


function PageHeading(
  {
    refreshing,
    onRefresh
  }: IPageHeadingProps
) {

  return (

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

            <LayoutDashboard
              className="size-4"
            />

          </div>


          <Badge
            variant="secondary"
          >
            Live Analytics
          </Badge>

        </div>


        <h2
          className="
            text-2xl
            font-bold
            tracking-tight
          "
        >
          Overview Dashboard
        </h2>


        <p
          className="
            mt-1
            max-w-3xl
            text-sm
            text-muted-foreground
          "
        >
          High-level operational indicators covering the
          SLTB fleet, trips, fuel, revenue, maintenance and
          spare-parts inventory.
        </p>

      </div>


      <Button
        variant="outline"
        onClick={
          onRefresh
        }
        disabled={
          refreshing
        }
      >

        {
          refreshing
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

  );

}


// =========================================================
// STATUS ITEM
// =========================================================

interface IStatusItemProps {

  label: string;

  value: number;

}


function StatusItem(
  {
    label,
    value
  }: IStatusItemProps
) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-lg
        border
        px-3
        py-2
      "
    >

      <span
        className="
          text-sm
          text-muted-foreground
        "
      >
        {label}
      </span>


      <span
        className="
          text-sm
          font-semibold
        "
      >
        {
          formatNumber(
            value
          )
        }
      </span>

    </div>

  );

}


// =========================================================
// COMPACT METRIC
// =========================================================

interface ICompactMetricProps {

  label: string;

  value: string;

}


function CompactMetric(
  {
    label,
    value
  }: ICompactMetricProps
) {

  return (

    <div
      className="
        rounded-lg
        border
        p-3
      "
    >

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
          text-sm
          font-semibold
        "
      >
        {value}
      </p>

    </div>

  );

}


// =========================================================
// SNAPSHOT METRIC
// =========================================================

interface ISnapshotMetricProps {

  icon:
    typeof Users;

  label: string;

  value: string;

}


function SnapshotMetric(
  {
    icon: Icon,
    label,
    value
  }: ISnapshotMetricProps
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
          rounded-lg
          bg-muted
        "
      >

        <Icon
          className="size-4"
        />

      </div>


      <div
        className="
          min-w-0
        "
      >

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
            break-words
            text-sm
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
// LOADING SCREEN
// =========================================================

function OverviewLoading() {

  return (

    <div
      className="
        grid
        gap-6
      "
    >

      {/* ===================================================
          TITLE
      =================================================== */}

      <div>

        <Skeleton
          className="
            h-9
            w-56
          "
        />


        <Skeleton
          className="
            mt-3
            h-4
            w-full
            max-w-lg
          "
        />

      </div>


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
                8
            }
          ).map(
            (
              _,
              index
            ) => (

              <Card
                key={
                  index
                }
              >

                <CardHeader>

                  <Skeleton
                    className="
                      h-4
                      w-24
                    "
                  />

                </CardHeader>


                <CardContent>

                  <Skeleton
                    className="
                      h-8
                      w-32
                    "
                  />


                  <Skeleton
                    className="
                      mt-3
                      h-3
                      w-full
                    "
                  />

                </CardContent>

              </Card>

            )
          )
        }

      </div>


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