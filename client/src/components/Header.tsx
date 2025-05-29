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

    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-container">
          <i className="fas fa-plane-departure brand-icon"></i>
          <span className="brand-text">Travel Easy</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/flights" 
              className={isActive('/flights') ? 'active' : ''}
            >
              <i className="fas fa-search"></i> Search Flights
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/parks" 
              className={isActive('/parks') ? 'active' : ''}
            >
              <i className="fas fa-tree"></i> Parks
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/testimonial" 
              className={isActive('/testimonal') ? 'active' : ''}
            >
              <i className="fas fa-comment"></i> Testimonials
            </Nav.Link>
            {Auth.loggedIn() ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/saved-flights" 
                  className={isActive('/saved-flights') ? 'active' : ''}
                >
                  <i className="fas fa-heart"></i> Saved Flights
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className={isActive('/profile') ? 'active' : ''}
                >
                  <i className="fas fa-user"></i> Profile
                </Nav.Link>
                <Nav.Link onClick={logout} className="logout-link">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={isActive('/login') ? 'active' : ''}
                >
                  <i className="fas fa-sign-in-alt"></i> Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className={isActive('/signup') ? 'active' : ''}
                >
                  <i className="fas fa-user-plus"></i> Signup
                </Nav.Link>
              </>
            )}
          </Nav>
          {Auth.loggedIn() && (
            <div className="user-profile">
              <Image
                src={`https://ui-avatars.com/api/?name=${Auth.getProfile().data.username}&background=random`}
                roundedCircle
                className="user-avatar"
                alt="User avatar"
              />
              <span className="username">{Auth.getProfile().data.username}</span>
            </div>

          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 