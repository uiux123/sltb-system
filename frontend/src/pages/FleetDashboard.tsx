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
  BusFront,
  CircleGauge,
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
  busesApi
} from "@/api/buses.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  BusDeleteDialog
} from "@/components/fleet/bus-delete-dialog";

import {
  BusFormDialog
} from "@/components/fleet/bus-form-dialog";

import {
  BusManagementTable
} from "@/components/fleet/bus-management-table";

import {
  BusViewDialog
} from "@/components/fleet/bus-view-dialog";

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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import type {
  IFleetAnalytics
} from "@/types/analytics.types";

import type {
  IBus,
  IBusInput,
  IDepot
} from "@/types/fleetManagement.types";

import {
  formatNumber,
  formatPercentage
} from "@/utils/formatters";


// =========================================================
// FLEET STATUS CHART CONFIG
// =========================================================

const fleetStatusChartConfig = {

  operational: {

    label:
      "Operational",

    color:
      "var(--chart-1)"

  },

  maintenance: {

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
// FUEL TYPE CHART CONFIG
// =========================================================

const fuelTypeChartConfig = {

  diesel: {

    label:
      "Diesel",

    color:
      "var(--chart-1)"

  },

  hybrid: {

    label:
      "Hybrid",

    color:
      "var(--chart-2)"

  },

  electric: {

    label:
      "Electric",

    color:
      "var(--chart-3)"

  }

} satisfies ChartConfig;


// =========================================================
// DEPOT CHART CONFIG
// =========================================================

const depotChartConfig = {

  availability: {

    label:
      "Availability",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================
// FLEET DASHBOARD
// =========================================================

export default function FleetDashboard() {

  // =======================================================
  // ANALYTICS STATE
  // =======================================================

  const [
    fleet,
    setFleet
  ] =
    useState<
      IFleetAnalytics | null
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
  // DIALOG STATE
  // =======================================================

  const [
    selectedBus,
    setSelectedBus
  ] =
    useState<
      IBus | null
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


  const [
    markingOutOfService,
    setMarkingOutOfService
  ] =
    useState(
      false
    );


  // =======================================================
  // LOAD FLEET ANALYTICS
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
            await analyticsApi.getFleet();


          setFleet(
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
  // LOAD BUS MANAGEMENT DATA
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
            busResult,
            depotResult
          ] =
            await Promise.all([

              busesApi.getAll(),

              busesApi.getDepots()

            ]);


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
  // REFRESH ANALYTICS + MANAGEMENT
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
  // CREATE / UPDATE BUS
  // =======================================================

  const handleFormSubmit =
    async (
      input:
        IBusInput
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

        // =================================================
        // CREATE
        // =================================================

        if (
          formMode ===
          "create"
        ) {

          await busesApi.create(
            input
          );


          setSuccessMessage(
            "Bus created successfully."
          );

        }

        // =================================================
        // UPDATE
        // =================================================

        else {

          if (
            !selectedBus
          ) {

            return;

          }


          await busesApi.update(

            selectedBus.bus_id,

            input

          );


          setSuccessMessage(
            "Bus updated successfully."
          );

        }


        // =================================================
        // CLOSE FORM
        // =================================================

        setFormOpen(
          false
        );


        setSelectedBus(
          null
        );


        // =================================================
        // REFRESH TABLE + ANALYTICS
        // =================================================

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
  // DELETE BUS
  // =======================================================

  const handleDelete =
    async (): Promise<void> => {

      if (
        !selectedBus
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

        await busesApi.delete(
          selectedBus.bus_id
        );


        setSuccessMessage(
          "Bus deleted successfully."
        );


        setDeleteOpen(
          false
        );


        setSelectedBus(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        // =================================================
        // SAFE DELETE BACKEND ERROR
        // =================================================

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
  // MARK BUS OUT OF SERVICE
  // =======================================================

  const handleMarkOutOfService =
    async (): Promise<void> => {

      if (
        !selectedBus
      ) {

        return;

      }


      setMarkingOutOfService(
        true
      );

      setDeleteError(
        null
      );


      try {

        const updateInput:
          IBusInput = {

            bus_id:
              selectedBus.bus_id,

            registration_no:
              selectedBus.registration_no,

            depot_id:
              selectedBus.depot_id,

            manufacturer:
              selectedBus.manufacturer,

            model:
              selectedBus.model,

            manufacture_year:
              selectedBus.manufacture_year,

            capacity:
              selectedBus.capacity,

            fuel_type:
              selectedBus.fuel_type,

            odometer_km:
              selectedBus.odometer_km,

            bus_status:
              "Out of Service",

            last_service_date:
              selectedBus
                .last_service_date
                .slice(
                  0,
                  10
                )

          };


        await busesApi.update(

          selectedBus.bus_id,

          updateInput

        );


        setSuccessMessage(
          `${selectedBus.bus_id} was marked Out of Service.`
        );


        setDeleteOpen(
          false
        );


        setSelectedBus(
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

        setMarkingOutOfService(
          false
        );

      }

    };


  // =======================================================
  // FLEET STATUS CHART DATA
  // =======================================================

  const statusData =
    useMemo(
      () => {

        if (
          !fleet
        ) {

          return [];

        }


        const fillMap:
          Record<string, string> = {

            Operational:
              "var(--color-operational)",

            "Under Maintenance":
              "var(--color-maintenance)",

            Breakdown:
              "var(--color-breakdown)",

            "Out of Service":
              "var(--color-outOfService)"

          };


        return fleet
          .status_distribution
          .map(
            item => ({

              status:
                item.status,

              count:
                item.count,

              percentage:
                item.percentage,

              fill:
                fillMap[
                  item.status
                ] ??
                "var(--chart-1)"

            })
          );

      },
      [
        fleet
      ]
    );


  // =======================================================
  // FUEL TYPE CHART DATA
  // =======================================================

  const fuelTypeData =
    useMemo(
      () => {

        if (
          !fleet
        ) {

          return [];

        }


        const fillMap:
          Record<string, string> = {

            Diesel:
              "var(--color-diesel)",

            Hybrid:
              "var(--color-hybrid)",

            Electric:
              "var(--color-electric)"

          };


        return fleet
          .fuel_type_distribution
          .map(
            item => ({

              fuel_type:
                item.fuel_type,

              count:
                item.count,

              percentage:
                item.percentage,

              fill:
                fillMap[
                  item.fuel_type
                ] ??
                "var(--chart-1)"

            })
          );

      },
      [
        fleet
      ]
    );


  // =======================================================
  // DEPOT PERFORMANCE CHART DATA
  // =======================================================

  const depotData =
    useMemo(
      () => {

        if (
          !fleet
        ) {

          return [];

        }


        return fleet
          .depot_performance
          .slice(
            0,
            10
          )
          .map(
            item => ({

              depot:
                item.depot_id,

              availability:
                item.availability_percentage

            })
          );

      },
      [
        fleet
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
          PAGE HEADER
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

              <BusFront
                className="size-4"
              />

            </div>


            <Badge
              variant="secondary"
            >
              Fleet Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Fleet Analytics & Management
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse SLTB fleet performance and manage
            individual bus records from one module.
          </p>

        </div>


        {/* =================================================
            REFRESH
        ================================================= */}

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
          SUCCESS MESSAGE
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
            Manage Buses
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
                  Unable to load Fleet Analytics
                </AlertTitle>


                <AlertDescription>
                  {analyticsError}
                </AlertDescription>

              </Alert>

            )
          }


          {/* ===============================================
              LOADING
          =============================================== */}

          {
            analyticsLoading &&
            !fleet
              ? (

                  <FleetLoading />

                )
              : fleet
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

                          title="Total Buses"

                          value={
                            formatNumber(
                              fleet
                                .summary
                                .total_buses
                            )
                          }

                          description="Vehicles represented in the fleet"

                          icon={
                            BusFront
                          }

                        />


                        <KpiCard

                          title="Operational"

                          value={
                            formatNumber(
                              fleet
                                .summary
                                .operational_buses
                            )
                          }

                          description="Buses currently marked Operational"

                          icon={
                            Gauge
                          }

                        />


                        <KpiCard

                          title="Fleet Availability"

                          value={
                            formatPercentage(
                              fleet
                                .summary
                                .fleet_availability_percentage
                            )
                          }

                          description="Operational buses as a percentage of fleet"

                          icon={
                            CircleGauge
                          }

                        />


                        <KpiCard

                          title="Passenger Capacity"

                          value={
                            formatNumber(
                              fleet
                                .age_and_usage
                                .total_passenger_capacity
                            )
                          }

                          description="Total recorded fleet seating capacity"

                          icon={
                            Route
                          }

                        />

                      </section>


                      {/* =====================================
                          STATUS + FUEL TYPE CHARTS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {/* ===================================
                            FLEET STATUS
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Fleet Status
                            </CardTitle>


                            <CardDescription>
                              Current distribution of fleet
                              operational statuses.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                fleetStatusChartConfig
                              }
                              className="
                                mx-auto
                                h-[300px]
                                w-full
                                max-w-[420px]
                              "
                            >

                              <PieChart>

                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent
                                      hideLabel
                                      nameKey="status"
                                    />
                                  }
                                />


                                <Pie
                                  data={
                                    statusData
                                  }
                                  dataKey="count"
                                  nameKey="status"
                                  innerRadius={
                                    65
                                  }
                                  outerRadius={
                                    105
                                  }
                                  strokeWidth={
                                    4
                                  }
                                />

                              </PieChart>

                            </ChartContainer>

                          </CardContent>

                        </Card>


                        {/* ===================================
                            FUEL TYPE
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Fuel Type Distribution
                            </CardTitle>


                            <CardDescription>
                              Number of fleet vehicles by
                              recorded fuel type.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                fuelTypeChartConfig
                              }
                              className="
                                mx-auto
                                h-[300px]
                                w-full
                                max-w-[420px]
                              "
                            >

                              <PieChart>

                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent
                                      hideLabel
                                      nameKey="fuel_type"
                                    />
                                  }
                                />


                                <Pie
                                  data={
                                    fuelTypeData
                                  }
                                  dataKey="count"
                                  nameKey="fuel_type"
                                  innerRadius={
                                    65
                                  }
                                  outerRadius={
                                    105
                                  }
                                  strokeWidth={
                                    4
                                  }
                                />

                              </PieChart>

                            </ChartContainer>

                          </CardContent>

                        </Card>

                      </section>


                      {/* =====================================
                          FLEET AGE / USAGE
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Fleet Age & Usage
                          </CardTitle>


                          <CardDescription>
                            High-level vehicle age, mileage
                            and capacity indicators.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <div
                            className="
                              grid
                              gap-3
                              sm:grid-cols-2
                              lg:grid-cols-3
                            "
                          >

                            <FleetMetric
                              label="Average Vehicle Age"
                              value={`${formatNumber(
                                fleet
                                  .age_and_usage
                                  .average_vehicle_age_years,
                                2
                              )} years`}
                            />


                            <FleetMetric
                              label="Oldest Vehicle Age"
                              value={`${formatNumber(
                                fleet
                                  .age_and_usage
                                  .oldest_vehicle_age_years
                              )} years`}
                            />


                            <FleetMetric
                              label="Newest Vehicle Age"
                              value={`${formatNumber(
                                fleet
                                  .age_and_usage
                                  .newest_vehicle_age_years
                              )} years`}
                            />


                            <FleetMetric
                              label="Average Odometer"
                              value={`${formatNumber(
                                fleet
                                  .age_and_usage
                                  .average_odometer_km
                              )} km`}
                            />


                            <FleetMetric
                              label="Maximum Odometer"
                              value={`${formatNumber(
                                fleet
                                  .age_and_usage
                                  .maximum_odometer_km
                              )} km`}
                            />


                            <FleetMetric
                              label="Average Capacity"
                              value={
                                formatNumber(
                                  fleet
                                    .age_and_usage
                                    .average_bus_capacity,
                                  2
                                )
                              }
                            />

                          </div>

                        </CardContent>

                      </Card>


                      {/* =====================================
                          DEPOT PERFORMANCE
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Depot Fleet Availability
                          </CardTitle>


                          <CardDescription>
                            First ten depot results returned
                            by the Fleet Analytics service.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <ChartContainer
                            config={
                              depotChartConfig
                            }
                            className="
                              h-[340px]
                              w-full
                            "
                          >

                            <BarChart
                              accessibilityLayer
                              data={
                                depotData
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
                                domain={[
                                  0,
                                  100
                                ]}
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
                                dataKey="availability"
                                fill="var(--color-availability)"
                                radius={
                                  5
                                }
                              />

                            </BarChart>

                          </ChartContainer>

                        </CardContent>

                      </Card>


                      {/* =====================================
                          HIGHEST ODOMETER TABLE
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Highest Odometer Buses
                          </CardTitle>


                          <CardDescription>
                            Buses with the highest recorded
                            odometer values.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

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
                                  Status
                                </TableHead>

                                <TableHead
                                  className="text-right"
                                >
                                  Odometer
                                </TableHead>

                              </TableRow>

                            </TableHeader>


                            <TableBody>

                              {
                                fleet
                                  .highest_odometer_buses
                                  .map(
                                    bus => (

                                      <TableRow
                                        key={
                                          bus.bus_id
                                        }
                                      >

                                        <TableCell>

                                          <div
                                            className="
                                              font-medium
                                            "
                                          >
                                            {
                                              bus.bus_id
                                            }
                                          </div>


                                          <div
                                            className="
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            {
                                              bus.registration_no
                                            }
                                          </div>

                                        </TableCell>


                                        <TableCell>

                                          {
                                            bus.manufacturer
                                          }

                                          {" "}

                                          {
                                            bus.model
                                          }

                                        </TableCell>


                                        <TableCell>
                                          {
                                            bus.depot_id
                                          }
                                        </TableCell>


                                        <TableCell>

                                          <Badge
                                            variant="secondary"
                                          >
                                            {
                                              bus.bus_status
                                            }
                                          </Badge>

                                        </TableCell>


                                        <TableCell
                                          className="text-right"
                                        >

                                          {
                                            formatNumber(
                                              bus.odometer_km
                                            )
                                          }{" "}km

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
                  Manage Fleet
                </CardTitle>


                <CardDescription>
                  Create, view, update and safely delete
                  SLTB bus records.
                </CardDescription>

              </div>


              <Button
                onClick={
                  () => {

                    setSelectedBus(
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

                Add Bus

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
                            Unable to load buses
                          </AlertTitle>


                          <AlertDescription>
                            {
                              managementError
                            }
                          </AlertDescription>

                        </Alert>

                      )
                    : (

                        <BusManagementTable

                          buses={
                            buses
                          }

                          onView={
                            bus => {

                              setSelectedBus(
                                bus
                              );

                              setViewOpen(
                                true
                              );

                            }
                          }

                          onEdit={
                            bus => {

                              setSelectedBus(
                                bus
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
                            bus => {

                              setSelectedBus(
                                bus
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

                      )
              }

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>


      {/* ===================================================
          CREATE / EDIT DIALOG
      =================================================== */}

      <BusFormDialog

        open={
          formOpen
        }

        mode={
          formMode
        }

        bus={
          selectedBus
        }

        depots={
          depots
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

        onSubmit={
          handleFormSubmit
        }

      />


      {/* ===================================================
          VIEW DIALOG
      =================================================== */}

      <BusViewDialog

        open={
          viewOpen
        }

        bus={
          selectedBus
        }

        onOpenChange={
          open => {

            setViewOpen(
              open
            );


            if (
              !open
            ) {

              setSelectedBus(
                null
              );

            }

          }
        }

      />


      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <BusDeleteDialog

        open={
          deleteOpen
        }

        bus={
          selectedBus
        }

        deleting={
          deleting
        }

        markingOutOfService={
          markingOutOfService
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

              setSelectedBus(
                null
              );

            }

          }
        }

        onDelete={
          handleDelete
        }

        onMarkOutOfService={
          handleMarkOutOfService
        }

      />

    </div>

  );

}


// =========================================================
// FLEET METRIC
// =========================================================

interface IFleetMetricProps {

  label: string;

  value: string;

}


function FleetMetric(
  {
    label,
    value
  }: IFleetMetricProps
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
// FLEET LOADING
// =========================================================

function FleetLoading() {

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