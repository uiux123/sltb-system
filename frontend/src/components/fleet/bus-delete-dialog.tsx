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
  IBus
} from "@/types/fleetManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IBusDeleteDialogProps {

  bus:
    IBus | null;

  open:
    boolean;

  deleting:
    boolean;

  markingOutOfService:
    boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onDelete:
    () => Promise<void>;

  onMarkOutOfService:
    () => Promise<void>;

}


// =========================================================
// DELETE DIALOG
// =========================================================

export function BusDeleteDialog(
  {
    bus,
    open,
    deleting,
    markingOutOfService,
    error,
    onOpenChange,
    onDelete,
    onMarkOutOfService
  }: IBusDeleteDialogProps
) {

  if (
    !bus
  ) {

    return null;

  }


  const busy =

    deleting ||
    markingOutOfService;


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
            Delete {bus.bus_id}?
          </DialogTitle>


          <DialogDescription>
            The backend will verify whether this bus has
            related operational records before allowing
            deletion.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle
            className="size-4"
          />

          <AlertTitle>
            Safe deletion
          </AlertTitle>


          <AlertDescription>
            Buses linked to trips, fuel records, ticket
            sales or maintenance history must be preserved
            for operational data integrity.
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
                Bus cannot be deleted
              </AlertTitle>


              <AlertDescription>
                {error}
              </AlertDescription>

            </Alert>

          )
        }


        <DialogFooter
          className="
            gap-2
            sm:gap-0
          "
        >

          <Button
            type="button"
            variant="outline"
            disabled={
              busy
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


          {
            error && (

              <Button
                type="button"
                variant="outline"
                disabled={
                  busy ||
                  bus.bus_status ===
                    "Out of Service"
                }
                onClick={
                  () => {

                    void onMarkOutOfService();

                  }
                }
              >

                {
                  markingOutOfService && (

                    <LoaderCircle
                      className="
                        size-4
                        animate-spin
                      "
                    />

                  )
                }

                Mark Out of Service

              </Button>

            )
          }


          <Button
            type="button"
            variant="destructive"
            disabled={
              busy
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

            Delete Bus

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}