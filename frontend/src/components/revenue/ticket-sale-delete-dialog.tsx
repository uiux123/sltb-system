import {
  AlertTriangle,
  LoaderCircle
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

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

import type {
  ITicketSale
} from "@/types/ticketSalesManagement.types";


// =========================================================
// PROPS
// =========================================================

interface ITicketSaleDeleteDialogProps {

  ticketSale:
    ITicketSale | null;

  open:
    boolean;

  deleting:
    boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onDelete:
    () => Promise<void>;

}


// =========================================================
// COMPONENT
// =========================================================

export function TicketSaleDeleteDialog(
  {
    ticketSale,
    open,
    deleting,
    error,
    onOpenChange,
    onDelete
  }: ITicketSaleDeleteDialogProps
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
        className="sm:max-w-lg"
      >

        <DialogHeader>

          <DialogTitle>
            Delete {ticketSale.ticket_record_id}?
          </DialogTitle>


          <DialogDescription>
            This permanently removes the selected Ticket
            Sale record.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle
            className="size-4"
          />


          <AlertTitle>
            Confirm deletion
          </AlertTitle>


          <AlertDescription>
            Ticket Sales are leaf operational records in the
            current data model. The backend still validates
            the delete request.
          </AlertDescription>

        </Alert>


        {
          error && (

            <Alert
              variant="destructive"
            >

              <AlertTriangle
                className="size-4"
              />


              <AlertTitle>
                Unable to delete Ticket Sale
              </AlertTitle>


              <AlertDescription>
                {error}
              </AlertDescription>

            </Alert>

          )
        }


        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            disabled={
              deleting
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
            type="button"
            variant="destructive"
            disabled={
              deleting
            }
            onClick={
              () => {

                void onDelete();

              }
            }
          >

            {
              deleting && (

                <LoaderCircle
                  className="
                    size-4
                    animate-spin
                  "
                />

              )
            }

            Delete Ticket Sale

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}