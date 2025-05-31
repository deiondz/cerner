"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
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
import { Textarea } from "~/components/ui/textarea";
import {
  Search,
  Edit,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface CitizenReport {
  report_id: string;
  nfc_id: string;
  household_id: string;
  citizen_contact: string;
  timestamp: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  additional_notes: string;
  ward_code: string;
  priority: "low" | "medium" | "high";
}

export default function CitizenReportsPage() {
  const [reports, setReports] = useState<CitizenReport[]>([
    {
      report_id: "R001",
      nfc_id: "NFC001",
      household_id: "H001",
      citizen_contact: "9876543210",
      timestamp: "2025-05-31T12:00:00Z",
      status: "open",
      additional_notes:
        "Garbage not collected for 3 days. Bins are overflowing.",
      ward_code: "W01",
      priority: "high",
    },
    {
      report_id: "R002",
      nfc_id: "NFC002",
      household_id: "H002",
      citizen_contact: "9876543211",
      timestamp: "2025-05-30T14:30:00Z",
      status: "in_progress",
      additional_notes: "Missed collection yesterday. Please schedule pickup.",
      ward_code: "W01",
      priority: "medium",
    },
    {
      report_id: "R003",
      nfc_id: "NFC003",
      household_id: "H003",
      citizen_contact: "9876543212",
      timestamp: "2025-05-29T09:15:00Z",
      status: "resolved",
      additional_notes: "Issue resolved. Collection completed on 2025-05-30.",
      ward_code: "W02",
      priority: "low",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [editingReport, setEditingReport] = useState<CitizenReport | null>(
    null,
  );

  const [formData, setFormData] = useState({
    status: "",
    additional_notes: "",
    priority: "",
  });

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.report_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nfc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizen_contact.includes(searchTerm) ||
      report.additional_notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;
    const matchesWard = wardFilter === "all" || report.ward_code === wardFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesWard;
  });

  const handleEditReport = (report: CitizenReport) => {
    setEditingReport(report);
    setFormData({
      status: report.status,
      additional_notes: report.additional_notes,
      priority: report.priority,
    });
  };

  const handleUpdateReport = () => {
    if (editingReport) {
      setReports(
        reports.map((report) =>
          report.report_id === editingReport.report_id
            ? {
                ...report,
                ...formData,
                status: formData.status as any,
                priority: formData.priority as any,
              }
            : report,
        ),
      );
      setEditingReport(null);
      setFormData({ status: "", additional_notes: "", priority: "" });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citizen Reports</h1>
          <p className="text-muted-foreground">
            Manage citizen complaints and service requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-muted-foreground text-xs">All time reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((r) => r.status === "open").length}
            </div>
            <p className="text-muted-foreground text-xs">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((r) => r.status === "in_progress").length}
            </div>
            <p className="text-muted-foreground text-xs">Being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((r) => r.status === "resolved").length}
            </div>
            <p className="text-muted-foreground text-xs">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Citizen Reports</CardTitle>
          <CardDescription>
            Track and manage citizen complaints and service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Household</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.report_id}>
                  <TableCell className="font-medium">
                    {report.report_id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.nfc_id}</div>
                      <div className="text-muted-foreground text-sm">
                        {report.household_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.citizen_contact}</TableCell>
                  <TableCell>{report.ward_code}</TableCell>
                  <TableCell className="text-sm">
                    {formatTimestamp(report.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(report.priority) as any}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <Badge
                        variant={
                          report.status === "open"
                            ? "destructive"
                            : report.status === "in_progress"
                              ? "default"
                              : report.status === "resolved"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={report.additional_notes}
                  >
                    {report.additional_notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditReport(report)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Update Report</DialogTitle>
                          <DialogDescription>
                            Update the status and notes for this citizen report
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit_status" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Resolved
                                </SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit_priority"
                              className="text-right"
                            >
                              Priority
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                setFormData({ ...formData, priority: value })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit_notes"
                              className="pt-2 text-right"
                            >
                              Notes
                            </Label>
                            <Textarea
                              id="edit_notes"
                              value={formData.additional_notes}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additional_notes: e.target.value,
                                })
                              }
                              className="col-span-3"
                              rows={4}
                              placeholder="Add resolution notes or updates..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUpdateReport}>
                            Update Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
