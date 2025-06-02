import { getAllWorkers } from "~/server/db/queries/get-all-workers";
import WardTable from "./components/table/ward-table";
import WardStats from "./components/ward-stats";
export default async function WardsPage() {
  const workers = await getAllWorkers();
  return (
    <div className="space-y-6">
      <WardStats wards={[]} />
      <WardTable workers={workers} />
    </div>
  );
}
