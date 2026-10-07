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
  IRoute
} from "@/types/routeTripManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IRouteViewDialogProps {

  route:
    IRoute | null;

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

export function RouteViewDialog(
  {
    route,
    open,
    onOpenChange
  }: IRouteViewDialogProps
) {

  if (
    !route
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

      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle>
            {route.route_id}
          </DialogTitle>

          <DialogDescription>
            Route {route.route_number}
          </DialogDescription>

        </DialogHeader>


        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
          "
        >

          <Detail
            label="Origin"
            value={
              route.origin
            }
          />

          <Detail
            label="Destination"
            value={
              route.destination
            }
          />

          <Detail
            label="Distance"
            value={`${formatNumber(
              route.distance_km,
              2
            )} km`}
          />

          <Detail
            label="Route Type"
            value={
              route.route_type
            }
          />

          <Detail
            label="Scheduled Trips / Day"
            value={
              formatNumber(
                route.scheduled_trips_per_day
              )
            }
          />

          <Detail
            label="Average Fare"
            value={
              formatCurrency(
                route.average_fare,
                2
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

            <p className="text-xs text-muted-foreground">
              Social Service
            </p>

            <Badge
              className="mt-2"
              variant="secondary"
            >
              {
                route.social_service_route
                  ? "Yes"
                  : "No"
              }
            </Badge>

          </div>


          <div
            className="
              rounded-lg
              border
              p-3
            "
          >

            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <Badge
              className="mt-2"
              variant={
                route.status ===
                  "Active"
                  ? "outline"
                  : "secondary"
              }
            >
              {route.status}
            </Badge>

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