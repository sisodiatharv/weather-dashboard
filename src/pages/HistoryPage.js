import React, { useState } from "react";
import useHistoricalWeather from "../hooks/useHistoricalWeather";
import HistoricalCharts from "../components/charts/HistoricalCharts";
import ErrorBanner from "../components/layout/ErrorBanner";
import SectionTitle from "../components/layout/SectionTitle";
import { todayStr, daysAgo, yearsBeforeDate } from "../utils/helpers";
import "./HistoryPage.css";

export default function HistoryPage({ lat, lon }) {
  const [startDate, setStartDate] = useState(daysAgo(30));
  const [endDate, setEndDate] = useState(todayStr());
  const { data, aqDaily, loading, error, fetch } = useHistoricalWeather();

  const minStart = yearsBeforeDate(endDate, 2);

  const daysDiff = Math.round(
    (new Date(endDate) - new Date(startDate)) / 86_400_000
  );

  const handleFetch = () => {
    fetch(lat, lon, startDate, endDate);
  };

  const handleStartChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
  };

  const handleEndChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    // ensure start is within 2-year window of new end
    const newMin = yearsBeforeDate(val, 2);
    if (startDate < newMin) setStartDate(newMin);
  };

  return (
    <div className="history-page fade-in-up">
      {/* Range selector */}
      <div className="range-card">
        <div className="range-card__fields">
          <div className="range-field">
            <label className="range-field__label">Start Date</label>
            <input
              type="date"
              className="date-input"
              value={startDate}
              min={minStart}
              max={endDate}
              onChange={handleStartChange}
            />
          </div>
          <div className="range-field__arrow">→</div>
          <div className="range-field">
            <label className="range-field__label">End Date</label>
            <input
              type="date"
              className="date-input"
              value={endDate}
              min={startDate}
              max={todayStr()}
              onChange={handleEndChange}
            />
          </div>
          <div className="range-card__meta">
            <span className="range-days">{daysDiff} days selected</span>
            <span className="range-limit">Max: 2 years</span>
          </div>
        </div>
        <button
          className="fetch-btn"
          onClick={handleFetch}
          disabled={loading || !lat || daysDiff < 1 || daysDiff > 730}
        >
          {loading ? (
            <span className="fetch-btn__loading">
              <span className="fetch-btn__spinner" />
              Loading…
            </span>
          ) : (
            "Fetch Historical Data"
          )}
        </button>
      </div>

      <ErrorBanner message={error} />

      {/* Empty state */}
      {!data && !loading && (
        <div className="history-page__empty">
          <div className="history-page__empty-icon">📆</div>
          <div className="history-page__empty-title">
            Select a date range to explore historical weather
          </div>
          <div className="history-page__empty-sub">
            Up to 2 years of daily data — temperature, precipitation, wind,
            sunrise/sunset, and air quality
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="history-page__loading">
          <div className="history-page__spinner" />
          <div>Fetching {daysDiff} days of data…</div>
        </div>
      )}

      {/* Charts */}
      {data && !loading && (
        <>
          <SectionTitle>
            Historical Data — {startDate} to {endDate}
          </SectionTitle>
          <p className="history-page__hint">
            🖱️ Scroll to zoom · Drag to pan · Use Reset Zoom on each chart
          </p>
          <HistoricalCharts daily={data.daily} aqDaily={aqDaily} />
        </>
      )}
    </div>
  );
}
