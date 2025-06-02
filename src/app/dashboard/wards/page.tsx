import { getAllWorkers } from "~/server/db/queries/get-all-workers";
import WardTable from "./components/table/ward-table";
import WardStats from "./components/ward-stats";
import { getWardStats } from "~/server/db/queries/get-ward-stats";
import { Suspense } from "react";
import WardStatsSkeleton from "./components/ward-stats-skeleton";
import { Loader2 } from "lucide-react";

export default async function WardsPage() {
  const workers = await getAllWorkers();
  const wards = await getWardStats();

  return (
    <div className="space-y-6">
      <Suspense fallback={<WardStatsSkeleton />}>
        <WardStats wards={wards} />
      </Suspense>
      <Suspense
        fallback={<Loader2 className="text-muted-foreground animate-spin" />}
      >
        <WardTable workers={workers} />
      </Suspense>
    </div>
  );
}
