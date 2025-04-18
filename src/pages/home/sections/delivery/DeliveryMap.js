import React, { useState, useEffect } from "react";
import DeliveryMapSkeleton from "./DeliveryMapSkeleton";
import './DeliveryMap.css'

const DeliveryMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [weatherToday, setWeatherToday] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Funkcija za upravljanje učitavanjem iframe-a
  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

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
      );

      if (!response.ok) {
        throw new Error(`API greška: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.properties || !data.properties.timeseries || !data.properties.timeseries.length) {
        throw new Error("Nepotpuni podaci od API-ja");
      }
      
      const timeseries = data.properties.timeseries;

      // Pronađi najbliže dostupno vrijeme
      const now = new Date();
      
      // Sortiramo vremenske serije po vremenskoj blizini trenutnom trenutku
      const sortedTimeseries = [...timeseries].sort((a, b) => {
        return Math.abs(new Date(a.time) - now) - Math.abs(new Date(b.time) - now);
      });
      
      // Uzmi najbliži vremenski unos
      const closestTimeEntry = sortedTimeseries[0];
      
      if (closestTimeEntry) {
        const details = closestTimeEntry.data.instant.details;
        
        // Provjerimo ima li podataka za sljedeći sat, ako ne, koristimo fallback
        const symbol = 
          (closestTimeEntry.data.next_1_hours && 
           closestTimeEntry.data.next_1_hours.summary && 
           closestTimeEntry.data.next_1_hours.summary.symbol_code) || 
          "clearsky_day";
        
        setWeatherToday({
          temperature: details.air_temperature,
          wind: details.wind_speed,
          humidity: details.relative_humidity,
          pressure: details.air_pressure_at_sea_level,
          symbol,
        });
      } else {
        throw new Error("Nije moguće dobiti trenutne vremenske podatke.");
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju vremena:", err);
      setError("Nije moguće učitati vremenske podatke. Molimo pokušajte kasnije.");
    }
  };

  useEffect(() => {
    fetchWeather();
    // Dodajemo timer za ponovno dohvaćanje vremena svakih 30 minuta
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  // Funkcija za renderiranje ikone vremena s fallback opcijama
  const renderWeatherIcon = (symbolCode) => {
    try {
      return (
        <img
          src={`https://api.met.no/images/weathericons/png/${symbolCode}.png`}
          alt={symbolCode}
          className="weather-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://api.met.no/images/weathericons/png/clearsky_day.png"; // Fallback ikona
          }}
        />
      );
    } catch (e) {
      return <span className="weather-icon">☀️</span>; // Emoji fallback ako sve ostalo ne uspije
    }
  };

  // Funkcija za SVG ikonu vjetra - elegantnija verzija
  const WindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="weather-icon-svg">
      <defs>
        <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F8FF7" />
          <stop offset="100%" stopColor="#2D6BDB" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#windGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h8.5a2.5 2.5 0 0 0 0-5C11.5 3 11 5 11 5" />
        <path d="M3 12h15.5a2.5 2.5 0 1 1 0 5c-2.5 0-2.5-5-2.5-5" />
        <path d="M5 16h5.5a2.5 2.5 0 1 1 0 5c-2 0-2-3-2-3" />
      </g>
    </svg>
  );

  // Funkcija za SVG ikonu vlažnosti - elegantnija verzija
  const HumidityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="weather-icon-svg">
      <defs>
        <linearGradient id="humidityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <g>
        <path fill="url(#humidityGradient)" d="M12 3.1L6.1 10.4c-1.7 2.1-1.9 5.1-.4 7.4 1.3 2 3.5 3.2 5.9 3.2 2.3 0 4.6-1.2 5.9-3.2 1.4-2.3 1.3-5.3-.4-7.4L12 3.1zm0 15.9c-1.6 0-3.1-.8-4-2.2-1-1.5-.9-3.5.3-5 .1-.1.1-.2.2-.3L12 6.7l3.6 4.8c.1.1.1.2.2.3 1.1 1.5 1.2 3.5.3 5-.9 1.4-2.4 2.2-4.1 2.2z" />
        <path fill="url(#humidityGradient)" opacity="0.7" d="M12 13c-.8 0-1.5.7-1.5 1.5S11.2 16 12 16s1.5-.7 1.5-1.5S12.8 13 12 13z" />
      </g>
    </svg>
  );

  // Funkcija za SVG ikonu mora - elegantnija verzija
  const SeaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="weather-icon-svg">
      <defs>
        <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60C2FA" />
          <stop offset="100%" stopColor="#2584EB" />
        </linearGradient>
      </defs>
      <g fill="none">
        <path fill="url(#seaGradient)" d="M4.5 16.5c1.5-2 3.8-2 5.3 0 1.5 2 3.8 2 5.3 0 1.5-2 3.8-2 5.3 0" strokeWidth="0" />
        <path fill="url(#seaGradient)" d="M4.5 12.5c1.5-2 3.8-2 5.3 0 1.5 2 3.8 2 5.3 0 1.5-2 3.8-2 5.3 0" strokeWidth="0" />
        <path fill="url(#seaGradient)" d="M4.5 8.5c1.5-2 3.8-2 5.3 0 1.5 2 3.8 2 5.3 0 1.5-2 3.8-2 5.3 0" strokeWidth="0" />
      </g>
    </svg>
  );

  return (
      <>
        {/* Weather info - samo na mobilnim uređajima */}
        <div className="col-md-10">
          {error && <p className="text-danger">{error}</p>}
          
          {weatherToday ? (
            <div className="weather-horizontal-container">
              <div className="weather-item location-item">
                <span className="weather-label city-label">Split, HR</span>
                <span className="weather-value me-lg-1">{currentTime.toLocaleDateString("en-GB")}</span>
                <span className="weather-value">
                  {currentTime.getHours().toString().padStart(2, '0')}:
                  {currentTime.getMinutes().toString().padStart(2, '0')}
                </span>
              </div>
              
              <div className="weather-item">
                {renderWeatherIcon(weatherToday.symbol)}
                <span className="weather-value">{Math.round(weatherToday.temperature)}°C</span>
              </div>
              
              <div className="weather-item">
                <div className="icon-container">
                  <WindIcon />
                </div>
                <span className="weather-value">{Math.round(weatherToday.wind)} m/s</span>
              </div>
              
              <div className="weather-item">
                <div className="icon-container">
                  <HumidityIcon />
                </div>
                <span className="weather-value">{Math.round(weatherToday.humidity)}%</span>
              </div>
              
              <div className="weather-item">
                <div className="icon-container">
                  <SeaIcon />
                </div>
                <span className="weather-value">~15°C</span>
              </div>
            </div>
          ) : (
            <p className="text-center">Učitavanje vremena...</p>
          )}
        </div>
        
        <div className="col-md-10">
          {/* Uvijek prikazujemo iframe, ali ga sakrijemo dok se ne učita */}
          <div style={{ position: "relative" }}>
            {!isLoaded && <DeliveryMapSkeleton />}
            
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1u5Hx3EedR34xYeOG-zZPcCueSxX0I5o&ehbc=2E312F&noprof=1"
              width="100%"
              height="400"
              title="Sailor's Feast - Marina Delivery Points Map"
              aria-label="Google map showing delivery points"
              style={{
                border: 0,
                opacity: isLoaded ? 1 : 0,
                position: isLoaded ? "relative" : "absolute",
                top: 0,
                left: 0
              }}
              allowFullScreen=""
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleIframeLoad}
            ></iframe>
          </div>
        </div>
      </>
  );
};

export default DeliveryMap;