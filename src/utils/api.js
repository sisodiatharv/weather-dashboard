const BASE = "https://api.open-meteo.com/v1";
const ARCHIVE = "https://archive-api.open-meteo.com/v1";
const AQ_BASE = "https://air-quality-api.open-meteo.com/v1";

async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

/** Page 1 – current day weather (supports past dates too) */
export async function fetchDayWeather(lat, lon, date) {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,windspeed_10m_max,uv_index_max,precipitation_probability_max",
    hourly:
      "temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m",
    current_weather: "true",
    timezone: "auto",
    start_date: date,
    end_date: date,
  });
  return safeFetch(`${BASE}/forecast?${p}`);
}

/** Page 1 – air quality for a single day */
export async function fetchDayAQ(lat, lon, date) {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly:
      "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,us_aqi",
    timezone: "auto",
    start_date: date,
    end_date: date,
  });
  return safeFetch(`${AQ_BASE}/air-quality?${p}`);
}

/** Page 2 – historical daily weather (archive API, up to 2 years) */
export async function fetchHistoricalWeather(lat, lon, start, end) {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily:
      "temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant",
    timezone: "auto",
    start_date: start,
    end_date: end,
  });
  return safeFetch(`${ARCHIVE}/archive?${p}`);
}

/** Page 2 – historical hourly AQ (then aggregated client-side to daily) */
export async function fetchHistoricalAQ(lat, lon, start, end) {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: "pm10,pm2_5",
    timezone: "auto",
    start_date: start,
    end_date: end,
  });
  try {
    return await safeFetch(`${AQ_BASE}/air-quality?${p}`);
  } catch {
    return null; // AQ not always available – silently fail
  }
}

/** Reverse geocode using Nominatim */
export async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const d = await r.json();
    return (
      d.address?.city ||
      d.address?.town ||
      d.address?.village ||
      d.display_name?.split(",")[0] ||
      `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`
    );
  } catch {
    return `${Number(lat).toFixed(2)}°N, ${Number(lon).toFixed(2)}°E`;
  }
}
