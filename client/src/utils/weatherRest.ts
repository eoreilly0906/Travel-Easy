const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Fetch 5-day / 3-hour forecast by city name
export async function fetchCityForecast(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch forecast');
  }

  const data = await res.json();

  return {
    cityName: data.city.name,
    forecastList: data.list, // Array of weather entries, every 3 hours
  };
}