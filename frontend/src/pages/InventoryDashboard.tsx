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
  Boxes,
  LoaderCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  TriangleAlert
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
  sparePartsApi
} from "@/api/spareParts.api";

import {
  KpiCard
} from "@/components/dashboard/kpi-card";

import {
  SparePartDeleteDialog
} from "@/components/inventory/spare-part-delete-dialog";

import {
  SparePartFormDialog
} from "@/components/inventory/spare-part-form-dialog";

import {
  SparePartManagementTable
} from "@/components/inventory/spare-part-management-table";

import {
  SparePartRestockDialog
} from "@/components/inventory/spare-part-restock-dialog";

import {
  SparePartViewDialog
} from "@/components/inventory/spare-part-view-dialog";

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
  IDepot
} from "@/types/fleetManagement.types";

import type {
  ISparePart,
  ISparePartCreateInput,
  ISparePartUpdateInput
} from "@/types/sparePartManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// LOCAL ANALYTICS VIEW TYPES
// =========================================================

interface IInventorySummaryView {

  total_spare_part_records: number;

  available_parts: number;

  low_stock_parts: number;

  out_of_stock_parts: number;

  total_units_in_stock: number;

  total_inventory_value: number;

}


interface IStockDistributionView {

  stock_status: string;

  count: number;

  percentage: number;

}


interface ICategoryPerformanceView {

  part_category: string;

  total_part_records: number;

  total_units_in_stock: number;

  total_inventory_value: number;

}


interface IDepotPerformanceView {

  depot_id: string;

  depot_name: string;

  total_part_records: number;

  total_units_in_stock: number;

  total_inventory_value: number;

}


interface IPartUsageView {

  part_id: string;

  part_name: string;

  part_category: string;

  usage_count: number;

  total_quantity_used: number;

}


interface IReorderAttentionView {

  part_id: string;

  part_name: string;

  part_category: string;

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  unit_cost: number;

  stock_status: string;

  shortage_quantity: number;

}


interface IInventoryAnalyticsView {

  summary:
    IInventorySummaryView;

  stock_status_distribution:
    IStockDistributionView[];

  category_performance:
    ICategoryPerformanceView[];

  depot_performance:
    IDepotPerformanceView[];

  most_used_parts:
    IPartUsageView[];

  reorder_attention:
    IReorderAttentionView[];

}


// =========================================================
// UNKNOWN RECORD HELPERS
// =========================================================

type UnknownRecord =
  Record<
    string,
    unknown
  >;


// =========================================================

function asRecord(
  value: unknown
): UnknownRecord {

  if (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value
    )
  ) {

    return value as UnknownRecord;

  }


  return {};

}


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
// NORMALIZE INVENTORY ANALYTICS
// =========================================================

