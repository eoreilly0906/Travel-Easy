const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
  }

  type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
  }

  input ThoughtInput {
    thoughtText: String!
    thoughtAuthor: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Park {
    id: ID!
    fullName: String
    description: String
    url: String
    states: String
    images: [ParkImage]
  }

  type ParkImage {
    url: String
    altText: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts: [Thought]!
    thought(thoughtId: ID!): Thought
    me: User
    parksByState(stateCode: String!): [Park]
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addThought(input: ThoughtInput!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
  }
`;

export default typeDefs;
