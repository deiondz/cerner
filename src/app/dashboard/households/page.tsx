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
import { Plus, Search, Edit, Trash2, Home, MapPin, Nfc } from "lucide-react";

interface Household {
  nfc_id: string;
  ward_code: string;
  ward_name: string;
  household_id: string;
  owner_number: string;
  address: string;
  date_created: string;
  date_updated: string;
  status: "active" | "inactive" | "suspended";
  last_scan: string;
}

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>([
    {
      nfc_id: "NFC001",
      ward_code: "W01",
      ward_name: "Central Ward",
      household_id: "H001",
      owner_number: "9876543210",
      address: "123 Main Street, Central Area",
      date_created: "2025-01-15",
      date_updated: "2025-05-30",
      status: "active",
      last_scan: "2025-05-31 08:30",
    },
    {
      nfc_id: "NFC002",
      ward_code: "W01",
      ward_name: "Central Ward",
      household_id: "H002",
      owner_number: "9876543211",
      address: "456 Oak Avenue, Central Area",
      date_created: "2025-02-01",
      date_updated: "2025-05-29",
      status: "active",
      last_scan: "2025-05-30 16:45",
    },
    {
      nfc_id: "NFC003",
      ward_code: "W02",
      ward_name: "North Ward",
      household_id: "H003",
      owner_number: "9876543212",
      address: "789 Pine Road, North District",
      date_created: "2025-01-20",
      date_updated: "2025-05-28",
      status: "inactive",
      last_scan: "2025-05-25 10:15",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(
    null,
  );

  const [formData, setFormData] = useState({
    nfc_id: "",
    ward_code: "",
    household_id: "",
    owner_number: "",
    address: "",
    status: "active",
  });

  const filteredHouseholds = households.filter((household) => {
    const matchesSearch =
      household.nfc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.household_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.owner_number.includes(searchTerm);
    const matchesWard =
      wardFilter === "all" || household.ward_code === wardFilter;
    const matchesStatus =
      statusFilter === "all" || household.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const handleCreateHousehold = () => {
    const newHousehold: Household = {
      ...formData,
      ward_name: "Central Ward", // This would come from API
      date_created: new Date().toISOString().split("T")[0],
      date_updated: new Date().toISOString().split("T")[0],
      last_scan: "Never",
      status: formData.status as "active" | "inactive" | "suspended",
    };
    setHouseholds([...households, newHousehold]);
    setFormData({
      nfc_id: "",
      ward_code: "",
      household_id: "",
      owner_number: "",
      address: "",
      status: "active",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditHousehold = (household: Household) => {
    setEditingHousehold(household);
    setFormData({
      nfc_id: household.nfc_id,
      ward_code: household.ward_code,
      household_id: household.household_id,
      owner_number: household.owner_number,
      address: household.address,
      status: household.status,
    });
  };

  const handleUpdateHousehold = () => {
    if (editingHousehold) {
      setHouseholds(
        households.map((household) =>
          household.nfc_id === editingHousehold.nfc_id
            ? {
                ...household,
                ...formData,
                date_updated: new Date().toISOString().split("T")[0],
                status: formData.status as "active" | "inactive" | "suspended",
              }
            : household,
        ),
      );
      setEditingHousehold(null);
      setFormData({
        nfc_id: "",
        ward_code: "",
        household_id: "",
        owner_number: "",
        address: "",
        status: "active",
      });
    }
  };

  const handleDeleteHousehold = (nfcId: string) => {
    setHouseholds(households.filter((household) => household.nfc_id !== nfcId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Households Management
          </h1>
          <p className="text-muted-foreground">
            Manage registered households and their NFC tags
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Household
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Household</DialogTitle>
              <DialogDescription>
                Add a new household to the waste management system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nfc_id" className="text-right">
                  NFC ID
                </Label>
                <Input
                  id="nfc_id"
                  value={formData.nfc_id}
                  onChange={(e) =>
                    setFormData({ ...formData, nfc_id: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="NFC004"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="household_id" className="text-right">
                  Household ID
                </Label>
                <Input
                  id="household_id"
                  value={formData.household_id}
                  onChange={(e) =>
                    setFormData({ ...formData, household_id: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="H004"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ward" className="text-right">
                  Ward
                </Label>
                <Select
                  value={formData.ward_code}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ward_code: value })
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
                <Label htmlFor="owner_number" className="text-right">
                  Owner Contact
                </Label>
                <Input
                  id="owner_number"
                  value={formData.owner_number}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_number: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="9876543210"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="address" className="pt-2 text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateHousehold}>
                Register Household
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Households
            </CardTitle>
            <Home className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{households.length}</div>
            <p className="text-muted-foreground text-xs">
              Registered households
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Households
            </CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {households.filter((h) => h.status === "active").length}
            </div>
            <p className="text-muted-foreground text-xs">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NFC Tags Issued
            </CardTitle>
            <Nfc className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {households.filter((h) => h.nfc_id).length}
            </div>
            <p className="text-muted-foreground text-xs">With NFC tags</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wards Covered</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(households.map((h) => h.ward_code)).size}
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
            placeholder="Search households..."
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Households Table */}
      <Card>
        <CardHeader>
          <CardTitle>Households</CardTitle>
          <CardDescription>
            A list of all registered households in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NFC ID</TableHead>
                <TableHead>Household ID</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Owner Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Scan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHouseholds.map((household) => (
                <TableRow key={household.nfc_id}>
                  <TableCell className="font-medium">
                    {household.nfc_id}
                  </TableCell>
                  <TableCell>{household.household_id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{household.ward_code}</div>
                      <div className="text-muted-foreground text-sm">
                        {household.ward_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{household.owner_number}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={household.address}
                  >
                    {household.address}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        household.status === "active"
                          ? "default"
                          : household.status === "inactive"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {household.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {household.last_scan}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditHousehold(household)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Household</DialogTitle>
                            <DialogDescription>
                              Update household information and status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_nfc_id"
                                className="text-right"
                              >
                                NFC ID
                              </Label>
                              <Input
                                id="edit_nfc_id"
                                value={formData.nfc_id}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_household_id"
                                className="text-right"
                              >
                                Household ID
                              </Label>
                              <Input
                                id="edit_household_id"
                                value={formData.household_id}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    household_id: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit_ward" className="text-right">
                                Ward
                              </Label>
                              <Select
                                value={formData.ward_code}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, ward_code: value })
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
                                htmlFor="edit_owner_number"
                                className="text-right"
                              >
                                Owner Contact
                              </Label>
                              <Input
                                id="edit_owner_number"
                                value={formData.owner_number}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    owner_number: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <Label
                                htmlFor="edit_address"
                                className="pt-2 text-right"
                              >
                                Address
                              </Label>
                              <Textarea
                                id="edit_address"
                                value={formData.address}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: e.target.value,
                                  })
                                }
                                className="col-span-3"
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit_status"
                                className="text-right"
                              >
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
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">
                                    Inactive
                                  </SelectItem>
                                  <SelectItem value="suspended">
                                    Suspended
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdateHousehold}>
                              Update Household
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHousehold(household.nfc_id)}
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
