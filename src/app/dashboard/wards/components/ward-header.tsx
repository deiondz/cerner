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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Worker } from "~/server/db/types";

interface WardHeaderProps {
  supervisors: Worker[];
}

export default function WardHeader({ supervisors }: WardHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    ward_code: "",
    name: "",
    supervisor_id: "",
  });

  const handleCreateWard = async () => {
    startTransition(async () => {
      console.log(formData);
      setFormData({ ward_code: "", name: "", supervisor_id: "" });
      setIsCreateDialogOpen(false);
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wards Management</h1>
        <p className="text-muted-foreground">
          Manage administrative wards and their supervisors
        </p>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Ward
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ward</DialogTitle>
            <DialogDescription>
              Add a new administrative ward to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Ward Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="East Ward"
              />
            </div>
            <div className="grid w-full grid-cols-4 items-center gap-4">
              <Label htmlFor="supervisor" className="text-right">
                Supervisor
              </Label>
              <Select
                value={formData.supervisor_id}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, supervisor_id: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder="Select supervisor"
                    className="col-span-3"
                  />
                </SelectTrigger>
                <SelectContent className="col-span-3">
                  {/* {supervisors.map((supervisor) => (
                    <SelectItem
                      key={supervisor.workerId}
                      value={supervisor.workerId}
                    >
                      {supervisor.name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateWard} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ward"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
