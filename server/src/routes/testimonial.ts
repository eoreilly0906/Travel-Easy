import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new testimonial
router.post('/', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    res.status(400).json({ error: 'Name and message are required.' });
  }

  try {
    const newTestimonial = new Testimonial({ name, message });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
