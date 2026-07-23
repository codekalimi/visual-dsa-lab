"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Moon, PanelLeft, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

type Props = {
  curriculumOpen?: boolean;
  onMenuClick?: () => void;
  onToggleCurriculum?: () => void;
};

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="6" cy="6" r="2.25" className="fill-cyan" />
      <circle cx="18" cy="6" r="2.25" className="fill-cyan" />
      <circle cx="6" cy="18" r="2.25" className="fill-cyan" />
      <circle cx="18" cy="18" r="2.25" className="fill-cyan" />
      <circle cx="12" cy="12" r="2.25" className="fill-cyan" />
      <path
        d="M8 6h8M6 8v8M18 8v8M8 18h8M8.2 8.2l2.6 2.6M15.8 8.2l-2.6 2.6M8.2 15.8l2.6-2.6M15.8 15.8l-2.6-2.6"
        className="stroke-cyan"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TopNav({
  curriculumOpen = false,
  onMenuClick,
  onToggleCurriculum,
}: Props) {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  return (
    <header
      className="relative flex h-16 shrink-0 items-center justify-between overflow-hidden px-4 md:px-6"
      style={{
        background:
          "radial-gradient(ellipse 50% 160% at 12% 100%, var(--header-glow), transparent 65%), var(--panel)",
        borderTop: "1px solid var(--header-edge)",
        borderBottom: "1px solid var(--header-edge)",
      }}
    >
      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick ?? onToggleCurriculum}
          aria-expanded={curriculumOpen}
          aria-controls="floating-curriculum"
          aria-label={curriculumOpen ? "Close curriculum" : "Open curriculum"}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-panel-2 hover:text-ink sm:hidden"
        >
          <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <Link href="/" className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight md:text-xl">
              <span className="text-ink">Visual</span>
              <span className="text-cyan">AlgoLab</span>
            </span>
            <span className="hidden text-xs text-muted sm:inline md:text-[13px]">
              interactive algorithm walkthroughs
            </span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:bg-panel-2 hover:text-ink"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Profile menu"
            className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-1 pr-2 text-muted transition hover:bg-panel-2 hover:text-ink"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-soft text-cyan">
              <User className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[160px] rounded-lg border border-border bg-panel py-1 shadow-xl shadow-black/20"
            >
              <p className="border-b border-border px-3 py-2 text-xs text-muted">
                Guest learner
              </p>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-panel-2"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-panel-2"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
