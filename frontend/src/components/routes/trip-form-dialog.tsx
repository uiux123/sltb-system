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
  IBus,
  IDepot
} from "@/types/fleetManagement.types";

import type {
  IRoute,
  ITrip,
  ITripInput,
  TripStatus
} from "@/types/routeTripManagement.types";


// =========================================================
// LOCAL FORM
// =========================================================

interface ITripFormState {

  trip_id: string;

  bus_id: string;

  route_id: string;

  depot_id: string;

  trip_date: string;

  scheduled_departure: string;

  actual_departure: string;

  scheduled_arrival: string;

  actual_arrival: string;

  passenger_count: number;

  operated_km: number;

  trip_status: TripStatus;

}


// =========================================================
// PROPS
// =========================================================

interface ITripFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  trip:
    ITrip | null;

  buses:
    IBus[];

  routes:
    IRoute[];

  depots:
    IDepot[];

  submitting: boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onSubmit:
    (
      input: ITripInput
    ) => Promise<void>;

}


// =========================================================
// DATE / TIME HELPERS
// =========================================================

const toDateInput =
  (
    value: string
  ): string => {

    return value
      ? value.slice(
          0,
          10
        )
      : "";

  };


const toTimeInput =
  (
    value?: string | null
  ): string => {

    if (
      !value
    ) {

      return "";

    }


    const directTime =
      value.match(
        /^(\d{2}:\d{2})/
      );


    if (
      directTime
    ) {

      return directTime[1];

    }


    const isoTime =
      value.match(
        /T(\d{2}:\d{2})/
      );


    return isoTime
      ? isoTime[1]
      : "";

  };


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyTrip =
  (): ITripFormState => ({

    trip_id:
      "",

    bus_id:
      "",

    route_id:
      "",

    depot_id:
      "",

    trip_date:
      new Date()
        .toISOString()
        .slice(
          0,
          10
        ),

    scheduled_departure:
      "",

    actual_departure:
      "",

    scheduled_arrival:
      "",

    actual_arrival:
      "",

    passenger_count:
      0,

    operated_km:
      0,

    trip_status:
      "Scheduled"

  });


// =========================================================
// COMPONENT
// =========================================================

