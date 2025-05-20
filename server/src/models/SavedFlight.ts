import mongoose from 'mongoose';

interface IFlightSegment {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
}

interface ICarbonEmissions {
  this_flight: number;
  typical_for_route: number;
  difference_percentage: number;
}

interface IFlightDetails {
  flights: IFlightSegment[];
  total_duration: number;
  carbon_emissions: ICarbonEmissions;
  price: number;
  type: string;
  airline_logo: string;
  departure_token: string;
}

const flightSegmentSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  }
});

const carbonEmissionsSchema = new mongoose.Schema({
  this_flight: {
    type: Number,
    required: true
  },
  typical_for_route: {
    type: Number,
    required: true
  },
  difference_percentage: {
    type: Number,
    required: true
  }
});

const flightDetailsSchema = new mongoose.Schema({
  flights: [flightSegmentSchema],
  total_duration: {
    type: Number,
    required: true
  },
  carbon_emissions: {
    type: carbonEmissionsSchema,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  airline_logo: {
    type: String,
    required: true
  },
  departure_token: {
    type: String,
    required: true
  }
});

const savedFlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightDetails: {
    type: flightDetailsSchema,
    required: true
  },
  departureCity: {
    type: String,
    required: true
  },
  arrivalCity: {
    type: String,
    required: true
  },
  departureDate: {
    type: String,
    required: true
  },
  returnDate: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const SavedFlight = mongoose.model('SavedFlight', savedFlightSchema);

export default SavedFlight; 