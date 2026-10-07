import {
  useEffect,
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
  BusStatus,
  FuelType,
  IBus,
  IBusInput,
  IDepot
} from "@/types/fleetManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IBusFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  bus:
    IBus | null;

  depots:
    IDepot[];

  submitting:
    boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onSubmit:
    (
      input: IBusInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyForm =
  (): IBusInput => ({

    bus_id:
      "",

    registration_no:
      "",

    depot_id:
      "",

    manufacturer:
      "",

    model:
      "",

    manufacture_year:
      new Date()
        .getFullYear(),

    capacity:
      1,

    fuel_type:
      "Diesel",

    odometer_km:
      0,

    bus_status:
      "Operational",

    last_service_date:
      new Date()
        .toISOString()
        .slice(
          0,
          10
        )

  });


// =========================================================
// DATE FOR HTML INPUT
// =========================================================

const toDateInputValue =
  (
    value: string
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
// BUS FORM DIALOG
// =========================================================

export function BusFormDialog(
  {
    open,
    mode,
    bus,
    depots,
    submitting,
    error,
    onOpenChange,
    onSubmit
  }: IBusFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<IBusInput>(
      createEmptyForm()
    );


  // =======================================================
  // LOAD FORM WHEN DIALOG OPENS
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
        bus
      ) {

        setForm({

          bus_id:
            bus.bus_id,

          registration_no:
            bus.registration_no,

          depot_id:
            bus.depot_id,

          manufacturer:
            bus.manufacturer,

          model:
            bus.model,

          manufacture_year:
            bus.manufacture_year,

          capacity:
            bus.capacity,

          fuel_type:
            bus.fuel_type,

          odometer_km:
            bus.odometer_km,

          bus_status:
            bus.bus_status,

          last_service_date:
            toDateInputValue(
              bus.last_service_date
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
      bus
    ]
  );


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ): Promise<void> => {

      event.preventDefault();


      await onSubmit(
        form
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

        {/* =================================================
            HEADER
        ================================================= */}

        <DialogHeader>

          <DialogTitle>

            {
              mode ===
              "create"
                ? "Add Bus"
                : `Edit ${bus?.bus_id ?? "Bus"}`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
              "create"
                ? "Create a new bus record in the SLTB fleet."
                : "Update the selected SLTB fleet record."
            }

          </DialogDescription>

        </DialogHeader>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            grid
            gap-5
          "
        >

          {/* =================================================
              BUS ID / REGISTRATION
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="bus-id"
              >
                Bus ID
              </Label>


              <Input
                id="bus-id"
                value={
                  form.bus_id
                }
                disabled={
                  mode ===
                  "edit"
                }
                required
                placeholder="BUS101"
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        bus_id:
                          event
                            .target
                            .value
                            .toUpperCase()

                      })
                    );

                  }
                }
              />

            </div>


            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="registration-no"
              >
                Registration Number
              </Label>


              <Input
                id="registration-no"
                value={
                  form.registration_no
                }
                required
                placeholder="NC-1234"
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        registration_no:
                          event
                            .target
                            .value
                            .toUpperCase()

                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              DEPOT
          ================================================= */}

          <div
            className="grid gap-2"
          >

            <Label>
              Depot
            </Label>


            <Select
              value={
                form.depot_id
              }
              onValueChange={
                value => {

                  // =========================================
                  // Current shadcn Select can return
                  // string | null.
                  //
                  // depot_id must remain a string.
                  // =========================================

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

              <SelectTrigger
                className="w-full"
              >

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
              MANUFACTURER / MODEL
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="manufacturer"
              >
                Manufacturer
              </Label>


              <Input
                id="manufacturer"
                required
                value={
                  form.manufacturer
                }
                placeholder="Ashok Leyland"
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        manufacturer:
                          event
                            .target
                            .value

                      })
                    );

                  }
                }
              />

            </div>


            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="model"
              >
                Model
              </Label>


              <Input
                id="model"
                required
                value={
                  form.model
                }
                placeholder="Viking"
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        model:
                          event
                            .target
                            .value

                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              YEAR / CAPACITY
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="manufacture-year"
              >
                Manufacture Year
              </Label>


              <Input
                id="manufacture-year"
                type="number"
                min={
                  1900
                }
                max={
                  new Date()
                    .getFullYear()
                }
                required
                value={
                  form.manufacture_year
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        manufacture_year:
                          Number(
                            event
                              .target
                              .value
                          )

                      })
                    );

                  }
                }
              />

            </div>


            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="capacity"
              >
                Capacity
              </Label>


              <Input
                id="capacity"
                type="number"
                min={
                  1
                }
                required
                value={
                  form.capacity
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        capacity:
                          Number(
                            event
                              .target
                              .value
                          )

                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              FUEL TYPE / BUS STATUS
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            {/* ===============================================
                FUEL TYPE
            =============================================== */}

            <div
              className="grid gap-2"
            >

              <Label>
                Fuel Type
              </Label>


              <Select
                value={
                  form.fuel_type
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

                        fuel_type:
                          value as FuelType

                      })
                    );

                  }
                }
              >

                <SelectTrigger
                  className="w-full"
                >

                  <SelectValue
                    placeholder="Select fuel type"
                  />

                </SelectTrigger>


                <SelectContent>

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


            {/* ===============================================
                BUS STATUS
            =============================================== */}

            <div
              className="grid gap-2"
            >

              <Label>
                Bus Status
              </Label>


              <Select
                value={
                  form.bus_status
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

                        bus_status:
                          value as BusStatus

                      })
                    );

                  }
                }
              >

                <SelectTrigger
                  className="w-full"
                >

                  <SelectValue
                    placeholder="Select bus status"
                  />

                </SelectTrigger>


                <SelectContent>

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

            </div>

          </div>


          {/* =================================================
              ODOMETER / SERVICE DATE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="odometer"
              >
                Odometer (km)
              </Label>


              <Input
                id="odometer"
                type="number"
                min={
                  0
                }
                required
                value={
                  form.odometer_km
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        odometer_km:
                          Number(
                            event
                              .target
                              .value
                          )

                      })
                    );

                  }
                }
              />

            </div>


            <div
              className="grid gap-2"
            >

              <Label
                htmlFor="last-service-date"
              >
                Last Service Date
              </Label>


              <Input
                id="last-service-date"
                type="date"
                required
                value={
                  form.last_service_date
                }
                onChange={
                  event => {

                    setForm(
                      current => ({

                        ...current,

                        last_service_date:
                          event
                            .target
                            .value

                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              API / VALIDATION ERROR
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
                () => {

                  onOpenChange(
                    false
                  );

                }
              }
            >

              Cancel

            </Button>


            <Button
              type="submit"
              disabled={
                submitting ||
                !form.bus_id ||
                !form.registration_no ||
                !form.depot_id ||
                !form.manufacturer ||
                !form.model ||
                !form.last_service_date
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
                  ? "Add Bus"
                  : "Save Changes"
              }

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}