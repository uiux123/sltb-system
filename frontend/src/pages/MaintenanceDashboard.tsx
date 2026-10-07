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
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";

import {
  Banknote,
  Clock3,
  LoaderCircle,
  Plus,
  RefreshCw,
  TriangleAlert,
  Wrench
} from "lucide-react";

import {
  analyticsApi
} from "@/api/analytics.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  busesApi
} from "@/api/buses.api";

import {
  maintenanceRecordsApi
} from "@/api/maintenanceRecords.api";

import {
  sparePartsApi
} from "@/api/spareParts.api";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  MaintenanceDeleteDialog
} from "@/components/maintenance/maintenance-delete-dialog";

import {
  MaintenanceFormDialog
} from "@/components/maintenance/maintenance-form-dialog";

import {
  MaintenanceManagementTable
} from "@/components/maintenance/maintenance-management-table";

import {
  MaintenanceViewDialog
} from "@/components/maintenance/maintenance-view-dialog";

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
  IMaintenanceAnalytics
} from "@/types/analytics.types";

import type {
  IBus
} from "@/types/fleetManagement.types";

import type {
  IMaintenanceCreateInput,
  IMaintenanceRecord,
  IMaintenanceUpdateInput
} from "@/types/maintenanceManagement.types";

import type {
  ISparePart
} from "@/types/sparePartManagement.types";

