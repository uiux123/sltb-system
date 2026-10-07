import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  CalendarRange,
  Filter,
  LoaderCircle,
  RotateCcw,
  TriangleAlert
} from "lucide-react";

import {
  busesApi
} from "@/api/buses.api";

import {
  getApiErrorMessage
} from "@/api/apiClient";

import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";

import {
  Badge
} from "@/components/ui/badge";

import {
  Button
} from "@/components/ui/button";

import {
  Input
} from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  countActiveGlobalFilters
} from "@/lib/globalFilters";

import {
  useGlobalFilters
} from "@/context/global-filter-context";

import type {
  IBus,
  IDepot
} from "@/types/fleetManagement.types";


// =========================================================
// GLOBAL FILTER BAR
// =========================================================

export function GlobalFilterBar() {

  // =======================================================
  // GLOBAL FILTERS
  // =======================================================

  const {

    filters,

    setDepotId,

    setBusId,

    setStartDate,

    setEndDate,

    clearFilters

  } =
    useGlobalFilters();


  // =======================================================
  // OPTIONS
  // =======================================================

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
    buses,
    setBuses
  ] =
    useState<
      IBus[]
    >(
      []
    );


  const [
    loading,
    setLoading
  ] =
    useState(
      true
    );


  const [
    error,
    setError
  ] =
    useState<
      string | null
    >(
      null
    );


  // =======================================================
  // LOAD OPTIONS
  // =======================================================

  useEffect(
    () => {

      const loadOptions =
        async (): Promise<void> => {

          setLoading(
            true
          );


          setError(
            null
          );


          try {

            const [
              depotResult,
              busResult
            ] =
              await Promise.all([

                busesApi.getDepots(),

                busesApi.getAll()

              ]);


            setDepots(
              depotResult
            );


            setBuses(
              busResult
            );

          } catch (
            requestError
          ) {

            setError(
              getApiErrorMessage(
                requestError
              )
            );

          } finally {

            setLoading(
              false
            );

          }

        };


      void loadOptions();

    },
    []
  );


  // =======================================================
  // SORTED DEPOTS
  // =======================================================

  const depotOptions =
    useMemo(
      () => {

        return [
          ...depots
        ].sort(
          (
            first,
            second
          ) =>
            first.depot_id.localeCompare(
              second.depot_id
            )
        );

      },
      [
        depots
      ]
    );


  // =======================================================
  // BUS OPTIONS
  // =======================================================

  const busOptions =
    useMemo(
      () => {

        const filtered =

          filters.depot_id
            ? buses.filter(
                bus =>
                  bus.depot_id ===
                  filters.depot_id
              )
            : buses;


        return [
          ...filtered
        ].sort(
          (
            first,
            second
          ) =>
            first.bus_id.localeCompare(
              second.bus_id
            )
        );

      },
      [
        buses,
        filters.depot_id
      ]
    );


  // =======================================================
  // ACTIVE COUNT
  // =======================================================

  const activeFilterCount =
    countActiveGlobalFilters(
      filters
    );


  return (

    <section
      className="
        border-b
        bg-card
        px-4
        py-3
        md:px-6
      "
    >

      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1600px]
          gap-3
        "
      >

        {/* =================================================
            FILTER HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-md
                bg-brand-blue/10
              "
            >

              <Filter
                className="
                  size-4
                  text-brand-blue
                  dark:text-white
                "
              />

            </div>


            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-brand-blue
                  dark:text-white
                "
              >
                Global Analytics Filters
              </p>


              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Applied automatically to compatible
                analytics endpoints.
              </p>

            </div>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {
              activeFilterCount >
                0 && (

                <Badge
                  className="
                    bg-brand-yellow
                    text-brand-blue
                    hover:bg-brand-yellow
                  "
                >
                  {
                    activeFilterCount
                  } active
                </Badge>

              )
            }


            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={
                activeFilterCount ===
                0
              }
              onClick={
                clearFilters
              }
            >

              <RotateCcw
                className="size-4"
              />

              Clear

            </Button>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {
          loading
            ? (

                <div
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    text-sm
                    text-muted-foreground
                  "
                >

                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                  Loading filter options...

                </div>

              )
            : (

                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >

                  {/* =========================================
                      DEPOT
                  ========================================= */}

                  <Select
                    value={
                      filters.depot_id ||
                      "all"
                    }
                    onValueChange={
                      value => {

                        if (
                          value ===
                          null
                        ) {

                          return;

                        }


                        setDepotId(
                          value ===
                            "all"
                            ? ""
                            : value
                        );

                      }
                    }
                  >

                    <SelectTrigger
                      className="w-full"
                    >

                      <SelectValue />

                    </SelectTrigger>


                    <SelectContent>

                      <SelectItem
                        value="all"
                      >
                        All Depots
                      </SelectItem>


                      {
                        depotOptions.map(
                          depot => (

                            <SelectItem
                              key={
                                depot.depot_id
                              }
                              value={
                                depot.depot_id
                              }
                            >

                              {
                                depot.depot_id
                              }

                              {" — "}

                              {
                                depot.depot_name
                              }

                            </SelectItem>

                          )
                        )
                      }

                    </SelectContent>

                  </Select>


                  {/* =========================================
                      BUS
                  ========================================= */}

                  <Select
                    value={
                      filters.bus_id ||
                      "all"
                    }
                    onValueChange={
                      value => {

                        if (
                          value ===
                          null
                        ) {

                          return;

                        }


                        setBusId(
                          value ===
                            "all"
                            ? ""
                            : value
                        );

                      }
                    }
                  >

                    <SelectTrigger
                      className="w-full"
                    >

                      <SelectValue />

                    </SelectTrigger>


                    <SelectContent>

                      <SelectItem
                        value="all"
                      >
                        All Buses
                      </SelectItem>


                      {
                        busOptions.map(
                          bus => (

                            <SelectItem
                              key={
                                bus.bus_id
                              }
                              value={
                                bus.bus_id
                              }
                            >

                              {
                                bus.bus_id
                              }

                              {" — "}

                              {
                                bus.registration_no
                              }

                            </SelectItem>

                          )
                        )
                      }

                    </SelectContent>

                  </Select>


                  {/* =========================================
                      START DATE
                  ========================================= */}

                  <div className="relative">

                    <CalendarRange
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        size-4
                        -translate-y-1/2
                        text-muted-foreground
                      "
                    />


                    <Input
                      type="date"
                      className="pl-9"
                      value={
                        filters.start_date
                      }
                      max={
                        filters.end_date ||
                        undefined
                      }
                      onChange={
                        event =>
                          setStartDate(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* =========================================
                      END DATE
                  ========================================= */}

                  <div className="relative">

                    <CalendarRange
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        size-4
                        -translate-y-1/2
                        text-muted-foreground
                      "
                    />


                    <Input
                      type="date"
                      className="pl-9"
                      value={
                        filters.end_date
                      }
                      min={
                        filters.start_date ||
                        undefined
                      }
                      onChange={
                        event =>
                          setEndDate(
                            event.target.value
                          )
                      }
                    />

                  </div>

                </div>

              )
        }


        {/* =================================================
            OPTION LOAD ERROR
        ================================================= */}

        {
          error && (

            <Alert
              variant="destructive"
            >

              <TriangleAlert
                className="size-4"
              />


              <AlertDescription>
                Unable to load Depot and Bus filter options:
                {" "}
                {error}
              </AlertDescription>

            </Alert>

          )
        }

      </div>

    </section>

  );

}