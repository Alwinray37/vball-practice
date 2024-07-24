// src/components/DrillCard.js
import React from "react";
import PropTypes from "prop-types";
import "./DrillCard.css";

const DrillCard = ({ drill, addDrillToPlan }) => {
  return (
    <div className="drill-card">
      <h3>{drill.name}</h3>
      <p>{drill.description}</p>
      {drill.image && <img src={drill.image} alt={drill.name} className="drill-image" />}
      {drill.video && <div dangerouslySetInnerHTML={{ __html: drill.video }} />}
      <button className="add-button" onClick={() => addDrillToPlan(drill)}>
        Add to Practice Plan
      </button>
    </div>
  );
};

DrillCard.propTypes = {
  drill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    video: PropTypes.string,
  }).isRequired,
  addDrillToPlan: PropTypes.func.isRequired,
};

export default DrillCard;
