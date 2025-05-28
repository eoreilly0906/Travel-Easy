import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI ? 'URI is set' : 'URI is not set');
    
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    throw new Error('Database connection failed.');
  }
};

export default db;
