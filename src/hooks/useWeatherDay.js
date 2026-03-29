import { useState, useEffect, useCallback } from "react";
import { fetchDayWeather, fetchDayAQ } from "../utils/api";

export default function useWeatherDay(lat, lon, date) {
  const [state, setState] = useState({
    wx: null,
    aq: null,
    loading: false,
    error: null,
  });

  const load = useCallback(async () => {
    if (!lat || !lon || !date) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    const t0 = performance.now();
    try {
      const [wx, aq] = await Promise.all([
        fetchDayWeather(lat, lon, date),
        fetchDayAQ(lat, lon, date),
      ]);
      const elapsed = performance.now() - t0;
      console.log(`[Weather] Loaded in ${elapsed.toFixed(0)}ms`);
      setState({ wx, aq, loading: false, error: null });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, [lat, lon, date]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
