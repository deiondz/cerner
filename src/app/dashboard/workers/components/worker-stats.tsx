import { MapPin, Users, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Worker } from "~/server/db/types";

interface WorkerStatsProps {
  stats: {
    totalWorkers: number;
    activeWorkers: number;
    assignedWorkers: number;
  };
}

export default function WorkerStats({ stats }: WorkerStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalWorkers}</div>
          <p className="text-muted-foreground text-xs">
            All registered workers
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
          <UserCheck className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeWorkers}</div>
          <p className="text-muted-foreground text-xs">Currently active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Assigned Workers
          </CardTitle>
          <MapPin className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assignedWorkers}</div>
          <p className="text-muted-foreground text-xs">Assigned to wards</p>
        </CardContent>
      </Card>
    </div>
  );
}
