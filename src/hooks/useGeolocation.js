import { useState, useEffect } from "react";
import { reverseGeocode } from "../utils/api";

export default function useGeolocation() {
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    name: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: 28.6139,
        lon: 77.209,
        name: "New Delhi (default)",
        loading: false,
        error: "Geolocation not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const name = await reverseGeocode(lat, lon);
        setLocation({ lat, lon, name, loading: false, error: null });
      },
      (err) => {
        setLocation({
          lat: 28.6139,
          lon: 77.209,
          name: "New Delhi (fallback)",
          loading: false,
          error: `${err.message} — using default location.`,
        });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  return location;
}
