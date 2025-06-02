"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { BarChart3, Users, Home, MapPin, FileText, Scan } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import MaxWidthWrapper from "~/components/max-width-wrapper";
import Link from "next/link";

export default function Dashboard() {
  const [userRole] = useState<"admin" | "supervisor" | "worker">("admin"); // Mock user role

  const stats = [
    {
      title: "Total Wards",
      value: "12",
      description: "Active administrative wards",
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      title: "Active Workers",
      value: "48",
      description: "Field workers on duty",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Registered Households",
      value: "1,247",
      description: "Households with NFC tags",
      icon: Home,
      color: "text-purple-600",
    },
    {
      title: "Today's Scans",
      value: "324",
      description: "NFC scans completed today",
      icon: Scan,
      color: "text-orange-600",
    },
    {
      title: "Open Reports",
      value: "23",
      description: "Pending citizen reports",
      icon: FileText,
      color: "text-red-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "scan",
      message: "Worker W123 scanned household NFC456",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "report",
      message: "New citizen report submitted for Ward W01",
      time: "15 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      type: "worker",
      message: "Worker W089 registered in Ward W03",
      time: "1 hour ago",
      status: "info",
    },
  ];

  return (
    <MaxWidthWrapper className="space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening in your waste
          management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Area */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Scan Activity Overview</CardTitle>
            <CardDescription>
              Daily NFC scan activity across all wards
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="border-muted-foreground/25 flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <BarChart3 className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  Chart visualization would go here
                </p>
                <p className="text-muted-foreground text-sm">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {activity.message}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "pending"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/dashboard/wards">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                    <p className="font-medium">Create Ward</p>
                  </CardContent>
                </Card>
              </Link>
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="font-medium">Add Worker</p>
                </CardContent>
              </Card>
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Home className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                  <p className="font-medium">Register Household</p>
                </CardContent>
              </Card>
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                  <p className="font-medium">View Reports</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </MaxWidthWrapper>
  );
}
