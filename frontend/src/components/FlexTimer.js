import React, { useEffect, useState } from "react";
import {
  useToolTimers,
  getElapsedMs,
  startTimer,
  pauseTimer,
  resetTimer,
  setCountdownPreset,
} from "../data/timerStore";

const fmt = (ms) => {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const PRESETS = [
  { label: "30s", seconds: 30 },
  { label: "1m", seconds: 60 },
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
];

// Countdown/stopwatch tool. Timer state lives in the shared timerStore, so
// every instance (dock widget, fullscreen overlay, practice sidebar) shows
// the same timer and it keeps running while unmounted.
const FlexTimer = ({
  initialMode = "countdown",
  lockedMode = null,
  title = "Timer",
  compact = false,
  onClose,
}) => {
  const [mode, setMode] = useState(lockedMode || initialMode);
  const timers = useToolTimers();
  const timer = timers[mode];
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!timer.running) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [timer.running]);

  const elapsedMs = getElapsedMs(timer, now);
  const remainingMs =
    mode === "countdown" ? timer.presetSeconds * 1000 - elapsedMs : null;

  const switchMode = (m) => {
    if (lockedMode) return;
    setMode(m);
  };

  const presetMin = Math.floor(timer.presetSeconds / 60);
  const presetSec = timer.presetSeconds % 60;

  const setPresetParts = (minutes, seconds) => {
    setCountdownPreset((Number(minutes) || 0) * 60 + (Number(seconds) || 0));
  };

  const display = mode === "countdown" ? fmt(remainingMs) : fmt(elapsedMs);
  const isDone = mode === "countdown" && remainingMs <= 0 && elapsedMs > 0;
  const canResume = elapsedMs > 0 && !isDone;

  return (
    <div className={`card tool-card timer-card ${compact ? "compact" : ""}`}>
      <div className="tool-card-header">
        <h3>{title}</h3>
        <div className="header-actions">
          {!lockedMode && (
            <div className="segmented">
              <button
                className={mode === "countdown" ? "active" : ""}
                onClick={() => switchMode("countdown")}
              >
                Countdown
              </button>
              <button
                className={mode === "stopwatch" ? "active" : ""}
                onClick={() => switchMode("stopwatch")}
              >
                Stopwatch
              </button>
            </div>
          )}
          {onClose && (
            <button className="btn-icon" title="Close" onClick={onClose}>
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
      </div>

      {mode === "countdown" && (
        <div className="timer-presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.seconds}
              className={`chip ${
                timer.presetSeconds === preset.seconds ? "active" : ""
              }`}
              onClick={() => setCountdownPreset(preset.seconds)}
            >
              {preset.label}
            </button>
          ))}
          <span className="timer-custom">
            <input
              type="number"
              min="0"
              max="60"
              value={presetMin}
              onChange={(e) => setPresetParts(e.target.value, presetSec)}
              aria-label="Minutes"
            />
            m
            <input
              type="number"
              min="0"
              max="59"
              value={presetSec}
              onChange={(e) => setPresetParts(presetMin, e.target.value)}
              aria-label="Seconds"
            />
            s
          </span>
        </div>
      )}

      <div className={`timer-display ${isDone ? "timer-done" : ""}`}>
        {display}
      </div>

      <div className="timer-controls">
        {timer.running ? (
          <button className="btn btn-ghost" onClick={() => pauseTimer(mode)}>
            Pause
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => startTimer(mode)}>
            {canResume ? "Resume" : "Start"}
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => resetTimer(mode)}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FlexTimer;
