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
  IFuelRecord
} from "@/types/fuelManagement.types";

import {
  formatCurrency,
  formatDecimal,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IFuelRecordManagementTableProps {

  fuelRecords:
    IFuelRecord[];

  onView:
    (
      fuelRecord: IFuelRecord
    ) => void;

  onEdit:
    (
      fuelRecord: IFuelRecord
    ) => void;

  onDelete:
    (
      fuelRecord: IFuelRecord
    ) => void;

}


// =========================================================
// PAGE SIZE
// =========================================================

const PAGE_SIZE =
  10;


// =========================================================
// COMPONENT
// =========================================================

export function FuelRecordManagementTable(
  {
    fuelRecords,
    onView,
    onEdit,
    onDelete
  }: IFuelRecordManagementTableProps
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
            fuelRecords.map(
              record =>
                record.depot_id
            )
          )
        ).sort();

      },
      [
        fuelRecords
      ]
    );


  // =======================================================
  // FILTER
  // =======================================================

  const filteredRecords =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return fuelRecords.filter(
          record => {

            const recordedBy =
              record.recorded_by ??
              "";


            const matchesSearch =

              !searchText ||

              record.fuel_record_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              record.trip_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              record.bus_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              record.depot_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              recordedBy
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesDepot =

              depotFilter ===
                "all" ||

              record.depot_id ===
                depotFilter;


            return (
              matchesSearch &&
              matchesDepot
            );

          }
        );

      },
      [
        fuelRecords,
        search,
        depotFilter
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
      depotFilter
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
          lg:grid-cols-[1fr_220px]
        "
      >

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
            className="pl-9"
            value={
              search
            }
            placeholder="Search fuel record, trip, bus, depot or recorded by..."
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

      </div>


      {/* ===================================================
          COUNT
      =================================================== */}

      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        Showing {
          pageRecords.length
        } of {
          filteredRecords.length
        } matching Fuel Records
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
                Fuel Record
              </TableHead>

              <TableHead>
                Trip / Bus
              </TableHead>

              <TableHead>
                Depot
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Fuel
              </TableHead>

              <TableHead>
                Total Cost
              </TableHead>

              <TableHead>
                Efficiency
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
              pageRecords.length >
                0
                ? pageRecords.map(
                    record => (

                      <TableRow
                        key={
                          record.fuel_record_id
                        }
                      >

                        <TableCell>

                          <div
                            className="font-medium"
                          >
                            {
                              record.fuel_record_id
                            }
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              record.recorded_by ??
                              "No recorder ID"
                            }
                          </div>

                        </TableCell>


                        <TableCell>

                          <div>
                            {
                              record.trip_id
                            }
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              record.bus_id
                            }
                          </div>

                        </TableCell>


                        <TableCell>
                          {
                            record.depot_id
                          }
                        </TableCell>


                        <TableCell>
                          {
                            record.fuel_date
                              .slice(
                                0,
                                10
                              )
                          }
                        </TableCell>


                        <TableCell>

                          {
                            formatNumber(
                              record.fuel_litres,
                              2
                            )
                          } L


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              formatCurrency(
                                record.fuel_cost_per_litre,
                                2
                              )
                            } / L
                          </div>

                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              record.total_fuel_cost,
                              2
                            )
                          }
                        </TableCell>


                        <TableCell>

                          {
                            formatDecimal(
                              record.km_per_litre,
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


                        <TableCell>

                          <div
                            className="
                              flex
                              justify-end
                              gap-1
                            "
                          >

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="View Fuel Record"
                              onClick={
                                () =>
                                  onView(
                                    record
                                  )
                              }
                            >

                              <Eye
                                className="size-4"
                              />

                            </Button>


                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit Fuel Record"
                              onClick={
                                () =>
                                  onEdit(
                                    record
                                  )
                              }
                            >

                              <Pencil
                                className="size-4"
                              />

                            </Button>


                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Delete Fuel Record"
                              onClick={
                                () =>
                                  onDelete(
                                    record
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
                        No Fuel Records match the selected
                        filters.
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


        <div
          className="
            flex
            gap-2
          "
        >

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

            <ChevronLeft
              className="size-4"
            />

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

            <ChevronRight
              className="size-4"
            />

          </Button>

        </div>

      </div>

    </div>

  );

}