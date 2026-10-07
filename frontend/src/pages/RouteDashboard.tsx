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
  XAxis,
  YAxis
} from "recharts";

import {
  Clock3,
  Gauge,
  LoaderCircle,
  Plus,
  RefreshCw,
  Route as RouteIcon,
  TriangleAlert,
  Users
} from "lucide-react";

import {
  analyticsApi
} from "@/api/analytics.api";

import {
  busesApi
} from "@/api/buses.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  routeTripApi
} from "@/api/routeTrip.api";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  RouteDeleteDialog
} from "@/components/routes/route-delete-dialog";

import {
  RouteFormDialog
} from "@/components/routes/route-form-dialog";

import {
  RouteManagementTable
} from "@/components/routes/route-management-table";

import {
  RouteViewDialog
} from "@/components/routes/route-view-dialog";

import {
  TripDeleteDialog
} from "@/components/routes/trip-delete-dialog";

import {
  TripFormDialog
} from "@/components/routes/trip-form-dialog";

import {
  TripManagementTable
} from "@/components/routes/trip-management-table";

import {
  TripViewDialog
} from "@/components/routes/trip-view-dialog";

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
  IRouteTripAnalytics
} from "@/types/analytics.types";

import type {
  IBus,
  IDepot
} from "@/types/fleetManagement.types";

import type {
  IRoute,
  IRouteInput,
  ITrip,
  ITripInput
} from "@/types/routeTripManagement.types";

import {
  formatNumber,
  formatPercentage
} from "@/utils/formatters";


// =========================================================
// CHART CONFIGS
// =========================================================

