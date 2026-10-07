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
  IMaintenanceRecord
} from "@/types/maintenanceManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IMaintenanceDeleteDialogProps {

  maintenanceRecord:
    IMaintenanceRecord | null;

  open: boolean;

  deleting: boolean;

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

export function MaintenanceDeleteDialog(
  {
    maintenanceRecord,
    open,
    deleting,
    error,
    onOpenChange,
    onDelete
  }: IMaintenanceDeleteDialogProps
) {

  if (
    !maintenanceRecord
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
            Delete {maintenanceRecord.maintenance_id}?
          </DialogTitle>


          <DialogDescription>
            Maintenance deletion is handled as a
            transactional reversal by the backend.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle
            className="size-4"
          />


          <AlertTitle>
            Transactional deletion
          </AlertTitle>


          <AlertDescription>
            Deleting this record can restore its spare-part
            quantities and cause the bus status to be
            recalculated. All changes are committed or
            rolled back together.
          </AlertDescription>

        </Alert>


        {
          maintenanceRecord.parts_used.length >
            0 && (

            <div
              className="
                rounded-lg
                border
                bg-muted/20
                p-4
                text-sm
              "
            >

              <strong>
                {
                  maintenanceRecord.parts_used.reduce(
                    (
                      total,
                      part
                    ) =>
                      total +
                      part.quantity,
                    0
                  )
                }
              </strong>

              {" "}spare-part unit(s) are represented in
              this maintenance record.

            </div>

          )
        }


        {
          error && (

            <Alert
              variant="destructive"
            >

              <AlertTriangle
                className="size-4"
              />


              <AlertTitle>
                Maintenance deletion failed
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

            Delete Maintenance

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}