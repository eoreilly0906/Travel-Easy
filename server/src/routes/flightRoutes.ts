import express from 'express';
import Flight from '../models/Flight.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Search flights
router.post('/search', async (req, res) => {
  try {
    const { departureCity, arrivalCity, departureDate, returnDate } = req.body;

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
      console.log('SerpAPI Response:', flights);

      // Transform the SerpAPI response to our expected format
      const transformedFlights = flights.best_flights?.map((flight: any) => ({
        flights: flight.flights.map((segment: any) => ({
          airline: segment.airline || 'Unknown Airline',
          flightNumber: segment.flight_number || '',
          departureTime: segment.departure_airport?.time || '',
          arrivalTime: segment.arrival_airport?.time || ''
        })),
        total_duration: flight.total_duration || 0,
        carbon_emissions: {
          this_flight: flight.carbon_emissions?.this_flight || 0,
          typical_for_route: flight.carbon_emissions?.typical_for_route || 0,
          difference_percentage: flight.carbon_emissions?.difference_percentage || 0
        },
        price: flight.price || 0,
        type: flight.type || 'Standard',
        airline_logo: flight.airline_logo || '',
        departure_token: flight.departure_token || ''
      })) || [];

      console.log('Transformed flights:', JSON.stringify(transformedFlights, null, 2));
      return res.json({ best_flights: transformedFlights });
    } else {
      console.log('Using local database (no API key or base URL configured)');
      // Use local database
      const flights = await Flight.find({
        departureCity: { $regex: new RegExp(departureCity, 'i') },
        arrivalCity: { $regex: new RegExp(arrivalCity, 'i') },
        departureTime: {
          $gte: departureStart,
          $lte: departureEnd
        }
      }).sort({ departureTime: 1 });

      return res.json(flights);
    }
  } catch (error) {
    console.error('Error searching flights:', error);
    return res.status(500).json({ 
      message: 'Error searching flights',
      details: error instanceof Error ? error.message : 'Unknown error'
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