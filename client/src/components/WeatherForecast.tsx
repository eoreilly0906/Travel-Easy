import React, { useState } from 'react';
import './weatherForecast.css'; 
import AnimatedCursor from './AnimatedCursor';

interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface Props {
  forecast: {
    cityName: string;
    forecastList: ForecastItem[];
  };
}

// Map icon code to cursor image path
const getCursorImage = (iconCode: string) => {
  switch (iconCode) {
    case '01d':
    case '01n':
      return '/assets/sun.gif';
    case '02d':
    case '02n':
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return '/assets/cloud.gif';
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return '/assets/rain.gif';
    case '13d':
    case '13n':
      return '/assets/snow.gif';
    case '11d':
    case '11n':
      return '/assets/storm.gif';
    default:
      return '/assets/sun.gif'; // fallback
  }
};

const WeatherForecast: React.FC<Props> = ({ forecast }) => {
  // Track which card is hovered (null if none)
  const [hoveredCursor, setHoveredCursor] = useState<string | null>(null);

  if (
    !forecast.forecastList ||
    !Array.isArray(forecast.forecastList) ||
    forecast.forecastList.length === 0
  ) {
    console.log('Invalid forecast data:', forecast);
    return <div>Loading forecast...</div>;
  }

  const getIconUrl = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Group forecast by day
  const dailyMap: Record<string, ForecastItem[]> = {};

  forecast.forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = [];
    }
    dailyMap[date].push(item);
  });

  const dailySummaries = Object.entries(dailyMap).map(([date, items]) => {
    const min = Math.min(...items.map(i => i.main.temp_min));
    const max = Math.max(...items.map(i => i.main.temp_max));
    const icon = items[Math.floor(items.length / 2)].weather[0].icon;
    const description = items[Math.floor(items.length / 2)].weather[0].description;

    return {
      date,
      temp: {
        min,
        max,
      },
      icon,
      description,
    };
  });

  return (
    <>
      {hoveredCursor && <AnimatedCursor src={hoveredCursor} size={32} />}
      <div className="bg-white rounded shadow-md p-4">
        <h3 className="text-xl font-bold text-center mb-4">
          {forecast.cityName} - 5 Day Forecast
        </h3>
        <p className="text-center text-sm text-gray-600 mb-4">
        Your next adventure starts with the weather!
        <br />
      </p>

        <div className="weather-forecast-container">
          {dailySummaries.slice(0, 5).map((day, index) => {
            const displayDate = new Date(day.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={index}
                className="weather-card flex flex-col items-center justify-center"
                onMouseEnter={() => setHoveredCursor(getCursorImage(day.icon))}
                onMouseLeave={() => setHoveredCursor(null)}
              >
                <img
                  src={getIconUrl(day.icon)}
                  alt={day.description}
                  title={day.description}
                  className="weather-icon bounce"
                  style={{ width: 64, height: 64 }}
                />
                <p className="weather-date">{displayDate}</p>
                <p className="weather-desc">{day.description}</p>
                <p className="temp">High: {Math.round(day.temp.max)}°F</p>
                <p className="temp">Low: {Math.round(day.temp.min)}°F</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WeatherForecast;