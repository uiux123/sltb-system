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
  ITicketSale
} from "@/types/ticketSalesManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ITicketSaleManagementTableProps {

  ticketSales:
    ITicketSale[];

  onView:
    (
      ticketSale: ITicketSale
    ) => void;

  onEdit:
    (
      ticketSale: ITicketSale
    ) => void;

  onDelete:
    (
      ticketSale: ITicketSale
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

export function TicketSaleManagementTable(
  {
    ticketSales,
    onView,
    onEdit,
    onDelete
  }: ITicketSaleManagementTableProps
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
            ticketSales.map(
              sale =>
                sale.depot_id
            )
          )
        ).sort();

      },
      [
        ticketSales
      ]
    );


  // =======================================================
  // FILTER
  // =======================================================

  const filteredSales =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return ticketSales.filter(
          sale => {

            const conductor =
              sale.conductor_id ??
              "";


            const matchesSearch =

              !searchText ||

              sale.ticket_record_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              sale.trip_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              sale.bus_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              sale.route_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              sale.depot_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              conductor
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesDepot =

              depotFilter ===
                "all" ||

              sale.depot_id ===
                depotFilter;


            return (
              matchesSearch &&
              matchesDepot
            );

          }
        );

      },
      [
        ticketSales,
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
        filteredSales.length /
        PAGE_SIZE
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const pageSales =
    filteredSales.slice(

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
            placeholder="Search ticket, trip, bus, route, depot or conductor..."
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


      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        Showing {pageSales.length} of {
          filteredSales.length
        } matching Ticket Sales
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
                Ticket Record
              </TableHead>

              <TableHead>
                Trip / Bus
              </TableHead>

              <TableHead>
                Route / Depot
              </TableHead>

              <TableHead>
                Tickets
              </TableHead>

              <TableHead>
                Actual Revenue
              </TableHead>

              <TableHead>
                Expected
              </TableHead>

              <TableHead>
                Difference
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
              pageSales.length >
                0
                ? pageSales.map(
                    sale => (

                      <TableRow
                        key={
                          sale.ticket_record_id
                        }
                      >

                        <TableCell>

                          <div className="font-medium">
                            {sale.ticket_record_id}
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              sale.sale_date.slice(
                                0,
                                10
                              )
                            }
                          </div>

                        </TableCell>


                        <TableCell>

                          <div>
                            {sale.trip_id}
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {sale.bus_id}
                          </div>

                        </TableCell>


                        <TableCell>

                          <div>
                            {sale.route_id}
                          </div>


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {sale.depot_id}
                          </div>

                        </TableCell>


                        <TableCell>

                          {
                            formatNumber(
                              sale.tickets_sold
                            )
                          }


                          <div
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Full {
                              sale.full_fare_tickets
                            } / Concession {
                              sale.concession_tickets
                            }
                          </div>

                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              sale.total_revenue,
                              2
                            )
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              sale.expected_revenue,
                              2
                            )
                          }
                        </TableCell>


                        <TableCell>
                          {
                            formatCurrency(
                              sale.revenue_difference,
                              2
                            )
                          }
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
                              title="View Ticket Sale"
                              onClick={
                                () =>
                                  onView(
                                    sale
                                  )
                              }
                            >

                              <Eye className="size-4" />

                            </Button>


                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Ticket Sale"
                              onClick={
                                () =>
                                  onEdit(
                                    sale
                                  )
                              }
                            >

                              <Pencil className="size-4" />

                            </Button>


                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Ticket Sale"
                              onClick={
                                () =>
                                  onDelete(
                                    sale
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
                        No Ticket Sales match the selected
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