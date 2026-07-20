"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePlayerStore } from "@/lib/player/store";
import { beatDuration } from "@/lib/animation/diff";

/**
 * While playing, advance steps on a beat synced to speed.
 * Visualizers own their GSAP tweens for the transition; this only paces the player.
 */
export function usePlaybackBeat() {
  const playing = usePlayerStore((s) => s.playing);
  const speed = usePlayerStore((s) => s.speed);
  const next = usePlayerStore((s) => s.next);
  const pause = usePlayerStore((s) => s.pause);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    const tick = () => {
      const state = usePlayerStore.getState();
      if (!state.playing) return;
      if (state.index >= state.steps.length - 1) {
        pause();
        return;
      }
      next();
      timer.current = setTimeout(tick, beatDuration(state.speed) * 1000);
    };

    timer.current = setTimeout(tick, beatDuration(speed) * 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, speed, next, pause]);
}

/** Kill and replace a timeline when step index changes. */
export function useStepTimeline(
  build: (tl: gsap.core.Timeline, duration: number) => void,
  deps: unknown[],
) {
  const speed = usePlayerStore((s) => s.speed);
  const index = usePlayerStore((s) => s.index);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    tlRef.current?.kill();
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tlRef.current = tl;
    build(tl, beatDuration(speed));
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, speed, ...deps]);
}
