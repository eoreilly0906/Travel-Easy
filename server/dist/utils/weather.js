const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 
export const fetchWeather = async (city) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`);
    console.log(res);
    if (!res.ok)
        throw new Error('Failed to fetch weather');
    return res.json();
};
