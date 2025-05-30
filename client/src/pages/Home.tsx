import { useState } from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';
import WeatherForecast from '../components/WeatherForecast';
import { fetchCityForecast } from '../utils/weatherRest'; // Updated import
import 'weather-icons/css/weather-icons.css';

const Home = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [errorForecast, setErrorForecast] = useState('');

  const handleForecastSearch = async () => {
    if (!city.trim()) return;

    try {
      setLoadingForecast(true);
      setErrorForecast('');
      const forecastData = await fetchCityForecast(city); // Use new function
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      setErrorForecast('Failed to load weather');
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <main>
      <div className="flex-row justify-center">
        {/* Weather Forecast Section */}
        <div className="col-12 col-md-10 mb-3 p-3 border rounded bg-white shadow-sm">
          <h2 className="mb-2">5-Day Weather Forecast</h2>
          <h5 className="mb-4">
            <img
              src="/assets/raincoat.png"
              alt="Raincoat"
              style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 6 }}
            />
            Raincoat or sunglasses?
            <img
              src="/assets/sunglasses.png"
              alt="Sunglasses"
              style={{ width: 24, height: 24, verticalAlign: 'middle', margin: '0 6px' }}
            />
            Let our 5-day forecast help you decide!
          </h5>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input mb-2"
          />
          <button onClick={handleForecastSearch} className="btn btn-primary mb-4">
            Get Forecast
          </button>

          {loadingForecast && <p>Loading forecast...</p>}
          {errorForecast && <p className="text-red-600">{errorForecast}</p>}
          {forecast && <WeatherForecast forecast={forecast} />}
        </div>

        {/* Thought Form */}
        <div className="col-12 col-md-10 mb-3 p-3 border-dotted border">
          <ThoughtForm />
        </div>

        {/* Thought List */}
        <div className="col-12 col-md-8 mb-3">
          <ThoughtList title="Some Feed for Thought(s)..." thoughts={[]} />
        </div>
      </div>
    </main>
  );
};

export default Home;