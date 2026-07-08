import React from "react";
import { youtubeEmbedUrl } from "../data/storage";

const DrillCard = ({ drill, onAdd, onEdit, onDelete }) => {
  const embed = youtubeEmbedUrl(drill.video);
  return (
    <div className="drill-card">
      <div className="drill-card-media">
        {embed ? (
          <iframe
            src={embed}
            title={drill.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : drill.image ? (
          <img src={drill.image} alt={drill.name} loading="lazy" />
        ) : (
          <div className="drill-card-placeholder">
            <i className="fa-solid fa-volleyball" />
          </div>
        )}
      </div>
      <div className="drill-card-body">
        <h3>{drill.name}</h3>
        <p>{drill.description}</p>
      </div>
      <div className="drill-card-actions">
        {onAdd && (
          <button className="btn btn-primary" onClick={() => onAdd(drill)}>
            + Add to Plan
          </button>
        )}
        {onEdit && (
          <button className="btn btn-ghost" onClick={() => onEdit(drill)}>
            Edit
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger-ghost" onClick={() => onDelete(drill)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DrillCard;
