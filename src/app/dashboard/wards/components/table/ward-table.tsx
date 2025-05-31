"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Ward } from "~/types/ward";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface WardTableProps {
  wards: Ward[];
}

export default function WardTable({ wards }: WardTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wards</CardTitle>
        <CardDescription>
          A list of all administrative wards in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={wards} />
      </CardContent>
    </Card>
  );
}
