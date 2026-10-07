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
  ITrip
} from "@/types/routeTripManagement.types";

import type {
  ITicketSale,
  ITicketSaleCreateInput,
  ITicketSaleUpdateInput
} from "@/types/ticketSalesManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// FORM STATE
// =========================================================

interface ITicketSaleFormState {

  ticket_record_id: string;

  trip_id: string;

  full_fare_tickets: number;

  concession_tickets: number;

  total_revenue: number;

  expected_revenue: number;

  conductor_id: string;

}


// =========================================================
// PROPS
// =========================================================

interface ITicketSaleFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  ticketSale:
    ITicketSale | null;

  trips:
    ITrip[];

  availableTrips:
    ITrip[];

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
        ITicketSaleCreateInput
    ) => Promise<void>;

  onUpdate:
    (
      input:
        ITicketSaleUpdateInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY FORM
// =========================================================

const createEmptyForm =
  (): ITicketSaleFormState => ({

    ticket_record_id:
      "",

    trip_id:
      "",

    full_fare_tickets:
      0,

    concession_tickets:
      0,

    total_revenue:
      0,

    expected_revenue:
      0,

    conductor_id:
      ""

  });


// =========================================================
// FORM COMPONENT
// =========================================================

export function TicketSaleFormDialog(
  {
    open,
    mode,
    ticketSale,
    trips,
    availableTrips,
    submitting,
    error,
    onOpenChange,
    onCreate,
    onUpdate
  }: ITicketSaleFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<ITicketSaleFormState>(
      createEmptyForm()
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


      if (
        mode ===
          "edit" &&
        ticketSale
      ) {

        setForm({

          ticket_record_id:
            ticketSale.ticket_record_id,

          trip_id:
            ticketSale.trip_id,

          full_fare_tickets:
            ticketSale.full_fare_tickets,

          concession_tickets:
            ticketSale.concession_tickets,

          total_revenue:
            ticketSale.total_revenue,

          expected_revenue:
            ticketSale.expected_revenue,

          conductor_id:
            ticketSale.conductor_id ??
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
      ticketSale
    ]
  );


  // =======================================================
  // SELECTED TRIP
  // =======================================================

  const selectedTrip =
    useMemo(
      () => {

        return trips.find(
          trip =>
            trip.trip_id ===
            form.trip_id
        );

      },
      [
        trips,
        form.trip_id
      ]
    );


  // =======================================================
  // TICKET TOTAL
  // =======================================================

  const ticketTotal =
    form.full_fare_tickets +
    form.concession_tickets;


  // =======================================================
  // PASSENGER LIMIT
  // =======================================================

  const exceedsPassengerCount =

    selectedTrip
      ? ticketTotal >
        selectedTrip.passenger_count
      : false;


  // =======================================================
  // REVENUE DIFFERENCE PREVIEW
  // =======================================================

  const revenueDifference =

    form.expected_revenue -
    form.total_revenue;


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
        exceedsPassengerCount
      ) {

        return;

      }


      // ===================================================
      // CREATE
      // ===================================================

      if (
        mode ===
        "create"
      ) {

        const input:
          ITicketSaleCreateInput = {

            ticket_record_id:
              form.ticket_record_id,

            trip_id:
              form.trip_id,

            full_fare_tickets:
              form.full_fare_tickets,

            concession_tickets:
              form.concession_tickets,

            total_revenue:
              form.total_revenue,

            expected_revenue:
              form.expected_revenue,

            ...(
              form.conductor_id.trim()
                ? {
                    conductor_id:
                      form.conductor_id.trim()
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
        ITicketSaleUpdateInput = {

          full_fare_tickets:
            form.full_fare_tickets,

          concession_tickets:
            form.concession_tickets,

          total_revenue:
            form.total_revenue,

          expected_revenue:
            form.expected_revenue,

          ...(
            form.conductor_id.trim()
              ? {
                  conductor_id:
                    form.conductor_id.trim()
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
                ? "Add Ticket Sale"
                : `Edit ${
                    ticketSale
                      ?.ticket_record_id ??
                    "Ticket Sale"
                  }`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
                "create"
                ? "Select an unused completed Trip. Bus, route, depot, sale date, ticket total and revenue difference are derived by the backend."
                : "The linked Trip and Ticket Record ID cannot be changed."
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

            <Label htmlFor="ticket-record-id">
              Ticket Record ID
            </Label>


            <Input
              id="ticket-record-id"
              required
              disabled={
                mode ===
                "edit"
              }
              placeholder="TKT101"
              value={
                form.ticket_record_id
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      ticket_record_id:
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
                                  trip.route_id
                                }

                                {" — "}

                                {
                                  formatNumber(
                                    trip.passenger_count
                                  )
                                } passengers

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
                          No completed Trips without a
                          Ticket Sale are currently
                          available.
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
                      The Trip relationship is immutable.
                    </p>

                  </div>

                )
          }


          {/* =================================================
              TRIP INFORMATION
          ================================================= */}

          {
            selectedTrip && (

              <div
                className="
                  grid
                  gap-3
                  rounded-lg
                  border
                  bg-muted/20
                  p-4
                  sm:grid-cols-4
                "
              >

                <TripMetric
                  label="Bus"
                  value={
                    selectedTrip.bus_id
                  }
                />

                <TripMetric
                  label="Route"
                  value={
                    selectedTrip.route_id
                  }
                />

                <TripMetric
                  label="Depot"
                  value={
                    selectedTrip.depot_id
                  }
                />

                <TripMetric
                  label="Trip Passengers"
                  value={
                    formatNumber(
                      selectedTrip.passenger_count
                    )
                  }
                />

              </div>

            )
          }


          {/* =================================================
              TICKET COUNTS
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="full-fare">
                Full Fare Tickets
              </Label>


              <Input
                id="full-fare"
                type="number"
                min="0"
                required
                value={
                  form.full_fare_tickets
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        full_fare_tickets:
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

              <Label htmlFor="concession">
                Concession Tickets
              </Label>


              <Input
                id="concession"
                type="number"
                min="0"
                required
                value={
                  form.concession_tickets
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        concession_tickets:
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
              REVENUE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="actual-revenue">
                Actual Revenue
              </Label>


              <Input
                id="actual-revenue"
                type="number"
                min="0"
                step="0.01"
                required
                value={
                  form.total_revenue
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        total_revenue:
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

              <Label htmlFor="expected-revenue">
                Expected Revenue
              </Label>


              <Input
                id="expected-revenue"
                type="number"
                min="0"
                step="0.01"
                required
                value={
                  form.expected_revenue
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        expected_revenue:
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
              CONDUCTOR
          ================================================= */}

          <div className="grid gap-2">

            <Label htmlFor="conductor">
              Conductor ID
            </Label>


            <Input
              id="conductor"
              placeholder="Optional conductor identifier"
              value={
                form.conductor_id
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      conductor_id:
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

            <TripMetric
              label="Ticket Total"
              value={
                formatNumber(
                  ticketTotal
                )
              }
            />


            <TripMetric
              label="Actual Revenue"
              value={
                formatCurrency(
                  form.total_revenue,
                  2
                )
              }
            />


            <TripMetric
              label="Expected - Actual"
              value={
                formatCurrency(
                  revenueDifference,
                  2
                )
              }
            />

          </div>


          {/* =================================================
              PASSENGER VALIDATION
          ================================================= */}

          {
            exceedsPassengerCount && (

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
                Ticket total ({ticketTotal}) cannot exceed
                the selected Trip passenger count (
                {selectedTrip?.passenger_count ?? 0}).
              </div>

            )
          }


          {/* =================================================
              API ERROR
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
                !form.ticket_record_id ||
                (
                  mode ===
                    "create" &&
                  !form.trip_id
                ) ||
                form.full_fare_tickets <
                  0 ||
                form.concession_tickets <
                  0 ||
                form.total_revenue <
                  0 ||
                form.expected_revenue <
                  0 ||
                exceedsPassengerCount
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
                  ? "Add Ticket Sale"
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