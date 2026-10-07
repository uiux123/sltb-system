import {
  useEffect,
  useState,
  type FormEvent
} from "react";

import {
  LoaderCircle
} from "lucide-react";

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

import {
  Input
} from "@/components/ui/input";

import {
  Label
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import type {
  IRoute,
  IRouteInput,
  RouteStatus,
  RouteType
} from "@/types/routeTripManagement.types";


// =========================================================
// PROPS
// =========================================================

interface IRouteFormDialogProps {

  open: boolean;

  mode:
    | "create"
    | "edit";

  route:
    IRoute | null;

  submitting: boolean;

  error:
    string | null;

  onOpenChange:
    (
      open: boolean
    ) => void;

  onSubmit:
    (
      input: IRouteInput
    ) => Promise<void>;

}


// =========================================================
// EMPTY ROUTE
// =========================================================

const createEmptyRoute =
  (): IRouteInput => ({

    route_id:
      "",

    route_number:
      "",

    origin:
      "",

    destination:
      "",

    distance_km:
      1,

    route_type:
      "Urban",

    scheduled_trips_per_day:
      1,

    average_fare:
      0,

    social_service_route:
      false,

    status:
      "Active"

  });


// =========================================================
// COMPONENT
// =========================================================

export function RouteFormDialog(
  {
    open,
    mode,
    route,
    submitting,
    error,
    onOpenChange,
    onSubmit
  }: IRouteFormDialogProps
) {

  const [
    form,
    setForm
  ] =
    useState<IRouteInput>(
      createEmptyRoute()
    );


  // =======================================================
  // LOAD FORM
  // =======================================================

  useEffect(
    () => {

      if (
        !open
      ) {

        return;

      }


      if (
        mode ===
          "edit" &&
        route
      ) {

        setForm({

          route_id:
            route.route_id,

          route_number:
            route.route_number,

          origin:
            route.origin,

          destination:
            route.destination,

          distance_km:
            route.distance_km,

          route_type:
            route.route_type,

          scheduled_trips_per_day:
            route.scheduled_trips_per_day,

          average_fare:
            route.average_fare,

          social_service_route:
            route.social_service_route,

          status:
            route.status

        });

      } else {

        setForm(
          createEmptyRoute()
        );

      }

    },
    [
      open,
      mode,
      route
    ]
  );


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ): Promise<void> => {

      event.preventDefault();


      await onSubmit(
        form
      );

    };


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
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-3xl
        "
      >

        <DialogHeader>

          <DialogTitle>

            {
              mode ===
                "create"
                ? "Add Route"
                : `Edit ${route?.route_id ?? "Route"}`
            }

          </DialogTitle>


          <DialogDescription>

            {
              mode ===
                "create"
                ? "Create a new SLTB route record."
                : "Update the selected route record."
            }

          </DialogDescription>

        </DialogHeader>


        <form
          className="grid gap-5"
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================================
              ID / NUMBER
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="route-id">
                Route ID
              </Label>


              <Input
                id="route-id"
                required
                disabled={
                  mode ===
                  "edit"
                }
                placeholder="R101"
                value={
                  form.route_id
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        route_id:
                          event.target.value
                            .toUpperCase()
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="route-number">
                Route Number
              </Label>


              <Input
                id="route-number"
                required
                value={
                  form.route_number
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        route_number:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              ORIGIN / DESTINATION
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="origin">
                Origin
              </Label>


              <Input
                id="origin"
                required
                value={
                  form.origin
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        origin:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="destination">
                Destination
              </Label>


              <Input
                id="destination"
                required
                value={
                  form.destination
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        destination:
                          event.target.value
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              DISTANCE / TYPE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="distance">
                Distance (km)
              </Label>


              <Input
                id="distance"
                type="number"
                min="0.1"
                step="0.1"
                required
                value={
                  form.distance_km
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        distance_km:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label>
                Route Type
              </Label>


              <Select
                value={
                  form.route_type
                }
                onValueChange={
                  value => {

                    if (
                      value ===
                      null
                    ) {

                      return;

                    }


                    setForm(
                      current => ({
                        ...current,

                        route_type:
                          value as RouteType
                      })
                    );

                  }
                }
              >

                <SelectTrigger className="w-full">

                  <SelectValue />

                </SelectTrigger>


                <SelectContent>

                  <SelectItem value="Urban">
                    Urban
                  </SelectItem>

                  <SelectItem value="Intercity">
                    Intercity
                  </SelectItem>

                  <SelectItem value="Rural">
                    Rural
                  </SelectItem>

                  <SelectItem value="School">
                    School
                  </SelectItem>

                  <SelectItem value="Night">
                    Night
                  </SelectItem>

                  <SelectItem value="Other">
                    Other
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </div>


          {/* =================================================
              SCHEDULE / FARE
          ================================================= */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <div className="grid gap-2">

              <Label htmlFor="scheduled-trips">
                Scheduled Trips / Day
              </Label>


              <Input
                id="scheduled-trips"
                type="number"
                min="0"
                required
                value={
                  form.scheduled_trips_per_day
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        scheduled_trips_per_day:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />

            </div>


            <div className="grid gap-2">

              <Label htmlFor="average-fare">
                Average Fare
              </Label>


              <Input
                id="average-fare"
                type="number"
                min="0"
                step="0.01"
                required
                value={
                  form.average_fare
                }
                onChange={
                  event => {

                    setForm(
                      current => ({
                        ...current,

                        average_fare:
                          Number(
                            event.target.value
                          )
                      })
                    );

                  }
                }
              />

            </div>

          </div>


          {/* =================================================
              STATUS
          ================================================= */}

          <div className="grid gap-2">

            <Label>
              Route Status
            </Label>


            <Select
              value={
                form.status
              }
              onValueChange={
                value => {

                  if (
                    value ===
                    null
                  ) {

                    return;

                  }


                  setForm(
                    current => ({
                      ...current,

                      status:
                        value as RouteStatus
                    })
                  );

                }
              }
            >

              <SelectTrigger className="w-full">

                <SelectValue />

              </SelectTrigger>


              <SelectContent>

                <SelectItem value="Active">
                  Active
                </SelectItem>

                <SelectItem value="Inactive">
                  Inactive
                </SelectItem>

              </SelectContent>

            </Select>

          </div>


          {/* =================================================
              SOCIAL SERVICE
          ================================================= */}

          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-lg
              border
              p-4
            "
          >

            <input
              type="checkbox"
              checked={
                form.social_service_route
              }
              onChange={
                event => {

                  setForm(
                    current => ({
                      ...current,

                      social_service_route:
                        event.target.checked
                    })
                  );

                }
              }
              className="
                size-4
                accent-current
              "
            />


            <div>

              <p className="text-sm font-medium">
                Social Service Route
              </p>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Mark this route when it is operated as a
                social-service route.
              </p>

            </div>

          </label>


          {/* =================================================
              ERROR
          ================================================= */}

          {
            error && (

              <div
                className="
                  rounded-lg
                  border
                  border-destructive/30
                  bg-destructive/5
                  p-3
                  text-sm
                  text-destructive
                "
              >
                {error}
              </div>

            )
          }


          {/* =================================================
              FOOTER
          ================================================= */}

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              disabled={
                submitting
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
              type="submit"
              disabled={
                submitting ||
                !form.route_id ||
                !form.route_number ||
                !form.origin ||
                !form.destination
              }
            >

              {
                submitting && (

                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                )
              }

              {
                mode ===
                  "create"
                  ? "Add Route"
                  : "Save Changes"
              }

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}