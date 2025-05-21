import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import '../App.css';

// Custom error types
class FlightError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FlightError';
  }
}

class ValidationError extends FlightError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

class APIError extends FlightError {
  constructor(message: string, public status: number) {
    super(message, 'API_ERROR');
    this.name = 'APIError';
  }
}

// Type guards
const isAirport = (obj: unknown): obj is Airport => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'id' in obj &&
    'time' in obj &&
    typeof (obj as Airport).name === 'string' &&
    typeof (obj as Airport).id === 'string' &&
    typeof (obj as Airport).time === 'string'
  );
};

const isFlightSegment = (obj: unknown): obj is FlightSegment => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'departure_airport' in obj &&
    'arrival_airport' in obj &&
    'airline' in obj &&
    'flight_number' in obj &&
    isAirport((obj as FlightSegment).departure_airport) &&
    isAirport((obj as FlightSegment).arrival_airport) &&
    typeof (obj as FlightSegment).airline === 'string' &&
    typeof (obj as FlightSegment).flight_number === 'string'
  );
};

const isCarbonEmissions = (obj: unknown): obj is CarbonEmissions => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'this_flight' in obj &&
    'typical_for_this_route' in obj &&
    'difference_percent' in obj &&
    typeof (obj as CarbonEmissions).this_flight === 'number' &&
    typeof (obj as CarbonEmissions).typical_for_this_route === 'number' &&
    typeof (obj as CarbonEmissions).difference_percent === 'number'
  );
};

const isFlight = (obj: unknown): obj is Flight => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'flights' in obj &&
    'total_duration' in obj &&
    'carbon_emissions' in obj &&
    'price' in obj &&
    Array.isArray((obj as Flight).flights) &&
    (obj as Flight).flights.every(isFlightSegment) &&
    typeof (obj as Flight).total_duration === 'number' &&
    isCarbonEmissions((obj as Flight).carbon_emissions) &&
    typeof (obj as Flight).price === 'number'
  );
};

// API response types
interface FlightSearchResponse {
  best_flights: Flight[];
  status: 'success' | 'error';
  message?: string;
}

interface FlightSearchForm {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate: string;
}

interface Airport {
  name: string;
  id: string;
  time: string;
}

interface FlightSegment {
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions: string[];
  often_delayed_by_over_30_min?: boolean;
}

interface TransformedFlightSegment {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: number;
  airplane: string;
  travelClass: string;
  legroom: string;
  extensions: string[];
}

interface CarbonEmissions {
  this_flight: number;
  typical_for_this_route: number;
  difference_percent: number;
}

interface Layover {
  duration: number;
  name: string;
  id: string;
  overnight?: boolean;
}

interface Flight {
  flights: FlightSegment[];
  layovers?: Layover[];
  total_duration: number;
  carbon_emissions: CarbonEmissions;
  price: number;
  type: string;
  airline_logo: string;
  extensions: string[];
  departure_token: string;
}

interface SaveStatus {
  success: boolean;
  message: string;
}

interface SaveStatusMap {
  [key: string]: SaveStatus;
}

// Airport code mapping
interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
}

