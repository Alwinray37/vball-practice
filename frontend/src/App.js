// src/App.js
import React, { useState } from "react";
import DrillCard from "./components/DrillCard";
import PracticePlan from "./components/PracticePlan";
import { warmUpDrills, skillDrills, gameDrills } from "./drills";
import "./index.css";

function App() {
  const [practicePlan, setPracticePlan] = useState([]);
  const [customDrill, setCustomDrill] = useState({
    name: "",
    description: "",
    image: "",
    time: "",
  });
  const [selectedDrillType, setSelectedDrillType] = useState("warmUp");

  const addDrillToPlan = (drill) => {
    setPracticePlan([...practicePlan, { ...drill, time: "", notes: "" }]);
  };

  const removeDrillFromPlan = (index) => {
    const newPlan = [...practicePlan];
    newPlan.splice(index, 1);
    setPracticePlan(newPlan);
  };

  const handleCustomDrillChange = (e) => {
    const { name, value } = e.target;
    setCustomDrill({ ...customDrill, [name]: value });
  };

  const handleAddCustomDrill = () => {
    addDrillToPlan(customDrill);
    setCustomDrill({ name: "", description: "", image: "", time: "" });
  };

  const renderDrills = () => {
    switch (selectedDrillType) {
      case "warmUp":
        return warmUpDrills;
      case "skill":
        return skillDrills;
      case "game":
        return gameDrills;
      default:
        return [];
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Volleyball Practice Plan</h1>
      </header>
      <div id="practice-plan-container">
        <h2>Practice Plan</h2>
        <PracticePlan
          practicePlan={practicePlan}
          removeDrillFromPlan={removeDrillFromPlan}
        />
      </div>
      <div className="add-drill-form">
        <h3>Add Your Own Drill</h3>
        <input
          type="text"
          name="name"
          placeholder="Drill Name"
          value={customDrill.name}
          onChange={handleCustomDrillChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={customDrill.description}
          onChange={handleCustomDrillChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={customDrill.image}
          onChange={handleCustomDrillChange}
        />
        <input
          type="text"
          name="time"
          placeholder="Time (e.g., 10 minutes)"
          value={customDrill.time}
          onChange={handleCustomDrillChange}
        />
        <button className="add-button" onClick={handleAddCustomDrill}>
          Add Drill
        </button>
      </div>
      <div className="tabs">
        <button
          className={`tab ${selectedDrillType === "warmUp" ? "active" : ""}`}
          onClick={() => setSelectedDrillType("warmUp")}
        >
          Warm-Up Drills
        </button>
        <button
          className={`tab ${selectedDrillType === "skill" ? "active" : ""}`}
          onClick={() => setSelectedDrillType("skill")}
        >
          Skill Drills
        </button>
        <button
          className={`tab ${selectedDrillType === "game" ? "active" : ""}`}
          onClick={() => setSelectedDrillType("game")}
        >
          Game Drills
        </button>
      </div>
      <div id="drillCard-container">
        {renderDrills().map((drill, index) => (
          <DrillCard key={index} drill={drill} addDrillToPlan={addDrillToPlan} />
        ))}
      </div>
      
    </div>
  );
}

export default App;
