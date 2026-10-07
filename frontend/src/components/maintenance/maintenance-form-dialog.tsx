import {
  useEffect,
  useMemo,
  useState,
  type FormEvent
} from "react";

import {
  LoaderCircle,
  Plus,
  Trash2
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

import type {
  IMaintenanceCreateInput,
  IMaintenancePartInput,
  IMaintenanceRecord,
  IMaintenanceUpdateInput,
  MaintenanceStatus,
  MaintenanceType
} from "@/types/maintenanceManagement.types";

import type {
  ISparePart
} from "@/types/sparePartManagement.types";

import {
  formatCurrency
} from "@/utils/formatters";


// =========================================================
// FORM STATE
// =========================================================

interface IMaintenanceFormState {

  maintenance_id: string;

  bus_id: string;

  reported_date: string;

  maintenance_type: MaintenanceType;

  fault_category: string;

  fault_description: string;

  labour_cost: number;

  downtime_hours: number;

  technician_id: string;

  completion_date: string;

  status: MaintenanceStatus;

}


// =========================================================
// PROPS
// =========================================================

interface IMaintenanceFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  maintenanceRecord:
    IMaintenanceRecord | null;

  buses:
    IBus[];

  spareParts:
    ISparePart[];

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
        IMaintenanceCreateInput
    ) => Promise<void>;

  onUpdate:
    (
      input:
        IMaintenanceUpdateInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyForm =
  (): IMaintenanceFormState => ({

    maintenance_id:
      "",

    bus_id:
      "",

    reported_date:
      new Date()
        .toISOString()
        .slice(
          0,
          10
        ),

    maintenance_type:
      "Preventive",

    fault_category:
      "",

    fault_description:
      "",

    labour_cost:
      0,

    downtime_hours:
      0,

    technician_id:
      "",

    completion_date:
      "",

    status:
      "In Progress"

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
// COMPONENT
// =========================================================

export function MaintenanceFormDialog(
  {
    open,
    mode,
    maintenanceRecord,
    buses,
    spareParts,
    submitting,
    error,
    onOpenChange,
    onCreate,
    onUpdate
  }: IMaintenanceFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<IMaintenanceFormState>(
      createEmptyForm()
    );


  const [
    selectedParts,
    setSelectedParts
  ] =
    useState<
      IMaintenancePartInput[]
    >(
      []
    );


  const [
    partToAdd,
    setPartToAdd
  ] =
    useState(
      ""
    );


  const [
    partQuantity,
    setPartQuantity
  ] =
    useState(
      1
    );


  const [
    partsError,
    setPartsError
  ] =
    useState<
      string | null
    >(
      null
    );


  // =======================================================
  // INITIALIZE FORM
  // =======================================================

  useEffect(
    () => {

      if (
        !open
      ) {

        return;

      }


      setPartToAdd(
        ""
      );


      setPartQuantity(
        1
      );


      setPartsError(
        null
      );


      if (
        mode ===
          "edit" &&
        maintenanceRecord
      ) {

        setForm({

          maintenance_id:
            maintenanceRecord.maintenance_id,

          bus_id:
            maintenanceRecord.bus_id,

          reported_date:
            toDateInput(
              maintenanceRecord.reported_date
            ),

          maintenance_type:
            maintenanceRecord.maintenance_type,

          fault_category:
            maintenanceRecord.fault_category,

          fault_description:
            maintenanceRecord.fault_description,

          labour_cost:
            maintenanceRecord.labour_cost,

          downtime_hours:
            maintenanceRecord.downtime_hours,

          technician_id:
            maintenanceRecord.technician_id ??
            "",

          completion_date:
            toDateInput(
              maintenanceRecord.completion_date
            ),

          status:
            maintenanceRecord.status

        });


        setSelectedParts(
          []
        );

      } else {

        setForm(
          createEmptyForm()
        );


        setSelectedParts(
          []
        );

      }

    },
    [
      open,
      mode,
      maintenanceRecord
    ]
  );


  // =======================================================
  // SELECTED BUS
  // =======================================================

  const selectedBus =
    useMemo(
      () => {

        return buses.find(
          bus =>
            bus.bus_id ===
            form.bus_id
        );

      },
      [
        buses,
        form.bus_id
      ]
    );


  // =======================================================
  // AVAILABLE PARTS FROM SELECTED BUS DEPOT
  // =======================================================

  const availableParts =
    useMemo(
      () => {

        if (
          !selectedBus
        ) {

          return [];

        }


        return spareParts.filter(
          part =>

            part.depot_id ===
              selectedBus.depot_id &&

            part.quantity_in_stock >
              0
        );

      },
      [
        spareParts,
        selectedBus
      ]
    );


  // =======================================================
  // SELECTED PARTS COST
  // =======================================================

  const selectedPartsCost =
    useMemo(
      () => {

        return selectedParts.reduce(
          (
            total,
            selected
          ) => {

            const part =
              spareParts.find(
                item =>
                  item.part_id ===
                  selected.part_id
              );


            if (
              !part
            ) {

              return total;

            }


            return (
              total +
              (
                part.unit_cost *
                selected.quantity
              )
            );

          },
          0
        );

      },
      [
        selectedParts,
        spareParts
      ]
    );


  // =======================================================
  // PARTS COST PREVIEW
  // =======================================================

  const partsCostPreview =

    mode ===
      "edit" &&
    maintenanceRecord
      ? maintenanceRecord.parts_cost
      : selectedPartsCost;


  // =======================================================
  // TOTAL REPAIR COST PREVIEW
  // =======================================================

  const totalRepairCostPreview =

    partsCostPreview +
    form.labour_cost;


  // =======================================================
  // ADD SPARE PART
  // =======================================================

  const handleAddPart =
    (): void => {

      setPartsError(
        null
      );


      // ===================================================
      // VALIDATE PART
      // ===================================================

      if (
        !partToAdd
      ) {

        setPartsError(
          "Select a spare part."
        );

        return;

      }


      // ===================================================
      // VALIDATE QUANTITY
      // ===================================================

      if (
        partQuantity <=
        0
      ) {

        setPartsError(
          "Part quantity must be greater than zero."
        );

        return;

      }


      // ===================================================
      // FIND PART
      // ===================================================

      const sparePart =
        spareParts.find(
          part =>
            part.part_id ===
            partToAdd
        );


      if (
        !sparePart
      ) {

        setPartsError(
          "Selected spare part was not found."
        );

        return;

      }


      // ===================================================
      // CHECK STOCK
      // ===================================================

      if (
        partQuantity >
        sparePart.quantity_in_stock
      ) {

        setPartsError(
          `Only ${sparePart.quantity_in_stock} units are currently in stock.`
        );

        return;

      }


      // ===================================================
      // PREVENT DUPLICATE PART
      // ===================================================

      const alreadyAdded =
        selectedParts.some(
          part =>
            part.part_id ===
            partToAdd
        );


      if (
        alreadyAdded
      ) {

        setPartsError(
          "This spare part has already been added."
        );

        return;

      }


      // ===================================================
      // ADD PART
      // ===================================================

      setSelectedParts(
        current => [

          ...current,

          {
            part_id:
              partToAdd,

            quantity:
              partQuantity
          }

        ]
      );


      setPartToAdd(
        ""
      );


      setPartQuantity(
        1
      );

    };


  // =======================================================
  // REMOVE PART
  // =======================================================

  const handleRemovePart =
    (
      partId: string
    ): void => {

      setSelectedParts(
        current =>
          current.filter(
            part =>
              part.part_id !==
              partId
          )
      );

    };


  // =======================================================
  // SUBMIT FORM
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
          IMaintenanceCreateInput = {

            maintenance_id:
              form.maintenance_id,

            bus_id:
              form.bus_id,

            reported_date:
              form.reported_date,

            maintenance_type:
              form.maintenance_type,

            fault_category:
              form.fault_category.trim(),

            fault_description:
              form.fault_description.trim(),

            labour_cost:
              form.labour_cost,

            downtime_hours:
              form.downtime_hours,

            status:
              form.status,

            ...(
              selectedParts.length >
                0
                ? {
                    parts_used:
                      selectedParts
                  }
                : {}
            ),

            ...(
              form.technician_id.trim()
                ? {
                    technician_id:
                      form.technician_id.trim()
                  }
                : {}
            ),

            ...(
              form.completion_date
                ? {
                    completion_date:
                      form.completion_date
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
        IMaintenanceUpdateInput = {

          reported_date:
            form.reported_date,

          maintenance_type:
            form.maintenance_type,

          fault_category:
            form.fault_category.trim(),

          fault_description:
            form.fault_description.trim(),

          labour_cost:
            form.labour_cost,

          downtime_hours:
            form.downtime_hours,

          status:
            form.status,

          ...(
            form.technician_id.trim()
              ? {
                  technician_id:
                    form.technician_id.trim()
                }
              : {}
          ),

          ...(
            form.completion_date
              ? {
                  completion_date:
                    form.completion_date
                }
              : {}
          )

        };


      await onUpdate(
        input
      );

    };


  // =======================================================
  // PAGE
  // =======================================================

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
          sm:max-w-4xl
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <DialogHeader>

          <DialogTitle>

            {
              mode ===
                "create"
                ? "Add Maintenance Record"
                : `Edit ${
                    maintenanceRecord
                      ?.maintenance_id ??
                    "Maintenance Record"
                  }`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
                "create"
                ? "Creating maintenance may deduct spare-part stock and synchronize the selected bus status through the backend transaction."
                : "Maintenance parts are preserved as transactional history. Edit the maintenance details without replacing the original parts-used snapshot."
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
              MAINTENANCE ID / BUS
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            {/* MAINTENANCE ID */}

            <div className="grid gap-2">

              <Label
                htmlFor="maintenance-id"
              >
                Maintenance ID
              </Label>


              <Input
                id="maintenance-id"
                required
                disabled={
                  mode ===
                  "edit"
                }
                placeholder="MNT101"
                value={
                  form.maintenance_id
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        maintenance_id:
                          event.target.value
                            .toUpperCase()

                      })
                    );

                  }
                }
              />

            </div>


            {/* BUS */}

            <div className="grid gap-2">

              <Label>
                Bus
              </Label>


              {
                mode ===
                  "create"
                  ? (

                      <Select
                        value={
                          form.bus_id
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

                                bus_id:
                                  value

                              })
                            );


                            // Reset selected parts because
                            // spare parts belong to depots.

                            setSelectedParts(
                              []
                            );


                            setPartToAdd(
                              ""
                            );


                            setPartsError(
                              null
                            );

                          }
                        }
                      >

                        <SelectTrigger
                          className="w-full"
                        >

                          <SelectValue
                            placeholder="Select bus"
                          />

                        </SelectTrigger>


                        <SelectContent>

                          {
                            buses.map(
                              bus => (

                                <SelectItem
                                  key={
                                    bus.bus_id
                                  }
                                  value={
                                    bus.bus_id
                                  }
                                >

                                  {
                                    bus.bus_id
                                  }

                                  {" — "}

                                  {
                                    bus.registration_no
                                  }

                                  {" — "}

                                  {
                                    bus.bus_status
                                  }

                                </SelectItem>

                              )
                            )
                          }

                        </SelectContent>

                      </Select>

                    )
                  : (

                      <Input
                        disabled
                        value={
                          maintenanceRecord
                            ? `${maintenanceRecord.bus_id} — ${maintenanceRecord.depot_id}`
                            : form.bus_id
                        }
                      />

                    )
              }

            </div>

          </div>


          {/* =================================================
              BUS INFORMATION
          ================================================= */}

          {
            selectedBus && (

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

                <SmallMetric
                  label="Depot"
                  value={
                    selectedBus.depot_id
                  }
                />


                <SmallMetric
                  label="Vehicle"
                  value={`${selectedBus.manufacturer} ${selectedBus.model}`}
                />


                <SmallMetric
                  label="Current Bus Status"
                  value={
                    selectedBus.bus_status
                  }
                />

              </div>

            )
          }


          {/* =================================================
              REPORTED DATE / TYPE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            {/* DATE */}

            <div className="grid gap-2">

              <Label
                htmlFor="reported-date"
              >
                Reported Date
              </Label>


              <Input
                id="reported-date"
                type="date"
                required
                value={
                  form.reported_date
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        reported_date:
                          event.target.value

                      })
                    );

                  }
                }
              />

            </div>


            {/* TYPE */}

            <div className="grid gap-2">

              <Label>
                Maintenance Type
              </Label>


              <Select
                value={
                  form.maintenance_type
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

                        maintenance_type:
                          value as MaintenanceType

                      })
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
                    value="Preventive"
                  >
                    Preventive
                  </SelectItem>


                  <SelectItem
                    value="Corrective"
                  >
                    Corrective
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </div>


          {/* =================================================
              FAULT CATEGORY
          ================================================= */}

          <div className="grid gap-2">

            <Label
              htmlFor="fault-category"
            >
              Fault Category
            </Label>


            <Input
              id="fault-category"
              required
              placeholder="Engine, Brakes, Electrical, Tyres..."
              value={
                form.fault_category
              }
              onChange={
                event => {

                  setForm(
                    current => ({

                      ...current,

                      fault_category:
                        event.target.value

                    })
                  );

                }
              }
            />

          </div>


          {/* =================================================
              FAULT DESCRIPTION
          ================================================= */}

          <div className="grid gap-2">

            <Label
              htmlFor="fault-description"
            >
              Fault Description
            </Label>


            <textarea
              id="fault-description"
              required
              rows={
                4
              }
              value={
                form.fault_description
              }
              onChange={
                event => {

                  setForm(
                    current => ({

                      ...current,

                      fault_description:
                        event.target.value

                    })
                  );

                }
              }
              className="
                flex
                min-h-24
                w-full
                rounded-md
                border
                border-input
                bg-transparent
                px-3
                py-2
                text-sm
                shadow-xs
                outline-none
                transition-colors
                placeholder:text-muted-foreground
                focus-visible:border-ring
                focus-visible:ring-[3px]
                focus-visible:ring-ring/50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              placeholder="Describe the maintenance issue..."
            />

          </div>


          {/* =================================================
              PARTS USED - CREATE MODE
          ================================================= */}

          {
            mode ===
              "create" && (

              <div
                className="
                  grid
                  gap-4
                  rounded-lg
                  border
                  p-4
                "
              >

                <div>

                  <h3
                    className="
                      text-sm
                      font-semibold
                    "
                  >
                    Spare Parts Used
                  </h3>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Only in-stock parts from the selected
                    bus depot are shown. Stock is deducted
                    by the backend transaction when the
                    maintenance record is created.
                  </p>

                </div>


                {
                  selectedBus
                    ? (

                        <div
                          className="
                            grid
                            gap-3
                            md:grid-cols-[1fr_160px_auto]
                          "
                        >

                          {/* PART SELECT */}

                          <Select
                            value={
                              partToAdd
                            }
                            onValueChange={
                              value => {

                                if (
                                  value ===
                                  null
                                ) {

                                  return;

                                }


                                setPartToAdd(
                                  value
                                );


                                setPartsError(
                                  null
                                );

                              }
                            }
                          >

                            <SelectTrigger
                              className="w-full"
                            >

                              <SelectValue
                                placeholder="Select spare part"
                              />

                            </SelectTrigger>


                            <SelectContent>

                              {
                                availableParts.map(
                                  part => (

                                    <SelectItem
                                      key={
                                        part.part_id
                                      }
                                      value={
                                        part.part_id
                                      }
                                    >

                                      {
                                        part.part_id
                                      }

                                      {" — "}

                                      {
                                        part.part_name
                                      }

                                      {" — Stock: "}

                                      {
                                        part.quantity_in_stock
                                      }

                                    </SelectItem>

                                  )
                                )
                              }

                            </SelectContent>

                          </Select>


                          {/* QUANTITY */}

                          <Input
                            type="number"
                            min="1"
                            value={
                              partQuantity
                            }
                            onChange={
                              event => {

                                setPartQuantity(
                                  Number(
                                    event.target.value
                                  )
                                );

                              }
                            }
                          />


                          {/* ADD */}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={
                              handleAddPart
                            }
                            disabled={
                              !partToAdd
                            }
                          >

                            <Plus
                              className="size-4"
                            />

                            Add Part

                          </Button>

                        </div>

                      )
                    : (

                        <p
                          className="
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Select a bus first to view spare
                          parts available at its depot.
                        </p>

                      )
                }


                {/* ===========================================
                    PART ERROR
                =========================================== */}

                {
                  partsError && (

                    <div
                      className="
                        rounded-md
                        border
                        border-destructive/30
                        bg-destructive/5
                        p-3
                        text-sm
                        text-destructive
                      "
                    >
                      {partsError}
                    </div>

                  )
                }


                {/* ===========================================
                    SELECTED PARTS
                =========================================== */}

                {
                  selectedParts.length >
                    0 && (

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
                              Quantity
                            </TableHead>

                            <TableHead>
                              Unit Cost
                            </TableHead>

                            <TableHead>
                              Line Total
                            </TableHead>

                            <TableHead />

                          </TableRow>

                        </TableHeader>


                        <TableBody>

                          {
                            selectedParts.map(
                              selected => {

                                const part =
                                  spareParts.find(
                                    item =>
                                      item.part_id ===
                                      selected.part_id
                                  );


                                return (

                                  <TableRow
                                    key={
                                      selected.part_id
                                    }
                                  >

                                    <TableCell>

                                      <div
                                        className="font-medium"
                                      >
                                        {
                                          selected.part_id
                                        }
                                      </div>


                                      <div
                                        className="
                                          text-xs
                                          text-muted-foreground
                                        "
                                      >
                                        {
                                          part?.part_name ??
                                          "Unknown part"
                                        }
                                      </div>

                                    </TableCell>


                                    <TableCell>
                                      {
                                        selected.quantity
                                      }
                                    </TableCell>


                                    <TableCell>
                                      {
                                        formatCurrency(
                                          part?.unit_cost ??
                                            0,
                                          2
                                        )
                                      }
                                    </TableCell>


                                    <TableCell>
                                      {
                                        formatCurrency(
                                          (
                                            part?.unit_cost ??
                                            0
                                          ) *
                                          selected.quantity,
                                          2
                                        )
                                      }
                                    </TableCell>


                                    <TableCell
                                      className="text-right"
                                    >

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Remove spare part"
                                        onClick={
                                          () =>
                                            handleRemovePart(
                                              selected.part_id
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

                                    </TableCell>

                                  </TableRow>

                                );

                              }
                            )
                          }

                        </TableBody>

                      </Table>

                    </div>

                  )
                }

              </div>

            )
          }


          {/* =================================================
              EXISTING PARTS - EDIT MODE
          ================================================= */}

          {
            mode ===
              "edit" &&
            maintenanceRecord && (

              <div
                className="
                  grid
                  gap-3
                  rounded-lg
                  border
                  p-4
                "
              >

                <div>

                  <h3
                    className="
                      text-sm
                      font-semibold
                    "
                  >
                    Parts Used
                  </h3>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Parts are preserved as the original
                    maintenance transaction snapshot and
                    are read-only during this update.
                  </p>

                </div>


                {
                  maintenanceRecord.parts_used.length >
                    0
                    ? (

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
                                  Quantity
                                </TableHead>

                                <TableHead>
                                  Unit Cost
                                </TableHead>

                                <TableHead>
                                  Total
                                </TableHead>

                              </TableRow>

                            </TableHeader>


                            <TableBody>

                              {
                                maintenanceRecord
                                  .parts_used
                                  .map(
                                    part => (

                                      <TableRow
                                        key={
                                          part.part_id
                                        }
                                      >

                                        <TableCell>

                                          <div
                                            className="font-medium"
                                          >
                                            {
                                              part.part_id
                                            }
                                          </div>


                                          <div
                                            className="
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            {
                                              part.part_name
                                            }
                                          </div>

                                        </TableCell>


                                        <TableCell>
                                          {
                                            part.quantity
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
                                              part.line_total,
                                              2
                                            )
                                          }
                                        </TableCell>

                                      </TableRow>

                                    )
                                  )
                              }

                            </TableBody>

                          </Table>

                        </div>

                      )
                    : (

                        <p
                          className="
                            text-sm
                            text-muted-foreground
                          "
                        >
                          No spare parts were recorded for
                          this maintenance record.
                        </p>

                      )
                }

              </div>

            )
          }


          {/* =================================================
              LABOUR COST / DOWNTIME
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label
                htmlFor="labour-cost"
              >
                Labour Cost
              </Label>


              <Input
                id="labour-cost"
                type="number"
                min="0"
                step="0.01"
                required
                value={
                  form.labour_cost
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        labour_cost:
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

              <Label
                htmlFor="downtime"
              >
                Downtime Hours
              </Label>


              <Input
                id="downtime"
                type="number"
                min="0"
                step="0.1"
                required
                value={
                  form.downtime_hours
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        downtime_hours:
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
              TECHNICIAN / STATUS
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label
                htmlFor="technician"
              >
                Technician ID
              </Label>


              <Input
                id="technician"
                placeholder="Optional technician identifier"
                value={
                  form.technician_id
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        technician_id:
                          event.target.value

                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label>
                Maintenance Status
              </Label>


              <Select
                value={
                  form.status
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

                        status:
                          value as MaintenanceStatus

                      })
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
                    value="In Progress"
                  >
                    In Progress
                  </SelectItem>


                  <SelectItem
                    value="Completed"
                  >
                    Completed
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </div>


          {/* =================================================
              COMPLETION DATE
          ================================================= */}

          <div className="grid gap-2">

            <Label
              htmlFor="completion-date"
            >
              Completion Date
            </Label>


            <Input
              id="completion-date"
              type="date"
              value={
                form.completion_date
              }
              onChange={
                event => {

                  setForm(
                    current => ({

                      ...current,

                      completion_date:
                        event.target.value

                    })
                  );

                }
              }
            />

          </div>


          {/* =================================================
              COST PREVIEW
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

            <SmallMetric
              label="Parts Cost"
              value={
                formatCurrency(
                  partsCostPreview,
                  2
                )
              }
            />


            <SmallMetric
              label="Labour Cost"
              value={
                formatCurrency(
                  form.labour_cost,
                  2
                )
              }
            />


            <SmallMetric
              label="Estimated Repair Cost"
              value={
                formatCurrency(
                  totalRepairCostPreview,
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
            Cost previews are for interface guidance only.
            The authoritative spare-part prices and
            calculated maintenance totals come from the
            backend.
          </p>


          {/* =================================================
              BACKEND ERROR
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
                !form.maintenance_id ||
                !form.bus_id ||
                !form.reported_date ||
                !form.fault_category.trim() ||
                !form.fault_description.trim() ||
                form.labour_cost <
                  0 ||
                form.downtime_hours <
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
                  ? "Add Maintenance"
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
// SMALL METRIC
// =========================================================

interface ISmallMetricProps {

  label: string;

  value: string;

}


function SmallMetric(
  {
    label,
    value
  }: ISmallMetricProps
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