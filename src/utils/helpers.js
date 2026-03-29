/** Format number to fixed decimal places */
export const fmt = (v, dec = 1) =>
  v === null || v === undefined ? "--" : Number(v).toFixed(dec);

/** Celsius to Fahrenheit */
export const cToF = (c) => ((c * 9) / 5 + 32).toFixed(1);

/** Convert ISO datetime string to IST HH:MM */
export const toIST = (isoStr) => {
  if (!isoStr) return "--";
  try {
    return new Date(isoStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return isoStr;
  }
};

/** Convert IST time string to fractional hours for chart plotting */
export const timeToMinutes = (isoStr) => {
  if (!isoStr) return null;
  try {
    const d = new Date(isoStr);
    // Convert to IST
    const ist = new Date(
      d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    return ist.getHours() * 60 + ist.getMinutes();
  } catch {
    return null;
  }
};

export const minutesToTime = (minutes) => {
  if (minutes === null || minutes === undefined) return "--";
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h}:${String(m).padStart(2, "0")}`;
};

/** Today's date as YYYY-MM-DD */
export const todayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

/** Date N days ago */
export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/** Date N years before a given date string */
export const yearsBeforeDate = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
};

/** AQI level label + CSS class */
export const aqiInfo = (val) => {
  if (val === null || val === undefined) return { label: "--", cls: "" };
  if (val <= 50) return { label: "Good", cls: "aqi-good" };
  if (val <= 100) return { label: "Moderate", cls: "aqi-moderate" };
  if (val <= 150) return { label: "Unhealthy (Sensitive)", cls: "aqi-poor" };
  if (val <= 200) return { label: "Unhealthy", cls: "aqi-very-poor" };
  return { label: "Very Unhealthy", cls: "aqi-hazardous" };
};

/** Wind direction degrees → compass label */
export const windDirLabel = (deg) => {
  if (deg === null || deg === undefined) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

/** Aggregate hourly AQ data to daily averages */
export const aggregateAQDaily = (hourlyData) => {
  if (!hourlyData?.hourly) return null;
  const { time, pm10, pm2_5 } = hourlyData.hourly;
  const days = {};
  time.forEach((t, i) => {
    const day = t.slice(0, 10);
    if (!days[day]) days[day] = { pm10: [], pm2_5: [] };
    if (pm10[i] !== null && pm10[i] !== undefined) days[day].pm10.push(pm10[i]);
    if (pm2_5[i] !== null && pm2_5[i] !== undefined)
      days[day].pm2_5.push(pm2_5[i]);
  });
  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  return {
    time: Object.keys(days),
    pm10: Object.values(days).map((d) => avg(d.pm10)),
    pm2_5: Object.values(days).map((d) => avg(d.pm2_5)),
  };
};

/** Current hour index from hourly time array */
export const getCurrentHourIndex = (times) => {
  if (!times?.length) return 0;
  const hr = new Date().getHours();
  const idx = times.findIndex((t) => parseInt(t.slice(11, 13)) === hr);
  return idx >= 0 ? idx : Math.min(hr, times.length - 1);
};

