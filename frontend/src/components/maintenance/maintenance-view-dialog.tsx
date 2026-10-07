import {
  Badge
} from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import type {
  IMaintenanceRecord
} from "@/types/maintenanceManagement.types";

import {
  formatCurrency,
  formatNumber
} from "@/utils/formatters";


// =========================================================
// PROPS
// =========================================================

interface IMaintenanceViewDialogProps {

  maintenanceRecord:
    IMaintenanceRecord | null;

  open: boolean;

  onOpenChange:
    (
      open: boolean
    ) => void;

}


// =========================================================
// COMPONENT
// =========================================================

export function MaintenanceViewDialog(
  {
    maintenanceRecord,
    open,
    onOpenChange
  }: IMaintenanceViewDialogProps
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
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-4xl
        "
      >

        <DialogHeader>

          <DialogTitle>
            {maintenanceRecord.maintenance_id}
          </DialogTitle>


          <DialogDescription>
            Maintenance record details
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
            label="Bus"
            value={
              maintenanceRecord.bus_id
            }
          />

          <Detail
            label="Depot"
            value={
              maintenanceRecord.depot_id
            }
          />

          <Detail
            label="Reported Date"
            value={
              maintenanceRecord.reported_date
                .slice(
                  0,
                  10
                )
            }
          />

          <Detail
            label="Maintenance Type"
            value={
              maintenanceRecord.maintenance_type
            }
          />

          <Detail
            label="Fault Category"
            value={
              maintenanceRecord.fault_category
            }
          />

          <Detail
            label="Technician"
            value={
              maintenanceRecord.technician_id ??
              "Not specified"
            }
          />

          <Detail
            label="Parts Cost"
            value={
              formatCurrency(
                maintenanceRecord.parts_cost,
                2
              )
            }
          />

          <Detail
            label="Labour Cost"
            value={
              formatCurrency(
                maintenanceRecord.labour_cost,
                2
              )
            }
          />

          <Detail
            label="Total Repair Cost"
            value={
              formatCurrency(
                maintenanceRecord.total_repair_cost,
                2
              )
            }
          />

          <Detail
            label="Downtime"
            value={`${formatNumber(
              maintenanceRecord.downtime_hours,
              2
            )} hrs`}
          />

          <Detail
            label="Completion Date"
            value={
              maintenanceRecord.completion_date
                ? maintenanceRecord.completion_date
                    .slice(
                      0,
                      10
                    )
                : "Not completed"
            }
          />


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
              Status
            </p>


            <Badge
              className="mt-2"
              variant={
                maintenanceRecord.status ===
                  "Completed"
                  ? "outline"
                  : "secondary"
              }
            >
              {
                maintenanceRecord.status
              }
            </Badge>

          </div>

        </div>


        {/* =================================================
            FAULT DESCRIPTION
        ================================================= */}

        <div
          className="
            rounded-lg
            border
            p-4
          "
        >

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Fault Description
          </p>


          <p
            className="
              mt-2
              text-sm
            "
          >
            {
              maintenanceRecord.fault_description
            }
          </p>

        </div>


        {/* =================================================
            PARTS
        ================================================= */}

        <div
          className="
            grid
            gap-3
          "
        >

          <h3
            className="
              text-sm
              font-semibold
            "
          >
            Parts Used
          </h3>


          {
            maintenanceRecord.parts_used.length >
              0
              ? (

                  <div
                    className="
                      overflow-x-auto
                      rounded-lg
                      border
                    "
                  >

                    <Table>

                      <TableHeader>

                        <TableRow>

                          <TableHead>
                            Part
                          </TableHead>

                          <TableHead>
                            Quantity
                          </TableHead>

                          <TableHead>
                            Unit Cost
                          </TableHead>

                          <TableHead
                            className="text-right"
                          >
                            Line Total
                          </TableHead>

                        </TableRow>

                      </TableHeader>


                      <TableBody>

                        {
                          maintenanceRecord.parts_used.map(
                            part => (

                              <TableRow
                                key={
                                  part.part_id
                                }
                              >

                                <TableCell>

                                  <div
                                    className="font-medium"
                                  >
                                    {
                                      part.part_id
                                    }
                                  </div>


                                  <div
                                    className="
                                      text-xs
                                      text-muted-foreground
                                    "
                                  >
                                    {
                                      part.part_name
                                    }
                                  </div>

                                </TableCell>


                                <TableCell>
                                  {
                                    part.quantity
                                  }
                                </TableCell>


                                <TableCell>
                                  {
                                    formatCurrency(
                                      part.unit_cost,
                                      2
                                    )
                                  }
                                </TableCell>


                                <TableCell
                                  className="text-right"
                                >
                                  {
                                    formatCurrency(
                                      part.line_total,
                                      2
                                    )
                                  }
                                </TableCell>

                              </TableRow>

                            )
                          )
                        }

                      </TableBody>

                    </Table>

                  </div>

                )
              : (

                  <p
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No spare parts were recorded.
                  </p>

                )
          }

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