function normalizeInventoryAnalytics(
  value: unknown
): IInventoryAnalyticsView {

  const root =
    asRecord(
      value
    );


  const summarySource =
    asRecord(
      root.summary
    );


  const summary:
    IInventorySummaryView = {

      total_spare_part_records:
        readNumber(
          summarySource,
          [
            "total_spare_part_records",
            "total_spare_parts"
          ]
        ),

      available_parts:
        readNumber(
          summarySource,
          [
            "available_parts"
          ]
        ),

      low_stock_parts:
        readNumber(
          summarySource,
          [
            "low_stock_parts"
          ]
        ),

      out_of_stock_parts:
        readNumber(
          summarySource,
          [
            "out_of_stock_parts"
          ]
        ),

      total_units_in_stock:
        readNumber(
          summarySource,
          [
            "total_units_in_stock",
            "total_inventory_units"
          ]
        ),

      total_inventory_value:
        readNumber(
          summarySource,
          [
            "total_inventory_value"
          ]
        )

    };


  const stockStatusDistribution =
    readArray(
      root,
      "stock_status_distribution"
    )
      .map(
        valueItem => {

          const item =
            asRecord(
              valueItem
            );


          const count =
            readNumber(
              item,
              [
                "count",
                "part_count"
              ]
            );


          const providedPercentage =
            readNumber(
              item,
              [
                "percentage"
              ],
              -1
            );


          const percentage =

            providedPercentage >=
              0
              ? providedPercentage
              : summary.total_spare_part_records >
                  0
                ? Number(
                    (
                      (
                        count /
                        summary.total_spare_part_records
                      ) *
                      100
                    ).toFixed(
                      2
                    )
                  )
                : 0;


          return {

            stock_status:
              readString(
                item,
                [
                  "stock_status",
                  "status"
                ]
              ),

            count,

            percentage

          };

        }
      );


  const categoryPerformance =
    readArray(
      root,
      "category_performance"
    )
      .map(
        valueItem => {

          const item =
            asRecord(
              valueItem
            );


          return {

            part_category:
              readString(
                item,
                [
                  "part_category",
                  "category"
                ]
              ),

            total_part_records:
              readNumber(
                item,
                [
                  "total_part_records",
                  "part_count",
                  "total_parts"
                ]
              ),

            total_units_in_stock:
              readNumber(
                item,
                [
                  "total_units_in_stock",
                  "quantity_in_stock",
                  "total_quantity"
                ]
              ),

            total_inventory_value:
              readNumber(
                item,
                [
                  "total_inventory_value",
                  "inventory_value"
                ]
              )

          };

        }
      );


  const depotPerformance =
    readArray(
      root,
      "depot_performance"
    )
      .map(
        valueItem => {

          const item =
            asRecord(
              valueItem
            );


          return {

            depot_id:
              readString(
                item,
                [
                  "depot_id"
                ]
              ),

            depot_name:
              readString(
                item,
                [
                  "depot_name"
                ]
              ),

            total_part_records:
              readNumber(
                item,
                [
                  "total_part_records",
                  "part_count",
                  "total_parts"
                ]
              ),

            total_units_in_stock:
              readNumber(
                item,
                [
                  "total_units_in_stock",
                  "total_quantity",
                  "quantity_in_stock"
                ]
              ),

            total_inventory_value:
              readNumber(
                item,
                [
                  "total_inventory_value",
                  "inventory_value"
                ]
              )

          };

        }
      );


  const mostUsedParts =
    readArray(
      root,
      "most_used_parts"
    )
      .map(
        valueItem => {

          const item =
            asRecord(
              valueItem
            );


          return {

            part_id:
              readString(
                item,
                [
                  "part_id"
                ]
              ),

            part_name:
              readString(
                item,
                [
                  "part_name"
                ]
              ),

            part_category:
              readString(
                item,
                [
                  "part_category",
                  "category"
                ]
              ),

            usage_count:
              readNumber(
                item,
                [
                  "usage_count",
                  "maintenance_usage_count"
                ]
              ),

            total_quantity_used:
              readNumber(
                item,
                [
                  "total_quantity_used",
                  "quantity_used"
                ]
              )

          };

        }
      );


  const reorderAttention =
    readArray(
      root,
      "reorder_attention"
    )
      .map(
        valueItem => {

          const item =
            asRecord(
              valueItem
            );


          const quantity =
            readNumber(
              item,
              [
                "quantity_in_stock",
                "current_stock"
              ]
            );


          const reorderLevel =
            readNumber(
              item,
              [
                "reorder_level"
              ]
            );


          return {

            part_id:
              readString(
                item,
                [
                  "part_id"
                ]
              ),

            part_name:
              readString(
                item,
                [
                  "part_name"
                ]
              ),

            part_category:
              readString(
                item,
                [
                  "part_category",
                  "category"
                ]
              ),

            depot_id:
              readString(
                item,
                [
                  "depot_id"
                ]
              ),

            quantity_in_stock:
              quantity,

            reorder_level:
              reorderLevel,

            unit_cost:
              readNumber(
                item,
                [
                  "unit_cost"
                ]
              ),

            stock_status:
              readString(
                item,
                [
                  "stock_status"
                ]
              ),

            shortage_quantity:
              readNumber(
                item,
                [
                  "shortage_quantity",
                  "reorder_quantity"
                ],
                Math.max(
                  reorderLevel -
                  quantity,
                  0
                )
              )

          };

        }
      );


  return {

    summary,

    stock_status_distribution:
      stockStatusDistribution,

    category_performance:
      categoryPerformance,

    depot_performance:
      depotPerformance,

    most_used_parts:
      mostUsedParts,

    reorder_attention:
      reorderAttention

  };

}


