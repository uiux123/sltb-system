import {
  IParsedAnalyticsFilters
} from "../types/analyticsFilter.types";


// =========================================================
// CUSTOM VALIDATION ERROR
// =========================================================

export class AnalyticsFilterValidationError
  extends Error {

  constructor(
    message: string
  ) {

    super(
      message
    );

    this.name =
      "AnalyticsFilterValidationError";

  }

}


// =========================================================
// READ SINGLE QUERY PARAMETER
// =========================================================

const readSingleValue =
  (
    value: unknown,
    fieldName: string
  ): string | undefined => {

    if (
      value === undefined ||
      value === null
    ) {

      return undefined;

    }


    if (
      typeof value !==
      "string"
    ) {

      throw new AnalyticsFilterValidationError(
        `${fieldName} must contain only one value.`
      );

    }


    const trimmedValue =
      value.trim();


    if (
      trimmedValue.length ===
      0
    ) {

      return undefined;

    }


    return trimmedValue;

  };


// =========================================================
// VALIDATE YYYY-MM-DD
// =========================================================

const validateDateString =
  (
    value: string,
    fieldName: string
  ): void => {

    const pattern =
      /^\d{4}-\d{2}-\d{2}$/;


    if (
      !pattern.test(
        value
      )
    ) {

      throw new AnalyticsFilterValidationError(
        `${fieldName} must use YYYY-MM-DD format.`
      );

    }


    const [
      yearText,
      monthText,
      dayText
    ] =
      value.split(
        "-"
      );


    const year =
      Number(
        yearText
      );

    const month =
      Number(
        monthText
      );

    const day =
      Number(
        dayText
      );


    const validationDate =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day
        )
      );


    const valid =

      validationDate
        .getUTCFullYear() ===
        year &&

      validationDate
        .getUTCMonth() ===
        month - 1 &&

      validationDate
        .getUTCDate() ===
        day;


    if (
      !valid
    ) {

      throw new AnalyticsFilterValidationError(
        `${fieldName} is not a valid calendar date.`
      );

    }

  };


// =========================================================
// CONVERT SRI LANKAN LOCAL DATE TO UTC INSTANT
// =========================================================
//
// Sri Lanka = UTC +05:30
//
// Example:
//
// 2026-01-01 00:00 Sri Lanka
//
// becomes:
//
// 2025-12-31T18:30:00.000Z
//
// =========================================================

const createSriLankaStartOfDay =
  (
    date: string
  ): Date => {

    return new Date(
      `${date}T00:00:00.000+05:30`
    );

  };


// =========================================================
// PARSE AND VALIDATE ANALYTICS FILTERS
// =========================================================

export const parseAnalyticsFilters =
  (
    query:
      Record<string, unknown>
  ): IParsedAnalyticsFilters => {

    let depotId =
      readSingleValue(
        query.depot_id,
        "depot_id"
      );


    let busId =
      readSingleValue(
        query.bus_id,
        "bus_id"
      );


    let routeId =
      readSingleValue(
        query.route_id,
        "route_id"
      );


    const startDate =
      readSingleValue(
        query.start_date,
        "start_date"
      );


    const endDate =
      readSingleValue(
        query.end_date,
        "end_date"
      );


    // =====================================================
    // NORMALISE IDS
    // =====================================================

    depotId =
      depotId
        ?.toUpperCase();


    busId =
      busId
        ?.toUpperCase();


    routeId =
      routeId
        ?.toUpperCase();


    // =====================================================
    // VALIDATE DEPOT ID
    // =====================================================

    if (
      depotId &&
      !/^DEP\d{3}$/.test(
        depotId
      )
    ) {

      throw new AnalyticsFilterValidationError(
        "depot_id must use the format DEP001."
      );

    }


    // =====================================================
    // VALIDATE BUS ID
    // =====================================================

    if (
      busId &&
      !/^BUS\d{3}$/.test(
        busId
      )
    ) {

      throw new AnalyticsFilterValidationError(
        "bus_id must use the format BUS001."
      );

    }


    // =====================================================
    // VALIDATE ROUTE ID
    // =====================================================

    if (
      routeId &&
      !/^R\d{3}$/.test(
        routeId
      )
    ) {

      throw new AnalyticsFilterValidationError(
        "route_id must use the format R001."
      );

    }


    // =====================================================
    // VALIDATE START DATE
    // =====================================================

    if (
      startDate
    ) {

      validateDateString(
        startDate,
        "start_date"
      );

    }


    // =====================================================
    // VALIDATE END DATE
    // =====================================================

    if (
      endDate
    ) {

      validateDateString(
        endDate,
        "end_date"
      );

    }


    // =====================================================
    // CONVERT DATES
    // =====================================================

    const startDateValue =
      startDate
        ? createSriLankaStartOfDay(
            startDate
          )
        : undefined;


    const endDateStartValue =
      endDate
        ? createSriLankaStartOfDay(
            endDate
          )
        : undefined;


    // =====================================================
    // END DATE IS EXCLUSIVE NEXT DAY
    // =====================================================

    const endDateExclusiveValue =
      endDateStartValue

        ? new Date(
            endDateStartValue.getTime() +
            24 * 60 * 60 * 1000
          )

        : undefined;


    // =====================================================
    // START DATE MUST NOT BE AFTER END DATE
    // =====================================================

    if (
      startDateValue &&
      endDateStartValue &&
      startDateValue.getTime() >
      endDateStartValue.getTime()
    ) {

      throw new AnalyticsFilterValidationError(
        "start_date cannot be after end_date."
      );

    }


    return {

      depot_id:
        depotId,

      bus_id:
        busId,

      route_id:
        routeId,

      start_date:
        startDate,

      end_date:
        endDate,

      start_date_value:
        startDateValue,

      end_date_exclusive_value:
        endDateExclusiveValue

    };

  };