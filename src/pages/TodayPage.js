import React, { useState } from "react";
import useWeatherDay from "../hooks/useWeatherDay";
import StatCard from "../components/cards/StatCard";
import SectionTitle from "../components/layout/SectionTitle";
import HourlyCharts from "../components/charts/HourlyCharts";
import ErrorBanner from "../components/layout/ErrorBanner";
import {
  fmt,
  toIST,
  todayStr,
  aqiInfo,
  getCurrentHourIndex,
} from "../utils/helpers";
import "./TodayPage.css";

export default function TodayPage({ lat, lon }) {
  const [date, setDate] = useState(todayStr());
  const { wx, aq, loading, error } = useWeatherDay(lat, lon, date);

  const daily = wx?.daily;
  const hourly = wx?.hourly;
  const aqHourly = aq?.hourly;
  const currentWeather = wx?.current_weather;

  const hourIdx = getCurrentHourIndex(hourly?.time);
  const currentTemp = currentWeather?.temperature ?? hourly?.temperature_2m?.[hourIdx] ?? null;
  const aqi = aqHourly?.us_aqi?.[hourIdx] ?? null;
  const aqInfo = aqiInfo(aqi);

  return (
    <div className="today-page fade-in-up">
      {/* Date bar */}
      <div className="today-page__datebar">
        <label className="today-page__label" htmlFor="date-picker">
          📅 Select Date
        </label>
        <input
          id="date-picker"
          type="date"
          className="date-input"
          value={date}
          max={todayStr()}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="today-btn"
          onClick={() => setDate(todayStr())}
        >
          Today
        </button>
        <span className="today-page__coords">
          {lat && lon
            ? `📍 ${Number(lat).toFixed(3)}°N, ${Number(lon).toFixed(3)}°E`
            : "…"}
        </span>
      </div>

      <ErrorBanner message={error} />

      {/* ── Current Conditions ── */}
      <SectionTitle>Current Conditions</SectionTitle>
      <div className="stat-grid">
        {/* Temperature – wide card */}
        <StatCard icon="🌡️" label="Temperature" loading={loading} wide>
          <div className="temp-main">
            {fmt(currentTemp, 1)}
            <span className="temp-unit">°C</span>
          </div>
          <div className="temp-minmax">
            <span className="temp-max">
              ↑ {fmt(daily?.temperature_2m_max?.[0])}°C
            </span>
            <span className="temp-min">
              ↓ {fmt(daily?.temperature_2m_min?.[0])}°C
            </span>
          </div>
        </StatCard>

        <StatCard
          icon="💧"
          label="Precipitation"
          value={fmt(daily?.precipitation_sum?.[0])}
          unit="mm"
          loading={loading}
        />
        <StatCard
          icon="🌅"
          label="Sunrise"
          value={toIST(daily?.sunrise?.[0])}
          loading={loading}
        />
        <StatCard
          icon="🌇"
          label="Sunset"
          value={toIST(daily?.sunset?.[0])}
          loading={loading}
        />
        <StatCard
          icon="💨"
          label="Max Wind Speed"
          value={fmt(daily?.windspeed_10m_max?.[0])}
          unit="km/h"
          loading={loading}
        />
        <StatCard
          icon="💦"
          label="Humidity"
          value={fmt(hourly?.relativehumidity_2m?.[hourIdx], 0)}
          unit="%"
          loading={loading}
        />
        <StatCard
          icon="☀️"
          label="UV Index"
          value={fmt(daily?.uv_index_max?.[0])}
          loading={loading}
          sub={
            daily?.uv_index_max?.[0] == null
              ? undefined
              : daily.uv_index_max[0] <= 2
              ? "Low"
              : daily.uv_index_max[0] <= 5
              ? "Moderate"
              : daily.uv_index_max[0] <= 7
              ? "High"
              : "Very High"
          }
        />
        <StatCard
          icon="🌧️"
          label="Precip Probability"
          value={fmt(daily?.precipitation_probability_max?.[0], 0)}
          unit="%"
          loading={loading}
        />
        <StatCard
          icon="🌫️"
          label="Air Quality Index"
          loading={loading}
        >
          <div className={`stat-card__value ${aqInfo.cls}`}>
            {aqi !== null ? aqi : "--"}
          </div>
          <div className="stat-card__sub">{aqInfo.label}</div>
        </StatCard>
      </div>

      {/* ── Air Quality ── */}
      <SectionTitle>Air Quality Metrics</SectionTitle>
      <div className="stat-grid">
        <StatCard
          icon="🟤"
          label="PM10"
          value={fmt(aqHourly?.pm10?.[hourIdx])}
          unit="μg/m³"
          loading={loading}
        />
        <StatCard
          icon="🔵"
          label="PM2.5"
          value={fmt(aqHourly?.pm2_5?.[hourIdx])}
          unit="μg/m³"
          loading={loading}
        />
        <StatCard
          icon="⚫"
          label="Carbon Monoxide (CO)"
          value={fmt(aqHourly?.carbon_monoxide?.[hourIdx])}
          unit="μg/m³"
          loading={loading}
        />
        <StatCard
          icon="🔴"
          label="Nitrogen Dioxide (NO₂)"
          value={fmt(aqHourly?.nitrogen_dioxide?.[hourIdx])}
          unit="μg/m³"
          loading={loading}
        />
        <StatCard
          icon="🟡"
          label="Sulphur Dioxide (SO₂)"
          value={fmt(aqHourly?.sulphur_dioxide?.[hourIdx])}
          unit="μg/m³"
          loading={loading}
        />
      </div>

      {/* ── Hourly Charts ── */}
      {!loading && hourly && (
        <>
          <SectionTitle>Hourly Data — {date}</SectionTitle>
          <p className="today-page__chart-hint">
            🖱️ Scroll to zoom · Drag to pan · Double-click to reset
          </p>
          <HourlyCharts hourly={hourly} aqHourly={aqHourly} />
        </>
      )}
    </div>
  );
}
