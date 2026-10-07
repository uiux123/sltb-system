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
  ISparePart
} from "@/types/sparePartManagement.types";


// =========================================================
// PROPS
// =========================================================

interface ISparePartDeleteDialogProps {

  sparePart:
    ISparePart | null;

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

export function SparePartDeleteDialog(
  {
    sparePart,
    open,
    deleting,
    error,
    onOpenChange,
    onDelete
  }: ISparePartDeleteDialogProps
) {

  if (
    !sparePart
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
            Delete {sparePart.part_id}?
          </DialogTitle>


          <DialogDescription>
            The backend will validate whether this part can
            be safely removed.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle
            className="size-4"
          />


          <AlertTitle>
            Historical maintenance protection
          </AlertTitle>


          <AlertDescription>
            A spare part referenced inside a maintenance
            record's parts_used history should not be
            removed because that maintenance record depends
            on its part identifier.
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
                Spare part cannot be deleted
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

            Delete Spare Part

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}