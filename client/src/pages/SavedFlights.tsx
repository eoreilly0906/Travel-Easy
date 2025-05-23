import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : 'https://travel-easy-21g7.onrender.com';

interface SavedFlight {
  _id: string;
  flightDetails: {
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
  };
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate: string;
  savedAt: string;
}

const SavedFlights: React.FC = () => {
  const [savedFlights, setSavedFlights] = useState<SavedFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/login');
      return;
    }
    fetchSavedFlights();
  }, [navigate]);

  const fetchSavedFlights = async () => {
    try {
      const response = await fetch(`${API_URL}/api/saved-flights`, {
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch saved flights');
      }

      const data = await response.json();
      setSavedFlights(data);
    } catch (err) {
      setError('Failed to load saved flights. Please try again.');
      console.error('Error fetching saved flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/saved-flights/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete saved flight');
      }

      setSavedFlights(prevFlights => prevFlights.filter(flight => flight._id !== id));
    } catch (err) {
      setError('Failed to delete flight. Please try again.');
      console.error('Error deleting saved flight:', err);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <div className="loading">Loading saved flights...</div>;
  }

  return (
    <div className="saved-flights-container">
      <h1>Saved Flights</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {savedFlights.length === 0 ? (
        <div className="no-flights">
          <p>You haven't saved any flights yet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/flights')}
          >
            Search Flights
          </button>
        </div>
      ) : (
        <div className="saved-flights-list">
          {savedFlights.map((flight) => (
            <div key={flight._id} className="flight-card">
              <div className="flight-header">
                <img 
                  src={flight.flightDetails.airline_logo} 
                  alt={flight.flightDetails.flights[0]?.airline} 
                  className="airline-logo"
                  style={{ height: '40px', width: 'auto' }}
                />
                <span className="flight-type">{flight.flightDetails.type}</span>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(flight._id)}
                  aria-label="Delete flight"
                >
                  ×
                </button>
              </div>
              <div className="flight-details">
                <div className="flight-time">
                  {flight.flightDetails.flights.map((segment, idx) => (
                    <div key={idx} className="flight-segment">
                      <div>
                        <strong>Departure:</strong>
                        <p>{segment.departureTime}</p>
                        <small>{flight.departureCity}</small>
                      </div>
                      <div>
                        <strong>Arrival:</strong>
                        <p>{segment.arrivalTime}</p>
                        <small>{flight.arrivalCity}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flight-info">
                  <p><strong>Duration:</strong> {formatDuration(flight.flightDetails.total_duration)}</p>
                  <p><strong>Carbon Impact:</strong> {flight.flightDetails.carbon_emissions.difference_percentage}% vs typical</p>
                  <p className="flight-price">${flight.flightDetails.price}</p>
                  <p className="flight-dates">
                    <small>
                      {new Date(flight.departureDate).toLocaleDateString()} - {new Date(flight.returnDate).toLocaleDateString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedFlights; 