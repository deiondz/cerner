import { MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ward } from "~/types/ward";

interface WardStatsProps {
  wards: Ward[];
}

export default function WardStats({ wards }: WardStatsProps) {
  const totalWorkers = wards.reduce(
    (sum, ward) => sum + Number(ward.worker_count),
    0,
  );
  const totalHouseholds = wards.reduce(
    (sum, ward) => sum + Number(ward.household_count),
    0,
  );
  const activeWards = wards.filter((w) => w.status === "active").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Wards</CardTitle>
          <MapPin className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wards.length}</div>
          <p className="text-muted-foreground text-xs">{activeWards} active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkers}</div>
          <p className="text-muted-foreground text-xs">Across all wards</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Households
          </CardTitle>
          <MapPin className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHouseholds}</div>
          <p className="text-muted-foreground text-xs">Registered households</p>
        </CardContent>
      </Card>
    </div>
  );
}
