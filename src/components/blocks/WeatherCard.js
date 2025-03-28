import { useEffect, useState } from "react";
import './WeatherCard.css'

export default function SplitWeatherCard() {
  const [weatherToday, setWeatherToday] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Datum i vrijeme – osvježava se svake sekunde
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const lat = 43.5081; // Split
      const lon = 16.4402;

      const response = await fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "SailorsFeast/1.0 (info@sailorsfeast.com)",
          },
        }
      );

      const data = await response.json();
      const timeseries = data.properties.timeseries;

      const now = new Date();
      const currentHour = now.toISOString().split(":")[0] + ":00:00"; // format: 2025-03-28T12:00:00

      // Nađi prvi unos za današnji dan koji odgovara satu
      const today = now.toISOString().split("T")[0];
      const todayData = timeseries.find((entry) => entry.time.includes(today) && entry.time.includes(currentHour));

      if (todayData) {
        const details = todayData.data.instant.details;
        const symbol = todayData.data.next_1_hours?.summary?.symbol_code || "clearsky_day";
        setWeatherToday({
          temperature: details.air_temperature,
          wind: details.wind_speed,
          humidity: details.relative_humidity,
          pressure: details.air_pressure_at_sea_level,
          symbol,
        });
      } else {
        throw new Error("Could not retrieve today's weather.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="weather-card">
      <h5>🌍 Split, Croatia</h5>
      <p>
        {currentTime.toLocaleDateString("en-GB")} • {currentTime.toLocaleTimeString("en-GB")}
      </p>

      {error && <p className="text-red-500">{error}</p>}

      {weatherToday ? (
        <div style={{ marginTop: "0.5rem" }}>
          <img
            src={`https://api.met.no/images/weathericons/png/${weatherToday.symbol}.png`}
            alt={weatherToday.symbol}
            style={{ width: "48px", height: "48px" }}
          />
          <p>🌡️ {weatherToday.temperature}°C</p>
          <p>💨 Wind: {weatherToday.wind} m/s</p>
          <p>💧 Humidity: {weatherToday.humidity}%</p>
          <p>🌊 Sea Temp: ~19°C</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