const delayDistributionConfig = {

  trips: {

    label:
      "Trips",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const passengerConfig = {

  passengers: {

    label:
      "Passengers",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const delayConfig = {

  delay: {

    label:
      "Average Delay",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================

const loadFactorConfig = {

  loadFactor: {

    label:
      "Load Factor",

    color:
      "var(--chart-3)"

  }

} satisfies ChartConfig;


// =========================================================
// DASHBOARD
// =========================================================

export default function RouteDashboard() {

  // =======================================================
  // ANALYTICS
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IRouteTripAnalytics | null
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
  // MANAGEMENT DATA
  // =======================================================

  const [
    routes,
    setRoutes
  ] =
    useState<
      IRoute[]
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
    buses,
    setBuses
  ] =
    useState<
      IBus[]
    >(
      []
    );


  const [
    depots,
    setDepots
  ] =
    useState<
      IDepot[]
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
  // ROUTE DIALOG STATE
  // =======================================================

  const [
    selectedRoute,
    setSelectedRoute
  ] =
    useState<
      IRoute | null
    >(
      null
    );


  const [
    routeFormMode,
    setRouteFormMode
  ] =
    useState<
      "create" | "edit"
    >(
      "create"
    );


  const [
    routeFormOpen,
    setRouteFormOpen
  ] =
    useState(
      false
    );


  const [
    routeViewOpen,
    setRouteViewOpen
  ] =
    useState(
      false
    );


  const [
    routeDeleteOpen,
    setRouteDeleteOpen
  ] =
    useState(
      false
    );


  const [
    routeSubmitting,
    setRouteSubmitting
  ] =
    useState(
      false
    );


  const [
    routeFormError,
    setRouteFormError
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    routeDeleting,
    setRouteDeleting
  ] =
    useState(
      false
    );


  const [
    routeDeleteError,
    setRouteDeleteError
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    markingRouteInactive,
    setMarkingRouteInactive
  ] =
    useState(
      false
    );


  // =======================================================
  // TRIP DIALOG STATE
  // =======================================================

  const [
    selectedTrip,
    setSelectedTrip
  ] =
    useState<
      ITrip | null
    >(
      null
    );


  const [
    tripFormMode,
    setTripFormMode
  ] =
    useState<
      "create" | "edit"
    >(
      "create"
    );


  const [
    tripFormOpen,
    setTripFormOpen
  ] =
    useState(
      false
    );


  const [
    tripViewOpen,
    setTripViewOpen
  ] =
    useState(
      false
    );


  const [
    tripDeleteOpen,
    setTripDeleteOpen
  ] =
    useState(
      false
    );


  const [
    tripSubmitting,
    setTripSubmitting
  ] =
    useState(
      false
    );


  const [
    tripFormError,
    setTripFormError
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    tripDeleting,
    setTripDeleting
  ] =
    useState(
      false
    );


  const [
    tripDeleteError,
    setTripDeleteError
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
            await analyticsApi.getRoutes();


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
            routeResult,
            tripResult,
            busResult,
            depotResult
          ] =
            await Promise.all([

              routeTripApi.routes.getAll(),

              routeTripApi.trips.getAll(),

              busesApi.getAll(),

              busesApi.getDepots()

            ]);


          setRoutes(
            routeResult
          );

          setTrips(
            tripResult
          );

          setBuses(
            busResult
          );

          setDepots(
            depotResult
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
  // REFRESH EVERYTHING
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
  // ROUTE CREATE / UPDATE
  // =======================================================

  const handleRouteSubmit =
    async (
      input:
        IRouteInput
    ): Promise<void> => {

      setRouteSubmitting(
        true
      );

      setRouteFormError(
        null
      );

      setSuccessMessage(
        null
      );


      try {

        if (
          routeFormMode ===
          "create"
        ) {

          await routeTripApi.routes.create(
            input
          );


          setSuccessMessage(
            "Route created successfully."
          );

        } else {

          if (
            !selectedRoute
          ) {

            return;

          }


          await routeTripApi.routes.update(

            selectedRoute.route_id,

            input

          );


          setSuccessMessage(
            "Route updated successfully."
          );

        }


        setRouteFormOpen(
          false
        );

        setSelectedRoute(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setRouteFormError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setRouteSubmitting(
          false
        );

      }

    };


  // =======================================================
  // ROUTE DELETE
  // =======================================================

  const handleRouteDelete =
    async (): Promise<void> => {

      if (
        !selectedRoute
      ) {

        return;

      }


      setRouteDeleting(
        true
      );

      setRouteDeleteError(
        null
      );


      try {

        await routeTripApi.routes.delete(
          selectedRoute.route_id
        );


        setSuccessMessage(
          "Route deleted successfully."
        );


        setRouteDeleteOpen(
          false
        );

        setSelectedRoute(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setRouteDeleteError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setRouteDeleting(
          false
        );

      }

    };


  // =======================================================
  // MARK ROUTE INACTIVE
  // =======================================================

  const handleMarkRouteInactive =
    async (): Promise<void> => {

      if (
        !selectedRoute
      ) {

        return;

      }


      setMarkingRouteInactive(
        true
      );


      try {

        const input:
          IRouteInput = {

            route_id:
              selectedRoute.route_id,

            route_number:
              selectedRoute.route_number,

            origin:
              selectedRoute.origin,

            destination:
              selectedRoute.destination,

            distance_km:
              selectedRoute.distance_km,

            route_type:
              selectedRoute.route_type,

            scheduled_trips_per_day:
              selectedRoute.scheduled_trips_per_day,

            average_fare:
              selectedRoute.average_fare,

            social_service_route:
              selectedRoute.social_service_route,

            status:
              "Inactive"

          };


        await routeTripApi.routes.update(

          selectedRoute.route_id,

          input

        );


        setSuccessMessage(
          `${selectedRoute.route_id} was marked Inactive.`
        );


        setRouteDeleteOpen(
          false
        );

        setSelectedRoute(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setRouteDeleteError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setMarkingRouteInactive(
          false
        );

      }

    };


  // =======================================================
  // TRIP CREATE / UPDATE
  // =======================================================

  const handleTripSubmit =
    async (
      input:
        ITripInput
    ): Promise<void> => {

      setTripSubmitting(
        true
      );

      setTripFormError(
        null
      );

      setSuccessMessage(
        null
      );


      try {

        if (
          tripFormMode ===
          "create"
        ) {

          await routeTripApi.trips.create(
            input
          );


          setSuccessMessage(
            "Trip created successfully."
          );

        } else {

          if (
            !selectedTrip
          ) {

            return;

          }


          await routeTripApi.trips.update(

            selectedTrip.trip_id,

            input

          );


          setSuccessMessage(
            "Trip updated successfully."
          );

        }


        setTripFormOpen(
          false
        );

        setSelectedTrip(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setTripFormError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setTripSubmitting(
          false
        );

      }

    };


  // =======================================================
  // TRIP DELETE
  // =======================================================

  const handleTripDelete =
    async (): Promise<void> => {

      if (
        !selectedTrip
      ) {

        return;

      }


      setTripDeleting(
        true
      );

      setTripDeleteError(
        null
      );


      try {

        await routeTripApi.trips.delete(
          selectedTrip.trip_id
        );


        setSuccessMessage(
          "Trip deleted successfully."
        );


        setTripDeleteOpen(
          false
        );

        setSelectedTrip(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setTripDeleteError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setTripDeleting(
          false
        );

      }

    };


  // =======================================================
  // ANALYTICS CHART DATA
  // =======================================================

  const delayDistributionData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics.delay_distribution.map(
          item => ({

            range:
              item.delay_range,

            trips:
              item.count

          })
        );

      },
      [
        analytics
      ]
    );


  const passengerData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_passenger_routes
          .slice(
            0,
            10
          )
          .map(
            item => ({

              route:
                item.route_number ||
                item.route_id,

              passengers:
                item.total_passengers

            })
          );

      },
      [
        analytics
      ]
    );


  const delayData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_delay_routes
          .slice(
            0,
            10
          )
          .map(
            item => ({

              route:
                item.route_number ||
                item.route_id,

              delay:
                item.average_delay_minutes

            })
          );

      },
      [
        analytics
      ]
    );


  const loadFactorData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .highest_load_factor_routes
          .slice(
            0,
            10
          )
          .map(
            item => ({

              route:
                item.route_number ||
                item.route_id,

              loadFactor:
                item.average_load_factor_percentage

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

              <RouteIcon className="size-4" />

            </div>


            <Badge variant="secondary">
              Route & Trip Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Route & Trip Analytics
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse route and trip performance while
            managing route and trip operational records.
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

          <TabsTrigger value="routes">
            Manage Routes
          </TabsTrigger>

          <TabsTrigger value="trips">
            Manage Trips
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
                  Unable to load Route Analytics
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

                  <RouteAnalyticsLoading />

                )
              : analytics
                ? (

                    <>

                      {/* =====================================
                          KPIs
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
                          title="Total Trips"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_trips
                            )
                          }
                          description={`${formatNumber(
                            analytics
                              .summary
                              .completed_trips
                          )} completed trips`}
                          icon={
                            RouteIcon
                          }
                        />


                        <KpiCard
                          title="Passengers"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_passengers
                            )
                          }
                          description={`${formatNumber(
                            analytics
                              .summary
                              .average_passengers_per_trip,
                            2
                          )} average passengers per trip`}
                          icon={
                            Users
                          }
                        />


                        <KpiCard
                          title="Average Delay"
                          value={`${formatNumber(
                            analytics
                              .summary
                              .average_delay_minutes,
                            2
                          )} min`}
                          description="Average recorded delay across trips"
                          icon={
                            Clock3
                          }
                        />


                        <KpiCard
                          title="Average Load Factor"
                          value={
                            formatPercentage(
                              analytics
                                .summary
                                .average_load_factor_percentage
                            )
                          }
                          description="Passenger utilisation relative to capacity"
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
                            Operational Summary
                          </CardTitle>

                          <CardDescription>
                            Additional trip-level indicators.
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
                            label="Completed Trips"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .completed_trips
                              )
                            }
                          />

                          <SummaryMetric
                            label="Average Passengers / Trip"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .average_passengers_per_trip,
                                2
                              )
                            }
                          />

                          <SummaryMetric
                            label="Total Operated Distance"
                            value={`${formatNumber(
                              analytics
                                .summary
                                .total_operated_km,
                              2
                            )} km`}
                          />

                        </CardContent>

                      </Card>


                      {/* =====================================
                          DELAY + PASSENGERS
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
                              Delay Distribution
                            </CardTitle>

                            <CardDescription>
                              Recorded trips grouped by
                              delay range.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                delayDistributionConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  delayDistributionData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />

                                <XAxis
                                  dataKey="range"
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
                                  dataKey="trips"
                                  fill="var(--color-trips)"
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
                              Highest Passenger Routes
                            </CardTitle>

                            <CardDescription>
                              Top routes by recorded
                              passenger volume.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                passengerConfig
                              }
                              className="
                                h-[320px]
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


                      {/* =====================================
                          DELAY / LOAD FACTOR
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
                              Highest Delay Routes
                            </CardTitle>

                            <CardDescription>
                              Routes with the greatest
                              average recorded delay.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                delayConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  delayData
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
                                  dataKey="delay"
                                  fill="var(--color-delay)"
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
                              Highest Load Factor Routes
                            </CardTitle>

                            <CardDescription>
                              Routes with the highest
                              passenger-capacity utilisation.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                loadFactorConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  loadFactorData
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
                                  tickFormatter={
                                    value =>
                                      `${value}%`
                                  }
                                />

                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent />
                                  }
                                />

                                <Bar
                                  dataKey="loadFactor"
                                  fill="var(--color-loadFactor)"
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
                          ROUTE PERFORMANCE TABLE
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Route Performance
                          </CardTitle>

                          <CardDescription>
                            First ten route-performance
                            records returned by the analytics
                            endpoint.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

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
                                  Trips
                                </TableHead>

                                <TableHead>
                                  Passengers
                                </TableHead>

                                <TableHead>
                                  Avg. Delay
                                </TableHead>

                                <TableHead className="text-right">
                                  Load Factor
                                </TableHead>

                              </TableRow>

                            </TableHeader>


                            <TableBody>

                              {
                                analytics
                                  .route_performance
                                  .slice(
                                    0,
                                    10
                                  )
                                  .map(
                                    route => (

                                      <TableRow
                                        key={
                                          route.route_id
                                        }
                                      >

                                        <TableCell>

                                          <div className="font-medium">
                                            {route.route_id}
                                          </div>

                                          <div
                                            className="
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            {route.route_number}
                                          </div>

                                        </TableCell>


                                        <TableCell>
                                          {route.origin}
                                          {" → "}
                                          {route.destination}
                                        </TableCell>


                                        <TableCell>
                                          {
                                            formatNumber(
                                              route.total_trips
                                            )
                                          }
                                        </TableCell>


                                        <TableCell>
                                          {
                                            formatNumber(
                                              route.total_passengers
                                            )
                                          }
                                        </TableCell>


                                        <TableCell>
                                          {
                                            formatNumber(
                                              route.average_delay_minutes,
                                              2
                                            )
                                          } min
                                        </TableCell>


                                        <TableCell className="text-right">
                                          {
                                            formatPercentage(
                                              route.average_load_factor_percentage
                                            )
                                          }
                                        </TableCell>

                                      </TableRow>

                                    )
                                  )
                              }

                            </TableBody>

                          </Table>

                        </CardContent>

                      </Card>

                    </>

                  )
                : null
          }

        </TabsContent>


        {/* =================================================
            ROUTE MANAGEMENT
        ================================================= */}

        <TabsContent
          value="routes"
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
                  Manage Routes
                </CardTitle>

                <CardDescription>
                  Create, view, update and safely delete
                  route records.
                </CardDescription>

              </div>


              <Button
                onClick={
                  () => {

                    setSelectedRoute(
                      null
                    );

                    setRouteFormMode(
                      "create"
                    );

                    setRouteFormError(
                      null
                    );

                    setSuccessMessage(
                      null
                    );

                    setRouteFormOpen(
                      true
                    );

                  }
                }
              >

                <Plus className="size-4" />
                Add Route

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

                        <ManagementError
                          error={
                            managementError
                          }
                        />

                      )
                    : (

                        <RouteManagementTable

                          routes={
                            routes
                          }

                          onView={
                            route => {

                              setSelectedRoute(
                                route
                              );

                              setRouteViewOpen(
                                true
                              );

                            }
                          }

                          onEdit={
                            route => {

                              setSelectedRoute(
                                route
                              );

                              setRouteFormMode(
                                "edit"
                              );

                              setRouteFormError(
                                null
                              );

                              setRouteFormOpen(
                                true
                              );

                            }
                          }

                          onDelete={
                            route => {

                              setSelectedRoute(
                                route
                              );

                              setRouteDeleteError(
                                null
                              );

                              setRouteDeleteOpen(
                                true
                              );

                            }
                          }

                        />

                      )
              }

            </CardContent>

          </Card>

        </TabsContent>


        {/* =================================================
            TRIP MANAGEMENT
        ================================================= */}

        <TabsContent
          value="trips"
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
                  Manage Trips
                </CardTitle>

                <CardDescription>
                  Create, view, update and safely delete
                  trip records.
                </CardDescription>

              </div>


              <Button
                onClick={
                  () => {

                    setSelectedTrip(
                      null
                    );

                    setTripFormMode(
                      "create"
                    );

                    setTripFormError(
                      null
                    );

                    setSuccessMessage(
                      null
                    );

                    setTripFormOpen(
                      true
                    );

                  }
                }
              >

                <Plus className="size-4" />
                Add Trip

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

                        <ManagementError
                          error={
                            managementError
                          }
                        />

                      )
                    : (

                        <TripManagementTable

                          trips={
                            trips
                          }

                          onView={
                            trip => {

                              setSelectedTrip(
                                trip
                              );

                              setTripViewOpen(
                                true
                              );

                            }
                          }

                          onEdit={
                            trip => {

                              setSelectedTrip(
                                trip
                              );

                              setTripFormMode(
                                "edit"
                              );

                              setTripFormError(
                                null
                              );

                              setTripFormOpen(
                                true
                              );

                            }
                          }

                          onDelete={
                            trip => {

                              setSelectedTrip(
                                trip
                              );

                              setTripDeleteError(
                                null
                              );

                              setTripDeleteOpen(
                                true
                              );

                            }
                          }

                        />

                      )
              }

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>


      {/* ===================================================
          ROUTE DIALOGS
      =================================================== */}

      <RouteFormDialog
        open={
          routeFormOpen
        }
        mode={
          routeFormMode
        }
        route={
          selectedRoute
        }
        submitting={
          routeSubmitting
        }
        error={
          routeFormError
        }
        onOpenChange={
          open => {

            setRouteFormOpen(
              open
            );

            if (
              !open
            ) {

              setRouteFormError(
                null
              );

            }

          }
        }
        onSubmit={
          handleRouteSubmit
        }
      />


      <RouteViewDialog
        open={
          routeViewOpen
        }
        route={
          selectedRoute
        }
        onOpenChange={
          open => {

            setRouteViewOpen(
              open
            );

            if (
              !open
            ) {

              setSelectedRoute(
                null
              );

            }

          }
        }
      />


      <RouteDeleteDialog
        open={
          routeDeleteOpen
        }
        route={
          selectedRoute
        }
        deleting={
          routeDeleting
        }
        markingInactive={
          markingRouteInactive
        }
        error={
          routeDeleteError
        }
        onOpenChange={
          open => {

            setRouteDeleteOpen(
              open
            );

            if (
              !open
            ) {

              setRouteDeleteError(
                null
              );

              setSelectedRoute(
                null
              );

            }

          }
        }
        onDelete={
          handleRouteDelete
        }
        onMarkInactive={
          handleMarkRouteInactive
        }
      />


      {/* ===================================================
          TRIP DIALOGS
      =================================================== */}

      <TripFormDialog
        open={
          tripFormOpen
        }
        mode={
          tripFormMode
        }
        trip={
          selectedTrip
        }
        buses={
          buses
        }
        routes={
          routes
        }
        depots={
          depots
        }
        submitting={
          tripSubmitting
        }
        error={
          tripFormError
        }
        onOpenChange={
          open => {

            setTripFormOpen(
              open
            );

            if (
              !open
            ) {

              setTripFormError(
                null
              );

            }

          }
        }
        onSubmit={
          handleTripSubmit
        }
      />


      <TripViewDialog
        open={
          tripViewOpen
        }
        trip={
          selectedTrip
        }
        onOpenChange={
          open => {

            setTripViewOpen(
              open
            );

            if (
              !open
            ) {

              setSelectedTrip(
                null
              );

            }

          }
        }
      />


      <TripDeleteDialog
        open={
          tripDeleteOpen
        }
        trip={
          selectedTrip
        }
        deleting={
          tripDeleting
        }
        error={
          tripDeleteError
        }
        onOpenChange={
          open => {

            setTripDeleteOpen(
              open
            );

            if (
              !open
            ) {

              setTripDeleteError(
                null
              );

              setSelectedTrip(
                null
              );

            }

          }
        }
        onDelete={
          handleTripDelete
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
// MANAGEMENT ERROR
// =========================================================

function ManagementError(
  {
    error
  }: {
    error: string;
  }
) {

  return (

    <Alert variant="destructive">

      <TriangleAlert className="size-4" />

      <AlertTitle>
        Unable to load management data
      </AlertTitle>

      <AlertDescription>
        {error}
      </AlertDescription>

    </Alert>

  );

}


// =========================================================
// LOADING
// =========================================================

function RouteAnalyticsLoading() {

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