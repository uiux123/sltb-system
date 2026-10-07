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
  ITrip
} from "@/types/routeTripManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ITripViewDialogProps {

  trip:
    ITrip | null;

  open:
    boolean;

  onOpenChange:
    (
      open: boolean
    ) => void;

}


// =========================================================
// COMPONENT
// =========================================================

export function TripViewDialog(
  {
    trip,
    open,
    onOpenChange
  }: ITripViewDialogProps
) {

  if (
    !trip
  ) {

    return null;

  }


  return (

    <Dialog
      open={
        open
      }
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent className="sm:max-w-3xl">

        <DialogHeader>

          <DialogTitle>
            {trip.trip_id}
          </DialogTitle>

          <DialogDescription>
            Trip operational details
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
            label="Bus"
            value={
              trip.bus_id
            }
          />

          <Detail
            label="Route"
            value={
              trip.route_id
            }
          />

          <Detail
            label="Depot"
            value={
              trip.depot_id
            }
          />

          <Detail
            label="Trip Date"
            value={
              trip.trip_date.slice(
                0,
                10
              )
            }
          />

          <Detail
            label="Scheduled Departure"
            value={
              trip.scheduled_departure
            }
          />

          <Detail
            label="Actual Departure"
            value={
              trip.actual_departure ??
              "Not recorded"
            }
          />

          <Detail
            label="Scheduled Arrival"
            value={
              trip.scheduled_arrival
            }
          />

          <Detail
            label="Actual Arrival"
            value={
              trip.actual_arrival ??
              "Not recorded"
            }
          />

          <Detail
            label="Passengers"
            value={
              formatNumber(
                trip.passenger_count
              )
            }
          />

          <Detail
            label="Operated Distance"
            value={`${formatNumber(
              trip.operated_km,
              2
            )} km`}
          />

          <Detail
            label="Delay"
            value={`${formatNumber(
              trip.delay_minutes,
              2
            )} min`}
          />


          <div className="rounded-lg border p-3">

            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <Badge
              className="mt-2"
              variant="secondary"
            >
              {trip.trip_status}
            </Badge>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}


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

    <div className="rounded-lg border p-3">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value}
      </p>

    </div>

  );

}