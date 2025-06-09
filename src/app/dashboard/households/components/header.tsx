"use client";

import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function WorkerHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    ward_id: "",
  });

  const handleCreateWorker = async () => {
    startTransition(async () => {
      console.log(formData);
      setFormData({ name: "", contact_number: "", ward_id: "" });
      setIsCreateDialogOpen(false);
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Workers Management
        </h1>
        <p className="text-muted-foreground">
          Manage field workers and their ward assignments
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
              Add a new field worker to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Worker Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
                className="col-span-3"
                placeholder="+1234567890"
              />
            </div>
            <div className="grid w-full grid-cols-4 items-center gap-4">
              <Label htmlFor="ward" className="text-right">
                Assigned Ward
              </Label>
              <Select
                value={formData.ward_id}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, ward_id: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder="Select ward"
                    className="col-span-3"
                  />
                </SelectTrigger>
                <SelectContent className="col-span-3">
                  {/* {wards.map((ward) => (
                    <SelectItem
                      key={ward.wardId}
                      value={ward.wardId}
                    >
                      {ward.wardName}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateWorker} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Worker"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
