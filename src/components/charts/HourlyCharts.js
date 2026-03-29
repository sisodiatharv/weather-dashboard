import React, { useState } from "react";
import WeatherChart from "./WeatherChart";
import { cToF } from "../../utils/helpers";
import "./HourlyCharts.css";

const lineDs = (label, data, color, fill = true) => ({
  label,
  data,
  borderColor: color + "1)",
  backgroundColor: color + (fill ? "0.12)" : "0)"),
  fill,
  tension: 0.4,
  pointRadius: 2,
  pointHoverRadius: 5,
  borderWidth: 2,
});

const barDs = (label, data, color) => ({
  label,
  data,
  backgroundColor: color + "0.75)",
  borderColor: color + "1)",
  borderWidth: 1,
  borderRadius: 4,
  borderSkipped: false,
});

export default function HourlyCharts({ hourly, aqHourly }) {
  const [tempUnit, setTempUnit] = useState("C");

  if (!hourly) return null;

  const hours = hourly.time.map((t) => t.slice(11, 16));
  const aqHours = aqHourly?.time?.map((t) => t.slice(11, 16)) || hours;

  const tempData =
    tempUnit === "C"
      ? hourly.temperature_2m
      : hourly.temperature_2m.map((v) =>
          v !== null ? parseFloat(cToF(v)) : null
        );

  return (
    <div className="hourly-charts">
      {/* Temperature */}
      <div className="hourly-chart-card">
        <div className="hourly-chart-card__header">
          <div>
            <div className="hourly-chart-card__title">🌡️ Temperature</div>
            <div className="hourly-chart-card__subtitle">
              Hourly temperature (°{tempUnit})
            </div>
          </div>
          <div className="temp-toggle">
            <button
              className={`temp-toggle__btn ${tempUnit === "C" ? "active" : ""}`}
              onClick={() => setTempUnit("C")}
            >
              °C
            </button>
            <button
              className={`temp-toggle__btn ${tempUnit === "F" ? "active" : ""}`}
              onClick={() => setTempUnit("F")}
            >
              °F
            </button>
          </div>
        </div>
        <WeatherChart
          labels={hours}
          datasets={[
            lineDs(`Temp (°${tempUnit})`, tempData, "rgba(251,146,60,"),
          ]}
          height={200}
          minWidth={580}
        />
      </div>

      {/* Humidity */}
      <div className="hourly-chart-card">
        <div className="hourly-chart-card__title">💦 Relative Humidity</div>
        <div className="hourly-chart-card__subtitle">
          Hourly relative humidity (%)
        </div>
        <WeatherChart
          labels={hours}
          datasets={[
            lineDs(
              "Humidity (%)",
              hourly.relativehumidity_2m,
              "rgba(56,189,248,"
            ),
          ]}
          height={200}
          minWidth={580}
        />
      </div>

      {/* Precipitation */}
      <div className="hourly-chart-card">
        <div className="hourly-chart-card__title">🌧️ Precipitation</div>
        <div className="hourly-chart-card__subtitle">
          Hourly precipitation (mm)
        </div>
        <WeatherChart
          labels={hours}
          datasets={[
            barDs("Precip (mm)", hourly.precipitation, "rgba(129,140,248,"),
          ]}
          type="bar"
          height={200}
          minWidth={580}
        />
      </div>

      {/* Visibility */}
      <div className="hourly-chart-card">
        <div className="hourly-chart-card__title">👁️ Visibility</div>
        <div className="hourly-chart-card__subtitle">
          Hourly visibility (km)
        </div>
        <WeatherChart
          labels={hours}
          datasets={[
            lineDs(
              "Visibility (km)",
              hourly.visibility.map((v) =>
                v !== null ? parseFloat((v / 1000).toFixed(2)) : null
              ),
              "rgba(52,211,153,"
            ),
          ]}
          height={200}
          minWidth={580}
        />
      </div>

      {/* Wind Speed */}
      <div className="hourly-chart-card">
        <div className="hourly-chart-card__title">💨 Wind Speed (10m)</div>
        <div className="hourly-chart-card__subtitle">
          Hourly wind speed (km/h)
        </div>
        <WeatherChart
          labels={hours}
          datasets={[
            lineDs(
              "Wind Speed (km/h)",
              hourly.windspeed_10m,
              "rgba(45,212,191,"
            ),
          ]}
          height={200}
          minWidth={580}
        />
      </div>

      {/* PM10 + PM2.5 combined */}
      {aqHourly && (
        <div className="hourly-chart-card">
          <div className="hourly-chart-card__title">🟤 PM10 & PM2.5</div>
          <div className="hourly-chart-card__subtitle">
            Hourly particulate matter (μg/m³)
          </div>
          <WeatherChart
            labels={aqHours}
            datasets={[
              {
                ...lineDs(
                  "PM10 (μg/m³)",
                  aqHourly.pm10,
                  "rgba(251,146,60,",
                  false
                ),
              },
              {
                ...lineDs(
                  "PM2.5 (μg/m³)",
                  aqHourly.pm2_5,
                  "rgba(248,113,113,",
                  false
                ),
              },
            ]}
            height={200}
            minWidth={580}
          />
        </div>
      )}
    </div>
  );
}
