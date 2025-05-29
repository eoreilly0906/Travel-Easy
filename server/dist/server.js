import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, existsSync } from 'node:fs';
import cors from 'cors';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authContext } from './utils/auth.js';
import flightRoutes from './routes/flightRoutes.js';
import savedFlightRoutes from './routes/savedFlightRoutes.js';
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
    // REST API routes
    app.use('/api/flights', flightRoutes);
    app.use('/api/saved-flights', savedFlightRoutes);
    app.use('/api/testimonials', testimonialRoutes);
    app.use('/graphql', expressMiddleware(server, {
        context: authContext
    }));
    // Always serve static files in production
    const clientDistPath = path.join(__dirname, '../../client/dist');
    console.log('Current directory:', __dirname);
    console.log('Serving static files from:', clientDistPath);
    console.log('Directory contents:', readdirSync(clientDistPath));
    app.use(express.static(clientDistPath));
    app.get('*', (_req, res) => {
        const indexPath = path.join(clientDistPath, 'index.html');
        console.log('Serving index.html from:', indexPath);
        console.log('File exists:', existsSync(indexPath));
        res.sendFile(indexPath);
    });
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
