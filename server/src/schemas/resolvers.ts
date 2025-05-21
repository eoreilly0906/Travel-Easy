import { Thought, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface ThoughtArgs {
  thoughtId: string;
}

interface AddThoughtArgs {
  input:{
    thoughtText: string;
    thoughtAuthor: string;
  }
}

interface AddCommentArgs {
  thoughtId: string;
  commentText: string;
}

interface RemoveCommentArgs {
  thoughtId: string;
  commentId: string;
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('thoughts');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('thoughts');
    },
    thoughts: async () => {
      return await Thought.find().sort({ createdAt: -1 });
    },
    thought: async (_parent: any, { thoughtId }: ThoughtArgs) => {
      return await Thought.findOne({ _id: thoughtId });
    },
    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken({
        _id: user._id as string,
        username: user.username as string
      });
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      try {
        console.log('Login attempt received:', { email });
        
        // Find a user with the provided email
        const user = await User.findOne({ email });
        console.log('User lookup result:', user ? {
          found: true,
          username: user.username,
          hasPassword: !!user.password
        } : 'User not found');
      
        // If no user is found, throw an AuthenticationError
        if (!user) {
          console.error('Login failed: User not found for email:', email);
          throw new AuthenticationError('No user found with this email address.');
        }
      
        // Check if the provided password is correct
        console.log('Verifying password...');
        const correctPw = await user.isCorrectPassword(password);
        console.log('Password verification result:', correctPw ? 'Password correct' : 'Password incorrect');
      
        // If the password is incorrect, throw an AuthenticationError
        if (!correctPw) {
          console.error('Login failed: Incorrect password for email:', email);
          throw new AuthenticationError('Incorrect password.');
        }
      
        console.log('Login successful for user:', user.username);
        
        // Sign a token with the user's information
        const token = signToken({
          _id: user._id as string,
          username: user.username as string
        });
      
        console.log('Token generated successfully');
        
        // Return the token and the user
        return { token, user };
      } catch (error) {
        console.error('Login error:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : 'Unknown error type'
        });
        
        if (error instanceof AuthenticationError) {
          throw error;
        }
        
        // If it's a MongoDB error, provide a more specific message
        if (error instanceof Error && error.name === 'MongoError') {
          throw new Error('Database error occurred during login.');
        }
        
        throw new Error('An unexpected error occurred during login.');
      }
    },
    addThought: async (_parent: any, { input }: AddThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.create({ ...input });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { thoughts: thought._id } }
        );

        return thought;
      }
      throw AuthenticationError;
      ('You need to be logged in!');
    },
    addComment: async (_parent: any, { thoughtId, commentText }: AddCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeThought: async (_parent: any, { thoughtId }: ThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: thoughtId,
          thoughtAuthor: context.user.username,
        });

        if(!thought){
          throw AuthenticationError;
        }

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } }
        );

        return thought;
      }
      throw AuthenticationError;
    },
    removeComment: async (_parent: any, { thoughtId, commentId }: RemoveCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
