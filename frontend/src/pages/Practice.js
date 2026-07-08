import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FlexTimer from "../components/FlexTimer";
import Scoreboard from "../components/Scoreboard";
import {
  getPlan,
  savePlan,
  getSession,
  saveSession,
  clearSession,
  planTotalMinutes,
} from "../data/storage";

const fmtClock = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const freshSession = (planId) => ({
  planId,
  startedAt: Date.now(),
  pausedAt: null,
  pausedTotalMs: 0,
  completedItemIds: [],
  score: { a: 0, b: 0, nameA: "Team A", nameB: "Team B" },
});

// Live practice mode: overall clock, drill progress, general timer,
// scoreboard, and coach notes saved back onto the plan.
const Practice = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(() => getPlan(planId));
  const [session, setSession] = useState(() => {
    const existing = getSession();
    // Resume if a session for this plan survived a refresh; else start fresh.
    return existing && existing.planId === planId
      ? existing
      : saveSession(freshSession(planId));
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const paused = session.pausedAt !== null;
  const elapsedMs =
    (paused ? session.pausedAt : now) - session.startedAt - session.pausedTotalMs;

  const updateSession = (patch) => {
    setSession((prev) => saveSession({ ...prev, ...patch }));
  };

  const togglePause = () => {
    if (paused) {
      updateSession({
        pausedAt: null,
        pausedTotalMs: session.pausedTotalMs + (Date.now() - session.pausedAt),
      });
    } else {
      updateSession({ pausedAt: Date.now() });
    }
  };

  const toggleDone = (itemId) => {
    const done = session.completedItemIds.includes(itemId);
    updateSession({
      completedItemIds: done
        ? session.completedItemIds.filter((id) => id !== itemId)
        : [...session.completedItemIds, itemId],
    });
  };

  // Coach notes are written straight onto the saved plan.
  const updateNotes = (itemId, notes) => {
    setPlan((prev) => {
      const next = {
        ...prev,
        items: prev.items.map((it) =>
          it.id === itemId ? { ...it, notes } : it
        ),
      };
      savePlan(next);
      return next;
    });
  };

  const finishPractice = () => {
    if (!window.confirm("End practice? Notes stay saved on the plan.")) return;
    clearSession();
    navigate("/plans");
  };

  const doneCount = useMemo(
    () =>
      plan
        ? plan.items.filter((it) => session.completedItemIds.includes(it.id))
            .length
        : 0,
    [plan, session.completedItemIds]
  );

  if (!plan) {
    return (
      <div className="page">
        <p className="empty-state">
          Plan not found. <Link to="/plans">Back to saved plans</Link>
        </p>
      </div>
    );
  }

  const progress = plan.items.length
    ? Math.round((doneCount / plan.items.length) * 100)
    : 0;
  // Index of the first unfinished drill = what the team should be doing now.
  const currentIndex = plan.items.findIndex(
    (it) => !session.completedItemIds.includes(it.id)
  );

  return (
    <div className="page practice-page">
      <div className="practice-topbar card">
        <div className="practice-title">
          <h1>{plan.name}</h1>
          <span className="plan-card-meta">
            {plan.items.length} drills · {planTotalMinutes(plan)} min planned
          </span>
        </div>
        <div className="practice-clock">
          <span className={`elapsed ${paused ? "elapsed-paused" : ""}`}>
            {fmtClock(elapsedMs)}
          </span>
          <button className="btn btn-ghost" onClick={togglePause}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button className="btn btn-danger-ghost" onClick={finishPractice}>
            End Practice
          </button>
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-label">
          {doneCount}/{plan.items.length} drills done
        </span>
      </div>

      <div className="practice-grid">
        <div className="practice-drills">
          {plan.items.map((item, index) => {
            const done = session.completedItemIds.includes(item.id);
            const isCurrent = index === currentIndex;
            return (
              <div
                key={item.id}
                className={`card practice-item ${done ? "done" : ""} ${
                  isCurrent ? "current" : ""
                }`}
              >
                <label className="practice-item-check">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleDone(item.id)}
                  />
                </label>
                <div className="practice-item-main">
                  <div className="practice-item-head">
                    <span className="practice-item-name">
                      {index + 1}. {item.name}
                    </span>
                    <span className="chip">{item.minutes} min</span>
                    {isCurrent && <span className="chip chip-now">NOW</span>}
                  </div>
                  {item.description && (
                    <details className="practice-item-details">
                      <summary>Drill description</summary>
                      <p className="practice-item-desc">{item.description}</p>
                    </details>
                  )}
                  <textarea
                    className="coach-notes"
                    rows="2"
                    placeholder="Coach notes (saved with the plan)..."
                    value={item.notes || ""}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="practice-tools">
          <FlexTimer />
          <Scoreboard
            score={session.score}
            onChange={(score) => updateSession({ score })}
          />
        </div>
      </div>
    </div>
  );
};

export default Practice;
