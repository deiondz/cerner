import WorkerTable from "./components/table/worker-table";
import { getAllWards } from "~/server/db/queries/get-all-wards";
export default async function WorkersPage() {
  const wards = await getAllWards();
  return (
    <div className="space-y-6">
      <WorkerTable wards={wards} />
    </div>
  );
}
