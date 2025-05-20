import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
const expiration = '2h';

export interface AuthUser {
  _id?: string;
  username?: string;
}

export const signToken = (user: AuthUser) => {
  const payload = {
    _id: user._id,
    username: user.username
  };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

// Middleware for REST API routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { data: AuthUser };
    const user: { _id?: string; username?: string } = {};
    if (decoded.data._id) user._id = decoded.data._id;
    if (decoded.data.username) user.username = decoded.data.username;
    req.user = user;
    next();
    return;
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
};

// Context function for GraphQL
export const authContext = async ({ req }: { req: Request }) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, secret) as { data: AuthUser };
    const user: { _id?: string; username?: string } = {};
    if (decoded.data._id) user._id = decoded.data._id;
    if (decoded.data.username) user.username = decoded.data.username;
    return { user };
  } catch (error) {
    throw new GraphQLError('Invalid token', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
