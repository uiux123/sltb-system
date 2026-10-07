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
  IRoute
} from "@/types/routeTripManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IRouteDeleteDialogProps {

  route:
    IRoute | null;

  open:
    boolean;

  deleting:
    boolean;

  markingInactive:
    boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onDelete:
    () => Promise<void>;

  onMarkInactive:
    () => Promise<void>;

}


// =========================================================
// COMPONENT
// =========================================================

export function RouteDeleteDialog(
  {
    route,
    open,
    deleting,
    markingInactive,
    error,
    onOpenChange,
    onDelete,
    onMarkInactive
  }: IRouteDeleteDialogProps
) {

  if (
    !route
  ) {

    return null;

  }


  const busy =
    deleting ||
    markingInactive;


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
            Delete {route.route_id}?
          </DialogTitle>

          <DialogDescription>
            The backend will check dependent trips and
            ticket-sale records before deleting this route.
          </DialogDescription>

        </DialogHeader>


        <Alert>

          <AlertTriangle className="size-4" />

          <AlertTitle>
            Safe deletion
          </AlertTitle>

          <AlertDescription>
            A route with operational history must remain in
            the database. It can be marked Inactive instead.
          </AlertDescription>

        </Alert>


        {
          error && (

            <Alert variant="destructive">

              <AlertTriangle className="size-4" />

              <AlertTitle>
                Route cannot be deleted
              </AlertTitle>

              <AlertDescription>
                {error}
              </AlertDescription>

            </Alert>

          )
        }


        <DialogFooter className="gap-2 sm:gap-0">

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
                  route.status ===
                    "Inactive"
                }
                onClick={
                  () => {

                    void onMarkInactive();

                  }
                }
              >

                {
                  markingInactive && (

                    <LoaderCircle
                      className="
                        size-4
                        animate-spin
                      "
                    />

                  )
                }

                Mark Inactive

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

            Delete Route

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}