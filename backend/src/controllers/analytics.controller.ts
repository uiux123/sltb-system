import {
  Request,
  Response
} from "express";

import {
  getAnalyticsModuleStatus,
  getOverviewAnalytics,
  getFleetAnalytics,
  getRouteTripAnalytics,
  getFuelAnalytics,
  getRevenueAnalytics
} from "../services/analytics.service";

import {
  getMaintenanceAnalytics
} from "../services/maintenanceAnalytics.service";

import {
  getInventoryAnalytics
} from "../services/inventoryAnalytics.service";

import {
  getIntegratedBusAnalytics
} from "../services/busPerformanceAnalytics.service";

import {
  getAnalyticsFilterOptions,
  getFilteredAnalytics
} from "../services/filteredAnalytics.service";

import {
  AnalyticsFilterValidationError,
  parseAnalyticsFilters
} from "../utils/analyticsFilter.utils";


// =========================================================
// STEP 1
// ANALYTICS HEALTH
// =========================================================

export const getAnalyticsHealth =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const analyticsStatus =
        await getAnalyticsModuleStatus();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Analytics module is ready.",

        data:
          analyticsStatus

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to access analytics data.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown analytics error."

      });

    }

  };


// =========================================================
// STEP 2
// OVERVIEW
// =========================================================

export const getAnalyticsOverview =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const overview =
        await getOverviewAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Overview analytics retrieved successfully.",

        data:
          overview

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve overview analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown overview analytics error."

      });

    }

  };


// =========================================================
// STEP 3
// FLEET
// =========================================================

export const getAnalyticsFleet =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getFleetAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Fleet analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve fleet analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown fleet analytics error."

      });

    }

  };


// =========================================================
// STEP 4
// ROUTES / TRIPS
// =========================================================

export const getAnalyticsRoutes =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getRouteTripAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Route and trip analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve route and trip analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown route analytics error."

      });

    }

  };


// =========================================================
// STEP 5
// FUEL
// =========================================================

export const getAnalyticsFuel =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getFuelAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Fuel analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve fuel analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown fuel analytics error."

      });

    }

  };


// =========================================================
// STEP 6
// REVENUE
// =========================================================

export const getAnalyticsRevenue =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getRevenueAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Revenue analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve revenue analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown revenue analytics error."

      });

    }

  };


// =========================================================
// STEP 7
// MAINTENANCE
// =========================================================

export const getAnalyticsMaintenance =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getMaintenanceAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Maintenance analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve maintenance analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown maintenance analytics error."

      });

    }

  };


// =========================================================
// STEP 8
// INVENTORY
// =========================================================

export const getAnalyticsInventory =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getInventoryAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Inventory analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve inventory analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown inventory analytics error."

      });

    }

  };


// =========================================================
// STEP 9
// INTEGRATED BUS PERFORMANCE
// =========================================================

export const getAnalyticsBusPerformance =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await getIntegratedBusAnalytics();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Integrated bus performance analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve integrated bus performance analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown bus performance analytics error."

      });

    }

  };


// =========================================================
// STEP 10A
// ANALYTICS FILTER OPTIONS
// =========================================================

export const getAnalyticsFilters =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const options =
        await getAnalyticsFilterOptions();


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Analytics filter options retrieved successfully.",

        data:
          options

      });

    } catch (error) {

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve analytics filter options.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown filter options error."

      });

    }

  };


// =========================================================
// STEP 10B
// FILTERED ANALYTICS
// =========================================================

export const getAnalyticsFiltered =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      // ===================================================
      // VALIDATE QUERY PARAMETERS
      // ===================================================

      const filters =
        parseAnalyticsFilters(
          req.query as Record<string, unknown>
        );


      // ===================================================
      // RUN FILTERED ANALYTICS
      // ===================================================

      const result =
        await getFilteredAnalytics(
          filters
        );


      res.status(
        200
      ).json({

        success:
          true,

        message:
          "Filtered analytics retrieved successfully.",

        data:
          result

      });

    } catch (error) {

      // ===================================================
      // INVALID USER FILTER
      // ===================================================

      if (
        error instanceof
        AnalyticsFilterValidationError
      ) {

        res.status(
          400
        ).json({

          success:
            false,

          message:
            "Invalid analytics filter.",

          error:
            error.message

        });

        return;

      }


      // ===================================================
      // SERVER ERROR
      // ===================================================

      res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to retrieve filtered analytics.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown filtered analytics error."

      });

    }

  };