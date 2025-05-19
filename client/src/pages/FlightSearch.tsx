import React, { useState } from 'react';
import '../App.css';
import { searchFlights } from '../utils/flightApi';

interface FlightSearchForm {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate: string;
}

interface Flight {
  _id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  availableSeats: number;
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
      const results = await searchFlights(searchForm);
      setFlights(results);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flight-search-container">
      <h1>Flight Search</h1>
      <form onSubmit={handleSubmit} className="flight-search-form">
        <div className="form-group">
          <label htmlFor="departureCity">From:</label>
          <input
            type="text"
            id="departureCity"
            name="departureCity"
            value={searchForm.departureCity}
            onChange={handleInputChange}
            placeholder="Departure City"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="arrivalCity">To:</label>
          <input
            type="text"
            id="arrivalCity"
            name="arrivalCity"
            value={searchForm.arrivalCity}
            onChange={handleInputChange}
            placeholder="Arrival City"
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
            {flights.map((flight) => (
              <div key={flight._id} className="flight-card">
                <div className="flight-header">
                  <h3>{flight.airline}</h3>
                  <span className="flight-number">{flight.flightNumber}</span>
                </div>
                <div className="flight-details">
                  <div className="flight-time">
                    <div>
                      <strong>Departure:</strong>
                      <p>{formatTime(flight.departureTime)}</p>
                      <small>{flight.departureCity}</small>
                    </div>
                    <div>
                      <strong>Arrival:</strong>
                      <p>{formatTime(flight.arrivalTime)}</p>
                      <small>{flight.arrivalCity}</small>
                    </div>
                  </div>
                  <div className="flight-info">
                    <p><strong>Duration:</strong> {flight.duration}</p>
                    <p><strong>Available Seats:</strong> {flight.availableSeats}</p>
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