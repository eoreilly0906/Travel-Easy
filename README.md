# Travel Easy ✈️

A modern travel application that helps users search, compare, and save flight information. Built with React, GraphQL, and MongoDB, Travel Easy provides a seamless experience for planning your next journey.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔐 User Authentication (JWT)
- ✈️ Flight Search and Comparison
- 💾 Save Favorite Flights
- 📱 Responsive Design
- 🔍 Real-time Search
- 💬 Interactive Comments System
- 🎨 Modern UI/UX

## Technologies Used

### Frontend
- React 18
- TypeScript
- Apollo Client
- React Router
- React Bootstrap
- Vite
- JWT Authentication

### Backend
- Node.js
- Express.js
- GraphQL
- Apollo Server
- MongoDB
- Mongoose ODM
- JWT

### Development & Deployment
- GitHub Actions
- Render
- ESLint
- TypeScript
- Dotenv

## Screenshots

### Home Page
![Home Page](./client/public/screenshots/home.png)
*Main dashboard showing flight search interface*

### Search Results
![Search Results](./client/public/screenshots/search.png)
*Flight search results with filtering options*

### Saved Flights
![Saved Flights](./client/public/screenshots/saved.png)
*User's saved flights dashboard*

### User Profile
![User Profile](./client/public/screenshots/profile.png)
*User profile and settings page*

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/travel-easy.git
cd travel-easy
```

2. Install dependencies:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FLIGHT_API_KEY=your_flight_api_key
FLIGHT_API_BASE_URL=your_flight_api_base_url
```

4. Start the development server:
```bash
npm run start:dev
```

## Usage

1. Register a new account or login with existing credentials
2. Use the search interface to find flights
3. Compare different flight options
4. Save your favorite flights
5. Manage your saved flights in your profile

## API Documentation

### GraphQL Endpoints

#### Queries
- `users`: Get all users
- `user(username)`: Get user by username
- `thoughts`: Get all thoughts
- `thought(thoughtId)`: Get thought by ID
- `me`: Get current user

#### Mutations
- `addUser`: Create new user
- `login`: User login
- `addThought`: Add new thought
- `addComment`: Add comment to thought
- `removeThought`: Remove thought
- `removeComment`: Remove comment

## Deployment

The application is deployed on Render. Visit the live application at:
[Travel Easy] https://travel-easy-21g7.onrender.com

## License

This project is licensed under the ISC License.

---

Travel Easy was built with ❤️ by [The Team that brought you HoroScoop and Munchmap!]