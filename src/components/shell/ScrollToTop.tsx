"use client";

import { useEffect, useState, type RefObject } from "react";
import { ChevronUp } from "lucide-react";

type Props = {
  scrollRef: RefObject<HTMLElement | null>;
};

export function ScrollToTop({ scrollRef }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setVisible(el.scrollTop > 320);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Scroll to top"
      className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-cyan/40 bg-panel text-cyan shadow-lg shadow-black/40 transition hover:bg-cyan-soft"
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
