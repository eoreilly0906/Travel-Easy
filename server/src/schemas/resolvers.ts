import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../utils/auth.js';
import axios from 'axios';

interface UserArgs {
  username: string;
}

interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

const NPS_API_KEY = process.env.NPS_API_KEY;

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username });
    },
    me: async (_parent: any, _args: any, context: { user: AuthUser }) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
    parksByState: async (_parent: any, { stateCode }: { stateCode: string }) => {
      try {
        const response = await axios.get(
          `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${NPS_API_KEY}`
        );
        return response.data.data;
      } catch (error) {
        console.error('Error fetching parks:', error);
        throw new Error('Failed to fetch parks');
      }
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: { input: { username: string; email: string; password: string } }) => {
      const user = await User.create(input);
      const token = signToken(user as unknown as AuthUser);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user as unknown as AuthUser);

      return { token, user };
    },
  },
};

export default resolvers;