const AIRPORT_MAPPINGS: { [key: string]: AirportInfo[] } = {
  'new york': [
    { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
    { code: 'LGA', name: 'LaGuardia', city: 'New York', country: 'USA' },
    { code: 'EWR', name: 'Newark Liberty International', city: 'New York', country: 'USA' }
  ],
  'los angeles': [
    { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' }
  ],
  'chicago': [
    { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
    { code: 'MDW', name: 'Midway International', city: 'Chicago', country: 'USA' }
  ],
  'houston': [
    { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA' },
    { code: 'HOU', name: 'William P. Hobby', city: 'Houston', country: 'USA' }
  ],
  'miami': [
    { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' }
  ],
  'london': [
    { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    { code: 'LGW', name: 'Gatwick', city: 'London', country: 'UK' },
    { code: 'STN', name: 'Stansted', city: 'London', country: 'UK' }
  ],
  'paris': [
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'ORY', name: 'Orly', city: 'Paris', country: 'France' }
  ],
  'tokyo': [
    { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan' },
    { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan' }
  ],
  'sydney': [
    { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia' }
  ],
  'dubai': [
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' }
  ]
};

interface CitySearchResult {
  city: string;
  airports: AirportInfo[];
}

const FlightSearch: React.FC = () => {
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
  });

  const [departureAirports, setDepartureAirports] = useState<AirportInfo[]>([]);
  const [arrivalAirports, setArrivalAirports] = useState<AirportInfo[]>([]);
  const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<string>('');
  const [selectedArrivalAirport, setSelectedArrivalAirport] = useState<string>('');
  const [showAirportSelection, setShowAirportSelection] = useState<boolean>(false);
  const [activeSelection, setActiveSelection] = useState<'departure' | 'arrival' | null>(null);

  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const savedFlights = localStorage.getItem('flightSearchResults');
      return savedFlights ? JSON.parse(savedFlights) : [];
    } catch (error) {
      console.error('Error loading saved flights:', error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatusMap>(() => {
    try {
      const savedStatus = localStorage.getItem('flightSaveStatus');
      return savedStatus ? JSON.parse(savedStatus) : {};
    } catch (error) {
      console.error('Error loading save status:', error);
      return {};
    }
  });

  const navigate = useNavigate();

  // Update localStorage when flights change
  useEffect(() => {
    try {
      localStorage.setItem('flightSearchResults', JSON.stringify(flights));
    } catch (error) {
      console.error('Error saving flights to localStorage:', error);
    }
  }, [flights]);

  // Update localStorage when saveStatus changes
  useEffect(() => {
    try {
      localStorage.setItem('flightSaveStatus', JSON.stringify(saveStatus));
    } catch (error) {
      console.error('Error saving status to localStorage:', error);
    }
  }, [saveStatus]);

  const searchAirports = (cityName: string): CitySearchResult[] => {
    const normalizedCity = cityName.toLowerCase().trim();
    const results: CitySearchResult[] = [];

    Object.entries(AIRPORT_MAPPINGS).forEach(([key, airports]) => {
      if (key.includes(normalizedCity)) {
        results.push({
          city: airports[0].city,
          airports
        });
      }
    });

    return results;
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (value.length >= 2) {
      const results = searchAirports(value);
      if (name === 'departureCity') {
        setDepartureAirports(results[0]?.airports || []);
        setActiveSelection('departure');
      } else {
        setArrivalAirports(results[0]?.airports || []);
        setActiveSelection('arrival');
      }
      setShowAirportSelection(true);
    } else {
      setShowAirportSelection(false);
    }
  };

  const handleAirportSelection = (airport: AirportInfo, type: 'departure' | 'arrival') => {
    if (type === 'departure') {
      setSelectedDepartureAirport(airport.code);
      setSearchForm(prev => ({
        ...prev,
        departureCity: `${airport.city} (${airport.code})`
      }));
    } else {
      setSelectedArrivalAirport(airport.code);
      setSearchForm(prev => ({
        ...prev,
        arrivalCity: `${airport.city} (${airport.code})`
      }));
    }
    setShowAirportSelection(false);
    setActiveSelection(null);
  };

  const validateSearchForm = (form: FlightSearchForm): void => {
    if (!selectedDepartureAirport || !selectedArrivalAirport) {
      throw new ValidationError('Please select airports for both departure and arrival cities');
    }
    if (!form.departureDate || !form.returnDate) {
      throw new ValidationError('Departure and return dates are required');
    }
    if (new Date(form.departureDate) > new Date(form.returnDate)) {
      throw new ValidationError('Return date must be after departure date');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateSearchForm(searchForm);

      const response = await fetch('http://localhost:3001/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...searchForm,
          departureCity: selectedDepartureAirport,
          arrivalCity: selectedArrivalAirport
        }),
      });

      if (!response.ok) {
        throw new APIError(`Failed to fetch flights: ${response.status} ${response.statusText}`, response.status);
      }

      const data = await response.json() as FlightSearchResponse;
      
      if (!data.best_flights || !Array.isArray(data.best_flights)) {
        throw new ValidationError('Invalid response format from server');
      }

      // Validate each flight in the response
      data.best_flights.forEach((flight, index) => {
        if (!isFlight(flight)) {
          throw new ValidationError(`Invalid flight data at index ${index}`);
        }
      });

      setFlights(data.best_flights);
    } catch (err) {
      const errorMessage = err instanceof FlightError 
        ? err.message 
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateFlightData = (flight: Flight): void => {
    if (!isFlight(flight)) {
      throw new ValidationError('Invalid flight data structure');
    }

    flight.flights.forEach((segment, index) => {
      if (!isFlightSegment(segment)) {
        throw new ValidationError(`Invalid flight segment at index ${index}`);
      }
    });

    if (!isCarbonEmissions(flight.carbon_emissions)) {
      throw new ValidationError('Invalid carbon emissions data');
    }
  };

  const handleSaveFlight = async (flight: Flight, index: number) => {
    if (!Auth.loggedIn()) {
      navigate('/login');
      return;
    }

    try {
      if (saveStatus[`flight-${index}`]?.success) {
        return;
      }

      validateFlightData(flight);

      const flightSegments: TransformedFlightSegment[] = flight.flights.map((segment: FlightSegment) => {
        const { flight_number, departure_airport, arrival_airport, airline } = segment;

        if (!flight_number || !departure_airport?.time || !arrival_airport?.time || !airline) {
          throw new ValidationError(`Missing required fields in flight segment: flightNumber=${!!flight_number}, departureTime=${!!departure_airport?.time}, arrivalTime=${!!arrival_airport?.time}, airline=${!!airline}`);
        }

        return {
          airline,
          flightNumber: flight_number,
          departureTime: departure_airport.time,
          arrivalTime: arrival_airport.time,
          departureAirport: departure_airport.id || '',
          arrivalAirport: arrival_airport.id || '',
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
        throw new APIError(errorData.message || 'Failed to save flight', response.status);
      }

      const responseData = await response.json();
      setSaveStatus(prev => ({
        ...prev,
        [`flight-${index}`]: { success: true, message: 'Saved!' }
      }));
    } catch (error) {
      console.error('Error saving flight:', error);
      setSaveStatus(prev => ({
        ...prev,
        [`flight-${index}`]: { 
          success: false, 
          message: error instanceof FlightError ? error.message : 'Failed to save flight' 
        }
      }));
    }
  };

  const clearResults = () => {
    try {
      setFlights([]);
      setSaveStatus({});
      localStorage.removeItem('flightSearchResults');
      localStorage.removeItem('flightSaveStatus');
    } catch (error) {
      console.error('Error clearing results:', error);
      setError('Failed to clear results. Please try again.');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flight-search-container">
      <h1 className="text-center mb-3">Flight Search</h1>
      <form onSubmit={handleSubmit} className="flight-search-form">
        <div className="form-group">
          <label htmlFor="departureCity">From:</label>
          <input
            type="text"
            id="departureCity"
            name="departureCity"
            value={searchForm.departureCity}
            onChange={handleCityInputChange}
            placeholder="Enter city name"
            required
          />
          {showAirportSelection && activeSelection === 'departure' && (
            <div className="airport-selection">
              {departureAirports.map((airport) => (
                <div
                  key={airport.code}
                  className="airport-option"
                  onClick={() => handleAirportSelection(airport, 'departure')}
                >
                  {airport.name} ({airport.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="arrivalCity">To:</label>
          <input
            type="text"
            id="arrivalCity"
            name="arrivalCity"
            value={searchForm.arrivalCity}
            onChange={handleCityInputChange}
            placeholder="Enter city name"
            required
          />
          {showAirportSelection && activeSelection === 'arrival' && (
            <div className="airport-selection">
              {arrivalAirports.map((airport) => (
                <div
                  key={airport.code}
                  className="airport-option"
                  onClick={() => handleAirportSelection(airport, 'arrival')}
                >
                  {airport.name} ({airport.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="departureDate">Departure Date:</label>
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            value={searchForm.departureDate}
            onChange={handleCityInputChange}
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
            onChange={handleCityInputChange}
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