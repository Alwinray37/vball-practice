import React, { useState } from "react";
import DrillCard from "../components/DrillCard";
import DrillForm from "../components/DrillForm";
import { CATEGORIES } from "../data/seedDrills";
import { getDrills, saveDrill, deleteDrill } from "../data/storage";

// Browse, add, edit, and delete drills. Changes are saved globally
// (localStorage) and available in the plan builder.
const DrillLibrary = () => {
  const [drills, setDrills] = useState(getDrills);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | drill object

  const visible = drills.filter(
    (d) =>
      (category === "all" || d.category === category) &&
      (search === "" ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (drill) => {
    setDrills(saveDrill(drill));
    setEditing(null);
  };

  const handleDelete = (drill) => {
    if (window.confirm(`Delete "${drill.name}"? This can't be undone.`)) {
      setDrills(deleteDrill(drill.id));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Drill Library</h1>
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
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
        {visible.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
        {visible.length === 0 && (
          <p className="empty-state">No drills found. Add one!</p>
        )}
      </div>

      {editing && (
        <DrillForm
          drill={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default DrillLibrary;
