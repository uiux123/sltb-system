import type {
  IGlobalAnalyticsFilters
} from "@/types/globalFilters.types";


// =========================================================
// STORAGE KEY
// =========================================================

export const GLOBAL_FILTER_STORAGE_KEY =
  "sltb-global-analytics-filters";


// =========================================================
// EMPTY FILTERS
// =========================================================

export const EMPTY_GLOBAL_FILTERS:
  IGlobalAnalyticsFilters = {

    depot_id:
      "",

    bus_id:
      "",

    start_date:
      "",

    end_date:
      ""

  };


// =========================================================
// TYPE GUARD HELPERS
// =========================================================

function readString(
  value: unknown
): string {

  return typeof value ===
    "string"
      ? value
      : "";

}


// =========================================================
// READ STORED FILTERS
// =========================================================

export function getStoredGlobalFilters():
  IGlobalAnalyticsFilters {

  if (
    typeof window ===
    "undefined"
  ) {

    return {
      ...EMPTY_GLOBAL_FILTERS
    };

  }


  try {

    const rawValue =
      window.localStorage.getItem(
        GLOBAL_FILTER_STORAGE_KEY
      );


    if (
      !rawValue
    ) {

      return {
        ...EMPTY_GLOBAL_FILTERS
      };

    }


    const parsed =
      JSON.parse(
        rawValue
      ) as unknown;


    if (
      typeof parsed !==
        "object" ||
      parsed ===
        null ||
      Array.isArray(
        parsed
      )
    ) {

      return {
        ...EMPTY_GLOBAL_FILTERS
      };

    }


    const record =
      parsed as Record<
        string,
        unknown
      >;


    return {

      depot_id:
        readString(
          record.depot_id
        ),

      bus_id:
        readString(
          record.bus_id
        ),

      start_date:
        readString(
          record.start_date
        ),

      end_date:
        readString(
          record.end_date
        )

    };

  } catch {

    return {
      ...EMPTY_GLOBAL_FILTERS
    };

  }

}


// =========================================================
// SAVE FILTERS
// =========================================================

export function saveStoredGlobalFilters(
  filters:
    IGlobalAnalyticsFilters
): void {

  if (
    typeof window ===
    "undefined"
  ) {

    return;

  }


  window.localStorage.setItem(

    GLOBAL_FILTER_STORAGE_KEY,

    JSON.stringify(
      filters
    )

  );

}


// =========================================================
// REMOVE FILTERS
// =========================================================

export function clearStoredGlobalFilters():
  void {

  if (
    typeof window ===
    "undefined"
  ) {

    return;

  }


  window.localStorage.removeItem(
    GLOBAL_FILTER_STORAGE_KEY
  );

}


// =========================================================
// ACTIVE FILTER COUNT
// =========================================================

export function countActiveGlobalFilters(
  filters:
    IGlobalAnalyticsFilters
): number {

  return [

    filters.depot_id,

    filters.bus_id,

    filters.start_date,

    filters.end_date

  ].filter(
    value =>
      value.length >
      0
  ).length;

}