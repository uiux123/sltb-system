import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import type {
  IIntegratedBusPerformance
} from "@/types/busPerformance.types";

import {
  formatCurrency,
  formatDecimal,
  formatHours,
  formatNumber,
  formatPercentage
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IBusPerformanceTableProps {

  records:
    IIntegratedBusPerformance[];

}


// =========================================================
// PAGE SIZE
// =========================================================

const PAGE_SIZE =
  10;


// =========================================================
// COMPONENT
// =========================================================

export function BusPerformanceTable(
  {
    records
  }: IBusPerformanceTableProps
) {

  const [
    search,
    setSearch
  ] =
    useState(
      ""
    );


  const [
    depotFilter,
    setDepotFilter
  ] =
    useState(
      "all"
    );


  const [
    statusFilter,
    setStatusFilter
  ] =
    useState(
      "all"
    );


  const [
    sortBy,
    setSortBy
  ] =
    useState(
      "revenue"
    );


  const [
    page,
    setPage
  ] =
    useState(
      1
    );


  // =======================================================
  // DEPOT OPTIONS
  // =======================================================

  const depotOptions =
    useMemo(
      () => {

        return Array.from(
          new Set(
            records
              .map(
                record =>
                  record.depot_id
              )
              .filter(
                depotId =>
                  depotId &&
                  depotId !==
                    "-"
              )
          )
        ).sort();

      },
      [
        records
      ]
    );


  // =======================================================
  // STATUS OPTIONS
  // =======================================================

  const statusOptions =
    useMemo(
      () => {

        return Array.from(
          new Set(
            records
              .map(
                record =>
                  record.bus_status
              )
              .filter(
                status =>
                  status &&
                  status !==
                    "Unknown"
              )
          )
        ).sort();

      },
      [
        records
      ]
    );


  // =======================================================
  // FILTER + SORT
  // =======================================================

  const filteredRecords =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        const filtered =
          records.filter(
            record => {

              const matchesSearch =

                !searchText ||

                record.bus_id
                  .toLowerCase()
                  .includes(
                    searchText
                  ) ||

                record.registration_no
                  .toLowerCase()
                  .includes(
                    searchText
                  ) ||

                record.depot_id
                  .toLowerCase()
                  .includes(
                    searchText
                  ) ||

                record.manufacturer
                  .toLowerCase()
                  .includes(
                    searchText
                  ) ||

                record.model
                  .toLowerCase()
                  .includes(
                    searchText
                  );


              const matchesDepot =

                depotFilter ===
                  "all" ||

                record.depot_id ===
                  depotFilter;


              const matchesStatus =

                statusFilter ===
                  "all" ||

                record.bus_status ===
                  statusFilter;


              return (

                matchesSearch &&
                matchesDepot &&
                matchesStatus

              );

            }
          );


        return [
          ...filtered
        ].sort(
          (
            first,
            second
          ) => {

            switch (
              sortBy
            ) {

              case "cost":

                return (
                  second.total_operating_cost -
                  first.total_operating_cost
                );


              case "balance":

                return (
                  second.net_operational_balance -
                  first.net_operational_balance
                );


              case "efficiency":

                return (
                  second.fuel_efficiency_km_per_litre -
                  first.fuel_efficiency_km_per_litre
                );


              case "downtime":

                return (
                  second.total_downtime_hours -
                  first.total_downtime_hours
                );


              case "revenue":

              default:

                return (
                  second.total_revenue -
                  first.total_revenue
                );

            }

          }
        );

      },
      [
        records,
        search,
        depotFilter,
        statusFilter,
        sortBy
      ]
    );


  // =======================================================
  // RESET PAGE
  // =======================================================

  useEffect(
    () => {

      setPage(
        1
      );

    },
    [
      search,
      depotFilter,
      statusFilter,
      sortBy
    ]
  );


  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredRecords.length /
        PAGE_SIZE
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const pageRecords =
    filteredRecords.slice(

      (
        safePage -
        1
      ) *
      PAGE_SIZE,

      safePage *
      PAGE_SIZE

    );


  return (

    <div className="grid gap-4">

      {/* ===================================================
          FILTERS
      =================================================== */}

      <div
        className="
          grid
          gap-3
          xl:grid-cols-[1fr_180px_200px_220px]
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />


          <Input
            className="pl-9"
            value={
              search
            }
            placeholder="Search bus, registration, depot or model..."
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


        {/* DEPOT */}

        <Select
          value={
            depotFilter
          }
          onValueChange={
            value => {

              if (
                value ===
                null
              ) {

                return;

              }


              setDepotFilter(
                value
              );

            }
          }
        >

          <SelectTrigger className="w-full">

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="all">
              All Depots
            </SelectItem>


            {
              depotOptions.map(
                depotId => (

                  <SelectItem
                    key={
                      depotId
                    }
                    value={
                      depotId
                    }
                  >
                    {depotId}
                  </SelectItem>

                )
              )
            }

          </SelectContent>

        </Select>


        {/* STATUS */}

        <Select
          value={
            statusFilter
          }
          onValueChange={
            value => {

              if (
                value ===
                null
              ) {

                return;

              }


              setStatusFilter(
                value
              );

            }
          }
        >

          <SelectTrigger className="w-full">

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="all">
              All Bus Statuses
            </SelectItem>


            {
              statusOptions.map(
                status => (

                  <SelectItem
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {status}
                  </SelectItem>

                )
              )
            }

          </SelectContent>

        </Select>


        {/* SORT */}

        <Select
          value={
            sortBy
          }
          onValueChange={
            value => {

              if (
                value ===
                null
              ) {

                return;

              }


              setSortBy(
                value
              );

            }
          }
        >

          <SelectTrigger className="w-full">

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="revenue">
              Sort: Revenue
            </SelectItem>

            <SelectItem value="cost">
              Sort: Operating Cost
            </SelectItem>

            <SelectItem value="balance">
              Sort: Operating Balance
            </SelectItem>

            <SelectItem value="efficiency">
              Sort: Fuel Efficiency
            </SelectItem>

            <SelectItem value="downtime">
              Sort: Downtime
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      {/* ===================================================
          RESULT COUNT
      =================================================== */}

      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        Showing {pageRecords.length} of {
          filteredRecords.length
        } matching buses
      </p>


      {/* ===================================================
          TABLE
      =================================================== */}

      <div
        className="
          overflow-x-auto
          rounded-lg
          border
        "
      >

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Bus
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Trips / Passengers
              </TableHead>

              <TableHead>
                Distance
              </TableHead>

              <TableHead>
                Load Factor
              </TableHead>

              <TableHead>
                Fuel Efficiency
              </TableHead>

              <TableHead>
                Revenue
              </TableHead>

              <TableHead>
                Operating Cost
              </TableHead>

              <TableHead>
                Balance
              </TableHead>

              <TableHead>
                Downtime
              </TableHead>

            </TableRow>

          </TableHeader>


          <TableBody>

            {
              pageRecords.length >
                0
                ? pageRecords.map(
                    record => (

                      <TableRow
                        key={
                          record.bus_id
                        }
                      >

                        {/* BUS */}

                        <TableCell>

                          <div className="font-medium">
                            {record.bus_id}
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {record.registration_no}
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {record.depot_id}
                          </div>

                        </TableCell>


                        {/* STATUS */}

                        <TableCell>

                          <BusStatusBadge
                            status={
                              record.bus_status
                            }
                          />

                        </TableCell>


                        {/* TRIPS / PASSENGERS */}

                        <TableCell>

                          <div>
                            {
                              formatNumber(
                                record.total_trips
                              )
                            } trips
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              formatNumber(
                                record.total_passengers
                              )
                            } passengers
                          </div>

                        </TableCell>


                        {/* DISTANCE */}

                        <TableCell>
                          {
                            formatNumber(
                              record.total_operated_km,
                              2
                            )
                          } km
                        </TableCell>


                        {/* LOAD FACTOR */}

                        <TableCell>
                          {
                            formatPercentage(
                              record.average_load_factor_percentage
                            )
                          }
                        </TableCell>


                        {/* FUEL */}

                        <TableCell>

                          {
                            formatDecimal(
                              record.fuel_efficiency_km_per_litre,
                              2
                            )
                          } km/L


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              formatCurrency(
                                record.fuel_cost_per_km,
                                2
                              )
                            } / km
                          </div>

                        </TableCell>


                        {/* REVENUE */}

                        <TableCell>

                          {
                            formatCurrency(
                              record.total_revenue,
                              2
                            )
                          }


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              formatCurrency(
                                record.revenue_per_km,
                                2
                              )
                            } / km
                          </div>

                        </TableCell>


                        {/* COST */}

                        <TableCell>
                          {
                            formatCurrency(
                              record.total_operating_cost,
                              2
                            )
                          }
                        </TableCell>


                        {/* BALANCE */}

                        <TableCell>
                          {
                            formatCurrency(
                              record.net_operational_balance,
                              2
                            )
                          }
                        </TableCell>


                        {/* DOWNTIME */}

                        <TableCell>

                          {
                            formatHours(
                              record.total_downtime_hours,
                              2
                            )
                          }


                          {
                            record.in_progress_maintenance >
                              0 && (

                              <div className="mt-1">

                                <Badge variant="secondary">

                                  {
                                    formatNumber(
                                      record.in_progress_maintenance
                                    )
                                  } active

                                </Badge>

                              </div>

                            )
                          }

                        </TableCell>

                      </TableRow>

                    )
                  )
                : (

                    <TableRow>

                      <TableCell
                        colSpan={
                          10
                        }
                        className="
                          h-28
                          text-center
                          text-muted-foreground
                        "
                      >
                        No buses match the selected filters.
                      </TableCell>

                    </TableRow>

                  )
            }

          </TableBody>

        </Table>

      </div>


      {/* ===================================================
          PAGINATION
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          Page {safePage} of {totalPages}
        </p>


        <div className="flex gap-2">

          <Button
            variant="outline"
            size="sm"
            disabled={
              safePage <=
              1
            }
            onClick={
              () =>
                setPage(
                  current =>
                    Math.max(
                      1,
                      current -
                      1
                    )
                )
            }
          >

            <ChevronLeft className="size-4" />

            Previous

          </Button>


          <Button
            variant="outline"
            size="sm"
            disabled={
              safePage >=
              totalPages
            }
            onClick={
              () =>
                setPage(
                  current =>
                    Math.min(
                      totalPages,
                      current +
                      1
                    )
                )
            }
          >

            Next

            <ChevronRight className="size-4" />

          </Button>

        </div>

      </div>

    </div>

  );

}


// =========================================================
// BUS STATUS BADGE
// =========================================================

function BusStatusBadge(
  {
    status
  }: {
    status: string;
  }
) {

  if (
    status ===
    "Out of Service"
  ) {

    return (

      <Badge variant="destructive">
        {status}
      </Badge>

    );

  }


  if (
    status ===
      "Under Maintenance" ||
    status ===
      "Breakdown"
  ) {

    return (

      <Badge variant="secondary">
        {status}
      </Badge>

    );

  }


  return (

    <Badge variant="outline">
      {status}
    </Badge>

  );

}