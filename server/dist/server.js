import express from 'express';
import path from 'node:path';
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
    resolvers
});
const startApolloServer = async () => {
    await server.start();
    await db();
    const PORT = process.env.PORT || 3001;
    const app = express();
    // Enable CORS for all routes
    app.use(cors({
        origin: 'http://localhost:3000', // Allow requests from the client
        credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    // REST API routes
    app.use('/api/flights', flightRoutes);
    app.use('/api/saved-flights', savedFlightRoutes);
    app.use('/graphql', expressMiddleware(server, {
        context: authContext
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