export function TripFormDialog(
  {
    open,
    mode,
    trip,
    buses,
    routes,
    depots,
    submitting,
    error,
    onOpenChange,
    onSubmit
  }: ITripFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<ITripFormState>(
      createEmptyTrip()
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
        trip
      ) {

        setForm({

          trip_id:
            trip.trip_id,

          bus_id:
            trip.bus_id,

          route_id:
            trip.route_id,

          depot_id:
            trip.depot_id,

          trip_date:
            toDateInput(
              trip.trip_date
            ),

          scheduled_departure:
            toTimeInput(
              trip.scheduled_departure
            ),

          actual_departure:
            toTimeInput(
              trip.actual_departure
            ),

          scheduled_arrival:
            toTimeInput(
              trip.scheduled_arrival
            ),

          actual_arrival:
            toTimeInput(
              trip.actual_arrival
            ),

          passenger_count:
            trip.passenger_count,

          operated_km:
            trip.operated_km,

          trip_status:
            trip.trip_status

        });

      } else {

        setForm(
          createEmptyTrip()
        );

      }

    },
    [
      open,
      mode,
      trip
    ]
  );


  // =======================================================
  // DEPOT DISPLAY
  // =======================================================

  const selectedDepot =
    useMemo(
      () =>
        depots.find(
          depot =>
            depot.depot_id ===
            form.depot_id
        ),
      [
        depots,
        form.depot_id
      ]
    );


  // =======================================================
  // COMPLETED TRIP REQUIREMENTS
  // =======================================================

  const completedTimesMissing =

    form.trip_status ===
      "Completed" &&

    (
      !form.actual_departure ||
      !form.actual_arrival
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
        completedTimesMissing
      ) {

        return;

      }


      const input:
        ITripInput = {

          trip_id:
            form.trip_id,

          bus_id:
            form.bus_id,

          route_id:
            form.route_id,

          depot_id:
            form.depot_id,

          trip_date:
            form.trip_date,

          scheduled_departure:
            form.scheduled_departure,

          scheduled_arrival:
            form.scheduled_arrival,

          passenger_count:
            form.passenger_count,

          operated_km:
            form.operated_km,

          trip_status:
            form.trip_status,

          ...(
            form.actual_departure
              ? {
                  actual_departure:
                    form.actual_departure
                }
              : {}
          ),

          ...(
            form.actual_arrival
              ? {
                  actual_arrival:
                    form.actual_arrival
                }
              : {}
          )

        };


      await onSubmit(
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
                ? "Add Trip"
                : `Edit ${trip?.trip_id ?? "Trip"}`
            }

          </DialogTitle>


          <DialogDescription>
            Trip delay is calculated by the backend from the
            scheduled and actual departure information.
          </DialogDescription>

        </DialogHeader>


        <form
          className="grid gap-5"
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================================
              TRIP ID / DATE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="trip-id">
                Trip ID
              </Label>


              <Input
                id="trip-id"
                required
                disabled={
                  mode ===
                  "edit"
                }
                placeholder="TRIP101"
                value={
                  form.trip_id
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        trip_id:
                          event.target.value
                            .toUpperCase()
                      })
                    )
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="trip-date">
                Trip Date
              </Label>


              <Input
                id="trip-date"
                type="date"
                required
                value={
                  form.trip_date
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        trip_date:
                          event.target.value
                      })
                    )
                }
              />

            </div>

          </div>


          {/* =================================================
              BUS / DEPOT
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label>
                Bus
              </Label>


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


                    const selectedBus =
                      buses.find(
                        bus =>
                          bus.bus_id ===
                          value
                      );


                    setForm(
                      current => ({
                        ...current,

                        bus_id:
                          value,

                        depot_id:
                          selectedBus
                            ?.depot_id ??
                          ""
                      })
                    );

                  }
                }
              >

                <SelectTrigger className="w-full">

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

                        </SelectItem>

                      )
                    )
                  }

                </SelectContent>

              </Select>

            </div>


            <div className="grid gap-2">

              <Label>
                Depot
              </Label>


              <Input
                disabled
                value={
                  selectedDepot
                    ? `${selectedDepot.depot_id} — ${selectedDepot.depot_name}`
                    : form.depot_id
                }
                placeholder="Automatically selected from bus"
              />

            </div>

          </div>


          {/* =================================================
              ROUTE
          ================================================= */}

          <div className="grid gap-2">

            <Label>
              Route
            </Label>


            <Select
              value={
                form.route_id
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

                      route_id:
                        value
                    })
                  );

                }
              }
            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder="Select route"
                />

              </SelectTrigger>


              <SelectContent>

                {
                  routes.map(
                    route => (

                      <SelectItem
                        key={
                          route.route_id
                        }
                        value={
                          route.route_id
                        }
                      >

                        {
                          route.route_id
                        }
                        {" — "}
                        {
                          route.origin
                        }
                        {" → "}
                        {
                          route.destination
                        }

                      </SelectItem>

                    )
                  )
                }

              </SelectContent>

            </Select>

          </div>


          {/* =================================================
              SCHEDULED TIMES
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="scheduled-departure">
                Scheduled Departure
              </Label>


              <Input
                id="scheduled-departure"
                type="time"
                required
                value={
                  form.scheduled_departure
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        scheduled_departure:
                          event.target.value
                      })
                    )
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="scheduled-arrival">
                Scheduled Arrival
              </Label>


              <Input
                id="scheduled-arrival"
                type="time"
                required
                value={
                  form.scheduled_arrival
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        scheduled_arrival:
                          event.target.value
                      })
                    )
                }
              />

            </div>

          </div>


          {/* =================================================
              ACTUAL TIMES
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="actual-departure">
                Actual Departure
              </Label>


              <Input
                id="actual-departure"
                type="time"
                value={
                  form.actual_departure
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        actual_departure:
                          event.target.value
                      })
                    )
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="actual-arrival">
                Actual Arrival
              </Label>


              <Input
                id="actual-arrival"
                type="time"
                value={
                  form.actual_arrival
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        actual_arrival:
                          event.target.value
                      })
                    )
                }
              />

            </div>

          </div>


          {/* =================================================
              PASSENGERS / KM
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="passengers">
                Passenger Count
              </Label>


              <Input
                id="passengers"
                type="number"
                min="0"
                required
                value={
                  form.passenger_count
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        passenger_count:
                          Number(
                            event.target.value
                          )
                      })
                    )
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="operated-km">
                Operated Distance (km)
              </Label>


              <Input
                id="operated-km"
                type="number"
                min="0"
                step="0.1"
                required
                value={
                  form.operated_km
                }
                onChange={
                  event =>
                    setForm(
                      current => ({
                        ...current,

                        operated_km:
                          Number(
                            event.target.value
                          )
                      })
                    )
                }
              />

            </div>

          </div>


          {/* =================================================
              STATUS
          ================================================= */}

          <div className="grid gap-2">

            <Label>
              Trip Status
            </Label>


            <Select
              value={
                form.trip_status
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

                      trip_status:
                        value as TripStatus
                    })
                  );

                }
              }
            >

              <SelectTrigger className="w-full">

                <SelectValue />

              </SelectTrigger>


              <SelectContent>

                <SelectItem value="Scheduled">
                  Scheduled
                </SelectItem>

                <SelectItem value="Completed">
                  Completed
                </SelectItem>

                <SelectItem value="Cancelled">
                  Cancelled
                </SelectItem>

                <SelectItem value="Missed">
                  Missed
                </SelectItem>

              </SelectContent>

            </Select>

          </div>


          {/* =================================================
              LOCAL VALIDATION
          ================================================= */}

          {
            completedTimesMissing && (

              <div
                className="
                  rounded-lg
                  border
                  border-amber-300
                  bg-amber-50
                  p-3
                  text-sm
                  text-amber-800
                "
              >
                A Completed trip requires actual departure
                and actual arrival times.
              </div>

            )
          }


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
                !form.trip_id ||
                !form.bus_id ||
                !form.route_id ||
                !form.depot_id ||
                !form.trip_date ||
                !form.scheduled_departure ||
                !form.scheduled_arrival ||
                completedTimesMissing
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
                  ? "Add Trip"
                  : "Save Changes"
              }

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}