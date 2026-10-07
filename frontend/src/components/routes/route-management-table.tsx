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
  IRoute
} from "@/types/routeTripManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IRouteManagementTableProps {

  routes:
    IRoute[];

  onView:
    (
      route: IRoute
    ) => void;

  onEdit:
    (
      route: IRoute
    ) => void;

  onDelete:
    (
      route: IRoute
    ) => void;

}


// =========================================================

const PAGE_SIZE =
  10;


// =========================================================
// COMPONENT
// =========================================================

export function RouteManagementTable(
  {
    routes,
    onView,
    onEdit,
    onDelete
  }: IRouteManagementTableProps
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

  const filteredRoutes =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return routes.filter(
          route => {

            const matchesSearch =

              !searchText ||

              route.route_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              route.route_number
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              route.origin
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              route.destination
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesStatus =

              statusFilter ===
                "all" ||

              route.status ===
                statusFilter;


            const matchesType =

              typeFilter ===
                "all" ||

              route.route_type ===
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
        routes,
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
        filteredRoutes.length /
        PAGE_SIZE
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const pageRoutes =
    filteredRoutes.slice(

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
          lg:grid-cols-[1fr_190px_190px]
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
            placeholder="Search route, number, origin or destination..."
            value={
              search
            }
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

            <SelectItem value="Active">
              Active
            </SelectItem>

            <SelectItem value="Inactive">
              Inactive
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
              All Route Types
            </SelectItem>

            <SelectItem value="Urban">
              Urban
            </SelectItem>

            <SelectItem value="Intercity">
              Intercity
            </SelectItem>

            <SelectItem value="Rural">
              Rural
            </SelectItem>

            <SelectItem value="School">
              School
            </SelectItem>

            <SelectItem value="Night">
              Night
            </SelectItem>

            <SelectItem value="Other">
              Other
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      <p className="text-sm text-muted-foreground">
        Showing {pageRoutes.length} of {filteredRoutes.length}
        {" "}matching routes
      </p>


      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="overflow-x-auto rounded-lg border">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Route
              </TableHead>

              <TableHead>
                Journey
              </TableHead>

              <TableHead>
                Type
              </TableHead>

              <TableHead>
                Distance
              </TableHead>

              <TableHead>
                Fare
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
              pageRoutes.length >
                0
                ? pageRoutes.map(
                    route => (

                      <TableRow
                        key={
                          route.route_id
                        }
                      >

                        <TableCell>

                          <div className="font-medium">
                            {route.route_id}
                          </div>

                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Route {route.route_number}
                          </div>

                        </TableCell>


                        <TableCell>

                          <div>
                            {route.origin}
                          </div>

                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            to {route.destination}
                          </div>

                        </TableCell>


                        <TableCell>
                          {route.route_type}
                        </TableCell>


                        <TableCell>
                          {
                            formatNumber(
                              route.distance_km,
                              2
                            )
                          } km
                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              route.average_fare,
                              2
                            )
                          }
                        </TableCell>


                        <TableCell>

                          <Badge
                            variant={
                              route.status ===
                                "Active"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {route.status}
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
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="View route"
                              onClick={
                                () =>
                                  onView(
                                    route
                                  )
                              }
                            >

                              <Eye className="size-4" />

                            </Button>


                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit route"
                              onClick={
                                () =>
                                  onEdit(
                                    route
                                  )
                              }
                            >

                              <Pencil className="size-4" />

                            </Button>


                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Delete route"
                              onClick={
                                () =>
                                  onDelete(
                                    route
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
                          7
                        }
                        className="
                          h-28
                          text-center
                          text-muted-foreground
                        "
                      >
                        No routes match the selected filters.
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