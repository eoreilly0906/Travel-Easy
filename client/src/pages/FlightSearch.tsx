import React, { useState } from 'react';
import '../App.css';

interface FlightSearchForm {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate: string;
}

interface Flight {
  flights: Array<{
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
  }>;
  total_duration: number;
  carbon_emissions: {
    this_flight: number;
    typical_for_route: number;
    difference_percentage: number;
  };
  price: number;
  type: string;
  airline_logo: string;
  extensions: string[];
  departure_token: string;
}

const FlightSearch: React.FC = () => {
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchForm),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data.best_flights || []);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flight-search-container">
      <h1>Flight Search</h1>
      <form onSubmit={handleSubmit} className="flight-search-form">
        <div className="form-group">
          <label htmlFor="departureCity">From (Airport Code):</label>
          <input
            type="text"
            id="departureCity"
            name="departureCity"
            value={searchForm.departureCity}
            onChange={handleInputChange}
            placeholder="e.g., IAH"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="arrivalCity">To (Airport Code):</label>
          <input
            type="text"
            id="arrivalCity"
            name="arrivalCity"
            value={searchForm.arrivalCity}
            onChange={handleInputChange}
            placeholder="e.g., MSY"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="departureDate">Departure Date:</label>
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            value={searchForm.departureDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="returnDate">Return Date:</label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={searchForm.returnDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {flights.length > 0 && (
        <div className="flight-results">
          <h2>Available Flights</h2>
          <div className="flight-list">
            {flights.map((flight, index) => (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <img 
                    src={flight.airline_logo} 
                    alt={flight.flights[0]?.airline} 
                    className="airline-logo"
                    style={{ height: '40px', width: 'auto' }}
                  />
                  <span className="flight-type">{flight.type}</span>
                </div>
                <div className="flight-details">
                  <div className="flight-time">
                    {flight.flights.map((segment, idx) => (
                      <div key={idx} className="flight-segment">
                        <div>
                          <strong>Departure:</strong>
                          <p>{segment.departureTime}</p>
                          <small>{searchForm.departureCity}</small>
                        </div>
                        <div>
                          <strong>Arrival:</strong>
                          <p>{segment.arrivalTime}</p>
                          <small>{searchForm.arrivalCity}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flight-info">
                    <p><strong>Duration:</strong> {formatDuration(flight.total_duration)}</p>
                    <p><strong>Carbon Impact:</strong> {flight.carbon_emissions.difference_percentage}% vs typical</p>
                    <p className="flight-price">${flight.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch; 