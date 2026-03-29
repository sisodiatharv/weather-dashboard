import React from "react";
import "./Navbar.css";

export default function Navbar({ tab, setTab, locationName }) {
  return (
    <nav className="navbar">
      <span className="navbar-logo">⛅ Aether</span>

      <div className="navbar-tabs">
        <button
          className={`navbar-tab ${tab === "today" ? "active" : ""}`}
          onClick={() => setTab("today")}
        >
          Today
        </button>
        <button
          className={`navbar-tab ${tab === "history" ? "active" : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      <div className="navbar-location">
        <span className="location-pin">📍</span>
        <span>{locationName || "Detecting…"}</span>
      </div>
    </nav>
  );
}
