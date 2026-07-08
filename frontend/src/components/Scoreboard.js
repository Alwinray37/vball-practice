import React from "react";

// Two-team scoreboard for game drills (Queens, USA, Tug-of-War...).
// State lives in the parent so it survives across the practice session.
// score.serving marks who scored last (= who serves next); it persists
// until the other side scores.
const Scoreboard = ({
  score,
  onChange,
  title = "Scoreboard",
  compact = false,
  onClose,
}) => {
  const bump = (team, delta) => {
    const next = { ...score, [team]: Math.max(0, score[team] + delta) };
    if (delta > 0) next.serving = team;
    onChange(next);
  };

  const swapSides = () =>
    onChange({
      a: score.b,
      b: score.a,
      nameA: score.nameB,
      nameB: score.nameA,
      serving:
        score.serving === "a" ? "b" : score.serving === "b" ? "a" : null,
    });

  const resetScore = () => onChange({ ...score, a: 0, b: 0, serving: null });

  const setName = (key) => (e) => onChange({ ...score, [key]: e.target.value });

  return (
    <div className={`card tool-card scoreboard-card ${compact ? "compact" : ""}`}>
      <div className="tool-card-header">
        <h3>{title}</h3>
        <div className="header-actions">
          <button className="btn-icon" title="Swap sides" onClick={swapSides}>
            <i className="fa-solid fa-right-left" />
          </button>
          <button className="btn-icon" title="Reset score" onClick={resetScore}>
            <i className="fa-solid fa-arrows-rotate" />
          </button>
          {onClose && (
            <button className="btn-icon" title="Close" onClick={onClose}>
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
      </div>
      <div className="scoreboard">
        {[
          { key: "a", nameKey: "nameA" },
          { key: "b", nameKey: "nameB" },
        ].map(({ key, nameKey }) => (
          <div className={`score-side score-${key}`} key={key}>
            <input
              type="text"
              className="score-name"
              value={score[nameKey]}
              onChange={setName(nameKey)}
              aria-label="Team name"
            />
            <button
              className={`score-value ${
                score.serving === key ? "score-serving" : ""
              }`}
              onClick={() => bump(key, 1)}
              title="Tap to add a point"
            >
              {score.serving === key && (
                <i className="fa-solid fa-volleyball serving-icon" title="Serving" />
              )}
              {score[key]}
            </button>
            <div className="score-buttons">
              <button className="btn-icon" onClick={() => bump(key, -1)}>
                <i className="fa-solid fa-minus" />
              </button>
              <button className="btn-icon" onClick={() => bump(key, 1)}>
                <i className="fa-solid fa-plus" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
