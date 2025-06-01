import { getWardTableData } from "./actions/get-table-data";
import WardTable from "./components/table/ward-table";
import WardStats from "./components/ward-stats";
export default async function WardsPage() {
  const wards = await getWardTableData();

  return (
    <div className="space-y-6">
      <WardStats wards={[]} />
      <WardTable wards={wards} />
    </div>
  );
}
