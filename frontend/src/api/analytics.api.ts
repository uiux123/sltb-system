import type {
  AxiosRequestConfig
} from "axios";

import {
  apiClient
} from "@/api/apiClient";

import type {
  IApiSuccessResponse
} from "@/types/api.types";

import type {
  IAnalyticsFilterInput,
  IAnalyticsFilterOptions,
  IAnalyticsModuleStatus,
  IFilteredAnalytics,
  IFleetAnalytics,
  IFuelAnalytics,
  IIntegratedBusAnalytics,
  IInventoryAnalytics,
  IMaintenanceAnalytics,
  IOverviewAnalytics,
  IRevenueAnalytics,
  IRouteTripAnalytics
} from "@/types/analytics.types";


// =========================================================
// ANALYTICS ENDPOINT PATHS
// =========================================================
//
// apiClient already uses:
//
// /api
//
// Therefore:
//
// /analytics/health
//
// becomes:
//
// /api/analytics/health
//
// =========================================================

export const analyticsEndpoints = {

  health:
    "/analytics/health",

  overview:
    "/analytics/overview",

  fleet:
    "/analytics/fleet",

  routes:
    "/analytics/routes",

  fuel:
    "/analytics/fuel",

  revenue:
    "/analytics/revenue",

  maintenance:
    "/analytics/maintenance",

  inventory:
    "/analytics/inventory",

  busPerformance:
    "/analytics/bus-performance",

  filterOptions:
    "/analytics/filter-options",

  filtered:
    "/analytics/filtered"

} as const;


// =========================================================
// GENERIC ANALYTICS GET REQUEST
// =========================================================

const getAnalyticsData =
  async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {

    const response =
      await apiClient.get<
        IApiSuccessResponse<T>
      >(
        endpoint,
        config
      );


    return response.data.data;

  };


// =========================================================
// ANALYTICS API
// =========================================================

export const analyticsApi = {


  // =======================================================
  // STEP 1
  // HEALTH
  // =======================================================

  getHealth:
    (): Promise<IAnalyticsModuleStatus> => {

      return getAnalyticsData<
        IAnalyticsModuleStatus
      >(
        analyticsEndpoints.health
      );

    },


  // =======================================================
  // STEP 2
  // OVERVIEW
  // =======================================================

  getOverview:
    (): Promise<IOverviewAnalytics> => {

      return getAnalyticsData<
        IOverviewAnalytics
      >(
        analyticsEndpoints.overview
      );

    },


  // =======================================================
  // STEP 3
  // FLEET
  // =======================================================

  getFleet:
    (): Promise<IFleetAnalytics> => {

      return getAnalyticsData<
        IFleetAnalytics
      >(
        analyticsEndpoints.fleet
      );

    },


  // =======================================================
  // STEP 4
  // ROUTES / TRIPS
  // =======================================================

  getRoutes:
    (): Promise<IRouteTripAnalytics> => {

      return getAnalyticsData<
        IRouteTripAnalytics
      >(
        analyticsEndpoints.routes
      );

    },


  // =======================================================
  // STEP 5
  // FUEL
  // =======================================================

  getFuel:
    (): Promise<IFuelAnalytics> => {

      return getAnalyticsData<
        IFuelAnalytics
      >(
        analyticsEndpoints.fuel
      );

    },


  // =======================================================
  // STEP 6
  // REVENUE
  // =======================================================

  getRevenue:
    (): Promise<IRevenueAnalytics> => {

      return getAnalyticsData<
        IRevenueAnalytics
      >(
        analyticsEndpoints.revenue
      );

    },


  // =======================================================
  // STEP 7
  // MAINTENANCE
  // =======================================================

  getMaintenance:
    (): Promise<IMaintenanceAnalytics> => {

      return getAnalyticsData<
        IMaintenanceAnalytics
      >(
        analyticsEndpoints.maintenance
      );

    },


  // =======================================================
  // STEP 8
  // INVENTORY
  // =======================================================

  getInventory:
    (): Promise<IInventoryAnalytics> => {

      return getAnalyticsData<
        IInventoryAnalytics
      >(
        analyticsEndpoints.inventory
      );

    },


  // =======================================================
  // STEP 9
  // INTEGRATED BUS PERFORMANCE
  // =======================================================

  getBusPerformance:
    (): Promise<IIntegratedBusAnalytics> => {

      return getAnalyticsData<
        IIntegratedBusAnalytics
      >(
        analyticsEndpoints.busPerformance
      );

    },


  // =======================================================
  // STEP 10A
  // FILTER OPTIONS
  // =======================================================

  getFilterOptions:
    (): Promise<IAnalyticsFilterOptions> => {

      return getAnalyticsData<
        IAnalyticsFilterOptions
      >(
        analyticsEndpoints.filterOptions
      );

    },


  // =======================================================
  // STEP 10B
  // FILTERED ANALYTICS
  // =======================================================

  getFiltered:
    (
      filters:
        IAnalyticsFilterInput = {}
    ): Promise<IFilteredAnalytics> => {

      return getAnalyticsData<
        IFilteredAnalytics
      >(
        analyticsEndpoints.filtered,
        {

          params:
            filters

        }
      );

    }

};