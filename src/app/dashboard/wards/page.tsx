import { getAllWorkers } from "~/server/db/queries/get-all-workers";
import WardTable from "./components/table/ward-table";
import WardStats from "./components/ward-stats";
import { getWardStats } from "~/server/db/queries/get-ward-stats";
import { Suspense } from "react";
import WardStatsSkeleton from "./components/ward-stats-skeleton";
export default async function WardsPage() {
  const workers = await getAllWorkers();
  const wards = await getWardStats();

  return (
    <div className="space-y-6">
      <Suspense fallback={<WardStatsSkeleton />}>
        <WardStats wards={wards} />
      </Suspense>
      <WardTable workers={workers} />
    </div>
  );
}
