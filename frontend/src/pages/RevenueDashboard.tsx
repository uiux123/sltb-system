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
  Banknote,
  LoaderCircle,
  Percent,
  Plus,
  RefreshCw,
  Route,
  Target,
  Ticket,
  TriangleAlert
} from "lucide-react";

import {
  analyticsApi
} from "@/api/analytics.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  routeTripApi
} from "@/api/routeTrip.api";

import {
  ticketSalesApi
} from "@/api/ticketSales.api";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  TicketSaleDeleteDialog
} from "@/components/revenue/ticket-sale-delete-dialog";

import {
  TicketSaleFormDialog
} from "@/components/revenue/ticket-sale-form-dialog";

import {
  TicketSaleManagementTable
} from "@/components/revenue/ticket-sale-management-table";

import {
  TicketSaleViewDialog
} from "@/components/revenue/ticket-sale-view-dialog";

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
  IRevenueAnalytics,
  IRouteRevenuePerformance
} from "@/types/analytics.types";

import type {
  ITrip
} from "@/types/routeTripManagement.types";

import type {
  ITicketSale,
  ITicketSaleCreateInput,
  ITicketSaleUpdateInput
} from "@/types/ticketSalesManagement.types";

import {
  formatCurrency,
  formatNumber,
  formatPercentage
} from "@/utils/formatters";


// =========================================================
// CHART CONFIG
// =========================================================

