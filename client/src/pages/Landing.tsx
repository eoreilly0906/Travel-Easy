import "../extra-css/landing.css"

const Landing = () => {
  return (
    <main className="landing-container">
      <div className="text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4 bg-blue-50/50 px-6 py-3 rounded-lg inline-block text-indigo-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:bg-blue-100/50 transition-all duration-300">Welcome to TravelEasy! ✈️</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-indigo-300">
          Your all-in-one travel companion for seamless journey planning and real-time updates.
        </p>
        
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-3 bg-blue-50/50 px-4 py-2 rounded-lg inline-block text-indigo-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:bg-blue-100/50 transition-all duration-300">✈️ Flight Tracking</h2>
            <p className="text-indigo-300">
              Get real-time updates on flight status, arrivals, and departures. Never miss a connection with our comprehensive flight tracking system.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-3 bg-blue-50/50 px-4 py-2 rounded-lg inline-block text-indigo-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:bg-blue-100/50 transition-all duration-300">🎫 Travel Planning</h2>
            <p className="text-indigo-300">
              Save your favorite flights and create personalized travel itineraries. Plan your journey with ease and keep everything organized in one place.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-3 bg-blue-50/50 px-4 py-2 rounded-lg inline-block text-indigo-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:bg-blue-100/50 transition-all duration-300">🏞️ Local Attractions</h2>
            <p className="text-indigo-300">
              Discover exciting things to do at your destination. From national parks to local attractions, find the best spots to visit during your stay.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-3 bg-blue-50/50 px-4 py-2 rounded-lg inline-block text-indigo-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:bg-blue-100/50 transition-all duration-300">🔔 Smart Notifications</h2>
            <p className="text-indigo-300">
              Stay informed with personalized travel updates. Receive alerts about flight changes, gate updates, and important travel information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
