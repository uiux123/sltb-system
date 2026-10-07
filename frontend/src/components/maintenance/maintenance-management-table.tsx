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
  IMaintenanceRecord
} from "@/types/maintenanceManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IMaintenanceManagementTableProps {

  maintenanceRecords:
    IMaintenanceRecord[];

  onView:
    (
      record: IMaintenanceRecord
    ) => void;

  onEdit:
    (
      record: IMaintenanceRecord
    ) => void;

  onDelete:
    (
      record: IMaintenanceRecord
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

export function MaintenanceManagementTable(
  {
    maintenanceRecords,
    onView,
    onEdit,
    onDelete
  }: IMaintenanceManagementTableProps
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
    typeFilter,
    setTypeFilter
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

  const filteredRecords =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return maintenanceRecords.filter(
          record => {

            const technician =
              record.technician_id ??
              "";


            const matchesSearch =

              !searchText ||

              record.maintenance_id
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

              record.fault_category
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              technician
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesStatus =

              statusFilter ===
                "all" ||

              record.status ===
                statusFilter;


            const matchesType =

              typeFilter ===
                "all" ||

              record.maintenance_type ===
                typeFilter;


            return (
              matchesSearch &&
              matchesStatus &&
              matchesType
            );

          }
        );

      },
      [
        maintenanceRecords,
        search,
        statusFilter,
        typeFilter
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
      statusFilter,
      typeFilter
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
          lg:grid-cols-[1fr_210px_200px]
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
            placeholder="Search maintenance, bus, depot, fault or technician..."
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
              All Statuses
            </SelectItem>

            <SelectItem value="In Progress">
              In Progress
            </SelectItem>

            <SelectItem value="Completed">
              Completed
            </SelectItem>

          </SelectContent>

        </Select>


        <Select
          value={
            typeFilter
          }
          onValueChange={
            value => {

              if (
                value ===
                null
              ) {

                return;

              }


              setTypeFilter(
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
              All Types
            </SelectItem>

            <SelectItem value="Preventive">
              Preventive
            </SelectItem>

            <SelectItem value="Corrective">
              Corrective
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        Showing {pageRecords.length} of {
          filteredRecords.length
        } matching maintenance records
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
                Maintenance
              </TableHead>

              <TableHead>
                Bus / Depot
              </TableHead>

              <TableHead>
                Type
              </TableHead>

              <TableHead>
                Fault
              </TableHead>

              <TableHead>
                Cost
              </TableHead>

              <TableHead>
                Downtime
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
              pageRecords.length >
                0
                ? pageRecords.map(
                    record => (

                      <TableRow
                        key={
                          record.maintenance_id
                        }
                      >

                        <TableCell>

                          <div className="font-medium">
                            {
                              record.maintenance_id
                            }
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              record.reported_date.slice(
                                0,
                                10
                              )
                            }
                          </div>

                        </TableCell>


                        <TableCell>

                          <div>
                            {record.bus_id}
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


                        <TableCell>

                          <Badge
                            variant="outline"
                          >
                            {
                              record.maintenance_type
                            }
                          </Badge>

                        </TableCell>


                        <TableCell>
                          {
                            record.fault_category
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              record.total_repair_cost,
                              2
                            )
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatNumber(
                              record.downtime_hours,
                              2
                            )
                          } hrs
                        </TableCell>


                        <TableCell>

                          <Badge
                            variant={
                              record.status ===
                                "Completed"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {record.status}
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
                              title="View Maintenance"
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
                              variant="ghost"
                              size="icon"
                              title="Edit Maintenance"
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
                              variant="ghost"
                              size="icon"
                              title="Delete Maintenance"
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
                        No maintenance records match the
                        selected filters.
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