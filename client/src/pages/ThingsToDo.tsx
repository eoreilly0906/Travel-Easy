import React, { useState, useEffect } from 'react';
import './ThingsToDo.css';

const ThingsToDo: React.FC = () => {
const images = [
"https://th-thumbnailer.cdn-si-edu.com/pl7tMO37jADJMfZ8T1DuIRDaBbc=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/db/d6/dbd616d4-f52c-43cb-a9c2-4f77a5dcb2d3/eiffel-tower-night.jpg", // Eiffel Tower
"https://justhistoryposts.com/wp-content/uploads/2017/07/great-wall-of-china-fact.jpg?w=1170", // Great Wall
"https://trexperienceperu.com/sites/default/files/view_of_huayna_picchu_trexperience.jpg", // Machu Picchu
"https://ychef.files.bbci.co.uk/1280x720/p0gp95cq.jpg",   // Sydney Opera House
"https://www.travelandleisure.com/thmb/wdUcyBQyQ0wUVs4wLahp0iWgZhc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/taj-mahal-agra-india-TAJ0217-9eab8f20d11d4391901867ed1ce222b8.jpg", // Taj Mahal
"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1200px-Colosseo_2020.jpg", // Colosseum
"https://cdn-imgix.headout.com/tour/30357/TOUR-IMAGE/6cdcf542-452d-4897-beed-76cf68f154e4-1act-de005e04-05d9-4715-96b0-6a089d5c3460.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces", // Statue of Liberty
"https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/df/d0/e9.jpg" // Dunn River Falls
];

  const descriptions = [
    "The Eiffel Tower, Paris – a symbol of romance and elegance in the heart of France.",
    "The Great Wall of China – an awe-inspiring feat of ancient engineering stretching thousands of miles.",
    "Machu Picchu, Peru – a breathtaking mountaintop Incan city shrouded in mystery and history.",
    "Sydney Opera House, Australia – an architectural masterpiece and hub of culture by the harbor.",
    "The Taj Mahal, India – a white marble mausoleum built as a testament to eternal love.",
    "The Colosseum, Rome – a gladiatorial arena and enduring symbol of Ancient Roman grandeur.",
    "Statue of Liberty, New York – a global beacon of freedom and a landmark of the American dream.",
    "Dunn River Falls, Jamaica – a stunning natural waterfall cascading through lush tropicals."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const previousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      <div className="container">
        <h1>Favorite Destinations Around the World</h1>
        <div className="image-container">
          <img
            src={`${images[currentIndex]}?auto=format&fit=crop&w=800&q=80`}
            alt={`Destination ${currentIndex + 1}`}
            className="slideshow-image"
          />
          <div className="caption-overlay">{descriptions[currentIndex]}</div>
        </div>
        <div className="slideshow-buttons">
          <button onClick={previousSlide}>&lt; Prev</button>
          <button onClick={nextSlide}>Next &gt;</button>
        </div>
        <div className="dot-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      
      <section className="favorite-itinerary">
  <h2>Top 5 Favorite Sceneries</h2>
  <ol>
    <li>
      <div className="card-container">
        <div className="card"></div>
        <strong>Machu Picchu, Peru</strong> – A breathtaking mountaintop Incan city shrouded in mystery and history.
      </div>
    </li>
    <li>
      <strong>Sydney, Australia</strong> – Visit the iconic Sydney Opera House and enjoy the harbor views and beaches.
    </li>
    <li>
      <strong>Agra, India</strong> – Marvel at the Taj Mahal, a white marble mausoleum and symbol of eternal love.
    </li>
    <li>
      <strong>New York, USA</strong> – See the Statue of Liberty, stroll through Central Park, and explore vibrant city life.
    </li>
    <li>
      <strong>Ocho Rios, Jamaica</strong> – Climb Dunn’s River Falls, relax in natural lagoons, and experience lush tropical beauty.
      <div className="card-container">
        <div className="card"></div>
      </div>
    </li>
  </ol>
</section>

<section className="top-itinerary">
  <h2>Top 3 Most Visted</h2>
  <ol>
    <li>
     
        <strong>Paris, France</strong> – Explore the Eiffel Tower, Louvre Museum, and stroll along the Seine River.
    </li>
    <li>
      <strong>Beijing, China</strong> – Walk the Great Wall, visit the Forbidden City, and enjoy traditional Peking duck.
    </li>
    <li>
      <strong>Rome, Italy</strong> – Discover the Colosseum, Vatican City, and savor authentic Italian cuisine.
    </li>
  </ol>
</section>

<section className="full-itinerary">
  <h1>Full day plans just for you!</h1>
  <h2>Full-Day Itinerary: Paris, France</h2>
  <ul>
    <li><strong>8:00 AM</strong> – Start your day with a croissant and coffee at a local Parisian café.</li>
    <li><strong>9:00 AM</strong> – Visit the Eiffel Tower and enjoy panoramic views of the city.</li>
    <li><strong>11:00 AM</strong> – Take a scenic river cruise on the Seine.</li>
    <li><strong>12:30 PM</strong> – Lunch at a bistro near the Louvre.</li>
    <li><strong>2:00 PM</strong> – Explore the Louvre Museum and see the Mona Lisa.</li>
    <li><strong>5:00 PM</strong> – Walk through the Tuileries Garden and do some shopping on the Champs-Élysées.</li>
    <li><strong>7:30 PM</strong> – Dinner at a fine dining restaurant with views of the Eiffel Tower.</li>
    <li><strong>9:00 PM</strong> – Enjoy a nighttime stroll or a cabaret show at Moulin Rouge.</li>
  </ul>
</section>
<section className="full-itinerary">
  <h2>Full-Day Itinerary: San Francisco, California</h2>
  <ul>
    <li><strong>8:00 AM</strong> – Grab breakfast and coffee at a local café in the Mission District.</li>
    <li><strong>9:00 AM</strong> – Visit Alamo Square and snap photos of the Painted Ladies with the city skyline.</li>
    <li><strong>10:30 AM</strong> – Explore Golden Gate Park and stop by the de Young Museum or California Academy of Sciences.</li>
    <li><strong>12:30 PM</strong> – Enjoy lunch at Fisherman’s Wharf and sample clam chowder in a sourdough bread bowl.</li>
    <li><strong>2:00 PM</strong> – Take a ferry tour around Alcatraz Island or walk along the Embarcadero.</li>
    <li><strong>4:00 PM</strong> – Ride the iconic cable car to Union Square for shopping or relaxing at a café.</li>
    <li><strong>6:00 PM</strong> – Head to North Beach for a delicious Italian dinner.</li>
    <li><strong>8:00 PM</strong> – Finish the day with sunset views from Twin Peaks or the Golden Gate Bridge overlook.</li>
  </ul>
</section>
<section className="full-itinerary">
  <h2>Full-Day Itinerary: St. Croix, U.S. Virgin Islands</h2>
  <ul>
    <li><strong>8:00 AM</strong> – Start with breakfast at a beachside café in Christiansted.</li>
    <li><strong>9:00 AM</strong> – Visit the historic Fort Christiansvaern and stroll through the charming downtown.</li>
    <li><strong>11:00 AM</strong> – Snorkel or dive at the Buck Island Reef National Monument.</li>
    <li><strong>1:00 PM</strong> – Enjoy Caribbean cuisine for lunch at a waterfront restaurant.</li>
    <li><strong>2:30 PM</strong> – Explore the Estate Whim Plantation Museum and learn about island history.</li>
    <li><strong>4:00 PM</strong> – Relax on the beach or kayak in Salt River Bay.</li>
    <li><strong>6:30 PM</strong> – Dine at a seaside restaurant with fresh seafood and island cocktails.</li>
    <li><strong>8:00 PM</strong> – Take an evening bioluminescent bay tour for a magical night experience.</li>
  </ul>
</section>

<section className="full-itinerary">
  <h2>Full-Day Itinerary: Roatán, Honduras</h2>
  <ul>
    <li><strong>8:00 AM</strong> – Have breakfast at a beachfront café in West End.</li>
    <li><strong>9:00 AM</strong> – Go snorkeling or scuba diving in the Mesoamerican Barrier Reef.</li>
    <li><strong>11:30 AM</strong> – Visit Gumbalimba Park for ziplining, wildlife, and cultural exhibits.</li>
    <li><strong>1:00 PM</strong> – Enjoy a local Honduran meal at a seaside restaurant.</li>
    <li><strong>2:30 PM</strong> – Explore the Carambola Botanical Gardens or go hiking.</li>
    <li><strong>4:00 PM</strong> – Relax on West Bay Beach with a fresh coconut or tropical drink.</li>
    <li><strong>6:00 PM</strong> – Watch the sunset and have dinner with ocean views.</li>
    <li><strong>8:00 PM</strong> – Join a beachfront bonfire or local music night.</li>
  </ul>
</section>

<section className="full-itinerary">
  <h2>Full-Day Itinerary: Austin, Texas</h2>
  <ul>
    <li><strong>8:00 AM</strong> – Breakfast tacos and coffee from a local food truck.</li>
    <li><strong>9:00 AM</strong> – Stroll through Zilker Park and visit the Barton Springs Pool.</li>
    <li><strong>11:00 AM</strong> – Explore South Congress Avenue for boutique shopping and murals.</li>
    <li><strong>1:00 PM</strong> – Grab BBQ lunch at Franklin Barbecue or another top local spot.</li>
    <li><strong>2:30 PM</strong> – Visit the Texas State Capitol and Bullock Texas State History Museum.</li>
    <li><strong>4:00 PM</strong> – Enjoy a walk along Lady Bird Lake or rent a kayak.</li>
    <li><strong>6:00 PM</strong> – Head to Rainey Street for dinner and vibrant bar-hopping.</li>
    <li><strong>8:00 PM</strong> – Catch live music at a downtown venue or on Sixth Street.</li>
  </ul>
</section>
      <section className="travel-tips">
        <h2>Travel Tips</h2>
        <ul>
          <li>Always check visa requirements before traveling.</li>
          <li>Keep copies of important documents like your passport and itinerary.</li>
          <li>Learn a few basic phrases in the local language.</li>
          <li>Stay hydrated and carry a reusable water bottle.</li>
          <li>Respect local customs and traditions.</li>
        </ul>
      </section>
      <footer className="footer">
        <p>&copy; 2025 Travel Easy. All rights reserved.</p>
      </footer>        

    </>
  );
};



export default ThingsToDo;
