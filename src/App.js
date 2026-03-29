import React, { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TodayPage from "./pages/TodayPage";
import HistoryPage from "./pages/HistoryPage";
import useGeolocation from "./hooks/useGeolocation";
import "./App.css";

function GpsLoader() {
  return (
    <div className="gps-loader">
      <div className="gps-loader__spinner" />
      <div className="gps-loader__text">Detecting your location…</div>
      <div className="gps-loader__sub">
        Please allow location access when prompted
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("today");
  const { lat, lon, name, loading: gpsLoading, error: gpsError } = useGeolocation();

  if (gpsLoading) return <GpsLoader />;

  return (
    <div className="app">
      <Navbar tab={tab} setTab={setTab} locationName={name} />

      {gpsError && (
        <div className="app__gps-warn">
          📍 {gpsError}
        </div>
      )}

      <main className="app__main">
        {tab === "today" && <TodayPage lat={lat} lon={lon} />}
        {tab === "history" && <HistoryPage lat={lat} lon={lon} />}
      </main>
    </div>
  );
}
