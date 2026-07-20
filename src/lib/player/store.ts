import { create } from "zustand";
import type { Step } from "@/lib/types";

type PlayerState = {
  steps: Step[];
  index: number;
  playing: boolean;
  speed: number;
  setSteps: (steps: Step[]) => void;
  setIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  steps: [],
  index: 0,
  playing: false,
  speed: 1,
  setSteps: (steps) =>
    set({ steps, index: 0, playing: false }),
  setIndex: (index) => {
    const { steps } = get();
    if (steps.length === 0) return;
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    set({ index: clamped, playing: false });
  },
  next: () => {
    const { steps, index } = get();
    if (index < steps.length - 1) set({ index: index + 1 });
    else set({ playing: false });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1, playing: false });
  },
  play: () => {
    const { steps, index } = get();
    if (steps.length === 0) return;
    if (index >= steps.length - 1) set({ index: 0, playing: true });
    else set({ playing: true });
  },
  pause: () => set({ playing: false }),
  toggle: () => {
    const { playing } = get();
    if (playing) get().pause();
    else get().play();
  },
  setSpeed: (speed) => set({ speed }),
  reset: () => set({ steps: [], index: 0, playing: false }),
}));

export function selectCurrentStep(state: PlayerState): Step | null {
  if (state.steps.length === 0) return null;
  return state.steps[state.index] ?? null;
}
