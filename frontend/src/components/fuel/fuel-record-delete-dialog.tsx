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
  IFuelRecord
} from "@/types/fuelManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IFuelRecordDeleteDialogProps {

  fuelRecord:
    IFuelRecord | null;

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

export function FuelRecordDeleteDialog(
  {
    fuelRecord,
    open,
    deleting,
    error,
    onOpenChange,
    onDelete
  }: IFuelRecordDeleteDialogProps
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
        className="sm:max-w-lg"
      >

        <DialogHeader>

          <DialogTitle>
            Delete {fuelRecord.fuel_record_id}?
          </DialogTitle>


          <DialogDescription>
            This will permanently remove the selected Fuel
            Record.
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
            Fuel Records are leaf operational records in the
            current data model. The backend still validates
            the request before deletion.
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
                Unable to delete Fuel Record
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

            Delete Fuel Record

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}