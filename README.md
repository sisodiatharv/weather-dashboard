# ⛅ Aether — Weather Dashboard

A responsive React weather dashboard built with the [Open-Meteo API](https://open-meteo.com) (free, no API key required).

## Features

### Page 1 — Today / Single Date
- Auto-detects browser GPS location on load
- Calendar picker to view any past date
- **Stat cards:** Temperature (current / min / max), Precipitation, Sunrise & Sunset (IST), Max Wind Speed, Relative Humidity, UV Index, Precipitation Probability, AQI
- **Air Quality cards:** PM10, PM2.5, CO, NO₂, SO₂
- **6 Hourly Charts** (with °C / °F toggle on temperature):
  - Temperature
  - Relative Humidity
  - Precipitation (bar)
  - Visibility
  - Wind Speed (10m)
  - PM10 & PM2.5 combined

### Page 2 — Historical (up to 2 years)
- Date range selector (max 2-year window)
- **5 Historical Charts:**
  - Temperature: Mean / Max / Min
  - Sunrise & Sunset (plotted in IST)
  - Precipitation (bar)
  - Max Wind Speed with dominant direction in tooltip
  - PM10 & PM2.5 daily averages

### Chart Features
- Horizontal scroll for dense datasets
- Zoom in / out (mouse wheel + pinch)
- Pan (drag)
- Reset Zoom button per chart
- Fully mobile-responsive

## Tech Stack

| Layer | Library |
|-------|---------|
| UI Framework | React 18 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Zoom/Pan | chartjs-plugin-zoom + hammerjs |
| Weather Data | Open-Meteo (free, no key) |
| Air Quality | Open-Meteo Air Quality API |
| Geocoding | Nominatim (OpenStreetMap) |
| Dates | Native JS Date |
| Styling | Plain CSS with CSS variables |

## Getting Started

### Prerequisites
- Node.js 16+
- npm 8+

### Installation

```bash
# 1. Clone or unzip the project
cd weather-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app opens at **http://localhost:3000**.

### Production Build

```bash
npm run build
```

Output goes to `build/`. Deploy to Netlify, Vercel, or GitHub Pages.

#### Deploy to GitHub Pages
```bash
# Add to package.json:  "homepage": "https://<username>.github.io/<repo>"
npm install --save-dev gh-pages
npm run build
npx gh-pages -d build
```

## Project Structure

```
src/
├── components/
│   ├── cards/
│   │   ├── StatCard.js          # Reusable stat card
│   │   └── StatCard.css
│   ├── charts/
│   │   ├── WeatherChart.js      # Base Chart.js wrapper (zoom/pan)
│   │   ├── WeatherChart.css
│   │   ├── HourlyCharts.js      # All 6 hourly charts (Page 1)
│   │   ├── HourlyCharts.css
│   │   ├── HistoricalCharts.js  # All 5 historical charts (Page 2)
│   │   └── HistoricalCharts.css
│   └── layout/
│       ├── Navbar.js            # Top navigation
│       ├── Navbar.css
│       ├── SectionTitle.js      # Section divider
│       ├── SectionTitle.css
│       ├── ErrorBanner.js       # Error display
│       └── ErrorBanner.css
├── hooks/
│   ├── useGeolocation.js        # Browser GPS + reverse geocode
│   ├── useWeatherDay.js         # Fetch weather + AQ for one day
│   └── useHistoricalWeather.js  # Fetch historical data
├── pages/
│   ├── TodayPage.js             # Page 1
│   ├── TodayPage.css
│   ├── HistoryPage.js           # Page 2
│   └── HistoryPage.css
├── utils/
│   ├── api.js                   # All API calls
│   └── helpers.js               # Formatters, chart config, etc.
├── App.js
├── App.css
├── index.js
└── index.css
```

## Performance

- All data for Page 1 fetched with a single `Promise.all` (weather + AQ in parallel)
- Chart rendering deferred until data arrives
- No unnecessary re-renders (custom hooks with `useCallback`)
- Typical load time: **< 500ms** on good connections

## Notes

- GPS permission prompt appears on first load — allow it for local data
- If denied, defaults to **New Delhi, India**
- Open-Meteo archive API has a ~5-day lag for the most recent dates

## Submission

Per the assignment:
1. Push this repo to GitHub with this README
2. Deploy (Netlify recommended — just drag the `build/` folder)
3. Submit via [the Google Form](https://forms.gle/hncDcKF32CGQkpp69)
