"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CurriculumSidebar } from "@/components/shell/CurriculumSidebar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function FloatingCurriculum({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    prevFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            key="curriculum-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/55"
            aria-label="Close curriculum"
            onClick={onClose}
          />
          <motion.div
            key="curriculum-drawer"
            id="floating-curriculum"
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 left-14 z-50 w-[min(280px,calc(100vw-3.5rem))] shadow-2xl shadow-black/40"
          >
            <CurriculumSidebar open onClose={onClose} closeRef={closeRef} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
