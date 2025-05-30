import { useState } from 'react';
import { fetchWeatherForecast, fetchCityCoordinates  } from '../utils/weather';


// implementation

function WeatherComponent() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);

  const handleGetWeather = async () => {
  try {
    console.log('Fetching weather for:', city);

    // Step 1: Get coordinates based on city name
    const { lat, lon, name } = await fetchCityCoordinates(city);

    // Step 2: Fetch weather forecast using coordinates
    const data = await fetchWeatherForecast(lat, lon);

    // Step 3: Optionally combine city name with forecast
    setWeather({ cityName: name, ...data });
  } catch (err) {
    console.error(err);
    alert('Failed to load weather');
  }
};

   const getIconUrl = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="weather-component">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
        className="form-input mb-2"
      />
      <button onClick={handleGetWeather} className="btn btn-primary mb-3">
        Get Weather
      </button>

      {weather && (
        <div className="border p-3">
          <h3>{weather.name}</h3>
          <img
            src={getIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            title={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p>Temp: {weather.main.temp} °F</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default WeatherComponent;