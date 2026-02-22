import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import ThingsToDo from './pages/ThingsToDo';
import Parks from './pages/Parks';
import FlightSearch from './pages/FlightSearch';
import SavedFlights from './pages/SavedFlights';
import Testimonial from './pages/Testimonial.tsx';

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

      
      },{
        path:'/testimonial',
        element: <Testimonial />

      }

    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
