import React from "react";
import "./AdminStatCard.css";

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          {Icon && <Icon size={21} />}
        </div>

        <span className="admin-stat-live">
          SYSTEM
        </span>
      </div>

      <div className="admin-stat-content">
        <span className="admin-stat-title">
          {title}
        </span>

        <strong className="admin-stat-value">
          {value}
        </strong>

        <span className="admin-stat-description">
          {description}
        </span>
      </div>
    </div>
  );
}