import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import Auth from '../utils/auth';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  const logout = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-container">
          <i className="fas fa-plane-departure brand-icon"></i>
          <span className="brand-text">Travel Easy</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/home" 
              className={isActive('/home') ? 'active' : ''}
            >
              <i className="fas fa-home"></i> Home
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
              className={isActive('/testimonial') ? 'active' : ''}
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 