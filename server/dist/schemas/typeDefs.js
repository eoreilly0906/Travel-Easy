const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
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
    me: User
    parksByState(stateCode: String!): [Park]
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
  }
`;
export default typeDefs;
