import express from 'express';
import Flight from '../models/Flight.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Search flights
router.post('/search', async (req, res) => {
  try {
    const { departureCity, arrivalCity, departureDate, returnDate } = req.body;
    console.log('Received search request:', { departureCity, arrivalCity, departureDate, returnDate });

    // Convert dates to start and end of day
    const departureStart = new Date(departureDate);
    departureStart.setHours(0, 0, 0, 0);
    
    const departureEnd = new Date(departureDate);
    departureEnd.setHours(23, 59, 59, 999);

    // Check if we should use external API or local database
    if (process.env.FLIGHT_API_KEY && process.env.FLIGHT_API_BASE_URL) {
      console.log('Using SerpAPI with key:', process.env.FLIGHT_API_KEY ? 'Present' : 'Missing');
      
      // Use SerpAPI's Google Flights endpoint
      const apiUrl = `https://serpapi.com/search?engine=google_flights&api_key=${process.env.FLIGHT_API_KEY}&departure_id=${departureCity}&arrival_id=${arrivalCity}&outbound_date=${departureDate}&return_date=${returnDate}`;
      console.log('Making request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(Number(process.env.FLIGHT_API_TIMEOUT) || 5000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SerpAPI Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        return res.status(500).json({ 
          message: 'External flight API request failed',
          details: `Status: ${response.status}, Error: ${errorText}`
        });
      }

      const flights = await response.json();
      console.log('Raw SerpAPI Response:', JSON.stringify(flights, null, 2));

      // Transform the SerpAPI response to our expected format
      const transformedFlights = flights.best_flights?.map((flight: any) => {
        // Log each flight before transformation
        console.log('Processing flight:', JSON.stringify(flight, null, 2));

        const transformedFlight = {
          flights: [{
            airline: flight.flights?.[0]?.airline || 'Unknown Airline',
            flight_number: flight.flights?.[0]?.flight_number || 'N/A',
            departure_airport: {
              name: flight.flights?.[0]?.departure_airport?.name || departureCity,
              id: flight.flights?.[0]?.departure_airport?.id || departureCity,
              time: flight.flights?.[0]?.departure_airport?.time || departureStart.toISOString()
            },
            arrival_airport: {
              name: flight.flights?.[0]?.arrival_airport?.name || arrivalCity,
              id: flight.flights?.[0]?.arrival_airport?.id || arrivalCity,
              time: flight.flights?.[0]?.arrival_airport?.time || departureEnd.toISOString()
            },
            duration: flight.total_duration || 0,
            airplane: flight.flights?.[0]?.airplane || '',
            travel_class: flight.type || 'Economy',
            legroom: flight.flights?.[0]?.legroom || '',
            extensions: flight.flights?.[0]?.extensions || [],
            arrival_Time: flight.flights?.[0]?.arrival_airport?.time || departureEnd.toISOString(),
            departure_Time: flight.flights?.[0]?.departure_airport?.time || departureStart.toISOString(),
            airline_logo: flight.airline_logo || ''
          }],
          total_duration: flight.total_duration || 0,
          carbon_emissions: {
            this_flight: flight.carbon_emissions?.this_flight || 0,
            typical_for_this_route: flight.carbon_emissions?.typical_for_route || 0,
            difference_percent: flight.carbon_emissions?.difference_percentage || 0
          },
          price: flight.price || 0,
          type: flight.type || 'Economy',
          airline_logo: flight.airline_logo || '',
          departure_token: flight.departure_token || '',
          extensions: flight.flights?.[0]?.extensions || []
        };

        // Log the transformed flight
        console.log('Transformed flight:', JSON.stringify(transformedFlight, null, 2));
        return transformedFlight;
      }) || [];

      console.log('Final transformed flights:', JSON.stringify(transformedFlights, null, 2));
      return res.json({ best_flights: transformedFlights, status: 'success' });
    } else {
      console.log('Using local database (no API key or base URL configured)');
      
      // Create sample flight data
      const sampleFlights = [{
        flights: [{
          airline: 'Sample Airlines',
          flight_number: 'SA123',
          departure_airport: {
            name: 'Sample Departure',
            id: departureCity,
            time: departureStart.toISOString()
          },
          arrival_airport: {
            name: 'Sample Arrival',
            id: arrivalCity,
            time: new Date(departureStart.getTime() + 2 * 60 * 60 * 1000).toISOString()
          },
          duration: 120,
          airplane: 'Boeing 737',
          travel_class: 'Economy',
          legroom: 'Standard',
          extensions: [],
          arrival_Time: new Date(departureStart.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          departure_Time: departureStart.toISOString(),
          airline_logo: 'https://example.com/airline-logo.png'
        }],
        total_duration: 120,
        carbon_emissions: {
          this_flight: 100,
          typical_for_this_route: 120,
          difference_percent: -16.67
        },
        price: 299.99,
        type: 'Economy',
        airline_logo: 'https://example.com/airline-logo.png',
        departure_token: 'sample-token',
        extensions: []
      }];

      console.log('Returning sample flights:', JSON.stringify(sampleFlights, null, 2));
      return res.json({ best_flights: sampleFlights, status: 'success' });
    }
  } catch (error) {
    console.error('Error searching flights:', error);
    return res.status(500).json({ 
      message: 'Error searching flights',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    });
  }
});

// Get all flights (for testing)
router.get('/', async (_req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Error fetching flights' });
  }
});

export default router; 