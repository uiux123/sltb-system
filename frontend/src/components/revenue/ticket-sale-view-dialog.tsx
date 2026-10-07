import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import type {
  ITicketSale
} from "@/types/ticketSalesManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface ITicketSaleViewDialogProps {

  ticketSale:
    ITicketSale | null;

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

export function TicketSaleViewDialog(
  {
    ticketSale,
    open,
    onOpenChange
  }: ITicketSaleViewDialogProps
) {

  if (
    !ticketSale
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
            {ticketSale.ticket_record_id}
          </DialogTitle>


          <DialogDescription>
            Ticket sales and revenue information
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
              ticketSale.trip_id
            }
          />

          <Detail
            label="Bus"
            value={
              ticketSale.bus_id
            }
          />

          <Detail
            label="Route"
            value={
              ticketSale.route_id
            }
          />

          <Detail
            label="Depot"
            value={
              ticketSale.depot_id
            }
          />

          <Detail
            label="Sale Date"
            value={
              ticketSale.sale_date
                .slice(
                  0,
                  10
                )
            }
          />

          <Detail
            label="Tickets Sold"
            value={
              formatNumber(
                ticketSale.tickets_sold
              )
            }
          />

          <Detail
            label="Full Fare Tickets"
            value={
              formatNumber(
                ticketSale.full_fare_tickets
              )
            }
          />

          <Detail
            label="Concession Tickets"
            value={
              formatNumber(
                ticketSale.concession_tickets
              )
            }
          />

          <Detail
            label="Actual Revenue"
            value={
              formatCurrency(
                ticketSale.total_revenue,
                2
              )
            }
          />

          <Detail
            label="Expected Revenue"
            value={
              formatCurrency(
                ticketSale.expected_revenue,
                2
              )
            }
          />

          <Detail
            label="Revenue Difference"
            value={
              formatCurrency(
                ticketSale.revenue_difference,
                2
              )
            }
          />

          <Detail
            label="Conductor"
            value={
              ticketSale.conductor_id ??
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