import {
  formatCurrency,
  formatDecimal,
  formatHours,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// CHART CONFIGS
// =========================================================

const typeDistributionConfig = {

  preventive: {

    label:
      "Preventive",

    color:
      "var(--chart-1)"

  },

  corrective: {

    label:
      "Corrective",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================

const statusDistributionConfig = {

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

const faultCategoryConfig = {

  records: {

    label:
      "Maintenance Records",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const costTrendConfig = {

  cost: {

    label:
      "Maintenance Cost",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const downtimeTrendConfig = {

  downtime: {

    label:
      "Downtime Hours",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// MAINTENANCE DASHBOARD
// =========================================================

export default function MaintenanceDashboard() {

  // =======================================================
  // ANALYTICS STATE
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IMaintenanceAnalytics | null
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
    maintenanceRecords,
    setMaintenanceRecords
  ] =
    useState<
      IMaintenanceRecord[]
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
    spareParts,
    setSpareParts
  ] =
    useState<
      ISparePart[]
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
    selectedMaintenance,
    setSelectedMaintenance
  ] =
    useState<
      IMaintenanceRecord | null
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
            await analyticsApi.getMaintenance();


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
            maintenanceResult,
            busResult,
            sparePartResult
          ] =
            await Promise.all([

              maintenanceRecordsApi.getAll(),

              busesApi.getAll(),

              sparePartsApi.getAll()

            ]);


          setMaintenanceRecords(
            maintenanceResult
          );


          setBuses(
            busResult
          );


          setSpareParts(
            sparePartResult
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
  // CREATE MAINTENANCE
  // =======================================================

  const handleCreate =
    async (
      input:
        IMaintenanceCreateInput
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

        await maintenanceRecordsApi.create(
          input
        );


        setSuccessMessage(
          "Maintenance Record created successfully. Spare-part inventory and bus status were synchronized by the backend transaction."
        );


        setFormOpen(
          false
        );


        setSelectedMaintenance(
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
  // UPDATE MAINTENANCE
  // =======================================================

  const handleUpdate =
    async (
      input:
        IMaintenanceUpdateInput
    ): Promise<void> => {

      if (
        !selectedMaintenance
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

        await maintenanceRecordsApi.update(

          selectedMaintenance
            .maintenance_id,

          input

        );


        setSuccessMessage(
          "Maintenance Record updated successfully."
        );


        setFormOpen(
          false
        );


        setSelectedMaintenance(
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
  // DELETE / TRANSACTIONAL REVERSAL
  // =======================================================

  const handleDelete =
    async (): Promise<void> => {

      if (
        !selectedMaintenance
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

        await maintenanceRecordsApi.delete(
          selectedMaintenance
            .maintenance_id
        );


        setSuccessMessage(
          "Maintenance Record deleted successfully. Its transactional inventory effect was reversed by the backend."
        );


        setDeleteOpen(
          false
        );


        setSelectedMaintenance(
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
  // TYPE DISTRIBUTION
  // =======================================================

  const typeDistributionData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        const fills:
          Record<string, string> = {

            Preventive:
              "var(--color-preventive)",

            Corrective:
              "var(--color-corrective)"

          };


        return analytics
          .type_distribution
          .map(
            item => ({

              type:
                item.maintenance_type,

              count:
                item.count,

              percentage:
                item.percentage,

              fill:
                fills[
                  item.maintenance_type
                ] ??
                "var(--chart-1)"

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // STATUS DISTRIBUTION
  // =======================================================

  const statusDistributionData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        const fills:
          Record<string, string> = {

            Completed:
              "var(--color-completed)",

            "In Progress":
              "var(--color-inProgress)"

          };


        return analytics
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
                fills[
                  item.status
                ] ??
                "var(--chart-1)"

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // FAULT CATEGORY DATA
  // =======================================================

  const faultCategoryData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return [
          ...analytics.fault_categories
        ]
          .sort(
            (
              first,
              second
            ) =>
              second.maintenance_count -
              first.maintenance_count
          )
          .slice(
            0,
            10
          )
          .map(
            item => ({

              category:
                item.fault_category,

              records:
                item.maintenance_count

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // MONTHLY TREND
  // =======================================================

  const monthlyTrendData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return analytics
          .monthly_trend
          .map(
            item => ({

              month:
                item.month,

              cost:
                item.total_maintenance_cost,

              downtime:
                item.total_downtime_hours

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

              <Wrench
                className="size-4"
              />

            </div>


            <Badge
              variant="secondary"
            >
              Maintenance Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Maintenance Analytics & Management
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse maintenance cost, downtime and faults
            while managing transactional maintenance
            operations.
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
            Manage Maintenance
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
                  Unable to load Maintenance Analytics
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

                  <MaintenanceLoading />

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
                          title="Maintenance Records"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_maintenance_records
                            )
                          }
                          description={`${formatNumber(
                            analytics
                              .summary
                              .completed_maintenance
                          )} completed records`}
                          icon={
                            Wrench
                          }
                        />


                        <KpiCard
                          title="Maintenance Cost"
                          value={
                            formatCurrency(
                              analytics
                                .summary
                                .total_maintenance_cost
                            )
                          }
                          description="Total parts and labour expenditure"
                          icon={
                            Banknote
                          }
                        />


                        <KpiCard
                          title="Total Downtime"
                          value={
                            formatHours(
                              analytics
                                .summary
                                .total_downtime_hours
                            )
                          }
                          description={`${formatDecimal(
                            analytics
                              .summary
                              .average_downtime_hours,
                            2
                          )} average hours`}
                          icon={
                            Clock3
                          }
                        />


                        <KpiCard
                          title="In Progress"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .in_progress_maintenance
                            )
                          }
                          description="Maintenance records not yet completed"
                          icon={
                            Wrench
                          }
                        />

                      </section>


                      {/* =====================================
                          COST SUMMARY
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Maintenance Cost Summary
                          </CardTitle>


                          <CardDescription>
                            Parts, labour and repair cost
                            indicators calculated by the
                            backend.
                          </CardDescription>

                        </CardHeader>


                        <CardContent
                          className="
                            grid
                            gap-3
                            sm:grid-cols-4
                          "
                        >

                          <SummaryMetric
                            label="Parts Cost"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .total_parts_cost,
                                2
                              )
                            }
                          />


                          <SummaryMetric
                            label="Labour Cost"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .total_labour_cost,
                                2
                              )
                            }
                          />


                          <SummaryMetric
                            label="Average Repair Cost"
                            value={
                              formatCurrency(
                                analytics
                                  .summary
                                  .average_repair_cost,
                                2
                              )
                            }
                          />


                          <SummaryMetric
                            label="Corrective Maintenance"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .corrective_maintenance
                              )
                            }
                          />

                        </CardContent>

                      </Card>


                      {/* =====================================
                          TYPE + STATUS DISTRIBUTION
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {/* ===================================
                            MAINTENANCE TYPE
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Maintenance Type Distribution
                            </CardTitle>


                            <CardDescription>
                              Preventive and corrective
                              maintenance record distribution.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                typeDistributionConfig
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
                                      nameKey="type"
                                    />
                                  }
                                />


                                <Pie
                                  data={
                                    typeDistributionData
                                  }
                                  dataKey="count"
                                  nameKey="type"
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
                            STATUS
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Maintenance Status
                            </CardTitle>


                            <CardDescription>
                              Completed and currently
                              in-progress maintenance.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                statusDistributionConfig
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
                                    statusDistributionData
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

                      </section>


                      {/* =====================================
                          FAULT CATEGORY ANALYSIS
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Fault Category Analysis
                          </CardTitle>


                          <CardDescription>
                            Most frequently recorded
                            maintenance fault categories.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <ChartContainer
                            config={
                              faultCategoryConfig
                            }
                            className="
                              h-[340px]
                              w-full
                            "
                          >

                            <BarChart
                              accessibilityLayer
                              data={
                                faultCategoryData
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
                                dataKey="records"
                                fill="var(--color-records)"
                                radius={
                                  5
                                }
                              />

                            </BarChart>

                          </ChartContainer>

                        </CardContent>

                      </Card>


                      {/* =====================================
                          MONTHLY TRENDS
                      ===================================== */}

                      <section
                        className="
                          grid
                          gap-4
                          xl:grid-cols-2
                        "
                      >

                        {/* ===================================
                            COST TREND
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Maintenance Cost Trend
                            </CardTitle>


                            <CardDescription>
                              Total maintenance expenditure
                              by month.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                costTrendConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <LineChart
                                accessibilityLayer
                                data={
                                  monthlyTrendData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="month"
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


                        {/* ===================================
                            DOWNTIME TREND
                        =================================== */}

                        <Card>

                          <CardHeader>

                            <CardTitle>
                              Maintenance Downtime Trend
                            </CardTitle>


                            <CardDescription>
                              Total recorded vehicle
                              downtime by month.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                downtimeTrendConfig
                              }
                              className="
                                h-[320px]
                                w-full
                              "
                            >

                              <LineChart
                                accessibilityLayer
                                data={
                                  monthlyTrendData
                                }
                              >

                                <CartesianGrid
                                  vertical={
                                    false
                                  }
                                />


                                <XAxis
                                  dataKey="month"
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


                                <Line
                                  type="monotone"
                                  dataKey="downtime"
                                  stroke="var(--color-downtime)"
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
                          HIGH COST BUSES
                      ===================================== */}

                      <MaintenanceBusTable
                        title="Highest Maintenance Cost Buses"
                        description="Buses with the largest accumulated maintenance expenditure."
                        records={
                          analytics
                            .highest_maintenance_cost_buses
                        }
                      />


                      {/* =====================================
                          HIGH DOWNTIME BUSES
                      ===================================== */}

                      <MaintenanceBusTable
                        title="Highest Downtime Buses"
                        description="Buses with the greatest recorded maintenance downtime."
                        records={
                          analytics
                            .highest_downtime_buses
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
                  Manage Maintenance
                </CardTitle>


                <CardDescription>
                  Create, view, update and transactionally
                  reverse maintenance records.
                </CardDescription>

              </div>


              <Button
                disabled={
                  managementLoading
                }
                onClick={
                  () => {

                    setSelectedMaintenance(
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

                Add Maintenance

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
                            Unable to load Maintenance Records
                          </AlertTitle>


                          <AlertDescription>
                            {managementError}
                          </AlertDescription>

                        </Alert>

                      )
                    : (

                        <MaintenanceManagementTable

                          maintenanceRecords={
                            maintenanceRecords
                          }

                          onView={
                            record => {

                              setSelectedMaintenance(
                                record
                              );


                              setViewOpen(
                                true
                              );

                            }
                          }

                          onEdit={
                            record => {

                              setSelectedMaintenance(
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

                              setSelectedMaintenance(
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

                      )
              }

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>


      {/* ===================================================
          CREATE / EDIT DIALOG
      =================================================== */}

      <MaintenanceFormDialog

        open={
          formOpen
        }

        mode={
          formMode
        }

        maintenanceRecord={
          selectedMaintenance
        }

        buses={
          buses
        }

        spareParts={
          spareParts
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

      <MaintenanceViewDialog

        open={
          viewOpen
        }

        maintenanceRecord={
          selectedMaintenance
        }

        onOpenChange={
          open => {

            setViewOpen(
              open
            );


            if (
              !open
            ) {

              setSelectedMaintenance(
                null
              );

            }

          }
        }

      />


      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <MaintenanceDeleteDialog

        open={
          deleteOpen
        }

        maintenanceRecord={
          selectedMaintenance
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


              setSelectedMaintenance(
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
// MAINTENANCE BUS TABLE
// =========================================================

interface IMaintenanceBusTableProps {

  title: string;

  description: string;

  records:
    IMaintenanceAnalytics[
      "highest_maintenance_cost_buses"
    ];

}


function MaintenanceBusTable(
  {
    title,
    description,
    records
  }: IMaintenanceBusTableProps
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
                  Records
                </TableHead>

                <TableHead>
                  Maintenance Cost
                </TableHead>

                <TableHead
                  className="text-right"
                >
                  Downtime
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
                          formatNumber(
                            record.total_maintenance_records
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.total_maintenance_cost,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell
                        className="text-right"
                      >
                        {
                          formatHours(
                            record.total_downtime_hours,
                            2
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

function MaintenanceLoading() {

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