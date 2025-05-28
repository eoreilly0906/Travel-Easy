import React, { useState } from 'react';

type Testimonial = {
  name: string;
  message: string;
};

const Testimonial: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !message) return;

    const newTestimonial: Testimonial = { name, message };
    setTestimonials([newTestimonial, ...testimonials]);
    setName('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">What Our Travelers Say</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
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
          <label htmlFor="message" className="block text-sm font-medium">Your Comment</label>
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

      <div className="mt-8 space-y-4">
        {testimonials.map((t, index) => (
          <div key={index} className="border-t pt-4">
            <p className="text-gray-700 italic">"{t.message}"</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">– {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
