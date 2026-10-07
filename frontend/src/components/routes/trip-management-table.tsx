import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  Trash2
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
  ITrip
} from "@/types/routeTripManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ITripManagementTableProps {

  trips:
    ITrip[];

  onView:
    (
      trip: ITrip
    ) => void;

  onEdit:
    (
      trip: ITrip
    ) => void;

  onDelete:
    (
      trip: ITrip
    ) => void;

}


// =========================================================

const PAGE_SIZE =
  10;


// =========================================================
// COMPONENT
// =========================================================

export function TripManagementTable(
  {
    trips,
    onView,
    onEdit,
    onDelete
  }: ITripManagementTableProps
) {

  const [
    search,
    setSearch
  ] =
    useState(
      ""
    );


  const [
    statusFilter,
    setStatusFilter
  ] =
    useState(
      "all"
    );


  const [
    page,
    setPage
  ] =
    useState(
      1
    );


  // =======================================================
  // FILTER
  // =======================================================

  const filteredTrips =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return trips.filter(
          trip => {

            const matchesSearch =

              !searchText ||

              trip.trip_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              trip.bus_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              trip.route_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              trip.depot_id
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesStatus =

              statusFilter ===
                "all" ||

              trip.trip_status ===
                statusFilter;


            return (
              matchesSearch &&
              matchesStatus
            );

          }
        );

      },
      [
        trips,
        search,
        statusFilter
      ]
    );


  useEffect(
    () => {

      setPage(
        1
      );

    },
    [
      search,
      statusFilter
    ]
  );


  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredTrips.length /
        PAGE_SIZE
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const pageTrips =
    filteredTrips.slice(

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
          lg:grid-cols-[1fr_220px]
        "
      >

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
            placeholder="Search trip, bus, route or depot..."
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


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
              All Trip Statuses
            </SelectItem>

            <SelectItem value="Scheduled">
              Scheduled
            </SelectItem>

            <SelectItem value="Completed">
              Completed
            </SelectItem>

            <SelectItem value="Cancelled">
              Cancelled
            </SelectItem>

            <SelectItem value="Missed">
              Missed
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      <p className="text-sm text-muted-foreground">
        Showing {pageTrips.length} of {filteredTrips.length}
        {" "}matching trips
      </p>


      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="overflow-x-auto rounded-lg border">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Trip
              </TableHead>

              <TableHead>
                Bus
              </TableHead>

              <TableHead>
                Route
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Passengers
              </TableHead>

              <TableHead>
                Delay
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>


          <TableBody>

            {
              pageTrips.length >
                0
                ? pageTrips.map(
                    trip => (

                      <TableRow
                        key={
                          trip.trip_id
                        }
                      >

                        <TableCell>

                          <div className="font-medium">
                            {trip.trip_id}
                          </div>

                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {trip.depot_id}
                          </div>

                        </TableCell>


                        <TableCell>
                          {trip.bus_id}
                        </TableCell>


                        <TableCell>
                          {trip.route_id}
                        </TableCell>


                        <TableCell>
                          {
                            trip.trip_date.slice(
                              0,
                              10
                            )
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatNumber(
                              trip.passenger_count
                            )
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatNumber(
                              trip.delay_minutes,
                              2
                            )
                          } min
                        </TableCell>


                        <TableCell>

                          <Badge variant="secondary">
                            {trip.trip_status}
                          </Badge>

                        </TableCell>


                        <TableCell>

                          <div
                            className="
                              flex
                              justify-end
                              gap-1
                            "
                          >

                            <Button
                              variant="ghost"
                              size="icon"
                              title="View trip"
                              onClick={
                                () =>
                                  onView(
                                    trip
                                  )
                              }
                            >

                              <Eye className="size-4" />

                            </Button>


                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit trip"
                              onClick={
                                () =>
                                  onEdit(
                                    trip
                                  )
                              }
                            >

                              <Pencil className="size-4" />

                            </Button>


                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete trip"
                              onClick={
                                () =>
                                  onDelete(
                                    trip
                                  )
                              }
                            >

                              <Trash2
                                className="
                                  size-4
                                  text-destructive
                                "
                              />

                            </Button>

                          </div>

                        </TableCell>

                      </TableRow>

                    )
                  )
                : (

                    <TableRow>

                      <TableCell
                        colSpan={
                          8
                        }
                        className="
                          h-28
                          text-center
                          text-muted-foreground
                        "
                      >
                        No trips match the selected filters.
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

        <p className="text-sm text-muted-foreground">
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