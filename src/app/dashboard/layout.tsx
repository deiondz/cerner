import React from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
