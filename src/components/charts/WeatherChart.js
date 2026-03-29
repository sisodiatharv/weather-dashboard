import React, { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "./WeatherChart.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

export default function WeatherChart({
  labels = [],
  datasets = [],
  type = "line",
  height = 200,
  minWidth = 600,
  yTickFormatter,
  tooltipFormatter,
  title,
  subtitle,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy tracked instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Destroy any stale Chart.js instance attached to this canvas
    // (needed in React Strict Mode which double-invokes effects)
    const existingChart = Chart.getChart(canvasRef.current);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 380 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: datasets.length > 1,
            labels: {
              color: "#94a3b8",
              font: { family: "Space Grotesk", size: 11 },
              boxWidth: 12,
              padding: 16,
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            },
            pan: { enabled: true, mode: "x" },
          },
          tooltip: {
            backgroundColor: "rgba(13,22,37,0.97)",
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            titleColor: "#e2e8f0",
            bodyColor: "#94a3b8",
            titleFont: { family: "Syne", size: 12, weight: "700" },
            bodyFont: { family: "Space Grotesk", size: 11 },
            padding: 12,
            callbacks: tooltipFormatter
              ? { label: tooltipFormatter }
              : undefined,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#64748b",
              font: { family: "Space Grotesk", size: 10 },
              maxRotation: 0,
              maxTicksLimit: 14,
            },
            grid: { color: "rgba(255,255,255,0.04)" },
          },
          y: {
            ticks: {
              color: "#64748b",
              font: { family: "Space Grotesk", size: 10 },
              callback: yTickFormatter,
            },
            grid: { color: "rgba(255,255,255,0.04)" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels, datasets, type]);

  const resetZoom = () => {
    if (chartRef.current) chartRef.current.resetZoom();
  };

  return (
    <div className="weather-chart">
      {(title || subtitle) && (
        <div className="weather-chart__header">
          {title && <div className="weather-chart__title">{title}</div>}
          {subtitle && (
            <div className="weather-chart__subtitle">{subtitle}</div>
          )}
        </div>
      )}
      <div className="weather-chart__scroll">
        <div
          className="weather-chart__inner"
          style={{ minWidth, height }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
      <button className="weather-chart__reset" onClick={resetZoom}>
        Reset Zoom
      </button>
    </div>
  );
}
