// Shared, persistent scoreboard state — the dock widget and the Score Keeper
// page show the same score.

import { useSyncExternalStore } from "react";

const KEY = "vbp.toolScore";
const DEFAULT_SCORE = { a: 0, b: 0, nameA: "Team A", nameB: "Team B" };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SCORE, ...JSON.parse(raw) } : DEFAULT_SCORE;
  } catch {
    return DEFAULT_SCORE;
  }
}

let state = load();
const listeners = new Set();

export function setToolScore(next) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn());
}

export function useToolScore() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state
  );
}
