const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Debug log to check if API key is loaded
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');

// Fetch 5-day / 3-hour forecast by city name
export async function fetchCityForecast(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  console.log('Fetching from URL:', url.replace(API_KEY, 'REDACTED')); // Log URL without exposing API key

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch forecast');
  }

  const data = await res.json();

  return {
    cityName: data.city.name,
    forecastList: data.list, // Array of weather entries, every 3 hours
  };
}