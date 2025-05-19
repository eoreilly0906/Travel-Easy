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

export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  try {
    const response = await fetch('/api/flights/search', {
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