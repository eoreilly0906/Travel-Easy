interface FlightSearchParams {
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

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : 'https://travel-easy-21g7.onrender.com';

export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  try {
    const response = await fetch(`${API_URL}/api/flights/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch flights');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}; 