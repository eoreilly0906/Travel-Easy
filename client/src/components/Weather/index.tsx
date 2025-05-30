import React, { useState } from 'react';
import './style.css';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  icon: string;
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching weather for:', cityName);
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Weather API response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid response content type:', contentType);
        console.error('Response text:', text);
        throw new Error('Invalid response from server');
      }

      const data = await response.json();
      console.log('Weather API response:', data);
      
      if (!response.ok) {
        throw new Error(data.details || data.message || 'Failed to fetch weather data');
      }
      
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="weather-container">
      <h3>Check Weather</h3>
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="weather-input"
        />
        <button type="submit" className="weather-button" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {loading && <div className="weather-loading">Loading weather data...</div>}
      
      {error && (
        <div className="weather-error">
          <p>{error}</p>
          <small>Please check the city name and try again.</small>
        </div>
      )}
      
      {weather && !loading && !error && (
        <div className="weather-info">
          <h4>{weather.city}</h4>
          <div className="weather-details">
            <img 
              src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.description}
              className="weather-icon"
            />
            <div className="weather-temp">{weather.temperature}°F</div>
            <div className="weather-desc">{weather.description}</div>
            <div className="weather-meta">
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind: {weather.windSpeed} mph</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather; 