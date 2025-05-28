export const fetchWeather = async (city) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=df3fb9934a7d8ebae97c6749b588071a`);
    console.log(res);
    if (!res.ok)
        throw new Error('Failed to fetch weather');
    return res.json();
};
