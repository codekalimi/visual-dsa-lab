"use client";

import { useCallback, useState } from "react";
import { TopNav } from "@/components/shell/TopNav";
import { IconRail } from "@/components/shell/IconRail";
import { FloatingCurriculum } from "@/components/shell/FloatingCurriculum";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  const openCurriculum = useCallback(() => setCurriculumOpen(true), []);
  const closeCurriculum = useCallback(() => setCurriculumOpen(false), []);
  const toggleCurriculum = useCallback(
    () => setCurriculumOpen((o) => !o),
    [],
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <TopNav
        curriculumOpen={curriculumOpen}
        onMenuClick={openCurriculum}
        onToggleCurriculum={toggleCurriculum}
      />
      <div className="relative flex min-h-0 flex-1">
        <IconRail
          curriculumOpen={curriculumOpen}
          onToggleCurriculum={toggleCurriculum}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        <FloatingCurriculum open={curriculumOpen} onClose={closeCurriculum} />
      </div>
    </div>
  );
}
