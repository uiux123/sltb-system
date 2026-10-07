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
  ITrip
} from "@/types/routeTripManagement.types";


// =========================================================
// PROPS
// =========================================================

interface ITripDeleteDialogProps {

  trip:
    ITrip | null;

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

export function TripDeleteDialog(
  {
    trip,
    open,
    deleting,
    error,
    onOpenChange,
    onDelete
  }: ITripDeleteDialogProps
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

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            Delete {trip.trip_id}?
          </DialogTitle>

          <DialogDescription>
            The backend will verify whether fuel or ticket
            records depend on this trip.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle className="size-4" />

          <AlertTitle>
            Safe deletion
          </AlertTitle>

          <AlertDescription>
            A trip with linked fuel or ticket-sale records
            cannot be removed because those operational
            records depend on its history.
          </AlertDescription>

        </Alert>


        {
          error && (

            <Alert variant="destructive">

              <AlertTriangle className="size-4" />

              <AlertTitle>
                Trip cannot be deleted
              </AlertTitle>

              <AlertDescription>
                {error}
              </AlertDescription>

            </Alert>

          )
        }


        <DialogFooter>

          <Button
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

            Delete Trip

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}