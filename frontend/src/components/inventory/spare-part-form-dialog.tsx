import {
  useEffect,
  useMemo,
  useState,
  type FormEvent
} from "react";

import {
  LoaderCircle
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import type {
  IDepot
} from "@/types/fleetManagement.types";

import type {
  ISparePart,
  ISparePartCreateInput,
  ISparePartUpdateInput,
  SparePartStockStatus
} from "@/types/sparePartManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// FORM STATE
// =========================================================

interface ISparePartFormState {

  part_id: string;

  part_name: string;

  part_category: string;

  manufacturer: string;

  compatible_bus_models: string;

  depot_id: string;

  quantity_in_stock: number;

  reorder_level: number;

  unit_cost: number;

  supplier_name: string;

  last_restock_date: string;

}


// =========================================================
// PROPS
// =========================================================

interface ISparePartFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  sparePart:
    ISparePart | null;

  depots:
    IDepot[];

  submitting: boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onCreate:
    (
      input:
        ISparePartCreateInput
    ) => Promise<void>;

  onUpdate:
    (
      input:
        ISparePartUpdateInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyForm =
  (): ISparePartFormState => ({

    part_id:
      "",

    part_name:
      "",

    part_category:
      "",

    manufacturer:
      "",

    compatible_bus_models:
      "",

    depot_id:
      "",

    quantity_in_stock:
      0,

    reorder_level:
      5,

    unit_cost:
      0,

    supplier_name:
      "",

    last_restock_date:
      new Date()
        .toISOString()
        .slice(
          0,
          10
        )

  });


// =========================================================
// DATE HELPER
// =========================================================

const toDateInput =
  (
    value?: string
  ): string => {

    if (
      !value
    ) {

      return "";

    }


    return value.slice(
      0,
      10
    );

  };


// =========================================================
// STOCK STATUS PREVIEW
// =========================================================

const getStockStatus =
  (
    quantity: number,
    reorderLevel: number
  ): SparePartStockStatus => {

    if (
      quantity <=
      0
    ) {

      return "Out of Stock";

    }


    if (
      quantity <=
      reorderLevel
    ) {

      return "Low Stock";

    }


    return "Available";

  };


// =========================================================
// COMPONENT
// =========================================================

export function SparePartFormDialog(
  {
    open,
    mode,
    sparePart,
    depots,
    submitting,
    error,
    onOpenChange,
    onCreate,
    onUpdate
  }: ISparePartFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<ISparePartFormState>(
      createEmptyForm()
    );


  // =======================================================
  // INITIALIZE
  // =======================================================

  useEffect(
    () => {

      if (
        !open
      ) {

        return;

      }


      if (
        mode ===
          "edit" &&
        sparePart
      ) {

        setForm({

          part_id:
            sparePart.part_id,

          part_name:
            sparePart.part_name,

          part_category:
            sparePart.part_category,

          manufacturer:
            sparePart.manufacturer ??
            "",

          compatible_bus_models:
            sparePart.compatible_bus_models
              .join(
                ", "
              ),

          depot_id:
            sparePart.depot_id,

          quantity_in_stock:
            sparePart.quantity_in_stock,

          reorder_level:
            sparePart.reorder_level,

          unit_cost:
            sparePart.unit_cost,

          supplier_name:
            sparePart.supplier_name ??
            "",

          last_restock_date:
            toDateInput(
              sparePart.last_restock_date
            )

        });

      } else {

        setForm(
          createEmptyForm()
        );

      }

    },
    [
      open,
      mode,
      sparePart
    ]
  );


  // =======================================================
  // COMPATIBLE MODELS
  // =======================================================

  const compatibleModels =
    useMemo(
      () => {

        return form.compatible_bus_models
          .split(
            ","
          )
          .map(
            model =>
              model.trim()
          )
          .filter(
            model =>
              model.length >
              0
          );

      },
      [
        form.compatible_bus_models
      ]
    );


  // =======================================================
  // STOCK STATUS PREVIEW
  // =======================================================

  const stockStatusPreview =
    getStockStatus(
      form.quantity_in_stock,
      form.reorder_level
    );


  // =======================================================
  // INVENTORY VALUE PREVIEW
  // =======================================================

  const inventoryValuePreview =

    form.quantity_in_stock *
    form.unit_cost;


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ): Promise<void> => {

      event.preventDefault();


      // ===================================================
      // CREATE
      // ===================================================

      if (
        mode ===
        "create"
      ) {

        const input:
          ISparePartCreateInput = {

            part_id:
              form.part_id,

            part_name:
              form.part_name.trim(),

            part_category:
              form.part_category.trim(),

            compatible_bus_models:
              compatibleModels,

            depot_id:
              form.depot_id,

            quantity_in_stock:
              form.quantity_in_stock,

            reorder_level:
              form.reorder_level,

            unit_cost:
              form.unit_cost,

            last_restock_date:
              form.last_restock_date,

            ...(
              form.manufacturer.trim()
                ? {
                    manufacturer:
                      form.manufacturer.trim()
                  }
                : {}
            ),

            ...(
              form.supplier_name.trim()
                ? {
                    supplier_name:
                      form.supplier_name.trim()
                  }
                : {}
            )

          };


        await onCreate(
          input
        );


        return;

      }


      // ===================================================
      // UPDATE
      // ===================================================

      const input:
        ISparePartUpdateInput = {

          part_name:
            form.part_name.trim(),

          part_category:
            form.part_category.trim(),

          compatible_bus_models:
            compatibleModels,

          depot_id:
            form.depot_id,

          quantity_in_stock:
            form.quantity_in_stock,

          reorder_level:
            form.reorder_level,

          unit_cost:
            form.unit_cost,

          last_restock_date:
            form.last_restock_date,

          ...(
            form.manufacturer.trim()
              ? {
                  manufacturer:
                    form.manufacturer.trim()
                }
              : {}
          ),

          ...(
            form.supplier_name.trim()
              ? {
                  supplier_name:
                    form.supplier_name.trim()
                }
              : {}
          )

        };


      await onUpdate(
        input
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
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-3xl
        "
      >

        <DialogHeader>

          <DialogTitle>

            {
              mode ===
                "create"
                ? "Add Spare Part"
                : `Edit ${
                    sparePart
                      ?.part_id ??
                    "Spare Part"
                  }`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
                "create"
                ? "Create a new depot inventory record. Stock status is calculated by the backend."
                : "Update spare-part information. Use the dedicated Restock action to increase stock."
            }

          </DialogDescription>

        </DialogHeader>


        <form
          className="grid gap-5"
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================================
              PART ID / NAME
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="part-id">
                Part ID
              </Label>


              <Input
                id="part-id"
                required
                disabled={
                  mode ===
                  "edit"
                }
                placeholder="PART101"
                value={
                  form.part_id
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        part_id:
                          event.target.value
                            .toUpperCase()
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="part-name">
                Part Name
              </Label>


              <Input
                id="part-name"
                required
                placeholder="Brake Pad"
                value={
                  form.part_name
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        part_name:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              CATEGORY / MANUFACTURER
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="category">
                Category
              </Label>


              <Input
                id="category"
                required
                placeholder="Brake System"
                value={
                  form.part_category
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        part_category:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="manufacturer">
                Manufacturer
              </Label>


              <Input
                id="manufacturer"
                placeholder="Optional manufacturer"
                value={
                  form.manufacturer
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        manufacturer:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              COMPATIBLE BUS MODELS
          ================================================= */}

          <div className="grid gap-2">

            <Label htmlFor="compatible-models">
              Compatible Bus Models
            </Label>


            <Input
              id="compatible-models"
              placeholder="Viking, Ashok Leyland, Tata"
              value={
                form.compatible_bus_models
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      compatible_bus_models:
                        event.target.value
                    })
                  );

                }
              }
            />


            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Separate multiple models using commas.
            </p>

          </div>


          {/* =================================================
              DEPOT
          ================================================= */}

          <div className="grid gap-2">

            <Label>
              Depot
            </Label>


            <Select
              value={
                form.depot_id
              }
              onValueChange={
                value => {

                  if (
                    value ===
                    null
                  ) {

                    return;

                  }


                  setForm(
                    current => ({
                      ...current,

                      depot_id:
                        value
                    })
                  );

                }
              }
            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder="Select depot"
                />

              </SelectTrigger>


              <SelectContent>

                {
                  depots.map(
                    depot => (

                      <SelectItem
                        key={
                          depot.depot_id
                        }
                        value={
                          depot.depot_id
                        }
                      >

                        {
                          depot.depot_id
                        }

                        {" — "}

                        {
                          depot.depot_name
                        }

                      </SelectItem>

                    )
                  )
                }

              </SelectContent>

            </Select>

          </div>


          {/* =================================================
              QUANTITY / REORDER
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="quantity">
                Quantity in Stock
              </Label>


              <Input
                id="quantity"
                type="number"
                min="0"
                required
                disabled={
                  mode ===
                  "edit"
                }
                value={
                  form.quantity_in_stock
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        quantity_in_stock:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />


              {
                mode ===
                  "edit" && (

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Use Restock from the inventory table to
                    increase stock quantity.
                  </p>

                )
              }

            </div>


            <div className="grid gap-2">

              <Label htmlFor="reorder-level">
                Reorder Level
              </Label>


              <Input
                id="reorder-level"
                type="number"
                min="0"
                required
                value={
                  form.reorder_level
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        reorder_level:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              UNIT COST / SUPPLIER
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="unit-cost">
                Unit Cost
              </Label>


              <Input
                id="unit-cost"
                type="number"
                min="0"
                step="0.01"
                required
                value={
                  form.unit_cost
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        unit_cost:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="supplier">
                Supplier
              </Label>


              <Input
                id="supplier"
                placeholder="Optional supplier"
                value={
                  form.supplier_name
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        supplier_name:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              LAST RESTOCK
          ================================================= */}

          <div className="grid gap-2">

            <Label htmlFor="last-restock">
              Last Restock Date
            </Label>


            <Input
              id="last-restock"
              type="date"
              required
              value={
                form.last_restock_date
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      last_restock_date:
                        event.target.value
                    })
                  );

                }
              }
            />

          </div>


          {/* =================================================
              PREVIEW
          ================================================= */}

          <div
            className="
              grid
              gap-3
              rounded-lg
              border
              bg-muted/20
              p-4
              sm:grid-cols-3
            "
          >

            <PreviewMetric
              label="Stock Status Preview"
              value={
                stockStatusPreview
              }
            />


            <PreviewMetric
              label="Inventory Units"
              value={
                formatNumber(
                  form.quantity_in_stock
                )
              }
            />


            <PreviewMetric
              label="Inventory Value"
              value={
                formatCurrency(
                  inventoryValuePreview,
                  2
                )
              }
            />

          </div>


          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Stock status shown above is only a preview. The
            backend remains responsible for the saved
            stock_status value.
          </p>


          {/* =================================================
              ERROR
          ================================================= */}

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


          {/* =================================================
              FOOTER
          ================================================= */}

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              disabled={
                submitting
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
                submitting ||
                !form.part_id ||
                !form.part_name.trim() ||
                !form.part_category.trim() ||
                !form.depot_id ||
                !form.last_restock_date ||
                form.quantity_in_stock <
                  0 ||
                form.reorder_level <
                  0 ||
                form.unit_cost <
                  0
              }
            >

              {
                submitting && (

                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                )
              }


              {
                mode ===
                  "create"
                  ? "Add Spare Part"
                  : "Save Changes"
              }

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}


// =========================================================
// PREVIEW METRIC
// =========================================================

interface IPreviewMetricProps {

  label: string;

  value: string;

}


function PreviewMetric(
  {
    label,
    value
  }: IPreviewMetricProps
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
          font-medium
        "
      >
        {value}
      </p>

    </div>

  );

}