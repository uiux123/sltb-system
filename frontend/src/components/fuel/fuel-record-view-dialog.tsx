import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import type {
  IFuelRecord
} from "@/types/fuelManagement.types";

import {
  formatCurrency,
  formatDecimal,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IFuelRecordViewDialogProps {

  fuelRecord:
    IFuelRecord | null;

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

export function FuelRecordViewDialog(
  {
    fuelRecord,
    open,
    onOpenChange
  }: IFuelRecordViewDialogProps
) {

  if (
    !fuelRecord
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
        className="sm:max-w-3xl"
      >

        <DialogHeader>

          <DialogTitle>
            {fuelRecord.fuel_record_id}
          </DialogTitle>


          <DialogDescription>
            Fuel consumption and calculated efficiency
            information
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
            label="Trip"
            value={
              fuelRecord.trip_id
            }
          />

          <Detail
            label="Bus"
            value={
              fuelRecord.bus_id
            }
          />

          <Detail
            label="Depot"
            value={
              fuelRecord.depot_id
            }
          />

          <Detail
            label="Fuel Date"
            value={
              fuelRecord.fuel_date
                .slice(
                  0,
                  10
                )
            }
          />

          <Detail
            label="Fuel Litres"
            value={`${formatNumber(
              fuelRecord.fuel_litres,
              2
            )} L`}
          />

          <Detail
            label="Fuel Cost / Litre"
            value={
              formatCurrency(
                fuelRecord.fuel_cost_per_litre,
                2
              )
            }
          />

          <Detail
            label="Total Fuel Cost"
            value={
              formatCurrency(
                fuelRecord.total_fuel_cost,
                2
              )
            }
          />

          <Detail
            label="Operated Distance"
            value={`${formatNumber(
              fuelRecord.operated_km,
              2
            )} km`}
          />

          <Detail
            label="Efficiency"
            value={`${formatDecimal(
              fuelRecord.km_per_litre,
              2
            )} km/L`}
          />

          <Detail
            label="Fuel Cost / km"
            value={
              formatCurrency(
                fuelRecord.fuel_cost_per_km,
                2
              )
            }
          />

          <Detail
            label="Recorded By"
            value={
              fuelRecord.recorded_by ??
              "Not specified"
            }
          />

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