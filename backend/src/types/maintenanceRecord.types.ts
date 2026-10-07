export type MaintenanceType =
  | "Preventive"
  | "Corrective";


export type MaintenanceStatus =
  | "In Progress"
  | "Completed";


// =========================================================
// PART USED INSIDE MAINTENANCE RECORD
// =========================================================

export interface IMaintenancePartUsed {
  part_id: string;
  part_name: string;

  quantity: number;

  unit_cost: number;

  line_total: number;
}


// =========================================================
// MAINTENANCE RECORD
// =========================================================

export interface IMaintenanceRecord {
  maintenance_id: string;

  bus_id: string;

  depot_id: string;

  reported_date: Date;

  maintenance_type:
    MaintenanceType;

  fault_category: string;

  fault_description: string;

  parts_used:
    IMaintenancePartUsed[];

  parts_cost: number;

  labour_cost: number;

  total_repair_cost: number;

  downtime_hours: number;

  technician_id?: string;

  completion_date?: Date;

  status:
    MaintenanceStatus;
}


// =========================================================
// PART INPUT
// =========================================================
//
// Client only provides:
//
// part_id
// quantity
//
// part_name, unit_cost and line_total are obtained/calculated
// by the backend.
// =========================================================

export interface MaintenancePartInput {
  part_id: string;
  quantity: number;
}


// =========================================================
// CREATE INPUT
// =========================================================

export interface CreateMaintenanceRecordInput {
  maintenance_id: string;

  bus_id: string;

  reported_date:
    string | Date;

  maintenance_type:
    MaintenanceType;

  fault_category: string;

  fault_description: string;

  parts_used?:
    MaintenancePartInput[];

  labour_cost: number;

  downtime_hours: number;

  technician_id?: string;

  completion_date?:
    string | Date;

  status:
    MaintenanceStatus;
}


// =========================================================
// UPDATE INPUT
// =========================================================
//
// We intentionally do NOT allow parts_used to be changed
// through normal maintenance update.
//
// Inventory changes should not silently occur when somebody
// edits descriptive maintenance information.
// =========================================================

export interface UpdateMaintenanceRecordInput {
  reported_date?:
    string | Date;

  maintenance_type?:
    MaintenanceType;

  fault_category?: string;

  fault_description?: string;

  labour_cost?: number;

  downtime_hours?: number;

  technician_id?: string;

  completion_date?:
    string | Date;

  status?:
    MaintenanceStatus;
}