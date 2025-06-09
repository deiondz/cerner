"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Ward } from "~/server/db/types";
import HouseholdsTable from ".";

export default function HouseholdTable({ wards }: { wards: Ward[] }) {
  return (
    <Card className="border-none">
      <CardHeader className="p-0">
        <CardTitle>Households</CardTitle>
        <CardDescription>
          A list of all households in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <HouseholdsTable wards={wards} />
      </CardContent>
    </Card>
  );
}
