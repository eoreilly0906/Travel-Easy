import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Link } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import ThingsToDo from './pages/ThingsToDo';
import Parks from './pages/Parks';
import FlightSearch from './pages/FlightSearch';
import SavedFlights from './pages/SavedFlights';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />  
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: '/thingstodo',
        element: <ThingsToDo />
      },
      {
        path: '/parks',
        element: <Parks />
      },
      {
        path: '/flights',
        element: <FlightSearch />
      },
      {
        path: '/saved-flights',
        element: <SavedFlights />
      }
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}

// Example Button linking to the Things to Do page
<Link to="/things-to-do">
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Explore Things to Do
  </button>
</Link>
