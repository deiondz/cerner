import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import type { Ward } from "~/types/ward";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface WardHeaderProps {
  onCreateWard: (
    ward: Omit<
      Ward,
      "supervisor_name" | "worker_count" | "household_count" | "status"
    >,
  ) => void;
}

export default function WardHeader({ onCreateWard }: WardHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ward_code: "",
    name: "",
    supervisor_id: "",
  });

  const handleCreateWard = () => {
    onCreateWard(formData);
    setFormData({ ward_code: "", name: "", supervisor_id: "" });
    setIsCreateDialogOpen(false);
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
              <Label htmlFor="ward_code" className="text-right">
                Ward Code
              </Label>
              <Input
                id="ward_code"
                value={formData.ward_code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, ward_code: e.target.value })
                }
                className="col-span-3"
                placeholder="W04"
              />
            </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
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
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S004">David Wilson</SelectItem>
                  <SelectItem value="S005">Emma Brown</SelectItem>
                  <SelectItem value="S006">Frank Miller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateWard}>Create Ward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
