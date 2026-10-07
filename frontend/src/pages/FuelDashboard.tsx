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
  Line,
  LineChart,
  XAxis,
  YAxis
} from "recharts";

import {
  CircleDollarSign,
  Fuel,
  Gauge,
  LoaderCircle,
  Plus,
  RefreshCw,
  Route,
  TriangleAlert
} from "lucide-react";

import {
  analyticsApi
} from "@/api/analytics.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  fuelRecordsApi
} from "@/api/fuelRecords.api";

import {
  routeTripApi
} from "@/api/routeTrip.api";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  FuelRecordDeleteDialog
} from "@/components/fuel/fuel-record-delete-dialog";

import {
  FuelRecordFormDialog
} from "@/components/fuel/fuel-record-form-dialog";

import {
  FuelRecordManagementTable
} from "@/components/fuel/fuel-record-management-table";

import {
  FuelRecordViewDialog
} from "@/components/fuel/fuel-record-view-dialog";

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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import type {
  IFuelAnalytics
} from "@/types/analytics.types";

import type {
  IFuelRecord,
  IFuelRecordCreateInput,
  IFuelRecordUpdateInput
} from "@/types/fuelManagement.types";

import type {
  ITrip
} from "@/types/routeTripManagement.types";

import {
  formatCurrency,
  formatDecimal,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// CHART CONFIGS
// =========================================================

const fuelTrendConfig = {

  litres: {

    label:
      "Fuel Litres",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const fuelCostTrendConfig = {

  cost: {

    label:
      "Fuel Cost",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================

const depotEfficiencyConfig = {

  efficiency: {

    label:
      "km / Litre",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const depotCostConfig = {

  cost: {

    label:
      "Fuel Cost",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// FUEL DASHBOARD
// =========================================================

export default function FuelDashboard() {

  // =======================================================
  // ANALYTICS
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IFuelAnalytics | null
    >(
      null
    );


  const [
    analyticsLoading,
    setAnalyticsLoading
  ] =
    useState(
      true
    );


  const [
    analyticsError,
    setAnalyticsError
  ] =
    useState<
      string | null
    >(
      null
    );


  // =======================================================
  // MANAGEMENT
  // =======================================================

  const [
    fuelRecords,
    setFuelRecords
  ] =
    useState<
      IFuelRecord[]
    >(
      []
    );


  const [
    trips,
    setTrips
  ] =
    useState<
      ITrip[]
    >(
      []
    );


  const [
    managementLoading,
    setManagementLoading
  ] =
    useState(
      true
    );


  const [
    managementError,
    setManagementError
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    successMessage,
    setSuccessMessage
  ] =
    useState<
      string | null
    >(
      null
    );


  // =======================================================
  // DIALOG STATE
  // =======================================================

  const [
    selectedFuelRecord,
    setSelectedFuelRecord
  ] =
    useState<
      IFuelRecord | null
    >(
      null
    );


  const [
    formMode,
    setFormMode
  ] =
    useState<
      "create" | "edit"
    >(
      "create"
    );


  const [
    formOpen,
    setFormOpen
  ] =
    useState(
      false
    );


  const [
    viewOpen,
    setViewOpen
  ] =
    useState(
      false
    );


  const [
    deleteOpen,
    setDeleteOpen
  ] =
    useState(
      false
    );


  const [
    submitting,
    setSubmitting
  ] =
    useState(
      false
    );


  const [
    formError,
    setFormError
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    deleting,
    setDeleting
  ] =
    useState(
      false
    );


  const [
    deleteError,
    setDeleteError
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

        setAnalyticsLoading(
          true
        );

        setAnalyticsError(
          null
        );


        try {

          const result =
            await analyticsApi.getFuel();


          setAnalytics(
            result
          );

        } catch (
          requestError
        ) {

          setAnalyticsError(
            getApiErrorMessage(
              requestError
            )
          );

        } finally {

          setAnalyticsLoading(
            false
          );

        }

      },
      []
    );


  // =======================================================
  // LOAD MANAGEMENT DATA
  // =======================================================

  const loadManagement =
    useCallback(
      async (): Promise<void> => {

        setManagementLoading(
          true
        );

        setManagementError(
          null
        );


        try {

          const [
            fuelRecordResult,
            tripResult
          ] =
            await Promise.all([

              fuelRecordsApi.getAll(),

              routeTripApi.trips.getAll()

            ]);


          setFuelRecords(
            fuelRecordResult
          );


          setTrips(
            tripResult
          );

        } catch (
          requestError
        ) {

          setManagementError(
            getApiErrorMessage(
              requestError
            )
          );

        } finally {

          setManagementLoading(
            false
          );

        }

      },
      []
    );


  // =======================================================
  // REFRESH ALL
  // =======================================================

  const refreshAll =
    useCallback(
      async (): Promise<void> => {

        await Promise.all([

          loadAnalytics(),

          loadManagement()

        ]);

      },
      [
        loadAnalytics,
        loadManagement
      ]
    );


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(
    () => {

      void refreshAll();

    },
    [
      refreshAll
    ]
  );


  // =======================================================
  // AVAILABLE TRIPS
  // =======================================================
  //
  // Each Trip may have only one Fuel Record.
  //
  // Only completed Trips without an existing Fuel Record
  // are available when creating a Fuel Record.
  //
  // =======================================================

  const availableTrips =
    useMemo(
      () => {

        const usedTripIds =
          new Set(
            fuelRecords.map(
              record =>
                record.trip_id
            )
          );


        return trips.filter(
          trip =>

            trip.trip_status ===
              "Completed" &&

            !usedTripIds.has(
              trip.trip_id
            )
        );

      },
      [
        trips,
        fuelRecords
      ]
    );


  // =======================================================
  // CREATE FUEL RECORD
  // =======================================================

  const handleCreate =
    async (
      input:
        IFuelRecordCreateInput
    ): Promise<void> => {

      setSubmitting(
        true
      );

      setFormError(
        null
      );

      setSuccessMessage(
        null
      );


      try {

        await fuelRecordsApi.create(
          input
        );


        setSuccessMessage(
          "Fuel Record created successfully."
        );


        setFormOpen(
          false
        );


        setSelectedFuelRecord(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setFormError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setSubmitting(
          false
        );

      }

    };


  // =======================================================
  // UPDATE FUEL RECORD
  // =======================================================

  const handleUpdate =
    async (
      input:
        IFuelRecordUpdateInput
    ): Promise<void> => {

      if (
        !selectedFuelRecord
      ) {

        return;

      }


      setSubmitting(
        true
      );

      setFormError(
        null
      );

      setSuccessMessage(
        null
      );


      try {

        await fuelRecordsApi.update(

          selectedFuelRecord
            .fuel_record_id,

          input

        );


        setSuccessMessage(
          "Fuel Record updated successfully."
        );


        setFormOpen(
          false
        );


        setSelectedFuelRecord(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setFormError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setSubmitting(
          false
        );

      }

    };


  // =======================================================
  // DELETE FUEL RECORD
  // =======================================================

  const handleDelete =
    async (): Promise<void> => {

      if (
        !selectedFuelRecord
      ) {

        return;

      }


      setDeleting(
        true
      );

      setDeleteError(
        null
      );

      setSuccessMessage(
        null
      );


      try {

        await fuelRecordsApi.delete(
          selectedFuelRecord
            .fuel_record_id
        );


        setSuccessMessage(
          "Fuel Record deleted successfully."
        );


        setDeleteOpen(
          false
        );


        setSelectedFuelRecord(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setDeleteError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setDeleting(
          false
        );

      }

    };


  // =======================================================
  // DAILY FUEL TREND
  // =======================================================

  const dailyFuelTrend =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics.daily_trend.map(
          item => ({

            date:
              item.date,

            litres:
              item.total_fuel_litres,

            cost:
              item.total_fuel_cost

          })
        );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // DEPOT EFFICIENCY DATA
  // =======================================================

  const depotEfficiencyData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .depot_performance
          .slice(
            0,
            12
          )
          .map(
            item => ({

              depot:
                item.depot_id,

              efficiency:
                item.km_per_litre

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // DEPOT COST DATA
  // =======================================================

  const depotCostData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return [
          ...analytics.depot_performance
        ]
          .sort(
            (
              first,
              second
            ) =>
              second.total_fuel_cost -
              first.total_fuel_cost
          )
          .slice(
            0,
            12
          )
          .map(
            item => ({

              depot:
                item.depot_id,

              cost:
                item.total_fuel_cost

            })
          );

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

              <Fuel
                className="size-4"
              />

            </div>


            <Badge
              variant="secondary"
            >
              Fuel Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Fuel Analytics & Management
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse fuel consumption, expenditure and
            efficiency while managing operational Fuel
            Records.
          </p>

        </div>


        <Button
          variant="outline"
          disabled={
            analyticsLoading ||
            managementLoading
          }
          onClick={
            () => {

              void refreshAll();

            }
          }
        >

          {
            analyticsLoading ||
            managementLoading
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
          SUCCESS
      =================================================== */}

      {
        successMessage && (

          <Alert>

            <AlertTitle>
              Operation completed
            </AlertTitle>


            <AlertDescription>
              {successMessage}
            </AlertDescription>

          </Alert>

        )
      }


      {/* ===================================================
          TABS
      =================================================== */}

      <Tabs
        defaultValue="analytics"
        className="w-full"
      >

        <TabsList>

          <TabsTrigger
            value="analytics"
          >
            Analytics
          </TabsTrigger>


          <TabsTrigger
            value="management"
          >
            Manage Fuel Records
          </TabsTrigger>

        </TabsList>


        {/* =================================================
            ANALYTICS TAB
        ================================================= */}

        <TabsContent
          value="analytics"
          className="
            mt-6
            grid
            gap-6
          "
        >

          {/* ===============================================
              ANALYTICS ERROR
          =============================================== */}

          {
            analyticsError && (

              <Alert
                variant="destructive"
              >

                <TriangleAlert
                  className="size-4"
                />


                <AlertTitle>
                  Unable to load Fuel Analytics
                </AlertTitle>


                <AlertDescription>
                  {analyticsError}
                </AlertDescription>

              </Alert>

            )
          }


          {/* ===============================================
              ANALYTICS CONTENT
          =============================================== */}

          {
            analyticsLoading &&
            !analytics
              ? (

                  <FuelAnalyticsLoading />

                )
              : analytics
                ? (

                    <>

                      {/* =====================================
                          KPI CARDS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          sm:grid-cols-2
                          xl:grid-cols-4
                        "
                      >

                        <KpiCard

                          title="Fuel Records"

                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_fuel_records
                            )
                          }

                          description="Fuel transactions included in analytics"

                          icon={
                            Fuel
                          }

                        />


                        <KpiCard

                          title="Fuel Consumed"

                          value={`${formatNumber(
                            analytics
                              .summary
                              .total_fuel_litres,
                            2
                          )} L`}

                          description="Total recorded fuel consumption"

                          icon={
                            Fuel
                          }

                        />


                        <KpiCard

                          title="Fuel Expenditure"

                          value={
                            formatCurrency(
                              analytics
                                .summary
                                .total_fuel_cost
                            )
                          }

                          description="Total tracked fuel expenditure"

                          icon={
                            CircleDollarSign
                          }

                        />


                        <KpiCard

                          title="Overall Efficiency"

                          value={`${formatDecimal(
                            analytics
                              .summary
                              .overall_km_per_litre,
                            2
                          )} km/L`}

                          description="Operated kilometres per litre"

                          icon={
                            Gauge
                          }

                        />

                      </section>


                      {/* =====================================
                          SUMMARY
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Fuel Operations Summary
                          </CardTitle>


                          <CardDescription>
                            Additional network-level fuel
                            indicators calculated by the
                            backend.
                          </CardDescription>

                        </CardHeader>


                        <CardContent
                          className="
                            grid
                            gap-3
                            sm:grid-cols-3
                          "
                        >

                          <SummaryMetric

                            label="Total Operated Distance"

                            value={`${formatNumber(
                              analytics
                                .summary
                                .total_operated_km,
                              2
                            )} km`}

                          />


                          <SummaryMetric

                            label="Fuel Cost / km"

                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .overall_fuel_cost_per_km,
                                2
                              )
                            }

                          />


                          <SummaryMetric

                            label="Average Fuel Price / L"

                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .average_fuel_price_per_litre,
                                2
                              )
                            }

                          />

                        </CardContent>

                      </Card>


                      {/* =====================================
                          DAILY TRENDS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {/* ===================================
                            FUEL CONSUMPTION
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Fuel Consumption Trend
                            </CardTitle>


                            <CardDescription>
                              Fuel litres recorded over time.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                fuelTrendConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <LineChart
                                accessibilityLayer
                                data={
                                  dailyFuelTrend
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="date"
                                  tickLine={
                                    false
                                  }
                                  axisLine={
                                    false
                                  }
                                  minTickGap={
                                    24
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


                                <Line
                                  type="monotone"
                                  dataKey="litres"
                                  stroke="var(--color-litres)"
                                  strokeWidth={
                                    2
                                  }
                                  dot={
                                    false
                                  }
                                />

                              </LineChart>

                            </ChartContainer>

                          </CardContent>

                        </Card>


                        {/* ===================================
                            FUEL COST
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Fuel Cost Trend
                            </CardTitle>


                            <CardDescription>
                              Recorded fuel expenditure over
                              time.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                fuelCostTrendConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <LineChart
                                accessibilityLayer
                                data={
                                  dailyFuelTrend
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="date"
                                  tickLine={
                                    false
                                  }
                                  axisLine={
                                    false
                                  }
                                  minTickGap={
                                    24
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


                                <Line
                                  type="monotone"
                                  dataKey="cost"
                                  stroke="var(--color-cost)"
                                  strokeWidth={
                                    2
                                  }
                                  dot={
                                    false
                                  }
                                />

                              </LineChart>

                            </ChartContainer>

                          </CardContent>

                        </Card>

                      </section>


                      {/* =====================================
                          DEPOT CHARTS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {/* ===================================
                            DEPOT EFFICIENCY
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Depot Fuel Efficiency
                            </CardTitle>


                            <CardDescription>
                              Kilometres operated per litre
                              across depot-level fuel data.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                depotEfficiencyConfig
                              }
                              className="
                                h-[340px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  depotEfficiencyData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="depot"
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


                        {/* ===================================
                            DEPOT COST
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Highest Depot Fuel Cost
                            </CardTitle>


                            <CardDescription>
                              Depots with the largest
                              recorded fuel expenditure.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                depotCostConfig
                              }
                              className="
                                h-[340px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  depotCostData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="depot"
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

                      </section>


                      {/* =====================================
                          HIGHEST EFFICIENCY
                      ===================================== */}

                      <FuelBusTable

                        title="Highest Efficiency Buses"

                        description="Buses with the highest calculated kilometres-per-litre values."

                        records={
                          analytics
                            .highest_efficiency_buses
                        }

                      />


                      {/* =====================================
                          LOWEST EFFICIENCY
                      ===================================== */}

                      <FuelBusTable

                        title="Lowest Efficiency Buses"

                        description="Buses with lower calculated efficiency values that may warrant further operational investigation."

                        records={
                          analytics
                            .lowest_efficiency_buses
                        }

                      />


                      {/* =====================================
                          HIGHEST FUEL COST
                      ===================================== */}

                      <FuelBusTable

                        title="Highest Fuel Cost Buses"

                        description="Buses with the highest tracked fuel expenditure."

                        records={
                          analytics
                            .highest_fuel_cost_buses
                        }

                      />

                    </>

                  )
                : null
          }

        </TabsContent>


        {/* =================================================
            MANAGEMENT TAB
        ================================================= */}

        <TabsContent
          value="management"
          className="
            mt-6
            grid
            gap-6
          "
        >

          <Card>

            <CardHeader
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <CardTitle>
                  Manage Fuel Records
                </CardTitle>


                <CardDescription>
                  Create, view, update and delete
                  operational Fuel Records.
                </CardDescription>

              </div>


              <Button
                disabled={
                  managementLoading ||
                  availableTrips.length ===
                    0
                }
                onClick={
                  () => {

                    setSelectedFuelRecord(
                      null
                    );

                    setFormMode(
                      "create"
                    );

                    setFormError(
                      null
                    );

                    setSuccessMessage(
                      null
                    );

                    setFormOpen(
                      true
                    );

                  }
                }
              >

                <Plus
                  className="size-4"
                />

                Add Fuel Record

              </Button>

            </CardHeader>


            <CardContent>

              {
                managementLoading
                  ? (

                      <Skeleton
                        className="
                          h-[500px]
                          w-full
                        "
                      />

                    )
                  : managementError
                    ? (

                        <Alert
                          variant="destructive"
                        >

                          <TriangleAlert
                            className="size-4"
                          />


                          <AlertTitle>
                            Unable to load Fuel Records
                          </AlertTitle>


                          <AlertDescription>
                            {
                              managementError
                            }
                          </AlertDescription>

                        </Alert>

                      )
                    : (

                        <div
                          className="
                            grid
                            gap-4
                          "
                        >

                          {/* =================================
                              NO AVAILABLE TRIPS
                          ================================= */}

                          {
                            availableTrips.length ===
                              0 && (

                              <Alert>

                                <Route
                                  className="size-4"
                                />


                                <AlertTitle>
                                  No unused completed Trips
                                </AlertTitle>


                                <AlertDescription>
                                  Every currently completed
                                  Trip already has a Fuel
                                  Record. Create a new
                                  completed Trip in the Route
                                  & Trip module before adding
                                  another Fuel Record.
                                </AlertDescription>

                              </Alert>

                            )
                          }


                          {/* =================================
                              MANAGEMENT TABLE
                          ================================= */}

                          <FuelRecordManagementTable

                            fuelRecords={
                              fuelRecords
                            }

                            onView={
                              record => {

                                setSelectedFuelRecord(
                                  record
                                );

                                setViewOpen(
                                  true
                                );

                              }
                            }

                            onEdit={
                              record => {

                                setSelectedFuelRecord(
                                  record
                                );

                                setFormMode(
                                  "edit"
                                );

                                setFormError(
                                  null
                                );

                                setSuccessMessage(
                                  null
                                );

                                setFormOpen(
                                  true
                                );

                              }
                            }

                            onDelete={
                              record => {

                                setSelectedFuelRecord(
                                  record
                                );

                                setDeleteError(
                                  null
                                );

                                setSuccessMessage(
                                  null
                                );

                                setDeleteOpen(
                                  true
                                );

                              }
                            }

                          />

                        </div>

                      )
              }

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>


      {/* ===================================================
          CREATE / EDIT DIALOG
      =================================================== */}

      <FuelRecordFormDialog

        open={
          formOpen
        }

        mode={
          formMode
        }

        fuelRecord={
          selectedFuelRecord
        }

        availableTrips={
          availableTrips
        }

        submitting={
          submitting
        }

        error={
          formError
        }

        onOpenChange={
          open => {

            setFormOpen(
              open
            );


            if (
              !open
            ) {

              setFormError(
                null
              );

            }

          }
        }

        onCreate={
          handleCreate
        }

        onUpdate={
          handleUpdate
        }

      />


      {/* ===================================================
          VIEW DIALOG
      =================================================== */}

      <FuelRecordViewDialog

        open={
          viewOpen
        }

        fuelRecord={
          selectedFuelRecord
        }

        onOpenChange={
          open => {

            setViewOpen(
              open
            );


            if (
              !open
            ) {

              setSelectedFuelRecord(
                null
              );

            }

          }
        }

      />


      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <FuelRecordDeleteDialog

        open={
          deleteOpen
        }

        fuelRecord={
          selectedFuelRecord
        }

        deleting={
          deleting
        }

        error={
          deleteError
        }

        onOpenChange={
          open => {

            setDeleteOpen(
              open
            );


            if (
              !open
            ) {

              setDeleteError(
                null
              );

              setSelectedFuelRecord(
                null
              );

            }

          }
        }

        onDelete={
          handleDelete
        }

      />

    </div>

  );

}


// =========================================================
// SUMMARY METRIC
// =========================================================

interface ISummaryMetricProps {

  label: string;

  value: string;

}


function SummaryMetric(
  {
    label,
    value
  }: ISummaryMetricProps
) {

  return (

    <div
      className="
        rounded-lg
        border
        bg-background
        p-4
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
          mt-2
          text-lg
          font-semibold
        "
      >
        {value}
      </p>

    </div>

  );

}


// =========================================================
// FUEL BUS TABLE
// =========================================================

interface IFuelBusTableProps {

  title: string;

  description: string;

  records:
    IFuelAnalytics[
      "highest_efficiency_buses"
    ];

}


function FuelBusTable(
  {
    title,
    description,
    records
  }: IFuelBusTableProps
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
                  Vehicle
                </TableHead>

                <TableHead>
                  Depot
                </TableHead>

                <TableHead>
                  Fuel Type
                </TableHead>

                <TableHead>
                  Fuel Used
                </TableHead>

                <TableHead>
                  Fuel Cost
                </TableHead>

                <TableHead
                  className="text-right"
                >
                  Efficiency
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.map(
                  record => (

                    <TableRow
                      key={
                        record.bus_id
                      }
                    >

                      <TableCell>

                        <div
                          className="font-medium"
                        >
                          {
                            record.bus_id
                          }
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


                      <TableCell>

                        {
                          record.manufacturer
                        }

                        {" "}

                        {
                          record.model
                        }

                      </TableCell>


                      <TableCell>
                        {
                          record.depot_id
                        }
                      </TableCell>


                      <TableCell>
                        {
                          record.fuel_type
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.total_fuel_litres,
                            2
                          )
                        } L
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.total_fuel_cost,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell
                        className="text-right"
                      >
                        {
                          formatDecimal(
                            record.km_per_litre,
                            2
                          )
                        } km/L
                      </TableCell>

                    </TableRow>

                  )
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
// LOADING
// =========================================================

function FuelAnalyticsLoading() {

  return (

    <div
      className="
        grid
        gap-6
      "
    >

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