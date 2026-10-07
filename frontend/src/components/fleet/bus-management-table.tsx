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
  IBus
} from "@/types/fleetManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IBusManagementTableProps {

  buses:
    IBus[];

  onView:
    (
      bus: IBus
    ) => void;

  onEdit:
    (
      bus: IBus
    ) => void;

  onDelete:
    (
      bus: IBus
    ) => void;

}


// =========================================================
// PAGE SIZE
// =========================================================

const PAGE_SIZE =
  10;


// =========================================================
// BUS MANAGEMENT TABLE
// =========================================================

export function BusManagementTable(
  {
    buses,
    onView,
    onEdit,
    onDelete
  }: IBusManagementTableProps
) {

  // =======================================================
  // SEARCH
  // =======================================================

  const [
    search,
    setSearch
  ] =
    useState(
      ""
    );


  // =======================================================
  // STATUS FILTER
  // =======================================================

  const [
    statusFilter,
    setStatusFilter
  ] =
    useState(
      "all"
    );


  // =======================================================
  // FUEL FILTER
  // =======================================================

  const [
    fuelFilter,
    setFuelFilter
  ] =
    useState(
      "all"
    );


  // =======================================================
  // CURRENT PAGE
  // =======================================================

  const [
    page,
    setPage
  ] =
    useState(
      1
    );


  // =======================================================
  // FILTER BUSES
  // =======================================================

  const filteredBuses =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return buses.filter(
          bus => {

            // =============================================
            // SEARCH
            // =============================================

            const matchesSearch =

              !searchText ||

              bus.bus_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              bus.registration_no
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              bus.depot_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              bus.manufacturer
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              bus.model
                .toLowerCase()
                .includes(
                  searchText
                );


            // =============================================
            // STATUS FILTER
            // =============================================

            const matchesStatus =

              statusFilter ===
                "all" ||

              bus.bus_status ===
                statusFilter;


            // =============================================
            // FUEL FILTER
            // =============================================

            const matchesFuel =

              fuelFilter ===
                "all" ||

              bus.fuel_type ===
                fuelFilter;


            return (

              matchesSearch &&
              matchesStatus &&
              matchesFuel

            );

          }
        );

      },
      [
        buses,
        search,
        statusFilter,
        fuelFilter
      ]
    );


  // =======================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =======================================================

  useEffect(
    () => {

      setPage(
        1
      );

    },
    [
      search,
      statusFilter,
      fuelFilter
    ]
  );


  // =======================================================
  // TOTAL PAGES
  // =======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredBuses.length /
        PAGE_SIZE
      )
    );


  // =======================================================
  // SAFE CURRENT PAGE
  // =======================================================

  const safePage =
    Math.min(
      page,
      totalPages
    );


  // =======================================================
  // CURRENT PAGE RECORDS
  // =======================================================

  const pageBuses =
    filteredBuses.slice(

      (
        safePage -
        1
      ) *
      PAGE_SIZE,

      safePage *
      PAGE_SIZE

    );


  return (

    <div
      className="
        grid
        gap-4
      "
    >

      {/* ===================================================
          FILTERS
      =================================================== */}

      <div
        className="
          grid
          gap-3
          lg:grid-cols-[1fr_220px_180px]
        "
      >

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="relative"
        >

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
            value={
              search
            }
            onChange={
              event => {

                setSearch(
                  event.target.value
                );

              }
            }
            placeholder="Search bus, registration, depot, manufacturer..."
            className="pl-9"
          />

        </div>


        {/* =================================================
            STATUS FILTER
        ================================================= */}

        <Select
          value={
            statusFilter
          }
          onValueChange={
            value => {

              // ===========================================
              // shadcn Select may return string | null.
              //
              // statusFilter state must remain string.
              // ===========================================

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

          <SelectTrigger
            className="w-full"
          >

            <SelectValue
              placeholder="Bus status"
            />

          </SelectTrigger>


          <SelectContent>

            <SelectItem
              value="all"
            >
              All Statuses
            </SelectItem>


            <SelectItem
              value="Operational"
            >
              Operational
            </SelectItem>


            <SelectItem
              value="Under Maintenance"
            >
              Under Maintenance
            </SelectItem>


            <SelectItem
              value="Breakdown"
            >
              Breakdown
            </SelectItem>


            <SelectItem
              value="Out of Service"
            >
              Out of Service
            </SelectItem>

          </SelectContent>

        </Select>


        {/* =================================================
            FUEL FILTER
        ================================================= */}

        <Select
          value={
            fuelFilter
          }
          onValueChange={
            value => {

              // ===========================================
              // shadcn Select may return string | null.
              //
              // fuelFilter state must remain string.
              // ===========================================

              if (
                value ===
                null
              ) {

                return;

              }


              setFuelFilter(
                value
              );

            }
          }
        >

          <SelectTrigger
            className="w-full"
          >

            <SelectValue
              placeholder="Fuel type"
            />

          </SelectTrigger>


          <SelectContent>

            <SelectItem
              value="all"
            >
              All Fuel Types
            </SelectItem>


            <SelectItem
              value="Diesel"
            >
              Diesel
            </SelectItem>


            <SelectItem
              value="Electric"
            >
              Electric
            </SelectItem>


            <SelectItem
              value="Hybrid"
            >
              Hybrid
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      {/* ===================================================
          RESULT COUNT
      =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >

          Showing{" "}

          <span
            className="font-medium"
          >
            {
              pageBuses.length
            }
          </span>

          {" "}of{" "}

          <span
            className="font-medium"
          >
            {
              filteredBuses.length
            }
          </span>

          {" "}matching buses

        </p>


        <p
          className="
            text-sm
            text-muted-foreground
          "
        >

          Total fleet records:{" "}

          <span
            className="font-medium"
          >
            {
              buses.length
            }
          </span>

        </p>

      </div>


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
                Depot
              </TableHead>


              <TableHead>
                Vehicle
              </TableHead>


              <TableHead>
                Fuel
              </TableHead>


              <TableHead>
                Capacity
              </TableHead>


              <TableHead>
                Odometer
              </TableHead>


              <TableHead>
                Status
              </TableHead>


              <TableHead
                className="text-right"
              >
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>


          <TableBody>

            {
              pageBuses.length >
              0
                ? (

                    pageBuses.map(
                      bus => (

                        <TableRow
                          key={
                            bus.bus_id
                          }
                        >

                          {/* =================================
                              BUS
                          ================================= */}

                          <TableCell>

                            <div
                              className="
                                font-medium
                              "
                            >
                              {
                                bus.bus_id
                              }
                            </div>


                            <div
                              className="
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {
                                bus.registration_no
                              }
                            </div>

                          </TableCell>


                          {/* =================================
                              DEPOT
                          ================================= */}

                          <TableCell>

                            {
                              bus.depot_id
                            }

                          </TableCell>


                          {/* =================================
                              VEHICLE
                          ================================= */}

                          <TableCell>

                            <div>
                              {
                                bus.manufacturer
                              }
                            </div>


                            <div
                              className="
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {
                                bus.model
                              }
                            </div>

                          </TableCell>


                          {/* =================================
                              FUEL
                          ================================= */}

                          <TableCell>

                            <Badge
                              variant="outline"
                            >
                              {
                                bus.fuel_type
                              }
                            </Badge>

                          </TableCell>


                          {/* =================================
                              CAPACITY
                          ================================= */}

                          <TableCell>

                            {
                              formatNumber(
                                bus.capacity
                              )
                            }

                          </TableCell>


                          {/* =================================
                              ODOMETER
                          ================================= */}

                          <TableCell>

                            {
                              formatNumber(
                                bus.odometer_km
                              )
                            }{" "}km

                          </TableCell>


                          {/* =================================
                              STATUS
                          ================================= */}

                          <TableCell>

                            <BusStatusBadge
                              status={
                                bus.bus_status
                              }
                            />

                          </TableCell>


                          {/* =================================
                              ACTIONS
                          ================================= */}

                          <TableCell>

                            <div
                              className="
                                flex
                                justify-end
                                gap-1
                              "
                            >

                              {/* VIEW */}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title="View bus"
                                onClick={
                                  () => {

                                    onView(
                                      bus
                                    );

                                  }
                                }
                              >

                                <Eye
                                  className="size-4"
                                />

                              </Button>


                              {/* EDIT */}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title="Edit bus"
                                onClick={
                                  () => {

                                    onEdit(
                                      bus
                                    );

                                  }
                                }
                              >

                                <Pencil
                                  className="size-4"
                                />

                              </Button>


                              {/* DELETE */}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title="Delete bus"
                                onClick={
                                  () => {

                                    onDelete(
                                      bus
                                    );

                                  }
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

                  )
                : (

                    <TableRow>

                      <TableCell
                        colSpan={
                          8
                        }
                        className="
                          h-32
                          text-center
                        "
                      >

                        <div
                          className="
                            grid
                            place-items-center
                            gap-2
                            text-muted-foreground
                          "
                        >

                          <Search
                            className="size-6"
                          />


                          <p>
                            No buses match the selected
                            filters.
                          </p>

                        </div>

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
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >

          Page{" "}

          <span
            className="font-medium"
          >
            {
              safePage
            }
          </span>

          {" "}of{" "}

          <span
            className="font-medium"
          >
            {
              totalPages
            }
          </span>

        </p>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* PREVIOUS */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              safePage <=
              1
            }
            onClick={
              () => {

                setPage(
                  current =>
                    Math.max(
                      1,
                      current -
                      1
                    )
                );

              }
            }
          >

            <ChevronLeft
              className="size-4"
            />

            Previous

          </Button>


          {/* NEXT */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              safePage >=
              totalPages
            }
            onClick={
              () => {

                setPage(
                  current =>
                    Math.min(
                      totalPages,
                      current +
                      1
                    )
                );

              }
            }
          >

            Next

            <ChevronRight
              className="size-4"
            />

          </Button>

        </div>

      </div>

    </div>

  );

}


// =========================================================
// BUS STATUS BADGE
// =========================================================

interface IBusStatusBadgeProps {

  status: string;

}


function BusStatusBadge(
  {
    status
  }: IBusStatusBadgeProps
) {

  // =======================================================
  // OPERATIONAL
  // =======================================================

  if (
    status ===
    "Operational"
  ) {

    return (

      <Badge
        variant="outline"
        className="
          border-emerald-200
          bg-emerald-50
          text-emerald-700
        "
      >
        Operational
      </Badge>

    );

  }


  // =======================================================
  // UNDER MAINTENANCE
  // =======================================================

  if (
    status ===
    "Under Maintenance"
  ) {

    return (

      <Badge
        variant="outline"
        className="
          border-amber-200
          bg-amber-50
          text-amber-700
        "
      >
        Under Maintenance
      </Badge>

    );

  }


  // =======================================================
  // BREAKDOWN
  // =======================================================

  if (
    status ===
    "Breakdown"
  ) {

    return (

      <Badge
        variant="destructive"
      >
        Breakdown
      </Badge>

    );

  }


  // =======================================================
  // OUT OF SERVICE
  // =======================================================

  if (
    status ===
    "Out of Service"
  ) {

    return (

      <Badge
        variant="secondary"
      >
        Out of Service
      </Badge>

    );

  }


  return (

    <Badge
      variant="secondary"
    >
      {status}
    </Badge>

  );

}