import express from 'express';
import SavedFlight from '../models/SavedFlight.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Save a flight
router.post('/', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { flightDetails, departureCity, arrivalCity, departureDate, returnDate } = req.body;
    
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!flightDetails || !departureCity || !arrivalCity || !departureDate || !returnDate) {
      console.error('Missing required fields:', { flightDetails, departureCity, arrivalCity, departureDate, returnDate });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate flight details structure
    if (!flightDetails.flights || !Array.isArray(flightDetails.flights)) {
      console.error('Invalid flight details structure:', flightDetails);
      return res.status(400).json({ message: 'Invalid flight details structure' });
    }

    const userId = req.user._id;
    console.log('User ID:', userId);

    // Create a properly structured flight details object
    const structuredFlightDetails = {
      flights: flightDetails.flights.map((flight: any) => ({
        airline: String(flight.airline || ''),
        flightNumber: String(flight.flightNumber || ''),
        departureTime: String(flight.departureTime || ''),
        arrivalTime: String(flight.arrivalTime || '')
      })),
      total_duration: Number(flightDetails.total_duration) || 0,
      carbon_emissions: {
        this_flight: Number(flightDetails.carbon_emissions?.this_flight) || 0,
        typical_for_route: Number(flightDetails.carbon_emissions?.typical_for_route) || 0,
        difference_percentage: Number(flightDetails.carbon_emissions?.difference_percentage) || 0
      },
      price: Number(flightDetails.price) || 0,
      type: String(flightDetails.type || 'Standard'),
      airline_logo: String(flightDetails.airline_logo || ''),
      departure_token: String(flightDetails.departure_token || '')
    };

    console.log('Structured flight details:', JSON.stringify(structuredFlightDetails, null, 2));

    try {
      const savedFlight = await SavedFlight.create({
        user: userId,
        flightDetails: structuredFlightDetails,
        departureCity: String(departureCity),
        arrivalCity: String(arrivalCity),
        departureDate: String(departureDate),
        returnDate: String(returnDate)
      });

      console.log('Successfully saved flight:', savedFlight);
      return res.status(201).json(savedFlight);
    } catch (saveError) {
      console.error('Mongoose save error:', saveError);
      if (saveError instanceof Error) {
        return res.status(400).json({ 
          message: 'Invalid flight data',
          details: saveError.message,
          validationErrors: (saveError as any).errors
        });
      }
      throw saveError;
    }
  } catch (error) {
    console.error('Detailed error saving flight:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({ 
      message: 'Error saving flight',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all saved flights for a user
router.get('/', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user._id;
    const savedFlights = await SavedFlight.find({ user: userId })
      .sort({ savedAt: -1 });
    return res.json(savedFlights);
  } catch (error) {
    console.error('Error fetching saved flights:', error);
    return res.status(500).json({ message: 'Error fetching saved flights' });
  }
});

// Delete a saved flight
router.delete('/:id', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { id } = req.params;
    const userId = req.user._id;

    const savedFlight = await SavedFlight.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!savedFlight) {
      return res.status(404).json({ message: 'Saved flight not found' });
    }

    return res.json({ message: 'Saved flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved flight:', error);
    return res.status(500).json({ message: 'Error deleting saved flight' });
  }
});

export default router; 