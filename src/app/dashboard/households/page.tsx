import HouseholdTable from "./components/table/table";
import { getAllWards } from "~/server/db/queries/get-all-wards";
export default async function HouseholdsPage() {
  const wards = await getAllWards();
  return (
    <div className="space-y-6">
      <HouseholdTable wards={wards} />
    </div>
  );
}
