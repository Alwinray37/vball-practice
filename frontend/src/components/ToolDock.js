import React, { useEffect, useRef, useState } from "react";
import FlexTimer from "./FlexTimer";
import Scoreboard from "./Scoreboard";
import { useToolTimers, getElapsedMs } from "../data/timerStore";
import { useToolScore, setToolScore } from "../data/scoreStore";

const WIDGETS_KEY = "vbp.toolWidgets";
const DOCK_OPEN_KEY = "vbp.toolDockOpen";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const fmt = (ms) => {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const WIDGET_DEFS = [
  { type: "countdown", label: "Countdown" },
  { type: "stopwatch", label: "Stopwatch" },
  { type: "scoreboard", label: "Scoreboard" },
];

// Floating, collapsible tool dock (bottom-right). Timers keep running while
// collapsed — their state lives in timerStore, not in these widgets.
// Expand opens the whole toolbox fullscreen.
const ToolDock = () => {
  const dockRef = useRef(null);
  const [open, setOpen] = useState(() => read(DOCK_OPEN_KEY, false));
  const [widgets, setWidgets] = useState(() => read(WIDGETS_KEY, []));
  const [expanded, setExpanded] = useState(false);
  const score = useToolScore();
  const timers = useToolTimers();

  const anyRunning = timers.countdown.running || timers.stopwatch.running;

  // Tick only for the collapsed button's live time label.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!(anyRunning && !open)) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [anyRunning, open]);

  useEffect(() => {
    if (!open || expanded) return undefined;

    const handlePointerDown = (event) => {
      if (dockRef.current?.contains(event.target)) return;
      setOpen(false);
      write(DOCK_OPEN_KEY, false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [expanded, open]);

  const toggleOpen = () => {
    setOpen((prev) => {
      write(DOCK_OPEN_KEY, !prev);
      return !prev;
    });
  };

  const saveWidgets = (next) => {
    setWidgets(next);
    write(WIDGETS_KEY, next);
  };

  const addWidget = (type) => saveWidgets([...widgets, type]);
  const removeWidget = (type) =>
    saveWidgets(widgets.filter((widget) => widget !== type));

  const fabLabel = timers.countdown.running
    ? fmt(timers.countdown.presetSeconds * 1000 - getElapsedMs(timers.countdown, now))
    : timers.stopwatch.running
    ? fmt(getElapsedMs(timers.stopwatch, now))
    : null;

  const inactive = WIDGET_DEFS.filter((def) => !widgets.includes(def.type));

  const addButtons = inactive.map((def) => (
    <button
      key={def.type}
      className="tool-dock-button"
      onClick={() => addWidget(def.type)}
    >
      + {def.label}
    </button>
  ));

  const renderWidgets = () => (
    <>
      {widgets.includes("countdown") && (
        <FlexTimer
          lockedMode="countdown"
          title="Countdown"
          compact={!expanded}
          onClose={() => removeWidget("countdown")}
        />
      )}
      {widgets.includes("stopwatch") && (
        <FlexTimer
          lockedMode="stopwatch"
          title="Stopwatch"
          compact={!expanded}
          onClose={() => removeWidget("stopwatch")}
        />
      )}
      {widgets.includes("scoreboard") && (
        <Scoreboard
          score={score}
          onChange={setToolScore}
          title="Scoreboard"
          compact={!expanded}
          onClose={() => removeWidget("scoreboard")}
        />
      )}
      {widgets.length === 0 && (
        <p className="empty-state">No tools yet — add one above.</p>
      )}
    </>
  );

  if (expanded) {
    return (
      <div className="toolbox-overlay">
        <div className="toolbox-overlay-bar">
          {addButtons}
          <button
            className="btn-icon toolbox-overlay-close"
            title="Shrink toolbox"
            onClick={() => setExpanded(false)}
          >
            <i className="fa-solid fa-down-left-and-up-right-to-center" />
          </button>
        </div>
        <div className="toolbox-overlay-grid">{renderWidgets()}</div>
      </div>
    );
  }

  return (
    <div className={`tool-dock ${open ? "open" : ""}`} ref={dockRef}>
      {open ? (
        <div className="tool-dock-panel">
          <div className="tool-dock-bar">
            {addButtons}
            <span className="tool-dock-bar-right">
              <button
                className="btn-icon"
                title="Expand toolbox"
                onClick={() => setExpanded(true)}
              >
                <i className="fa-solid fa-up-right-and-down-left-from-center" />
              </button>
              <button
                className="btn-icon"
                title="Collapse"
                onClick={toggleOpen}
              >
                <i className="fa-solid fa-chevron-down" />
              </button>
            </span>
          </div>
          <div className="tool-dock-widgets">{renderWidgets()}</div>
        </div>
      ) : (
        <button
          className={`tool-dock-fab ${anyRunning ? "running" : ""}`}
          onClick={toggleOpen}
          aria-label="Open tools"
        >
          <i className="fa-solid fa-wrench" />
          {fabLabel && <span className="tool-dock-fab-time">{fabLabel}</span>}
        </button>
      )}
    </div>
  );
};

export default ToolDock;
