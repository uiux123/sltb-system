import {
  Badge
} from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

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

interface ISparePartViewDialogProps {

  sparePart:
    ISparePart | null;

  open: boolean;

  onOpenChange:
    (
      open: boolean
    ) => void;

}


// =========================================================
// COMPONENT
// =========================================================

export function SparePartViewDialog(
  {
    sparePart,
    open,
    onOpenChange
  }: ISparePartViewDialogProps
) {

  if (
    !sparePart
  ) {

    return null;

  }


  const inventoryValue =

    sparePart.quantity_in_stock *
    sparePart.unit_cost;


  return (

    <Dialog
      open={
        open
      }
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-3xl
        "
      >

        <DialogHeader>

          <DialogTitle>
            {sparePart.part_id}
          </DialogTitle>


          <DialogDescription>
            Spare-part inventory information
          </DialogDescription>

        </DialogHeader>


        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <Detail
            label="Part Name"
            value={
              sparePart.part_name
            }
          />

          <Detail
            label="Category"
            value={
              sparePart.part_category
            }
          />

          <Detail
            label="Manufacturer"
            value={
              sparePart.manufacturer ??
              "Not specified"
            }
          />

          <Detail
            label="Depot"
            value={
              sparePart.depot_id
            }
          />

          <Detail
            label="Quantity in Stock"
            value={
              formatNumber(
                sparePart.quantity_in_stock
              )
            }
          />

          <Detail
            label="Reorder Level"
            value={
              formatNumber(
                sparePart.reorder_level
              )
            }
          />

          <Detail
            label="Unit Cost"
            value={
              formatCurrency(
                sparePart.unit_cost,
                2
              )
            }
          />

          <Detail
            label="Inventory Value"
            value={
              formatCurrency(
                inventoryValue,
                2
              )
            }
          />

          <Detail
            label="Supplier"
            value={
              sparePart.supplier_name ??
              "Not specified"
            }
          />

          <Detail
            label="Last Restock"
            value={
              sparePart.last_restock_date
                .slice(
                  0,
                  10
                )
            }
          />


          <div
            className="
              rounded-lg
              border
              p-3
            "
          >

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Stock Status
            </p>


            <Badge
              className="mt-2"
              variant={
                sparePart.stock_status ===
                  "Out of Stock"
                  ? "destructive"
                  : sparePart.stock_status ===
                      "Low Stock"
                    ? "secondary"
                    : "outline"
              }
            >
              {sparePart.stock_status}
            </Badge>

          </div>

        </div>


        {/* =================================================
            COMPATIBLE MODELS
        ================================================= */}

        <div
          className="
            rounded-lg
            border
            p-4
          "
        >

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Compatible Bus Models
          </p>


          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >

            {
              sparePart.compatible_bus_models.length >
                0
                ? sparePart.compatible_bus_models.map(
                    model => (

                      <Badge
                        key={
                          model
                        }
                        variant="secondary"
                      >
                        {model}
                      </Badge>

                    )
                  )
                : (

                    <p
                      className="
                        text-sm
                        text-muted-foreground
                      "
                    >
                      No compatible models specified.
                    </p>

                  )
            }

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}


// =========================================================
// DETAIL
// =========================================================

interface IDetailProps {

  label: string;

  value: string;

}


function Detail(
  {
    label,
    value
  }: IDetailProps
) {

  return (

    <div
      className="
        rounded-lg
        border
        p-3
      "
    >

      <p
        className="
          text-xs
          text-muted-foreground
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          text-sm
          font-medium
        "
      >
        {value}
      </p>

    </div>

  );

}