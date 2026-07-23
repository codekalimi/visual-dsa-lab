"use client";

import type { ReactNode } from "react";
import { KadaneTeachPanel } from "@/components/teach/KadaneTeachPanel";

/** Returns the teach rail for an algorithm, or null when none exists. */
export function renderTeachPanel(algoId: string): ReactNode {
  switch (algoId) {
    case "kadane":
      return <KadaneTeachPanel />;
    default:
      return null;
  }
}

export function hasTeachPanel(algoId: string): boolean {
  return algoId === "kadane";
}
