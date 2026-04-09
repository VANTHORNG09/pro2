// app/(dashboard)/layout.tsx
"use client";

import * as React from "react";

import { SidebarProvider, AppSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const currentRole = user?.role ??  "student";
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-muted/30">
        <div className="flex min-h-screen">
          <AppSidebar role={currentRole} />

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
