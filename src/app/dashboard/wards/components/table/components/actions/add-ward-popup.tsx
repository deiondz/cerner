"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

// ** Import 3rd Party Libs
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ** Import UI Components
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

// ** Import API
import { addWard } from "~/api/wards/add-ward";
import type { Worker } from "~/server/db/types";

// Form validation schema
const formSchema = z.object({
  wardName: z.string().min(1, "Name is required").max(255),
  supervisorId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddWardPopup({ workers }: { workers: Worker[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardName: "",
      supervisorId: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await addWard(data);

      if (response.success) {
        toast.success("Ward added successfully");
        form.reset();
        setOpen(false);
        router.refresh(); // Refresh the page to show new data
        await queryClient.invalidateQueries({ queryKey: ["wards"] });
      } else {
        toast.error(response.error ?? "Failed to add ward"); // TODO: Add error message
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add ward",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          Add ward
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New ward</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new ward to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={workers.length === 0}
                          >
                            {field.value
                              ? workers.find(
                                  (worker) => worker.workerId === field.value,
                                )?.workerName
                              : "Select supervisor"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="min-w-sm overflow-y-auto p-0"
                        side="bottom"
                        align="center"
                        sideOffset={4}
                      >
                        <Command className="h-52 w-full">
                          <CommandInput placeholder="Search supervisor..." />
                          <CommandEmpty>No supervisor found.</CommandEmpty>
                          <CommandGroup className="overflow-y-scroll">
                            {workers.map((worker) => (
                              <CommandItem
                                value={worker.workerId}
                                key={worker.workerId}
                                onSelect={() => {
                                  field.onChange(worker.workerId);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === worker.workerId
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {worker.workerName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add ward"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
