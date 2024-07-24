// src/components/PracticePlan.js
import React from 'react';
import './PracticePlan.css';

const PracticePlan = ({ practicePlan, removeDrillFromPlan }) => {
  return (
    <table className="practice-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Drill Name</th>
          <th>Description</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {practicePlan.map((drill, index) => (
          <tr key={index}>
            <td contentEditable="true" suppressContentEditableWarning={true}>
              {drill.time}
            </td>
            <td>{drill.name}</td>
            <td>{drill.description}</td>
            <td contentEditable="true" suppressContentEditableWarning={true} class="notes-cell">
              {drill.notes}
            </td>
            <td>
              <button
                className="remove-button"
                onClick={() => removeDrillFromPlan(index)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PracticePlan;
