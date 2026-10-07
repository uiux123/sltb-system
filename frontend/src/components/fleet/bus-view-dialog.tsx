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
  IBus
} from "@/types/fleetManagement.types";

import {
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IBusViewDialogProps {

  bus:
    IBus | null;

  open:
    boolean;

  onOpenChange:
    (
      open: boolean
    ) => void;

}


// =========================================================
// BUS VIEW DIALOG
// =========================================================

export function BusViewDialog(
  {
    bus,
    open,
    onOpenChange
  }: IBusViewDialogProps
) {

  if (
    !bus
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

      <DialogContent
        className="sm:max-w-2xl"
      >

        <DialogHeader>

          <DialogTitle>
            {bus.bus_id}
          </DialogTitle>


          <DialogDescription>
            Fleet vehicle details
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
            label="Registration"
            value={
              bus.registration_no
            }
          />

          <Detail
            label="Depot"
            value={
              bus.depot_id
            }
          />

          <Detail
            label="Manufacturer"
            value={
              bus.manufacturer
            }
          />

          <Detail
            label="Model"
            value={
              bus.model
            }
          />

          <Detail
            label="Manufacture Year"
            value={
              String(
                bus.manufacture_year
              )
            }
          />

          <Detail
            label="Capacity"
            value={
              formatNumber(
                bus.capacity
              )
            }
          />

          <Detail
            label="Fuel Type"
            value={
              bus.fuel_type
            }
          />

          <Detail
            label="Odometer"
            value={`${formatNumber(
              bus.odometer_km
            )} km`}
          />

          <Detail
            label="Last Service"
            value={
              new Date(
                bus.last_service_date
              ).toLocaleDateString(
                "en-LK"
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
              Status
            </p>


            <Badge
              variant="secondary"
              className="mt-2"
            >
              {bus.bus_status}
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