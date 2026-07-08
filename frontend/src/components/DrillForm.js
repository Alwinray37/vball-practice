import React, { useState } from "react";
import { CATEGORIES } from "../data/seedDrills";

const empty = {
  name: "",
  category: "warmUp",
  description: "",
  image: "",
  video: "",
  defaultMinutes: 10,
};

// Add/edit drill form, shown in a modal. Pass `drill` to edit, omit to create.
const DrillForm = ({ drill, onSave, onCancel }) => {
  const [form, setForm] = useState(drill ? { ...empty, ...drill } : empty);

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      name: form.name.trim(),
      defaultMinutes: Number(form.defaultMinutes) || 10,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="modal card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h2>{drill ? "Edit Drill" : "New Drill / Game"}</h2>
        <label>
          Name *
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Butterfly"
            autoFocus
            required
          />
        </label>
        <div className="form-row">
          <label>
            Category
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Default time (min)
            <input
              type="number"
              min="1"
              max="180"
              value={form.defaultMinutes}
              onChange={set("defaultMinutes")}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            rows="4"
            value={form.description}
            onChange={set("description")}
            placeholder="How the drill works, setup, goals..."
          />
        </label>
        <label>
          Image URL
          <input
            type="url"
            value={form.image}
            onChange={set("image")}
            placeholder="https://..."
          />
        </label>
        <label>
          YouTube URL
          <input
            type="url"
            value={form.video}
            onChange={set("video")}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {drill ? "Save Changes" : "Add Drill"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DrillForm;
