"use client";

import { useState } from "react";
import { TopNav } from "@/components/shell/TopNav";
import { CurriculumSidebar } from "@/components/shell/CurriculumSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <CurriculumSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
