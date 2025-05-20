import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
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
  const [saveStatus, setSaveStatus] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

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

  const handleSaveFlight = async (flight: Flight, index: number) => {
    if (!Auth.loggedIn()) {
      navigate('/login');
      return;
    }

    try {
      // Log the raw flight data for debugging
      console.log('Raw flight data:', JSON.stringify(flight, null, 2));

      // Validate flight data structure
      if (!flight.flights || !Array.isArray(flight.flights) || flight.flights.length === 0) {
        throw new Error('Invalid flight data: missing or invalid flight segments');
      }

      // Validate each flight segment
      flight.flights.forEach((f, i) => {
        console.log(`Flight segment ${i + 1}:`, f);

        // Check if the flight segment has the required properties
        if (!f || typeof f !== 'object') {
          throw new Error(`Invalid flight data: flight segment ${i + 1} is not a valid object`);
        }

        // Check for required fields
        const missingFields = [];
        if (!f.flight_number) missingFields.push('flight_number');
        if (!f.departure_airport?.time) missingFields.push('departure_time');
        if (!f.arrival_airport?.time) missingFields.push('arrival_time');

        if (missingFields.length > 0) {
          throw new Error(`Invalid flight data: missing required fields in flight segment ${i + 1}: ${missingFields.join(', ')}`);
        }
      });

      // Create the flight data object
      const flightData = {
        flightDetails: {
          flights: flight.flights.map(f => ({
            airline: f.airline || 'Unknown Airline',
            flightNumber: f.flight_number,
            departureTime: f.departure_airport.time,
            arrivalTime: f.arrival_airport.time
          })),
          total_duration: Number(flight.total_duration) || 0,
          carbon_emissions: {
            this_flight: Number(flight.carbon_emissions?.this_flight) || 0,
            typical_for_route: Number(flight.carbon_emissions?.typical_for_this_route) || 0,
            difference_percentage: Number(flight.carbon_emissions?.difference_percent) || 0
          },
          price: Number(flight.price) || 0,
          type: flight.type || 'Standard',
          airline_logo: flight.airline_logo || '',
          departure_token: flight.departure_token || ''
        },
        departureCity: searchForm.departureCity,
        arrivalCity: searchForm.arrivalCity,
        departureDate: searchForm.departureDate,
        returnDate: searchForm.returnDate
      };

      console.log('Structured flight data:', JSON.stringify(flightData, null, 2));

      const response = await fetch('http://localhost:3001/api/saved-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(flightData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save flight');
      }

      setSaveStatus(prev => ({
        ...prev,
        [index]: 'saved'
      }));
    } catch (err) {
      setSaveStatus(prev => ({
        ...prev,
        [index]: 'error'
      }));
      setError(err instanceof Error ? err.message : 'Failed to save flight');
      console.error('Error saving flight:', err);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flight-search-container">
      <h1 className="text-center mb-3">Flight Search</h1>
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
        <div className="error-message text-center text-accent">
          {error}
        </div>
      )}

      <div className="flight-results">
        {flights.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-header">
              <img 
                src={flight.airline_logo} 
                alt={flight.flights[0]?.airline} 
                className="airline-logo"
              />
              <span className="flight-type">{flight.type}</span>
            </div>
            
            <div className="flight-details">
              {flight.flights.map((f, i) => (
                <div key={i} className="flight-info">
                  <div>
                    <strong>Airline:</strong> {f.airline}
                  </div>
                  <div>
                    <strong>Flight:</strong> {f.flightNumber}
                  </div>
                  <div>
                    <strong>Departure:</strong> {new Date(f.departureTime).toLocaleString()}
                  </div>
                  <div>
                    <strong>Arrival:</strong> {new Date(f.arrivalTime).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="flight-info">
                <div>
                  <strong>Duration:</strong> {formatDuration(flight.total_duration)}
                </div>
                <div>
                  <strong>Carbon Emissions:</strong> {flight.carbon_emissions.this_flight} kg
                </div>
                <div>
                  <strong>Price:</strong>
                  <span className="flight-price"> ${flight.price}</span>
                </div>
              </div>
            </div>

            <button
              className="save-button"
              onClick={() => handleSaveFlight(flight, index)}
              disabled={saveStatus[index] === 'saved'}
            >
              {saveStatus[index] === 'saved' ? 'Saved!' : 'Save Flight'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSearch; 