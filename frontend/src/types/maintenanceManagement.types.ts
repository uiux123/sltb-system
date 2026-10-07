// =========================================================
// MAINTENANCE TYPES
// =========================================================

export type MaintenanceType =
  | "Preventive"
  | "Corrective";


export type MaintenanceStatus =
  | "In Progress"
  | "Completed";


// =========================================================
// EMBEDDED PART SNAPSHOT
// =========================================================

export interface IMaintenancePartUsed {

  part_id: string;

  part_name: string;

  quantity: number;

  unit_cost: number;

  line_total: number;

}


// =========================================================
// PART INPUT
// =========================================================
//
// Create requests only send:
// part_id
// quantity
//
// The backend retrieves the actual spare part and creates
// the embedded snapshot.
//
// =========================================================

export interface IMaintenancePartInput {

  part_id: string;

  quantity: number;

}


// =========================================================
// MAINTENANCE RECORD
// =========================================================

export interface IMaintenanceRecord {

  _id?: string;

  maintenance_id: string;

  bus_id: string;

  depot_id: string;

  reported_date: string;

  maintenance_type: MaintenanceType;

  fault_category: string;

  fault_description: string;

  parts_used: IMaintenancePartUsed[];

  parts_cost: number;

  labour_cost: number;

  total_repair_cost: number;

  downtime_hours: number;

  technician_id?: string;

  completion_date?: string;

  status: MaintenanceStatus;

  createdAt?: string;

  updatedAt?: string;

}


// =========================================================
// CREATE INPUT
// =========================================================

export interface IMaintenanceCreateInput {

  maintenance_id: string;

  bus_id: string;

  reported_date: string;

  maintenance_type: MaintenanceType;

  fault_category: string;

  fault_description: string;

  parts_used?: IMaintenancePartInput[];

  labour_cost: number;

  downtime_hours: number;

  technician_id?: string;

  completion_date?: string;

  status: MaintenanceStatus;

}


// =========================================================
// UPDATE INPUT
// =========================================================
//
// bus_id and maintenance_id are intentionally excluded.
//
// parts_used is also intentionally excluded.
//
// Existing parts are inventory-affecting transactional
// history and are not changed by this update interface.
//
// =========================================================

export interface IMaintenanceUpdateInput {

  reported_date: string;

  maintenance_type: MaintenanceType;

  fault_category: string;

  fault_description: string;

  labour_cost: number;

  downtime_hours: number;

  technician_id?: string;

  completion_date?: string;

  status: MaintenanceStatus;

}