// =========================================================
// CHART CONFIGS
// =========================================================

const stockStatusConfig = {

  available: {

    label:
      "Available",

    color:
      "var(--chart-1)"

  },

  lowStock: {

    label:
      "Low Stock",

    color:
      "var(--chart-2)"

  },

  outOfStock: {

    label:
      "Out of Stock",

    color:
      "var(--chart-3)"

  }

} satisfies ChartConfig;


// =========================================================

const categoryValueConfig = {

  value: {

    label:
      "Inventory Value",

    color:
      "var(--chart-1)"

  }

} satisfies ChartConfig;


// =========================================================

const depotValueConfig = {

  value: {

    label:
      "Inventory Value",

    color:
      "var(--chart-2)"

  }

} satisfies ChartConfig;


// =========================================================
// INVENTORY DASHBOARD
// =========================================================

export default function InventoryDashboard() {

  // =======================================================
  // ANALYTICS STATE
  // =======================================================

  const [
    analytics,
    setAnalytics
  ] =
    useState<
      IInventoryAnalyticsView | null
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
    spareParts,
    setSpareParts
  ] =
    useState<
      ISparePart[]
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
    selectedSparePart,
    setSelectedSparePart
  ] =
    useState<
      ISparePart | null
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
    restockOpen,
    setRestockOpen
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
    restocking,
    setRestocking
  ] =
    useState(
      false
    );


  const [
    restockError,
    setRestockError
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
            await analyticsApi.getInventory();


          setAnalytics(
            normalizeInventoryAnalytics(
              result
            )
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
            sparePartResult,
            depotResult
          ] =
            await Promise.all([

              sparePartsApi.getAll(),

              busesApi.getDepots()

            ]);


          setSpareParts(
            sparePartResult
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
  // REFRESH
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
  // CREATE
  // =======================================================

  const handleCreate =
    async (
      input:
        ISparePartCreateInput
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

        await sparePartsApi.create(
          input
        );


        setSuccessMessage(
          "Spare Part created successfully."
        );


        setFormOpen(
          false
        );


        setSelectedSparePart(
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
        ISparePartUpdateInput
    ): Promise<void> => {

      if (
        !selectedSparePart
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

        await sparePartsApi.update(

          selectedSparePart.part_id,

          input

        );


        setSuccessMessage(
          "Spare Part updated successfully."
        );


        setFormOpen(
          false
        );


        setSelectedSparePart(
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
  // RESTOCK
  // =======================================================

  const handleRestock =
    async (
      quantity: number
    ): Promise<void> => {

      if (
        !selectedSparePart
      ) {

        return;

      }


      setRestocking(
        true
      );


      setRestockError(
        null
      );


      setSuccessMessage(
        null
      );


      try {

        await sparePartsApi.restock(

          selectedSparePart.part_id,

          {
            quantity
          }

        );


        setSuccessMessage(
          `${selectedSparePart.part_id} restocked successfully.`
        );


        setRestockOpen(
          false
        );


        setSelectedSparePart(
          null
        );


        await refreshAll();

      } catch (
        requestError
      ) {

        setRestockError(
          getApiErrorMessage(
            requestError
          )
        );

      } finally {

        setRestocking(
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
        !selectedSparePart
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

        await sparePartsApi.delete(
          selectedSparePart.part_id
        );


        setSuccessMessage(
          "Spare Part deleted successfully."
        );


        setDeleteOpen(
          false
        );


        setSelectedSparePart(
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
  // STOCK STATUS CHART
  // =======================================================

  const stockStatusData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        const fills:
          Record<string, string> = {

            Available:
              "var(--color-available)",

            "Low Stock":
              "var(--color-lowStock)",

            "Out of Stock":
              "var(--color-outOfStock)"

          };


        return analytics
          .stock_status_distribution
          .map(
            item => ({

              status:
                item.stock_status,

              count:
                item.count,

              percentage:
                item.percentage,

              fill:
                fills[
                  item.stock_status
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
  // CATEGORY VALUE
  // =======================================================

  const categoryValueData =
    useMemo(
      () => {

        if (
          !analytics
        ) {

          return [];

        }


        return [
          ...analytics.category_performance
        ]
          .sort(
            (
              first,
              second
            ) =>
              second.total_inventory_value -
              first.total_inventory_value
          )
          .slice(
            0,
            10
          )
          .map(
            item => ({

              category:
                item.part_category,

              value:
                item.total_inventory_value

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // DEPOT VALUE
  // =======================================================

  const depotValueData =
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
              second.total_inventory_value -
              first.total_inventory_value
          )
          .slice(
            0,
            10
          )
          .map(
            item => ({

              depot:
                item.depot_id,

              value:
                item.total_inventory_value

            })
          );

      },
      [
        analytics
      ]
    );


  // =======================================================
  // HIGHEST INVENTORY VALUE PARTS
  // =======================================================

  const highestValueParts =
    useMemo(
      () => {

        return [
          ...spareParts
        ]
          .sort(
            (
              first,
              second
            ) => {

              const firstValue =

                first.quantity_in_stock *
                first.unit_cost;


              const secondValue =

                second.quantity_in_stock *
                second.unit_cost;


              return (
                secondValue -
                firstValue
              );

            }
          )
          .slice(
            0,
            10
          );

      },
      [
        spareParts
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

              <Boxes className="size-4" />

            </div>


            <Badge variant="secondary">
              Inventory Module
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Inventory Analytics & Management
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            Analyse spare-part stock, inventory value,
            maintenance usage and reorder requirements while
            managing depot inventory.
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
          SUCCESS MESSAGE
      =================================================== */}

      {
        successMessage && (

          <Alert>

            <PackageCheck className="size-4" />


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
            Manage Spare Parts
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
                  Unable to load Inventory Analytics
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

                  <InventoryLoading />

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
                          title="Spare Part Records"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_spare_part_records
                            )
                          }
                          description="Inventory records currently tracked"
                          icon={
                            Boxes
                          }
                        />


                        <KpiCard
                          title="Units in Stock"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .total_units_in_stock
                            )
                          }
                          description="Total spare-part units currently held"
                          icon={
                            PackageCheck
                          }
                        />


                        <KpiCard
                          title="Low / Out of Stock"
                          value={
                            formatNumber(
                              analytics
                                .summary
                                .low_stock_parts +
                              analytics
                                .summary
                                .out_of_stock_parts
                            )
                          }
                          description={`${formatNumber(
                            analytics
                              .summary
                              .out_of_stock_parts
                          )} completely out of stock`}
                          icon={
                            TriangleAlert
                          }
                        />


                        <KpiCard
                          title="Inventory Value"
                          value={
                            formatCurrency(
                              analytics
                                .summary
                                .total_inventory_value
                            )
                          }
                          description="Current quantity × unit cost"
                          icon={
                            Banknote
                          }
                        />

                      </section>


                      {/* =====================================
                          STOCK SUMMARY
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Inventory Stock Summary
                          </CardTitle>


                          <CardDescription>
                            Current spare-part availability
                            indicators.
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
                            label="Available Parts"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .available_parts
                              )
                            }
                          />


                          <SummaryMetric
                            label="Low Stock Parts"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .low_stock_parts
                              )
                            }
                          />


                          <SummaryMetric
                            label="Out of Stock Parts"
                            value={
                              formatNumber(
                                analytics
                                  .summary
                                  .out_of_stock_parts
                              )
                            }
                          />

                        </CardContent>

                      </Card>


                      {/* =====================================
                          STATUS DISTRIBUTION
                      ===================================== */}

                      <Card>

                        <CardHeader>

                          <CardTitle>
                            Stock Status Distribution
                          </CardTitle>


                          <CardDescription>
                            Inventory records grouped by
                            their backend-calculated stock
                            status.
                          </CardDescription>

                        </CardHeader>


                        <CardContent>

                          <ChartContainer
                            config={
                              stockStatusConfig
                            }
                            className="
                              mx-auto
                              h-[320px]
                              w-full
                              max-w-[460px]
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
                                  stockStatusData
                                }
                                dataKey="count"
                                nameKey="status"
                                innerRadius={
                                  70
                                }
                                outerRadius={
                                  110
                                }
                                strokeWidth={
                                  4
                                }
                              />

                            </PieChart>

                          </ChartContainer>

                        </CardContent>

                      </Card>


                      {/* =====================================
                          CATEGORY / DEPOT VALUE
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
                              Inventory Value by Category
                            </CardTitle>


                            <CardDescription>
                              Categories with the highest
                              current inventory values.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                categoryValueConfig
                              }
                              className="
                                h-[340px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  categoryValueData
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
                                />


                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent />
                                  }
                                />


                                <Bar
                                  dataKey="value"
                                  fill="var(--color-value)"
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
                              Inventory Value by Depot
                            </CardTitle>


                            <CardDescription>
                              Depots with the highest
                              recorded spare-part inventory
                              value.
                            </CardDescription>

                          </CardHeader>


                          <CardContent>

                            <ChartContainer
                              config={
                                depotValueConfig
                              }
                              className="
                                h-[340px]
                                w-full
                              "
                            >

                              <BarChart
                                accessibilityLayer
                                data={
                                  depotValueData
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
                                  dataKey="value"
                                  fill="var(--color-value)"
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
                          MOST USED PARTS
                      ===================================== */}

                      <MostUsedPartsTable
                        records={
                          analytics
                            .most_used_parts
                        }
                      />


                      {/* =====================================
                          HIGHEST VALUE PARTS
                      ===================================== */}

                      <HighestValuePartsTable
                        records={
                          highestValueParts
                        }
                      />


                      {/* =====================================
                          REORDER ATTENTION
                      ===================================== */}

                      <ReorderAttentionTable
                        records={
                          analytics
                            .reorder_attention
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
                  Manage Spare Parts
                </CardTitle>


                <CardDescription>
                  Create, view, update, restock and safely
                  delete spare-part inventory records.
                </CardDescription>

              </div>


              <Button
                disabled={
                  managementLoading
                }
                onClick={
                  () => {

                    setSelectedSparePart(
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
                Add Spare Part

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
                            Unable to load Spare Parts
                          </AlertTitle>


                          <AlertDescription>
                            {managementError}
                          </AlertDescription>

                        </Alert>

                      )
                    : (

                        <SparePartManagementTable

                          spareParts={
                            spareParts
                          }

                          onView={
                            part => {

                              setSelectedSparePart(
                                part
                              );


                              setViewOpen(
                                true
                              );

                            }
                          }

                          onEdit={
                            part => {

                              setSelectedSparePart(
                                part
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

                          onRestock={
                            part => {

                              setSelectedSparePart(
                                part
                              );


                              setRestockError(
                                null
                              );


                              setSuccessMessage(
                                null
                              );


                              setRestockOpen(
                                true
                              );

                            }
                          }

                          onDelete={
                            part => {

                              setSelectedSparePart(
                                part
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
          FORM DIALOG
      =================================================== */}

      <SparePartFormDialog

        open={
          formOpen
        }

        mode={
          formMode
        }

        sparePart={
          selectedSparePart
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

      <SparePartViewDialog

        open={
          viewOpen
        }

        sparePart={
          selectedSparePart
        }

        onOpenChange={
          open => {

            setViewOpen(
              open
            );


            if (
              !open
            ) {

              setSelectedSparePart(
                null
              );

            }

          }
        }

      />


      {/* ===================================================
          RESTOCK DIALOG
      =================================================== */}

      <SparePartRestockDialog

        open={
          restockOpen
        }

        sparePart={
          selectedSparePart
        }

        restocking={
          restocking
        }

        error={
          restockError
        }

        onOpenChange={
          open => {

            setRestockOpen(
              open
            );


            if (
              !open
            ) {

              setRestockError(
                null
              );


              setSelectedSparePart(
                null
              );

            }

          }
        }

        onRestock={
          handleRestock
        }

      />


      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <SparePartDeleteDialog

        open={
          deleteOpen
        }

        sparePart={
          selectedSparePart
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


              setSelectedSparePart(
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

function SummaryMetric(
  {
    label,
    value
  }: {
    label: string;
    value: string;
  }
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
// MOST USED PARTS TABLE
// =========================================================

function MostUsedPartsTable(
  {
    records
  }: {
    records:
      IPartUsageView[];
  }
) {

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Most Used Spare Parts
        </CardTitle>


        <CardDescription>
          Spare parts most frequently referenced by
          maintenance operations.
        </CardDescription>

      </CardHeader>


      <CardContent>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Part
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Maintenance Uses
                </TableHead>

                <TableHead className="text-right">
                  Quantity Used
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.map(
                  record => (

                    <TableRow
                      key={
                        record.part_id
                      }
                    >

                      <TableCell>

                        <div className="font-medium">
                          {record.part_id}
                        </div>


                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {record.part_name}
                        </div>

                      </TableCell>


                      <TableCell>
                        {record.part_category}
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.usage_count
                          )
                        }
                      </TableCell>


                      <TableCell className="text-right">
                        {
                          formatNumber(
                            record.total_quantity_used
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
// HIGHEST VALUE PARTS
// =========================================================

function HighestValuePartsTable(
  {
    records
  }: {
    records:
      ISparePart[];
  }
) {

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Highest Value Spare Parts
        </CardTitle>


        <CardDescription>
          Current inventory records with the largest
          quantity × unit-cost values.
        </CardDescription>

      </CardHeader>


      <CardContent>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Part
                </TableHead>

                <TableHead>
                  Depot
                </TableHead>

                <TableHead>
                  Quantity
                </TableHead>

                <TableHead>
                  Unit Cost
                </TableHead>

                <TableHead className="text-right">
                  Inventory Value
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.map(
                  record => (

                    <TableRow
                      key={
                        record.part_id
                      }
                    >

                      <TableCell>

                        <div className="font-medium">
                          {record.part_id}
                        </div>


                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {record.part_name}
                        </div>

                      </TableCell>


                      <TableCell>
                        {record.depot_id}
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.quantity_in_stock
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatCurrency(
                            record.unit_cost,
                            2
                          )
                        }
                      </TableCell>


                      <TableCell className="text-right">
                        {
                          formatCurrency(
                            record.quantity_in_stock *
                            record.unit_cost,
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
// REORDER ATTENTION
// =========================================================

function ReorderAttentionTable(
  {
    records
  }: {
    records:
      IReorderAttentionView[];
  }
) {

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Reorder Attention
        </CardTitle>


        <CardDescription>
          Spare parts requiring stock attention based on
          current quantity and reorder levels.
        </CardDescription>

      </CardHeader>


      <CardContent>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Part
                </TableHead>

                <TableHead>
                  Depot
                </TableHead>

                <TableHead>
                  Current Stock
                </TableHead>

                <TableHead>
                  Reorder Level
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead className="text-right">
                  Suggested Gap
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {
                records.map(
                  record => (

                    <TableRow
                      key={
                        `${record.part_id}-${record.depot_id}`
                      }
                    >

                      <TableCell>

                        <div className="font-medium">
                          {record.part_id}
                        </div>


                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {record.part_name}
                        </div>

                      </TableCell>


                      <TableCell>
                        {record.depot_id}
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.quantity_in_stock
                          )
                        }
                      </TableCell>


                      <TableCell>
                        {
                          formatNumber(
                            record.reorder_level
                          )
                        }
                      </TableCell>


                      <TableCell>

                        <Badge
                          variant={
                            record.stock_status ===
                              "Out of Stock"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {
                            record.stock_status ||
                            "Low Stock"
                          }
                        </Badge>

                      </TableCell>


                      <TableCell className="text-right">
                        {
                          formatNumber(
                            record.shortage_quantity
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

function InventoryLoading() {

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