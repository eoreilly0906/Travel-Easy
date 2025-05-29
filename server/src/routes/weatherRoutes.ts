import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    console.log('Weather request received for city:', city);

    if (!city) {
      console.log('No city provided in request');
      return res.status(400).json({ message: 'City parameter is required' });
    }

    if (!process.env.WEATHER_API_KEY) {
      console.log('Weather API key is missing');
      return res.status(500).json({ message: 'Weather API key is not configured' });
    }

    // Request temperature in Fahrenheit directly
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city as string)}&units=imperial&appid=${process.env.WEATHER_API_KEY}`;
    console.log('Fetching weather from:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('Weather API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeatherMap API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return res.status(response.status).json({ 
        message: 'Failed to fetch weather data',
        details: `Status: ${response.status}, Error: ${errorText}`
      });
    }

    const data = await response.json();
    console.log('Raw temperature from API (Fahrenheit):', data.main.temp);

    if (!data.main || !data.weather || !data.weather[0]) {
      console.error('Invalid response format:', data);
      return res.status(500).json({ 
        message: 'Invalid response format from OpenWeatherMap',
        details: 'Missing required weather data fields'
      });
    }

    // Transform the data to match our frontend interface
    const weatherData = {
      temperature: Math.round(data.main.temp), // Temperature is already in Fahrenheit
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed), // Wind speed is already in mph
      city: data.name,
      icon: data.weather[0].icon
    };

    console.log('Final weather data being sent:', weatherData);

    res.setHeader('Content-Type', 'application/json');
    return res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      message: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 