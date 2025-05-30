import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../utils/auth.js';
import axios from 'axios';
const NPS_API_KEY = process.env.NPS_API_KEY;
const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
        parksByState: async (_parent, { stateCode }) => {
            try {
                const response = await axios.get(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${NPS_API_KEY}`);
                return response.data.data;
            }
            catch (error) {
                console.error('Error fetching parks:', error);
                throw new Error('Failed to fetch parks');
            }
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            const user = await User.create(input);
            const token = signToken(user);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
    },
};
export default resolvers;
