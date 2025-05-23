import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import cors from 'cors';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authContext } from './utils/auth.js';
import flightRoutes from './routes/flightRoutes.js';
import savedFlightRoutes from './routes/savedFlightRoutes.js';

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
    origin: ['http://localhost:3000', 'https://travel-easy.onrender.com'],
    credentials: true
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // REST API routes
  app.use('/api/flights', flightRoutes);
  app.use('/api/saved-flights', savedFlightRoutes);

  app.use('/graphql', expressMiddleware(server as any, {
    context: authContext
  }));

  if (process.env.NODE_ENV === 'production') {
    const clientDistPath = path.join(__dirname, '../../client/dist');
    console.log('Serving static files from:', clientDistPath);
    
    app.use(express.static(clientDistPath));

    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(clientDistPath, 'index.html');
      console.log('Serving index.html from:', indexPath);
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
