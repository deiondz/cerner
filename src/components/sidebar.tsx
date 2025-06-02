/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Home,
  MapPin,
  Users,
  Building,
  Scan,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "supervisor", "worker"],
  },
  {
    name: "Wards",
    href: "/dashboard/wards",
    icon: MapPin,
    roles: ["admin", "supervisor"],
  },
  {
    name: "Workers",
    href: "/dashboard/workers",
    icon: Users,
    roles: ["admin", "supervisor"],
  },
  {
    name: "Households",
    href: "/dashboard/households",
    icon: Building,
    roles: ["admin", "supervisor"],
  },
  {
    name: "Scan Logs",
    href: "/dashboard/scan-logs",
    icon: Scan,
    roles: ["admin", "supervisor", "worker"],
  },
  {
    name: "Citizen Reports",
    href: "/dashboard/citizen-reports",
    icon: FileText,
    roles: ["admin", "supervisor"],
  },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [userRole] = useState<"admin" | "supervisor" | "worker">("admin"); // Mock user role

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole),
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={cn(
        "bg-card border-border border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Scan className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="text-xl font-bold">Cerner</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {!collapsed && isLoaded && user && (
          <div className="border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName ?? "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user.fullName ??
                    user.primaryEmailAddress?.emailAddress.substring(0, 20) +
                      "..." ??
                    "User"}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {userRole}
                  </Badge>
                  {userRole === "supervisor" && (
                    <span className="text-muted-foreground text-xs">
                      Ward W01
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "h-9 w-9 p-0" : "px-3",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className={cn(
              "text-muted-foreground w-full justify-start",
              collapsed ? "px-2" : "px-3",
            )}
            onClick={handleSignOut}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
