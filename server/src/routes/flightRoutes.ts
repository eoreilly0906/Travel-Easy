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
      // Use SerpAPI's Google Flights endpoint
      const response = await fetch(`https://serpapi.com/search?engine=google_flights&api_key=${process.env.FLIGHT_API_KEY}&departure_id=${departureCity}&arrival_id=${arrivalCity}&outbound_date=${departureDate}&return_date=${returnDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(Number(process.env.FLIGHT_API_TIMEOUT) || 5000)
      });

      if (!response.ok) {
        return res.status(500).json({ message: 'External flight API request failed' });
      }

      const flights = await response.json();
      return res.json(flights);
    } else {
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
    return res.status(500).json({ message: 'Error searching flights' });
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