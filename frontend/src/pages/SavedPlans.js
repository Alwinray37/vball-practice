import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getPlans,
  getSession,
  deletePlan,
  duplicatePlan,
  planTotalMinutes,
} from "../data/storage";

// Saved practice plans: reuse, edit, duplicate, or start one.
const SavedPlans = () => {
  const [plans, setPlans] = useState(getPlans);
  const navigate = useNavigate();

  const handleDelete = (plan) => {
    if (window.confirm(`Delete plan "${plan.name}"?`)) {
      setPlans(deletePlan(plan.id));
    }
  };

  const handleDuplicate = (plan) => {
    duplicatePlan(plan.id);
    setPlans(getPlans());
  };

  const handleStart = (plan) => {
    const activeSession = getSession();
    if (
      activeSession &&
      activeSession.planId !== plan.id &&
      !window.confirm("Replace the current active practice with this plan?")
    ) {
      return;
    }
    navigate(`/practice/${plan.id}`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Saved Plans</h1>
        <Link to="/" className="btn btn-primary">
          + New Plan
        </Link>
      </div>

      {plans.length === 0 && (
        <p className="empty-state">
          No saved plans yet. Build one in the <Link to="/">Plan Builder</Link>{" "}
          and hit Save.
        </p>
      )}

      <div className="plan-list">
        {plans.map((plan) => (
          <div className="card plan-card" key={plan.id}>
            <div className="plan-card-info">
              <h3>{plan.name}</h3>
              <p className="plan-card-meta">
                {plan.date} · {plan.items.length} drills ·{" "}
                {planTotalMinutes(plan)} min
              </p>
              <p className="plan-card-drills">
                {plan.items.map((it) => it.name).join(" → ")}
              </p>
            </div>
            <div className="plan-card-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleStart(plan)}
              >
                <i className="fa-solid fa-play" /> Start
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate(`/builder/${plan.id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => handleDuplicate(plan)}
              >
                Duplicate
              </button>
              <button
                className="btn btn-danger-ghost"
                onClick={() => handleDelete(plan)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPlans;
