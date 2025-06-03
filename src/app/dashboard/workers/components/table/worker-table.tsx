"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Ward } from "~/server/db/types";
import WorkersTable from ".";

export default function WorkerTable({ wards }: { wards: Ward[] }) {
  return (
    <Card className="border-none">
      <CardHeader className="p-0">
        <CardTitle>Workers</CardTitle>
        <CardDescription>A list of all workers in the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <WorkersTable wards={wards} />
      </CardContent>
    </Card>
  );
}
