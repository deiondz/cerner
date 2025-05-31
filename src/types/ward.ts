export interface Ward {
  ward_code: string;
  name: string;
  supervisor_id: string;
  supervisor_name: string;
  worker_count: number;
  household_count: number;
  status: "active" | "inactive";
}
