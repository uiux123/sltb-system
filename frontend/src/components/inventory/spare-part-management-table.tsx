import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  PackagePlus,
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
  ISparePart
} from "@/types/sparePartManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ISparePartManagementTableProps {

  spareParts:
    ISparePart[];

  onView:
    (
      sparePart: ISparePart
    ) => void;

  onEdit:
    (
      sparePart: ISparePart
    ) => void;

  onRestock:
    (
      sparePart: ISparePart
    ) => void;

  onDelete:
    (
      sparePart: ISparePart
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

export function SparePartManagementTable(
  {
    spareParts,
    onView,
    onEdit,
    onRestock,
    onDelete
  }: ISparePartManagementTableProps
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
    depotFilter,
    setDepotFilter
  ] =
    useState(
      "all"
    );


  const [
    categoryFilter,
    setCategoryFilter
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
  // FILTER OPTIONS
  // =======================================================

  const depotOptions =
    useMemo(
      () => {

        return Array.from(
          new Set(
            spareParts.map(
              part =>
                part.depot_id
            )
          )
        ).sort();

      },
      [
        spareParts
      ]
    );


  const categoryOptions =
    useMemo(
      () => {

        return Array.from(
          new Set(
            spareParts.map(
              part =>
                part.part_category
            )
          )
        ).sort();

      },
      [
        spareParts
      ]
    );


  // =======================================================
  // FILTER
  // =======================================================

  const filteredParts =
    useMemo(
      () => {

        const searchText =
          search
            .trim()
            .toLowerCase();


        return spareParts.filter(
          part => {

            const manufacturer =
              part.manufacturer ??
              "";


            const supplier =
              part.supplier_name ??
              "";


            const matchesSearch =

              !searchText ||

              part.part_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              part.part_name
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              part.part_category
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              part.depot_id
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              manufacturer
                .toLowerCase()
                .includes(
                  searchText
                ) ||

              supplier
                .toLowerCase()
                .includes(
                  searchText
                );


            const matchesStatus =

              statusFilter ===
                "all" ||

              part.stock_status ===
                statusFilter;


            const matchesDepot =

              depotFilter ===
                "all" ||

              part.depot_id ===
                depotFilter;


            const matchesCategory =

              categoryFilter ===
                "all" ||

              part.part_category ===
                categoryFilter;


            return (

              matchesSearch &&
              matchesStatus &&
              matchesDepot &&
              matchesCategory

            );

          }
        );

      },
      [
        spareParts,
        search,
        statusFilter,
        depotFilter,
        categoryFilter
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
      depotFilter,
      categoryFilter
    ]
  );


  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredParts.length /
        PAGE_SIZE
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const pageParts =
    filteredParts.slice(

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
          xl:grid-cols-[1fr_190px_180px_200px]
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
            placeholder="Search part, name, category, depot, manufacturer..."
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


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
              All Statuses
            </SelectItem>

            <SelectItem value="Available">
              Available
            </SelectItem>

            <SelectItem value="Low Stock">
              Low Stock
            </SelectItem>

            <SelectItem value="Out of Stock">
              Out of Stock
            </SelectItem>

          </SelectContent>

        </Select>


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


        {/* CATEGORY */}

        <Select
          value={
            categoryFilter
          }
          onValueChange={
            value => {

              if (
                value ===
                null
              ) {

                return;

              }


              setCategoryFilter(
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
              All Categories
            </SelectItem>


            {
              categoryOptions.map(
                category => (

                  <SelectItem
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
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
        Showing {pageParts.length} of {
          filteredParts.length
        } matching Spare Parts
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
                Part
              </TableHead>

              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Depot
              </TableHead>

              <TableHead>
                Stock
              </TableHead>

              <TableHead>
                Reorder Level
              </TableHead>

              <TableHead>
                Unit Cost
              </TableHead>

              <TableHead>
                Inventory Value
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
              pageParts.length >
                0
                ? pageParts.map(
                    part => {

                      const inventoryValue =

                        part.quantity_in_stock *
                        part.unit_cost;


                      return (

                        <TableRow
                          key={
                            part.part_id
                          }
                        >

                          <TableCell>

                            <div className="font-medium">
                              {part.part_id}
                            </div>


                            <div
                              className="
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {part.part_name}
                            </div>

                          </TableCell>


                          <TableCell>
                            {part.part_category}
                          </TableCell>


                          <TableCell>
                            {part.depot_id}
                          </TableCell>


                          <TableCell>
                            {
                              formatNumber(
                                part.quantity_in_stock
                              )
                            }
                          </TableCell>


                          <TableCell>
                            {
                              formatNumber(
                                part.reorder_level
                              )
                            }
                          </TableCell>


                          <TableCell>
                            {
                              formatCurrency(
                                part.unit_cost,
                                2
                              )
                            }
                          </TableCell>


                          <TableCell>
                            {
                              formatCurrency(
                                inventoryValue,
                                2
                              )
                            }
                          </TableCell>


                          <TableCell>

                            <StockBadge
                              status={
                                part.stock_status
                              }
                            />

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
                                title="View Spare Part"
                                onClick={
                                  () =>
                                    onView(
                                      part
                                    )
                                }
                              >

                                <Eye className="size-4" />

                              </Button>


                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit Spare Part"
                                onClick={
                                  () =>
                                    onEdit(
                                      part
                                    )
                                }
                              >

                                <Pencil className="size-4" />

                              </Button>


                              <Button
                                variant="ghost"
                                size="icon"
                                title="Restock Spare Part"
                                onClick={
                                  () =>
                                    onRestock(
                                      part
                                    )
                                }
                              >

                                <PackagePlus className="size-4" />

                              </Button>


                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete Spare Part"
                                onClick={
                                  () =>
                                    onDelete(
                                      part
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

                      );

                    }
                  )
                : (

                    <TableRow>

                      <TableCell
                        colSpan={
                          9
                        }
                        className="
                          h-28
                          text-center
                          text-muted-foreground
                        "
                      >
                        No Spare Parts match the selected
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


// =========================================================
// STOCK BADGE
// =========================================================

function StockBadge(
  {
    status
  }: {
    status:
      ISparePart["stock_status"];
  }
) {

  if (
    status ===
    "Out of Stock"
  ) {

    return (

      <Badge variant="destructive">
        Out of Stock
      </Badge>

    );

  }


  if (
    status ===
    "Low Stock"
  ) {

    return (

      <Badge variant="secondary">
        Low Stock
      </Badge>

    );

  }


  return (

    <Badge variant="outline">
      Available
    </Badge>

  );

}