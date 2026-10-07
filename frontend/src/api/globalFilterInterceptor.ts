import {
  apiClient
} from "@/api/apiClient";

import {
  getStoredGlobalFilters
} from "@/lib/globalFilters";


// =========================================================
// INSTALL GLOBAL ANALYTICS FILTER INTERCEPTOR
// =========================================================
//
// This module is imported once by DashboardLayout.
//
// Only analytics requests receive global filters.
// CRUD and operational endpoints remain unchanged.
//
// =========================================================

apiClient.interceptors.request.use(
  config => {

    const requestUrl =
      config.url ??
      "";


    // =====================================================
    // ONLY ANALYTICS ENDPOINTS
    // =====================================================

    if (
      !requestUrl.includes(
        "/analytics/"
      )
    ) {

      return config;

    }


    // =====================================================
    // CURRENT FILTERS
    // =====================================================

    const filters =
      getStoredGlobalFilters();


    // =====================================================
    // BUILD FILTER QUERY
    // =====================================================

    const filterParams:
      Record<
        string,
        string
      > = {};


    if (
      filters.depot_id
    ) {

      filterParams.depot_id =
        filters.depot_id;

    }


    if (
      filters.bus_id
    ) {

      filterParams.bus_id =
        filters.bus_id;

    }


    if (
      filters.start_date
    ) {

      filterParams.start_date =
        filters.start_date;

    }


    if (
      filters.end_date
    ) {

      filterParams.end_date =
        filters.end_date;

    }


    // =====================================================
    // PRESERVE EXISTING REQUEST PARAMETERS
    // =====================================================

    config.params = {

      ...(
        config.params ??
        {}
      ),

      ...filterParams

    };


    return config;

  }
);