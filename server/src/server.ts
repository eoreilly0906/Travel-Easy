import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import type { Request, Response } from 'express';
import cors from 'cors';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authContext } from './utils/auth.js';
import flightRoutes from './routes/flightRoutes.js';
import savedFlightRoutes from './routes/savedFlightRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import testimonialRoutes from './routes/testimonial.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    console.error('GraphQL Error:', {
      message: formattedError.message,
      path: formattedError.path,
      extensions: formattedError.extensions,
      originalError: error
    });
    return formattedError;
  }
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  // Enable CORS for all routes
  app.use(cors({
    origin: ['http://localhost:3000', 'https://travel-easy-21g7.onrender.com'],
    credentials: true
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // API routes - these must come before any static file serving
  app.use('/api/flights', flightRoutes);
  app.use('/api/saved-flights', savedFlightRoutes);

  app.use('/api/weather', weatherRoutes);

  app.use('/api/testimonials', testimonialRoutes);

  app.use('/graphql', expressMiddleware(server as any, {
    context: authContext
  }));

  // Serve static files only in production
  if (process.env.NODE_ENV === 'production') {
    const clientDistPath = path.join(__dirname, '../../client/dist');
    if (existsSync(clientDistPath)) {
      // Serve static files
      app.use(express.static(clientDistPath));
      
      // Handle client-side routing - this must be the last route
      app.get('*', (_req: Request, res: Response) => {
        const indexPath = path.join(clientDistPath, 'index.html');
        if (existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ message: 'Not found' });
        }
      });
    }
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: Function) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startApolloServer();
