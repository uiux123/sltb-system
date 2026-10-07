export type DepotStatus = "Active" | "Inactive";

export interface IDepot {
  depot_id: string;
  depot_name: string;
  region: string;
  location: string;
  total_staff: number;
  monthly_fixed_cost: number;
  manager_name?: string;
  contact_number?: string;
  status: DepotStatus;
}

export type CreateDepotInput = IDepot;

export type UpdateDepotInput = Partial<
  Omit<IDepot, "depot_id">
>;