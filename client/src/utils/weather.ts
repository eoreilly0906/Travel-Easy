const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // use .env for safety

console.log("Loaded OpenWeather API Key:", API_KEY);

export const fetchWeatherForecast = async (lat: number, lon: number) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  return res.json();
};

export const fetchCityCoordinates = async (city: string) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to get city data');
  const data = await res.json();
  return {
    lat: data.coord.lat,
    lon: data.coord.lon,
    name: data.name,
  };
};