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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  MapPin,
  Smartphone,
} from "lucide-react";

interface Worker {
  worker_id: string;
  name: string;
  contact_number: string;
  ward_assigned: string;
  ward_name: string;
  date_created: string;
  device_id: string;
  status: "active" | "inactive";
  last_sync: string;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      worker_id: "W001",
      name: "John Doe",
      contact_number: "9876543210",
      ward_assigned: "W01",
      ward_name: "Central Ward",
      date_created: "2025-01-15",
      device_id: "DEV001",
      status: "active",
      last_sync: "2025-05-31 14:30",
    },
    {
      worker_id: "W002",
      name: "Jane Smith",
      contact_number: "9876543211",
      ward_assigned: "W01",
      ward_name: "Central Ward",
      date_created: "2025-02-01",
      device_id: "DEV002",
      status: "active",
      last_sync: "2025-05-31 15:45",
    },
    {
      worker_id: "W003",
      name: "Mike Johnson",
      contact_number: "9876543212",
      ward_assigned: "W02",
      ward_name: "North Ward",
      date_created: "2025-01-20",
      device_id: "DEV003",
      status: "inactive",
      last_sync: "2025-05-30 09:15",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const [formData, setFormData] = useState({
    worker_id: "",
    name: "",
    contact_number: "",
    ward_assigned: "",
    device_id: "",
  });

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.contact_number.includes(searchTerm);
    const matchesWard =
      wardFilter === "all" || worker.ward_assigned === wardFilter;
    return matchesSearch && matchesWard;
  });

  const handleCreateWorker = () => {
    const newWorker: Worker = {
      ...formData,
      ward_name: "Central Ward", // This would come from API
      date_created: new Date().toISOString().split("T")[0] || "", // Ensure string type
      status: "active",
      last_sync: "Never",
    };
    setWorkers([...workers, newWorker]);
    setFormData({
      worker_id: "",
      name: "",
      contact_number: "",
      ward_assigned: "",
      device_id: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      worker_id: worker.worker_id,
      name: worker.name,
      contact_number: worker.contact_number,
      ward_assigned: worker.ward_assigned,
      device_id: worker.device_id,
    });
  };

  const handleUpdateWorker = () => {
    if (editingWorker) {
      setWorkers(
        workers.map((worker) =>
          worker.worker_id === editingWorker.worker_id
            ? { ...worker, ...formData }
            : worker,
        ),
      );
      setEditingWorker(null);
      setFormData({
        worker_id: "",
        name: "",
        contact_number: "",
        ward_assigned: "",
        device_id: "",
      });
    }
  };

  const handleDeleteWorker = (workerId: string) => {
    setWorkers(workers.filter((worker) => worker.worker_id !== workerId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workers Management
          </h1>
          <p className="text-muted-foreground">
            Manage field workers and their assignments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
              <DialogDescription>
                Register a new field worker in the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="worker_id" className="text-right">
                  Worker ID
                </Label>
                <Input
                  id="worker_id"
                  value={formData.worker_id}
                  onChange={(e) =>
                    setFormData({ ...formData, worker_id: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="W004"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  value={formData.contact_number}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_number: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="9876543210"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ward" className="text-right">
                  Assigned Ward
                </Label>
                <Select
                  value={formData.ward_assigned}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ward_assigned: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W01">W01 - Central Ward</SelectItem>
                    <SelectItem value="W02">W02 - North Ward</SelectItem>
                    <SelectItem value="W03">W03 - South Ward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device" className="text-right">
                  Device ID
                </Label>
                <Input
                  id="device"
                  value={formData.device_id}
                  onChange={(e) =>
                    setFormData({ ...formData, device_id: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="DEV004"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateWorker}>Add Worker</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-muted-foreground text-xs">Registered workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter((w) => w.status === "active").length}
            </div>
            <p className="text-muted-foreground text-xs">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Devices Assigned
            </CardTitle>
            <Smartphone className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter((w) => w.device_id).length}
            </div>
            <p className="text-muted-foreground text-xs">With devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wards Covered</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(workers.map((w) => w.ward_assigned)).size}
            </div>
            <p className="text-muted-foreground text-xs">Different wards</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={wardFilter} onValueChange={setWardFilter}>
          <SelectTrigger className="w-[180px]">
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

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          <CardDescription>
            A list of all field workers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.worker_id}>
                  <TableCell className="font-medium">
                    {worker.worker_id}
                  </TableCell>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.contact_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{worker.ward_assigned}</div>
                      <div className="text-muted-foreground text-sm">
                        {worker.ward_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{worker.device_id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        worker.status === "active" ? "default" : "secondary"
                      }
                    >
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {worker.last_sync}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Worker</DialogTitle>
                            <DialogDescription>
                              Update worker information and assignments
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_worker_id"
                                className="text-right"
                              >
                                Worker ID
                              </Label>
                              <Input
                                id="edit_worker_id"
                                value={formData.worker_id}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit_name" className="text-right">
                                Full Name
                              </Label>
                              <Input
                                id="edit_name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_contact"
                                className="text-right"
                              >
                                Contact Number
                              </Label>
                              <Input
                                id="edit_contact"
                                value={formData.contact_number}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    contact_number: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit_ward" className="text-right">
                                Assigned Ward
                              </Label>
                              <Select
                                value={formData.ward_assigned}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    ward_assigned: value,
                                  })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="W01">
                                    W01 - Central Ward
                                  </SelectItem>
                                  <SelectItem value="W02">
                                    W02 - North Ward
                                  </SelectItem>
                                  <SelectItem value="W03">
                                    W03 - South Ward
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_device"
                                className="text-right"
                              >
                                Device ID
                              </Label>
                              <Input
                                id="edit_device"
                                value={formData.device_id}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    device_id: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdateWorker}>
                              Update Worker
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWorker(worker.worker_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
