import React from "react";
import WeatherChart from "./WeatherChart";
import { timeToMinutes, minutesToTime, windDirLabel } from "../../utils/helpers";
import "./HistoricalCharts.css";

const lineDs = (label, data, color, fill = false) => ({
  label,
  data,
  borderColor: color + "1)",
  backgroundColor: color + (fill ? "0.1)" : "0)"),
  fill,
  tension: 0.3,
  pointRadius: 0,
  pointHoverRadius: 4,
  borderWidth: 2,
});

const barDs = (label, data, color) => ({
  label,
  data,
  backgroundColor: color + "0.72)",
  borderColor: color + "1)",
  borderWidth: 1,
  borderRadius: 3,
  borderSkipped: false,
});

export default function HistoricalCharts({ daily, aqDaily }) {
  if (!daily) return null;

  const labels = daily.time;
  const minWidth = Math.max(800, labels.length * 4);

  return (
    <div className="historical-charts">
      {/* Temperature: Mean / Max / Min */}
      <div className="hist-chart-card">
        <div className="hist-chart-card__title">🌡️ Temperature — Mean, Max & Min</div>
        <div className="hist-chart-card__subtitle">
          Daily temperature range (°C) — scroll & zoom to explore
        </div>
        <WeatherChart
          labels={labels}
          datasets={[
            lineDs("Mean (°C)", daily.temperature_2m_mean, "rgba(250,204,21,"),
            lineDs("Max (°C)", daily.temperature_2m_max, "rgba(251,146,60,"),
            lineDs("Min (°C)", daily.temperature_2m_min, "rgba(56,189,248,"),
          ]}
          type="line"
          height={260}
          minWidth={minWidth}
        />
      </div>

      {/* Sunrise & Sunset in IST */}
      <div className="hist-chart-card">
        <div className="hist-chart-card__title">🌅 Sunrise & Sunset (IST)</div>
        <div className="hist-chart-card__subtitle">
          Daily sun cycle — plotted as minutes from midnight IST
        </div>
        <WeatherChart
          labels={labels}
          datasets={[
            lineDs(
              "Sunrise",
              daily.sunrise.map((s) => timeToMinutes(s)),
              "rgba(251,146,60,"
            ),
            lineDs(
              "Sunset",
              daily.sunset.map((s) => timeToMinutes(s)),
              "rgba(129,140,248,"
            ),
          ]}
          type="line"
          height={260}
          minWidth={minWidth}
          yTickFormatter={(v) => minutesToTime(v)}
          tooltipFormatter={(ctx) =>
            `${ctx.dataset.label}: ${minutesToTime(ctx.parsed.y)}`
          }
        />
      </div>

      {/* Precipitation */}
      <div className="hist-chart-card">
        <div className="hist-chart-card__title">🌧️ Precipitation</div>
        <div className="hist-chart-card__subtitle">
          Daily total precipitation (mm)
        </div>
        <WeatherChart
          labels={labels}
          datasets={[
            barDs(
              "Precipitation (mm)",
              daily.precipitation_sum,
              "rgba(129,140,248,"
            ),
          ]}
          type="bar"
          height={260}
          minWidth={minWidth}
        />
      </div>

      {/* Wind Speed + Direction */}
      <div className="hist-chart-card">
        <div className="hist-chart-card__title">
          💨 Max Wind Speed & Dominant Direction
        </div>
        <div className="hist-chart-card__subtitle">
          Daily max wind speed (km/h) with compass direction tooltip
        </div>
        <WeatherChart
          labels={labels}
          datasets={[
            lineDs(
              "Max Wind Speed (km/h)",
              daily.windspeed_10m_max,
              "rgba(52,211,153,"
            ),
          ]}
          type="line"
          height={260}
          minWidth={minWidth}
          tooltipFormatter={(ctx) => {
            const idx = ctx.dataIndex;
            const dir = daily.winddirection_10m_dominant?.[idx];
            const dirStr = dir !== null && dir !== undefined ? ` (${windDirLabel(dir)})` : "";
            return `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1)} km/h${dirStr}`;
          }}
        />
      </div>

      {/* PM10 + PM2.5 */}
      {aqDaily && (
        <div className="hist-chart-card">
          <div className="hist-chart-card__title">🟤 PM10 & PM2.5 Daily Average</div>
          <div className="hist-chart-card__subtitle">
            Air quality particulate trends (μg/m³)
          </div>
          <WeatherChart
            labels={aqDaily.time}
            datasets={[
              lineDs("PM10 (μg/m³)", aqDaily.pm10, "rgba(251,146,60,"),
              lineDs("PM2.5 (μg/m³)", aqDaily.pm2_5, "rgba(248,113,113,"),
            ]}
            type="line"
            height={260}
            minWidth={Math.max(800, aqDaily.time.length * 4)}
          />
        </div>
      )}
    </div>
  );
}
