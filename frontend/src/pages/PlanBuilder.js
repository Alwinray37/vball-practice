import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DrillCard from "../components/DrillCard";
import DrillForm from "../components/DrillForm";
import { CATEGORIES } from "../data/seedDrills";
import {
  getDrills,
  saveDrill,
  getPlan,
  getSession,
  savePlan,
  planTotalMinutes,
  uid,
} from "../data/storage";

const todayISO = () => new Date().toISOString().slice(0, 10);

// Build a practice plan from the drill library. With a :planId param it
// edits an existing saved plan.
const PlanBuilder = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [drills, setDrills] = useState(getDrills);
  const [plan, setPlan] = useState(() => {
    const existing = planId ? getPlan(planId) : null;
    return (
      existing || { id: undefined, name: "", date: todayISO(), items: [] }
    );
  });
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [addingDrill, setAddingDrill] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const visibleDrills = drills.filter(
    (d) =>
      (category === "all" || d.category === category) &&
      (search === "" || d.name.toLowerCase().includes(search.toLowerCase()))
  );

  const addItem = (drill) => {
    if (plan.items.some((item) => item.drillId === drill.id)) return;

    setPlan((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: uid(),
          drillId: drill.id,
          name: drill.name,
          description: drill.description,
          minutes: drill.defaultMinutes || 10,
          notes: "",
        },
      ],
    }));
  };

  const updateItem = (id, patch) => {
    setPlan({
      ...plan,
      items: plan.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  };

  const removeItem = (id) => {
    setPlan({ ...plan, items: plan.items.filter((it) => it.id !== id) });
  };

  const moveItem = (index, delta) => {
    const items = [...plan.items];
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    setPlan({ ...plan, items });
  };

  const handleSavePlan = () => {
    if (plan.items.length === 0) {
      setSaveMessage("Add a drill first");
      setTimeout(() => setSaveMessage(""), 2000);
      return null;
    }

    const name = plan.name.trim() || `Practice ${plan.date}`;
    const saved = savePlan({ ...plan, name });
    setPlan(saved);
    setSaveMessage("Saved");
    setTimeout(() => setSaveMessage(""), 2000);
    return saved;
  };

  const handleStartPractice = () => {
    const activeSession = getSession();
    if (
      activeSession &&
      activeSession.planId !== plan.id &&
      !window.confirm("Replace the current active practice with this plan?")
    ) {
      return;
    }

    const saved = handleSavePlan();
    if (!saved) return;
    navigate(`/practice/${saved.id}`);
  };

  // Custom drill created inline gets saved to the global library AND
  // added to the current plan.
  const handleNewDrill = (drill) => {
    const next = saveDrill(drill);
    setDrills(next);
    const created = next[next.length - 1];
    addItem(created);
    setAddingDrill(false);
  };

  const total = planTotalMinutes(plan);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{planId ? "Edit Plan" : "Plan Builder"}</h1>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleSavePlan}>
            {saveMessage || "Save Plan"}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleStartPractice}
            disabled={plan.items.length === 0}
          >
            <i className="fa-solid fa-play" /> Start Practice
          </button>
        </div>
      </div>

      <div className="card plan-meta">
        <label>
          Plan name
          <input
            type="text"
            value={plan.name}
            placeholder={`Practice ${plan.date}`}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={plan.date}
            onChange={(e) => setPlan({ ...plan, date: e.target.value })}
          />
        </label>
        <div className="plan-total">
          <span className="plan-total-num">{total}</span> min total
        </div>
      </div>

      <div className="card plan-items">
        <h2>Plan ({plan.items.length} drills)</h2>
        {plan.items.length === 0 && (
          <p className="empty-state">
            Pick drills below to build your practice.
          </p>
        )}
        {plan.items.map((item, index) => (
          <div className="plan-item" key={item.id}>
            <div className="plan-item-order">
              <button
                className="btn-icon"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <i className="fa-solid fa-chevron-up" />
              </button>
              <span className="plan-item-index">{index + 1}</span>
              <button
                className="btn-icon"
                onClick={() => moveItem(index, 1)}
                disabled={index === plan.items.length - 1}
                aria-label="Move down"
              >
                <i className="fa-solid fa-chevron-down" />
              </button>
            </div>
            <div className="plan-item-main">
              <div className="plan-item-title">{item.name}</div>
              <input
                type="text"
                className="plan-item-notes"
                placeholder="Notes for this drill (focus points, groups...)"
                value={item.notes}
                onChange={(e) => updateItem(item.id, { notes: e.target.value })}
              />
            </div>
            <div className="plan-item-side">
              <input
                type="number"
                min="1"
                max="180"
                className="plan-item-minutes"
                value={item.minutes}
                onChange={(e) =>
                  updateItem(item.id, { minutes: Number(e.target.value) })
                }
              />
              <span className="plan-item-min-label">min</span>
              <button
                className="btn-icon btn-remove"
                onClick={() => removeItem(item.id)}
                aria-label="Remove"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="page-header">
        <h2>Drill Library</h2>
        <button className="btn btn-ghost" onClick={() => setAddingDrill(true)}>
          + New Drill
        </button>
      </div>
      <div className="toolbar">
        <div className="tabs">
          <button
            className={`tab ${category === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`tab ${category === c.id ? "active" : ""}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="search-input"
          placeholder="Search drills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="card-grid">
        {visibleDrills.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            onAdd={addItem}
            added={plan.items.some((item) => item.drillId === drill.id)}
          />
        ))}
      </div>

      {addingDrill && (
        <DrillForm
          onSave={handleNewDrill}
          onCancel={() => setAddingDrill(false)}
        />
      )}
    </div>
  );
};

export default PlanBuilder;
