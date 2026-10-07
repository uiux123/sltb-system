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
  IFuelRecord,
  IFuelRecordCreateInput,
  IFuelRecordUpdateInput
} from "@/types/fuelManagement.types";

import type {
  ITrip
} from "@/types/routeTripManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// FORM STATE
// =========================================================

interface IFuelRecordFormState {

  fuel_record_id: string;

  trip_id: string;

  fuel_litres: number;

  fuel_cost_per_litre: number;

  recorded_by: string;

}


// =========================================================
// PROPS
// =========================================================

interface IFuelRecordFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  fuelRecord:
    IFuelRecord | null;

  availableTrips:
    ITrip[];

  submitting:
    boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onCreate:
    (
      input:
        IFuelRecordCreateInput
    ) => Promise<void>;

  onUpdate:
    (
      input:
        IFuelRecordUpdateInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyForm =
  (): IFuelRecordFormState => ({

    fuel_record_id:
      "",

    trip_id:
      "",

    fuel_litres:
      1,

    fuel_cost_per_litre:
      1,

    recorded_by:
      ""

  });


// =========================================================
// COMPONENT
// =========================================================

export function FuelRecordFormDialog(
  {
    open,
    mode,
    fuelRecord,
    availableTrips,
    submitting,
    error,
    onOpenChange,
    onCreate,
    onUpdate
  }: IFuelRecordFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<IFuelRecordFormState>(
      createEmptyForm()
    );


  // =======================================================
  // LOAD FORM
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
        fuelRecord
      ) {

        setForm({

          fuel_record_id:
            fuelRecord.fuel_record_id,

          trip_id:
            fuelRecord.trip_id,

          fuel_litres:
            fuelRecord.fuel_litres,

          fuel_cost_per_litre:
            fuelRecord.fuel_cost_per_litre,

          recorded_by:
            fuelRecord.recorded_by ??
            ""

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
      fuelRecord
    ]
  );


  // =======================================================
  // SELECTED TRIP
  // =======================================================

  const selectedTrip =
    useMemo(
      () =>
        availableTrips.find(
          trip =>
            trip.trip_id ===
            form.trip_id
        ),
      [
        availableTrips,
        form.trip_id
      ]
    );


  // =======================================================
  // ESTIMATED TOTAL
  // =======================================================

  const estimatedTotal =
    useMemo(
      () => {

        return (
          form.fuel_litres *
          form.fuel_cost_per_litre
        );

      },
      [
        form.fuel_litres,
        form.fuel_cost_per_litre
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


      if (
        mode ===
        "create"
      ) {

        const createInput:
          IFuelRecordCreateInput = {

            fuel_record_id:
              form.fuel_record_id,

            trip_id:
              form.trip_id,

            fuel_litres:
              form.fuel_litres,

            fuel_cost_per_litre:
              form.fuel_cost_per_litre,

            ...(
              form.recorded_by.trim()
                ? {
                    recorded_by:
                      form.recorded_by.trim()
                  }
                : {}
            )

          };


        await onCreate(
          createInput
        );


        return;

      }


      const updateInput:
        IFuelRecordUpdateInput = {

          fuel_litres:
            form.fuel_litres,

          fuel_cost_per_litre:
            form.fuel_cost_per_litre,

          ...(
            form.recorded_by.trim()
              ? {
                  recorded_by:
                    form.recorded_by.trim()
                }
              : {}
          )

        };


      await onUpdate(
        updateInput
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
          sm:max-w-2xl
        "
      >

        <DialogHeader>

          <DialogTitle>

            {
              mode ===
                "create"
                ? "Add Fuel Record"
                : `Edit ${
                    fuelRecord
                      ?.fuel_record_id ??
                    "Fuel Record"
                  }`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
                "create"
                ? "Select a completed Trip. Bus, depot, date and operated distance are derived by the backend."
                : "The linked Trip cannot be changed. Updating fuel values causes the backend to recalculate all derived fuel metrics."
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
              RECORD ID
          ================================================= */}

          <div className="grid gap-2">

            <Label htmlFor="fuel-record-id">
              Fuel Record ID
            </Label>


            <Input
              id="fuel-record-id"
              required
              disabled={
                mode ===
                "edit"
              }
              placeholder="FUEL101"
              value={
                form.fuel_record_id
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      fuel_record_id:
                        event.target.value
                          .toUpperCase()
                    })
                  );

                }
              }
            />

          </div>


          {/* =================================================
              TRIP
          ================================================= */}

          {
            mode ===
            "create"
              ? (

                  <div className="grid gap-2">

                    <Label>
                      Completed Trip
                    </Label>


                    <Select
                      value={
                        form.trip_id
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

                              trip_id:
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
                          placeholder="Select an unused completed Trip"
                        />

                      </SelectTrigger>


                      <SelectContent>

                        {
                          availableTrips.map(
                            trip => (

                              <SelectItem
                                key={
                                  trip.trip_id
                                }
                                value={
                                  trip.trip_id
                                }
                              >

                                {
                                  trip.trip_id
                                }

                                {" — "}

                                {
                                  trip.bus_id
                                }

                                {" — "}

                                {
                                  trip.trip_date
                                    .slice(
                                      0,
                                      10
                                    )
                                }

                              </SelectItem>

                            )
                          )
                        }

                      </SelectContent>

                    </Select>


                    {
                      availableTrips.length ===
                        0 && (

                        <p
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          No completed Trips without a Fuel
                          Record are currently available.
                        </p>

                      )
                    }

                  </div>

                )
              : (

                  <div className="grid gap-2">

                    <Label>
                      Linked Trip
                    </Label>


                    <Input
                      disabled
                      value={
                        form.trip_id
                      }
                    />


                    <p
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      The linked Trip cannot be changed
                      during Fuel Record updates.
                    </p>

                  </div>

                )
          }


          {/* =================================================
              SELECTED TRIP INFORMATION
          ================================================= */}

          {
            mode ===
              "create" &&
            selectedTrip && (

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

                <TripMetric
                  label="Bus"
                  value={
                    selectedTrip.bus_id
                  }
                />

                <TripMetric
                  label="Depot"
                  value={
                    selectedTrip.depot_id
                  }
                />

                <TripMetric
                  label="Operated Distance"
                  value={`${formatNumber(
                    selectedTrip.operated_km,
                    2
                  )} km`}
                />

              </div>

            )
          }


          {/* =================================================
              FUEL VALUES
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="fuel-litres">
                Fuel Litres
              </Label>


              <Input
                id="fuel-litres"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={
                  form.fuel_litres
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        fuel_litres:
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

              <Label htmlFor="fuel-price">
                Fuel Cost / Litre
              </Label>


              <Input
                id="fuel-price"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={
                  form.fuel_cost_per_litre
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        fuel_cost_per_litre:
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
              RECORDED BY
          ================================================= */}

          <div className="grid gap-2">

            <Label htmlFor="recorded-by">
              Recorded By
            </Label>


            <Input
              id="recorded-by"
              value={
                form.recorded_by
              }
              placeholder="Optional staff / employee identifier"
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      recorded_by:
                        event.target.value
                    })
                  );

                }
              }
            />

          </div>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <div
            className="
              rounded-lg
              border
              bg-muted/20
              p-4
            "
          >

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Estimated Fuel Cost
            </p>


            <p
              className="
                mt-1
                text-lg
                font-semibold
              "
            >
              LKR {
                formatNumber(
                  estimatedTotal,
                  2
                )
              }
            </p>


            <p
              className="
                mt-2
                text-xs
                text-muted-foreground
              "
            >
              This value is displayed for input guidance
              only. The authoritative total and efficiency
              values are calculated by the backend.
            </p>

          </div>


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
                !form.fuel_record_id ||
                (
                  mode ===
                    "create" &&
                  !form.trip_id
                ) ||
                form.fuel_litres <=
                  0 ||
                form.fuel_cost_per_litre <=
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
                  ? "Add Fuel Record"
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
// TRIP METRIC
// =========================================================

interface ITripMetricProps {

  label: string;

  value: string;

}


function TripMetric(
  {
    label,
    value
  }: ITripMetricProps
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