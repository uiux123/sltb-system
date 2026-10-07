import {
  useEffect,
  useState,
  type FormEvent
} from "react";

import {
  LoaderCircle,
  PackagePlus
} from "lucide-react";

import {
  Button
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import {
  Input
} from "@/components/ui/input";

import {
  Label
} from "@/components/ui/label";

import type {
  ISparePart
} from "@/types/sparePartManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ISparePartRestockDialogProps {

  sparePart:
    ISparePart | null;

  open: boolean;

  restocking: boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onRestock:
    (
      quantity: number
    ) => Promise<void>;

}


// =========================================================
// COMPONENT
// =========================================================

export function SparePartRestockDialog(
  {
    sparePart,
    open,
    restocking,
    error,
    onOpenChange,
    onRestock
  }: ISparePartRestockDialogProps
) {

  const [
    quantity,
    setQuantity
  ] =
    useState(
      1
    );


  // =======================================================
  // RESET
  // =======================================================

  useEffect(
    () => {

      if (
        open
      ) {

        setQuantity(
          1
        );

      }

    },
    [
      open,
      sparePart
    ]
  );


  if (
    !sparePart
  ) {

    return null;

  }


  // =======================================================
  // NEW QUANTITY PREVIEW
  // =======================================================

  const newQuantity =

    sparePart.quantity_in_stock +
    quantity;


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ): Promise<void> => {

      event.preventDefault();


      if (
        quantity <=
        0
      ) {

        return;

      }


      await onRestock(
        quantity
      );

    };


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
        className="sm:max-w-lg"
      >

        <DialogHeader>

          <DialogTitle>
            Restock {sparePart.part_id}
          </DialogTitle>


          <DialogDescription>
            Add new units to the current inventory quantity.
            The backend updates quantity, stock status and
            last restock date.
          </DialogDescription>

        </DialogHeader>


        <form
          className="grid gap-5"
          onSubmit={
            handleSubmit
          }
        >

          <div
            className="
              grid
              gap-3
              rounded-lg
              border
              bg-muted/20
              p-4
              sm:grid-cols-2
            "
          >

            <Metric
              label="Current Stock"
              value={
                formatNumber(
                  sparePart.quantity_in_stock
                )
              }
            />


            <Metric
              label="Reorder Level"
              value={
                formatNumber(
                  sparePart.reorder_level
                )
              }
            />

          </div>


          <div className="grid gap-2">

            <Label htmlFor="restock-quantity">
              Quantity to Add
            </Label>


            <Input
              id="restock-quantity"
              type="number"
              min="1"
              required
              value={
                quantity
              }
              onChange={
                event => {

                  setQuantity(
                    Number(
                      event.target.value
                    )
                  );

                }
              }
            />

          </div>


          <div
            className="
              rounded-lg
              border
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <PackagePlus
                className="size-4"
              />


              <span
                className="
                  text-sm
                  font-medium
                "
              >
                New Stock Preview
              </span>

            </div>


            <p
              className="
                mt-3
                text-2xl
                font-semibold
              "
            >
              {
                formatNumber(
                  newQuantity
                )
              }
            </p>

          </div>


          {
            error && (

              <div
                className="
                  rounded-lg
                  border
                  border-destructive/30
                  bg-destructive/5
                  p-3
                  text-sm
                  text-destructive
                "
              >
                {error}
              </div>

            )
          }


          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              disabled={
                restocking
              }
              onClick={
                () =>
                  onOpenChange(
                    false
                  )
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"
              disabled={
                restocking ||
                quantity <=
                  0
              }
            >

              {
                restocking && (

                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                )
              }

              Restock Part

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}


// =========================================================
// METRIC
// =========================================================

interface IMetricProps {

  label: string;

  value: string;

}


function Metric(
  {
    label,
    value
  }: IMetricProps
) {

  return (

    <div>

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
          font-semibold
        "
      >
        {value}
      </p>

    </div>

  );

}