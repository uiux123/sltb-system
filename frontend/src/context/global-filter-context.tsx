import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  EMPTY_GLOBAL_FILTERS,
  clearStoredGlobalFilters,
  getStoredGlobalFilters,
  saveStoredGlobalFilters
} from "@/lib/globalFilters";

import type {
  IGlobalAnalyticsFilters
} from "@/types/globalFilters.types";


// =========================================================
// CONTEXT VALUE
// =========================================================

interface IGlobalFilterContextValue {

  filters:
    IGlobalAnalyticsFilters;

  filterKey:
    string;

  setDepotId:
    (
      depotId: string
    ) => void;

  setBusId:
    (
      busId: string
    ) => void;

  setStartDate:
    (
      startDate: string
    ) => void;

  setEndDate:
    (
      endDate: string
    ) => void;

  clearFilters:
    () => void;

}


// =========================================================
// CONTEXT
// =========================================================

const GlobalFilterContext =
  createContext<
    IGlobalFilterContextValue | undefined
  >(
    undefined
  );


// =========================================================
// PROPS
// =========================================================

interface IGlobalFilterProviderProps {

  children:
    ReactNode;

}


// =========================================================
// PROVIDER
// =========================================================

export function GlobalFilterProvider(
  {
    children
  }: IGlobalFilterProviderProps
) {

  const [
    filters,
    setFilters
  ] =
    useState<
      IGlobalAnalyticsFilters
    >(
      () =>
        getStoredGlobalFilters()
    );


  // =======================================================
  // UPDATE HELPER
  // =======================================================

  const updateFilters =
    (
      updater:
        (
          current:
            IGlobalAnalyticsFilters
        ) =>
          IGlobalAnalyticsFilters
    ): void => {

      setFilters(
        current => {

          const next =
            updater(
              current
            );


          saveStoredGlobalFilters(
            next
          );


          return next;

        }
      );

    };


  // =======================================================
  // DEPOT
  // =======================================================

  const setDepotId =
    (
      depotId: string
    ): void => {

      updateFilters(
        current => ({

          ...current,

          depot_id:
            depotId,

          bus_id:
            ""

        })
      );

    };


  // =======================================================
  // BUS
  // =======================================================

  const setBusId =
    (
      busId: string
    ): void => {

      updateFilters(
        current => ({

          ...current,

          bus_id:
            busId

        })
      );

    };


  // =======================================================
  // START DATE
  // =======================================================

  const setStartDate =
    (
      startDate: string
    ): void => {

      updateFilters(
        current => {

          const shouldClearEndDate =

            current.end_date &&
            startDate &&
            current.end_date <
              startDate;


          return {

            ...current,

            start_date:
              startDate,

            end_date:
              shouldClearEndDate
                ? ""
                : current.end_date

          };

        }
      );

    };


  // =======================================================
  // END DATE
  // =======================================================

  const setEndDate =
    (
      endDate: string
    ): void => {

      updateFilters(
        current => ({

          ...current,

          end_date:
            endDate

        })
      );

    };


  // =======================================================
  // CLEAR
  // =======================================================

  const clearFilters =
    (): void => {

      clearStoredGlobalFilters();


      setFilters({
        ...EMPTY_GLOBAL_FILTERS
      });

    };


  // =======================================================
  // FILTER KEY
  // =======================================================

  const filterKey =
    useMemo(
      () => {

        return [

          filters.depot_id ||
            "all-depots",

          filters.bus_id ||
            "all-buses",

          filters.start_date ||
            "all-start",

          filters.end_date ||
            "all-end"

        ].join(
          "|"
        );

      },
      [
        filters
      ]
    );


  // =======================================================
  // VALUE
  // =======================================================

  const value =
    useMemo<
      IGlobalFilterContextValue
    >(
      () => ({

        filters,

        filterKey,

        setDepotId,

        setBusId,

        setStartDate,

        setEndDate,

        clearFilters

      }),
      [
        filters,
        filterKey
      ]
    );


  return (

    <GlobalFilterContext.Provider
      value={
        value
      }
    >

      {children}

    </GlobalFilterContext.Provider>

  );

}


// =========================================================
// HOOK
// =========================================================

export function useGlobalFilters():
  IGlobalFilterContextValue {

  const context =
    useContext(
      GlobalFilterContext
    );


  if (
    !context
  ) {

    throw new Error(
      "useGlobalFilters must be used inside GlobalFilterProvider."
    );

  }


  return context;

}