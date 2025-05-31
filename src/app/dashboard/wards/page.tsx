import { getWards } from "~/server/db/queries/ward";
import WardTable from "./components/table/ward-table";
import WardStats from "./components/ward-stats";

export default async function WardsPage() {
  const wards = await getWards();
  console.log(wards);

  return (
    <div className="space-y-6">
      {/* <WardHeader onCreateWard={handleCreateWard} /> */}
      <WardStats wards={wards} />
      {/* <WardSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} /> */}

      <WardTable wards={wards} />
    </div>
  );
}
