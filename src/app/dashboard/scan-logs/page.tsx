"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Search, Clock, Smartphone, Wifi, WifiOff } from "lucide-react";

interface ScanLog {
  scan_id: string;
  nfc_id: string;
  worker_id: string;
  worker_name: string;
  household_id: string;
  ward_code: string;
  timestamp: string;
  gps_latitude: number;
  gps_longitude: number;
  sync_status: boolean;
  scan_method: "NFC" | "Manual";
}

export default function ScanLogsPage() {
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([
    {
      scan_id: "S001",
      nfc_id: "NFC001",
      worker_id: "W001",
      worker_name: "John Doe",
      household_id: "H001",
      ward_code: "W01",
      timestamp: "2025-05-31T08:30:00Z",
      gps_latitude: 12.9716,
      gps_longitude: 77.5946,
      sync_status: true,
      scan_method: "NFC",
    },
    {
      scan_id: "S002",
      nfc_id: "NFC002",
      worker_id: "W002",
      worker_name: "Jane Smith",
      household_id: "H002",
      ward_code: "W01",
      timestamp: "2025-05-31T09:15:00Z",
      gps_latitude: 12.972,
      gps_longitude: 77.595,
      sync_status: true,
      scan_method: "NFC",
    },
    {
      scan_id: "S003",
      nfc_id: "NFC003",
      worker_id: "W003",
      worker_name: "Mike Johnson",
      household_id: "H003",
      ward_code: "W02",
      timestamp: "2025-05-31T10:45:00Z",
      gps_latitude: 12.98,
      gps_longitude: 77.6,
      sync_status: false,
      scan_method: "Manual",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredLogs = scanLogs.filter((log) => {
    const matchesSearch =
      log.scan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.nfc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.household_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = wardFilter === "all" || log.ward_code === wardFilter;
    const matchesSync =
      syncFilter === "all" ||
      (syncFilter === "synced" && log.sync_status) ||
      (syncFilter === "pending" && !log.sync_status);
    const matchesMethod =
      methodFilter === "all" || log.scan_method === methodFilter;
    return matchesSearch && matchesWard && matchesSync && matchesMethod;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Logs</h1>
          <p className="text-muted-foreground">
            Track NFC scans and worker activity across all wards
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Smartphone className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanLogs.length}</div>
            <p className="text-muted-foreground text-xs">All time scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Scans
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                scanLogs.filter(
                  (log) =>
                    new Date(log.timestamp).toDateString() ===
                    new Date().toDateString(),
                ).length
              }
            </div>
            <p className="text-muted-foreground text-xs">Scans today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced</CardTitle>
            <Wifi className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scanLogs.filter((log) => log.sync_status).length}
            </div>
            <p className="text-muted-foreground text-xs">Successfully synced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <WifiOff className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scanLogs.filter((log) => !log.sync_status).length}
            </div>
            <p className="text-muted-foreground text-xs">Awaiting sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search scan logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={wardFilter} onValueChange={setWardFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by ward" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            <SelectItem value="W01">Central Ward</SelectItem>
            <SelectItem value="W02">North Ward</SelectItem>
            <SelectItem value="W03">South Ward</SelectItem>
          </SelectContent>
        </Select>
        <Select value={syncFilter} onValueChange={setSyncFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sync status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="synced">Synced</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Scan method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="NFC">NFC</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scan Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Logs</CardTitle>
          <CardDescription>
            Detailed log of all NFC scans and worker activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan ID</TableHead>
                <TableHead>NFC/Household</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>GPS Location</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Sync Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.scan_id}>
                  <TableCell className="font-medium">{log.scan_id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.nfc_id}</div>
                      <div className="text-muted-foreground text-sm">
                        {log.household_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.worker_id}</div>
                      <div className="text-muted-foreground text-sm">
                        {log.worker_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{log.ward_code}</TableCell>
                  <TableCell className="text-sm">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatCoordinates(log.gps_latitude, log.gps_longitude)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.scan_method === "NFC" ? "default" : "secondary"
                      }
                    >
                      {log.scan_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {log.sync_status ? (
                        <Wifi className="h-4 w-4 text-green-600" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-orange-600" />
                      )}
                      <Badge
                        variant={log.sync_status ? "default" : "destructive"}
                      >
                        {log.sync_status ? "Synced" : "Pending"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
