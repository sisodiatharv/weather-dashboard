import { useState, useCallback } from "react";
import { fetchHistoricalWeather, fetchHistoricalAQ } from "../utils/api";
import { aggregateAQDaily } from "../utils/helpers";

export default function useHistoricalWeather() {
  const [state, setState] = useState({
    data: null,
    aqDaily: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (lat, lon, start, end) => {
    if (!lat || !lon || !start || !end) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    const t0 = performance.now();
    try {
      const [hist, aqRaw] = await Promise.all([
        fetchHistoricalWeather(lat, lon, start, end),
        fetchHistoricalAQ(lat, lon, start, end),
      ]);
      const elapsed = performance.now() - t0;
      console.log(`[Historical] Loaded in ${elapsed.toFixed(0)}ms`);
      setState({
        data: hist,
        aqDaily: aggregateAQDaily(aqRaw),
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, []);

  return { ...state, fetch: fetchData };
}
