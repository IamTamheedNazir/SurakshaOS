import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

// Icons
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for logged in user
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    closeMenu();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'vendor') return '/vendor-dashboard';
    return '/dashboard';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🕌</span>
          <span className="logo-text">UmrahConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/packages" 
            className={`nav-link ${isActive('/packages') ? 'active' : ''}`}
          >
            Packages
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact
          </Link>
          <Link 
            to="/faq" 
            className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
          >
            FAQ
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <Link to={getDashboardLink()} className="user-button">
                <UserIcon />
                <span>{user.name || 'Dashboard'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link 
          to="/packages" 
          className={`mobile-link ${isActive('/packages') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Packages
        </Link>
        <Link 
          to="/about" 
          className={`mobile-link ${isActive('/about') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`mobile-link ${isActive('/contact') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Contact
        </Link>
        <Link 
          to="/faq" 
          className={`mobile-link ${isActive('/faq') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          FAQ
        </Link>

        <div className="mobile-auth">
          {user ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="mobile-link dashboard-link"
                onClick={closeMenu}
              >
                <UserIcon />
                <span>{user.name || 'Dashboard'}</span>
              </Link>
              <button onClick={handleLogout} className="mobile-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="mobile-register" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
