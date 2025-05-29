import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../utils/auth';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1 className="m-0" style={{ fontSize: '1.5rem' }}>
            <i className="fas fa-plane-departure"></i> Travel Easy
          </h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/home" className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-home"></i> Home
              </Link>
              <Link to="/parks" className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-tree"></i> Parks
              </Link>
              <Link to="/saved-flights" className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-heart"></i> Saved Flights
              </Link>
              <a href="/" onClick={logout} className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/signup" className="mx-2" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className="fas fa-user-plus"></i> Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 