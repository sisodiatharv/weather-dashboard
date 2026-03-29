import React from "react";
import "./StatCard.css";

export default function StatCard({
  icon,
  label,
  value,
  unit,
  sub,
  loading,
  valueClass,
  wide,
  children,
}) {
  return (
    <div className={`stat-card fade-in-up ${wide ? "stat-card--wide" : ""}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__label">{label}</div>

      {loading ? (
        <>
          <div className="stat-card__skeleton stat-card__skeleton--val" />
          <div className="stat-card__skeleton stat-card__skeleton--sub" />
        </>
      ) : (
        <>
          {children ? (
            children
          ) : (
            <div className={`stat-card__value ${valueClass || ""}`}>
              {value}
              {unit && <span className="stat-card__unit"> {unit}</span>}
            </div>
          )}
          {sub && <div className="stat-card__sub">{sub}</div>}
        </>
      )}
    </div>
  );
}
