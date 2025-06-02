"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import WardsTable from ".";
import { type Worker } from "~/server/db/types";

export default function WardTable({ workers }: { workers: Worker[] }) {
  return (
    <Card className="border-none">
      <CardHeader className="p-0">
        <CardTitle>Wards</CardTitle>
        <CardDescription>
          A list of all administrative wards in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <WardsTable workers={workers} />
      </CardContent>
    </Card>
  );
}
