import axios
  from "axios";

import {
  appConfig
} from "@/config/env";

import type {
  IApiErrorResponse
} from "@/types/api.types";


// =========================================================
// AXIOS API CLIENT
// =========================================================

export const apiClient =
  axios.create({

    baseURL:
      appConfig.apiBaseUrl,

    timeout:
      30000,

    headers: {

      Accept:
        "application/json"

    }

  });


// =========================================================
// GET USER-FRIENDLY API ERROR MESSAGE
// =========================================================

export const getApiErrorMessage =
  (
    error: unknown
  ): string => {

    // =====================================================
    // AXIOS ERROR
    // =====================================================

    if (
      axios.isAxiosError<
        IApiErrorResponse
      >(
        error
      )
    ) {

      // ---------------------------------------------------
      // Backend returned an explicit error
      // ---------------------------------------------------

      if (
        error.response?.data?.error
      ) {

        return error.response.data.error;

      }


      // ---------------------------------------------------
      // Backend returned message
      // ---------------------------------------------------

      if (
        error.response?.data?.message
      ) {

        return error.response.data.message;

      }


      // ---------------------------------------------------
      // Server did not respond
      // ---------------------------------------------------

      if (
        error.code ===
        "ECONNABORTED"
      ) {

        return "The analytics request timed out.";

      }


      if (
        !error.response
      ) {

        return "Unable to connect to the analytics server.";

      }


      return error.message;

    }


    // =====================================================
    // NORMAL JAVASCRIPT ERROR
    // =====================================================

    if (
      error instanceof Error
    ) {

      return error.message;

    }


    // =====================================================
    // UNKNOWN ERROR
    // =====================================================

    return "An unknown API error occurred.";

  };


export default apiClient;