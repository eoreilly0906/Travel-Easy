import { Link } from 'react-router-dom';
import "../extra-css/landing.css"


const Landing = () => {
  return (
    <main
      className= "landing-container"
      
    >
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to TravelEasy! ✈️</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Real-time flight tracking, arrivals, departures, and personalized travel updates.
        </p>
        <Link
          to="/home"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
};

export default Landing;
