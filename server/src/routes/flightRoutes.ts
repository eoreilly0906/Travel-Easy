import express from 'express';
import Flight from '../models/Flight';
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
      // Use external flight API
      const response = await fetch(`${process.env.FLIGHT_API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FLIGHT_API_KEY}`,
        },
        body: JSON.stringify({
          departureCity,
          arrivalCity,
          departureDate,
          returnDate
        }),
        signal: AbortSignal.timeout(Number(process.env.FLIGHT_API_TIMEOUT) || 5000)
      });

      if (!response.ok) {
        throw new Error('External flight API request failed');
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

      res.json(flights);
    }
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Error searching flights' });
  }
});

// Get all flights (for testing)
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Error fetching flights' });
  }
});

export default router; 