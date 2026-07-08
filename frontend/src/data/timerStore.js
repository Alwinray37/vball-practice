// Shared, persistent timer state for the countdown and stopwatch tools.
// Lives outside React so timers keep running while the dock is collapsed,
// across page navigation, and survive a refresh (state is timestamp-based).

import { useSyncExternalStore } from "react";

const KEY = "vbp.toolTimers";

const defaults = () => ({
  countdown: { presetSeconds: 300, running: false, startedAt: null, baseMs: 0 },
  stopwatch: { running: false, startedAt: null, baseMs: 0 },
});

function load() {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      countdown: { ...base.countdown, ...parsed.countdown },
      stopwatch: { ...base.stopwatch, ...parsed.stopwatch },
    };
  } catch {
    return base;
  }
}

let state = load();
const listeners = new Set();

function setState(next) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn());
  syncZeroWatcher();
}

export function getTimers() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useToolTimers() {
  return useSyncExternalStore(subscribe, getTimers);
}

export function getElapsedMs(timer, now = Date.now()) {
  return timer.baseMs + (timer.running ? Math.max(0, now - timer.startedAt) : 0);
}

export function getRemainingMs(now = Date.now()) {
  const c = state.countdown;
  return c.presetSeconds * 1000 - getElapsedMs(c, now);
}

// Short beep without any audio assets.
export function beep(times = 3) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      const t = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.3);
    }
  } catch {
    // audio not available; timer still works silently
  }
}

// Watches a running countdown and stops + beeps at zero, even when no
// timer component is mounted (dock collapsed, other page, etc.).
let watchId = null;

function syncZeroWatcher() {
  const needsWatch = state.countdown.running;
  if (needsWatch && watchId === null) {
    watchId = setInterval(() => {
      if (getRemainingMs() <= 0) {
        const c = state.countdown;
        setState({
          ...state,
          countdown: {
            ...c,
            running: false,
            startedAt: null,
            baseMs: c.presetSeconds * 1000,
          },
        });
        beep();
      }
    }, 250);
  } else if (!needsWatch && watchId !== null) {
    clearInterval(watchId);
    watchId = null;
  }
}

syncZeroWatcher();

// ---- Actions ----

export function startTimer(kind) {
  const t = state[kind];
  if (t.running) return;
  // Restarting a finished countdown starts from the full preset again.
  const baseMs =
    kind === "countdown" && t.baseMs >= t.presetSeconds * 1000 ? 0 : t.baseMs;
  setState({
    ...state,
    [kind]: { ...t, running: true, startedAt: Date.now(), baseMs },
  });
}

export function pauseTimer(kind) {
  const t = state[kind];
  if (!t.running) return;
  setState({
    ...state,
    [kind]: {
      ...t,
      running: false,
      startedAt: null,
      baseMs: getElapsedMs(t),
    },
  });
}

export function resetTimer(kind) {
  setState({
    ...state,
    [kind]: { ...state[kind], running: false, startedAt: null, baseMs: 0 },
  });
}

export function setCountdownPreset(seconds) {
  const presetSeconds = Math.min(3600, Math.max(1, Math.round(seconds) || 1));
  setState({
    ...state,
    countdown: {
      presetSeconds,
      running: false,
      startedAt: null,
      baseMs: 0,
    },
  });
}