const revenueTrendConfig = {

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

const routeRevenueConfig = {

  revenue: {

    label:
      "Actual Revenue",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const shortfallConfig = {

  shortfall: {

    label:
      "Revenue Difference",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================

const depotRevenueConfig = {

  revenue: {

    label:
      "Actual Revenue",

    color:
      "var(--chart-3)"

  }

} satisfies ChartConfig;


// =========================================================
// REVENUE DASHBOARD
// =========================================================

export default function RevenueDashboard() {

  // =======================================================
  // ANALYTICS STATE
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IRevenueAnalytics | null
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
  // MANAGEMENT STATE
  // =======================================================

  const [
    ticketSales,
    setTicketSales
  ] =
    useState<
      ITicketSale[]
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
    selectedTicketSale,
    setSelectedTicketSale
  ] =
    useState<
      ITicketSale | null
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
            await analyticsApi.getRevenue();


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
  // LOAD MANAGEMENT
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
            ticketResult,
            tripResult
          ] =
            await Promise.all([

              ticketSalesApi.getAll(),

              routeTripApi.trips.getAll()

            ]);


          setTicketSales(
            ticketResult
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

  const availableTrips =
    useMemo(
      () => {

        const usedTripIds =
          new Set(
            ticketSales.map(
              sale =>
                sale.trip_id
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
        ticketSales
      ]
    );


  // =======================================================
  // CREATE
  // =======================================================

  const handleCreate =
    async (
      input:
        ITicketSaleCreateInput
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

        await ticketSalesApi.create(
          input
        );


        setSuccessMessage(
          "Ticket Sale created successfully."
        );


        setFormOpen(
          false
        );


        setSelectedTicketSale(
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
  // UPDATE
  // =======================================================

  const handleUpdate =
    async (
      input:
        ITicketSaleUpdateInput
    ): Promise<void> => {

      if (
        !selectedTicketSale
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

        await ticketSalesApi.update(

          selectedTicketSale
            .ticket_record_id,

          input

        );


        setSuccessMessage(
          "Ticket Sale updated successfully."
        );


        setFormOpen(
          false
        );


        setSelectedTicketSale(
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
  // DELETE
  // =======================================================

  const handleDelete =
    async (): Promise<void> => {

      if (
        !selectedTicketSale
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

        await ticketSalesApi.delete(
          selectedTicketSale
            .ticket_record_id
        );


        setSuccessMessage(
          "Ticket Sale deleted successfully."
        );


        setDeleteOpen(
          false
        );


        setSelectedTicketSale(
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
  // DAILY TREND
  // =======================================================

  const dailyTrendData =
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

            actual:
              item.actual_revenue,

            expected:
              item.expected_revenue

          })
        );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // HIGHEST REVENUE ROUTES
  // =======================================================

  const highestRevenueRouteData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_revenue_routes
          .slice(
            0,
            10
          )
          .map(
            item => ({

              route:
                item.route_number ||
                item.route_id,

              revenue:
                item.total_actual_revenue

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // SHORTFALL ROUTES
  // =======================================================

  const shortfallRouteData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .largest_revenue_shortfall_routes
          .slice(
            0,
            10
          )
          .map(
            item => ({

              route:
                item.route_number ||
                item.route_id,

              shortfall:
                item.total_revenue_difference

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // DEPOT REVENUE
  // =======================================================

  const depotRevenueData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_revenue_depots
          .slice(
            0,
            10
          )
          .map(
            item => ({

              depot:
                item.depot_id,

              revenue:
                item.total_actual_revenue

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

    <div className="grid gap-6">

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

          <div className="mb-2 flex items-center gap-2">

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

              <Banknote className="size-4" />

            </div>


            <Badge variant="secondary">
              Revenue Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Revenue Analytics & Management
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse ticket revenue and expected revenue
            performance while managing operational Ticket
            Sale records.
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

                  <RefreshCw className="size-4" />

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

          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>

          <TabsTrigger value="management">
            Manage Ticket Sales
          </TabsTrigger>

        </TabsList>


        {/* =================================================
            ANALYTICS
        ================================================= */}

        <TabsContent
          value="analytics"
          className="
            mt-6
            grid
            gap-6
          "
        >

          {
            analyticsError && (

              <Alert variant="destructive">

                <TriangleAlert className="size-4" />

                <AlertTitle>
                  Unable to load Revenue Analytics
                </AlertTitle>

                <AlertDescription>
                  {analyticsError}
                </AlertDescription>

              </Alert>

            )
          }


          {
            analyticsLoading &&
            !analytics
              ? (

                  <RevenueAnalyticsLoading />

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
                          title="Tickets Sold"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_tickets_sold
                            )
                          }
                          description={`${formatNumber(
                            analytics
                              .summary
                              .total_ticket_records
                          )} Ticket Sale records`}
                          icon={
                            Ticket
                          }
                        />


                        <KpiCard
                          title="Actual Revenue"
                          value={
                            formatCurrency(
                              analytics
                                .summary
                                .total_actual_revenue
                            )
                          }
                          description="Total recorded ticket revenue"
                          icon={
                            Banknote
                          }
                        />


                        <KpiCard
                          title="Expected Revenue"
                          value={
                            formatCurrency(
                              analytics
                                .summary
                                .total_expected_revenue
                            )
                          }
                          description="Total expected revenue"
                          icon={
                            Target
                          }
                        />


                        <KpiCard
                          title="Revenue Achievement"
                          value={
                            formatPercentage(
                              analytics
                                .summary
                                .revenue_achievement_percentage
                            )
                          }
                          description="Actual revenue relative to expected revenue"
                          icon={
                            Percent
                          }
                        />

                      </section>


                      {/* =====================================
                          SUMMARY
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Revenue Summary
                          </CardTitle>

                          <CardDescription>
                            Additional revenue indicators
                            calculated by the backend.
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
                            label="Revenue Difference"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .total_revenue_difference,
                                2
                              )
                            }
                          />


                          <SummaryMetric
                            label="Average Revenue / Ticket"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .average_revenue_per_ticket,
                                2
                              )
                            }
                          />


                          <SummaryMetric
                            label="Average Revenue / Trip"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .average_revenue_per_trip,
                                2
                              )
                            }
                          />

                        </CardContent>

                      </Card>


                      {/* =====================================
                          REVENUE TREND
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Actual vs Expected Revenue Trend
                          </CardTitle>

                          <CardDescription>
                            Daily comparison of recorded and
                            expected ticket revenue.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <ChartContainer
                            config={
                              revenueTrendConfig
                            }
                            className="
                              h-[340px]
                              w-full
                            "
                          >

                            <LineChart
                              accessibilityLayer
                              data={
                                dailyTrendData
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
                                dataKey="actual"
                                stroke="var(--color-actual)"
                                strokeWidth={
                                  2
                                }
                                dot={
                                  false
                                }
                              />


                              <Line
                                type="monotone"
                                dataKey="expected"
                                stroke="var(--color-expected)"
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


                      {/* =====================================
                          ROUTE CHARTS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Highest Revenue Routes
                            </CardTitle>

                            <CardDescription>
                              Routes with the largest
                              recorded ticket revenue.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                routeRevenueConfig
                              }
                              className="
                                h-[330px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  highestRevenueRouteData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="route"
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
                                    5
                                  }
                                />

                              </BarChart>

                            </ChartContainer>

                          </CardContent>

                        </Card>


                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Largest Revenue Shortfall Routes
                            </CardTitle>

                            <CardDescription>
                              Routes with the largest
                              expected-minus-actual revenue
                              differences.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                shortfallConfig
                              }
                              className="
                                h-[330px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  shortfallRouteData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="route"
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
                                  dataKey="shortfall"
                                  fill="var(--color-shortfall)"
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
                          DEPOT REVENUE
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Highest Revenue Depots
                          </CardTitle>

                          <CardDescription>
                            Depots with the largest recorded
                            ticket revenue.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <ChartContainer
                            config={
                              depotRevenueConfig
                            }
                            className="
                              h-[340px]
                              w-full
                            "
                          >

                            <BarChart
                              accessibilityLayer
                              data={
                                depotRevenueData
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
                                dataKey="revenue"
                                fill="var(--color-revenue)"
                                radius={
                                  5
                                }
                              />

                            </BarChart>

                          </ChartContainer>

                        </CardContent>

                      </Card>


                      {/* =====================================
                          ROUTE TABLES
                      ===================================== */}

                      <RevenueRouteTable
                        title="Highest Revenue Route Details"
                        description="Detailed revenue information for the highest-revenue routes."
                        records={
                          analytics
                            .highest_revenue_routes
                        }
                      />


                      <RevenueRouteTable
                        title="Revenue Shortfall Route Details"
                        description="Detailed actual, expected and achievement information for routes with the largest revenue differences."
                        records={
                          analytics
                            .largest_revenue_shortfall_routes
                        }
                      />

                    </>

                  )
                : null
          }

        </TabsContent>


        {/* =================================================
            MANAGEMENT
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
                  Manage Ticket Sales
                </CardTitle>

                <CardDescription>
                  Create, view, update and delete Ticket
                  Sale records.
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

                    setSelectedTicketSale(
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

                <Plus className="size-4" />
                Add Ticket Sale

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

                        <Alert variant="destructive">

                          <TriangleAlert className="size-4" />

                          <AlertTitle>
                            Unable to load Ticket Sales
                          </AlertTitle>

                          <AlertDescription>
                            {managementError}
                          </AlertDescription>

                        </Alert>

                      )
                    : (

                        <div className="grid gap-4">

                          {
                            availableTrips.length ===
                              0 && (

                              <Alert>

                                <Route className="size-4" />

                                <AlertTitle>
                                  No unused completed Trips
                                </AlertTitle>

                                <AlertDescription>
                                  Every currently completed
                                  Trip already has a Ticket
                                  Sale. Create a new completed
                                  Trip in the Route & Trip
                                  module before adding another
                                  Ticket Sale.
                                </AlertDescription>

                              </Alert>

                            )
                          }


                          <TicketSaleManagementTable
                            ticketSales={
                              ticketSales
                            }
                            onView={
                              sale => {

                                setSelectedTicketSale(
                                  sale
                                );

                                setViewOpen(
                                  true
                                );

                              }
                            }
                            onEdit={
                              sale => {

                                setSelectedTicketSale(
                                  sale
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
                              sale => {

                                setSelectedTicketSale(
                                  sale
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
          FORM DIALOG
      =================================================== */}

      <TicketSaleFormDialog
        open={
          formOpen
        }
        mode={
          formMode
        }
        ticketSale={
          selectedTicketSale
        }
        trips={
          trips
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

      <TicketSaleViewDialog
        open={
          viewOpen
        }
        ticketSale={
          selectedTicketSale
        }
        onOpenChange={
          open => {

            setViewOpen(
              open
            );


            if (
              !open
            ) {

              setSelectedTicketSale(
                null
              );

            }

          }
        }
      />


      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <TicketSaleDeleteDialog
        open={
          deleteOpen
        }
        ticketSale={
          selectedTicketSale
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

              setSelectedTicketSale(
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

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

    </div>

  );

}


// =========================================================
// REVENUE ROUTE TABLE
// =========================================================

interface IRevenueRouteTableProps {

  title: string;

  description: string;

  records:
    IRouteRevenuePerformance[];

}


function RevenueRouteTable(
  {
    title,
    description,
    records
  }: IRevenueRouteTableProps
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

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Route
                </TableHead>

                <TableHead>
                  Journey
                </TableHead>

                <TableHead>
                  Tickets
                </TableHead>

                <TableHead>
                  Actual
                </TableHead>

                <TableHead>
                  Expected
                </TableHead>

                <TableHead>
                  Difference
                </TableHead>

                <TableHead className="text-right">
                  Achievement
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.map(
                  record => (

                    <TableRow
                      key={
                        record.route_id
                      }
                    >

                      <TableCell>

                        <div className="font-medium">
                          {record.route_id}
                        </div>

                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {record.route_number}
                        </div>

                      </TableCell>


                      <TableCell>
                        {record.origin}
                        {" → "}
                        {record.destination}
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.total_tickets_sold
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.total_actual_revenue,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.total_expected_revenue,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.total_revenue_difference,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell className="text-right">
                        {
                          formatPercentage(
                            record.revenue_achievement_percentage
                          )
                        }
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

function RevenueAnalyticsLoading() {

  return (

    <div className="grid gap-6">

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