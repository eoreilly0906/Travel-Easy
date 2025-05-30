import React, { useState, useEffect } from 'react';
import './Testimonial.css'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Testimonial = {
  name: string;
  message: string;
};

const Testimonial: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !message) return;

    await fetch(`${API_URL}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });

    const newTestimonial: Testimonial = { name, message };
    setTestimonials([newTestimonial, ...testimonials]);
    setName('');
    setMessage('');
  };

  return (
    <div className="testimonial-container">
      <h1 className="testimonial-title" >What Our Travelers Say</h1>

      <form onSubmit={handleSubmit} className="testimonial-form">
        <div>
          <label htmlFor="name" className="your-name" >Your Name</label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="your-comment">Your Comment</label>
          <textarea
            id="message"
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <div className="testimonial-list">
        {testimonials.map((t, index) => (
          <div key={index} className="border-t pt-4">
            <p className="testimonial-message">"{t.message}"</p>
            <p className="testimonial-name">– {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
