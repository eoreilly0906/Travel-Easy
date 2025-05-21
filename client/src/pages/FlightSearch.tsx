import React, { useState, useEffect } from 'react';
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

  const [flights, setFlights] = useState<Flight[]>(() => {
    const savedFlights = localStorage.getItem('flightSearchResults');
    return savedFlights ? JSON.parse(savedFlights) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: { success: boolean; message: string } }>(() => {
    const savedStatus = localStorage.getItem('flightSaveStatus');
    return savedStatus ? JSON.parse(savedStatus) : {};
  });
  const navigate = useNavigate();

  // Update localStorage when flights change
  useEffect(() => {
    localStorage.setItem('flightSearchResults', JSON.stringify(flights));
  }, [flights]);

  // Update localStorage when saveStatus changes
  useEffect(() => {
    localStorage.setItem('flightSaveStatus', JSON.stringify(saveStatus));
  }, [saveStatus]);

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
      console.log('Raw API response:', JSON.stringify(data, null, 2));
      console.log('Best flights array:', JSON.stringify(data.best_flights, null, 2));
      if (data.best_flights && data.best_flights.length > 0) {
        console.log('First flight structure:', JSON.stringify(data.best_flights[0], null, 2));
        if (data.best_flights[0].flights) {
          console.log('First flight segments:', JSON.stringify(data.best_flights[0].flights, null, 2));
        }
      }
      setFlights(data.best_flights || []);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlight = async (flight: any, index: number) => {
    if (!Auth.loggedIn()) {
      navigate('/login');
      return;
    }

    try {
      console.log('Raw flight data:', flight);
      console.log('Flight segments:', flight.flights);

      // Check if flight is already saved
      if (saveStatus[`flight-${index}`]?.success) {
        return;
      }

      // Validate and transform flight data
      const flightSegments = flight.flights.map((segment: any) => {
        console.log('Processing segment:', JSON.stringify(segment, null, 2));
        
        // Extract required fields from the API response
        const flightNumber = segment.flight_number;
        const departureTime = segment.departure_airport?.time;
        const arrivalTime = segment.arrival_airport?.time;
        const airline = segment.airline;

        // Validate required fields
        if (!flightNumber || !departureTime || !arrivalTime || !airline) {
          throw new Error(`Invalid flight data: missing required fields in flight segment: flightNumber=${!!flightNumber}, departureTime=${!!departureTime}, arrivalTime=${!!arrivalTime}, airline=${!!airline}`);
        }

        return {
          airline,
          flightNumber,
          departureTime,
          arrivalTime,
          departureAirport: segment.departure_airport?.id || '',
          arrivalAirport: segment.arrival_airport?.id || '',
          duration: segment.duration || 0,
          airplane: segment.airplane || '',
          travelClass: segment.travel_class || 'Economy',
          legroom: segment.legroom || '',
          extensions: segment.extensions || []
        };
      });

      const flightData = {
        flightDetails: {
          flights: flightSegments,
          total_duration: flight.total_duration || 0,
          carbon_emissions: {
            this_flight: flight.carbon_emissions?.this_flight || 0,
            typical_for_route: flight.carbon_emissions?.typical_for_this_route || 0,
            difference_percentage: flight.carbon_emissions?.difference_percent || 0
          },
          price: flight.price || 0,
          type: flight.type || 'Standard',
          airline_logo: flight.airline_logo || '',
          departure_token: flight.departure_token || ''
        },
        departureCity: flight.flights[0]?.departure_airport?.id || '',
        arrivalCity: flight.flights[flight.flights.length - 1]?.arrival_airport?.id || '',
        departureDate: flight.flights[0]?.departure_airport?.time?.split(' ')[0] || '',
        returnDate: flight.flights[flight.flights.length - 1]?.arrival_airport?.time?.split(' ')[0] || ''
      };

      console.log('Structured flight data:', JSON.stringify(flightData, null, 2));

      const response = await fetch('http://localhost:3001/api/saved-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(flightData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save flight');
      }

      const responseData = await response.json();
      console.log('Save flight response:', JSON.stringify(responseData, null, 2));
      setSaveStatus(prev => ({
        ...prev,
        [`flight-${index}`]: { success: true, message: 'Saved!' }
      }));
    } catch (error) {
      console.error('Error saving flight:', error);
      setSaveStatus(prev => ({
        ...prev,
        [`flight-${index}`]: { success: false, message: error instanceof Error ? error.message : 'Failed to save flight' }
      }));
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Add a function to clear saved results
  const clearResults = () => {
    setFlights([]);
    setSaveStatus({});
    localStorage.removeItem('flightSearchResults');
    localStorage.removeItem('flightSaveStatus');
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

        <div className="form-buttons">
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
          {flights.length > 0 && (
            <button type="button" className="clear-button" onClick={clearResults}>
              Clear Results
            </button>
          )}
        </div>
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
              disabled={saveStatus[`flight-${index}`]?.success}
            >
              {saveStatus[`flight-${index}`]?.success ? 'Saved!' : 'Save Flight'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSearch; 