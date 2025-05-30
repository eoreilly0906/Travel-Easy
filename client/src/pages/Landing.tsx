import React from 'react';
import { Link } from 'react-router-dom';
import "../extra-css/landing.css"

const Landing = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to Travel Easy
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Your all-in-one travel companion for seamless trip planning and unforgettable adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-4 text-white">
              <i className="fas fa-plane-departure mr-3"></i>
              Flight Search
            </h2>
            <p className="text-indigo-200 mb-6">
              Find the best flight deals with our advanced search engine. Compare prices, routes, and airlines to plan your perfect journey.
            </p>
            <Link 
              to="/flights" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Search Flights
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-4 text-white">
              <i className="fas fa-tree mr-3"></i>
              National Parks
            </h2>
            <p className="text-indigo-200 mb-6">
              Explore the beauty of America's national parks. Get detailed information about trails, facilities, and park activities.
            </p>
            <Link 
              to="/parks" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Explore Parks
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-4 text-white">
              <i className="fas fa-map-marked-alt mr-3"></i>
              Things to Do
            </h2>
            <p className="text-indigo-200 mb-6">
              Discover exciting activities and attractions at your destination. From local hotspots to hidden gems, find the perfect experiences.
            </p>
            <Link 
              to="/thingstodo" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Find Activities
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose Travel Easy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-white">
                <i className="fas fa-bolt mr-2"></i>
                Fast & Easy
              </h3>
              <p className="text-indigo-200">
                Quick and intuitive interface for planning your perfect trip in minutes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-white">
                <i className="fas fa-shield-alt mr-2"></i>
                Reliable
              </h3>
              <p className="text-indigo-200">
                Trusted information and real-time updates for a worry-free journey.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-white">
                <i className="fas fa-heart mr-2"></i>
                <div className="Personalized">
                Personalized 
                </div>
              </h3>
              <p className="text-indigo-200">
                Customized recommendations based on your preferences and travel history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
