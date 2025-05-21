import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_FORECAST } from '../utils/queries';
import ThoughtList from '../components/ThoughtList/index.tsx';
import ThoughtForm from '../components/ThoughtForm/index.tsx';

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];

  const [city, setCity] = useState('');
  const [getForecast, { data: forecastData, loading: loadingForecast, error: forecastError }] = useLazyQuery(QUERY_FORECAST);

  const handleForecastSearch = () => {
    if (city.trim()) {
      getForecast({ variables: { city } });
    }
  };

  return (
    <main>
      <div className="flex-row justify-center">

        {/* Weather Forecast Section */}
        <div className="col-12 col-md-6 mb-3 p-3" style={{ border: '1px solid #ccc' }}>
          <h2>Weather Forecast</h2>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input mb-2"
          />
          <button onClick={handleForecastSearch} className="btn btn-primary mb-2">
            Get Forecast
          </button>

          {loadingForecast && <p>Loading forecast...</p>}
          {forecastError && <p>Error fetching forecast.</p>}
          {forecastData?.getForecast && (
            <div className="border p-2">
              <p><strong>City:</strong> {forecastData.getForecast.city}</p>
              <p><strong>Temperature:</strong> {forecastData.getForecast.temperature} °C</p>
              <p><strong>Description:</strong> {forecastData.getForecast.description}</p>
              <p><strong>Humidity:</strong> {forecastData.getForecast.humidity}%</p>
              <p><strong>Wind Speed:</strong> {forecastData.getForecast.windSpeed} m/s</p>
            </div>
          )}
        </div>

        {/* Thought Form */}
        <div className="col-12 col-md-10 mb-3 p-3" style={{ border: '1px dotted #1a1a1a' }}>
          <ThoughtForm />
        </div>

        {/* Thought List */}
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;