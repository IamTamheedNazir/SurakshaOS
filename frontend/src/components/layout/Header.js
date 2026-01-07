import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isVendor, isAdmin } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-icon">☪️</span>
            <div className="logo-text">
              <span className="logo-main">UmrahConnect</span>
              <span className="logo-version">2.0</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/packages" className="nav-link" onClick={closeMobileMenu}>
              🕌 Packages
            </Link>
            <Link to="/track" className="nav-link" onClick={closeMobileMenu}>
              📱 Track Application
            </Link>
            
            {isVendor() && (
              <Link to="/vendor" className="nav-link" onClick={closeMobileMenu}>
                💼 Vendor Panel
              </Link>
            )}
            
            {isAdmin() && (
              <Link to="/admin" className="nav-link" onClick={closeMobileMenu}>
                ⚙️ Admin Panel
              </Link>
            )}
            
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
              ℹ️ About
            </Link>
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>
              📞 Contact
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu-container">
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.firstName} />
                    ) : (
                      <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="user-name hide-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="user-menu-overlay"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="user-menu-dropdown">
                      <div className="user-menu-header">
                        <div className="user-menu-info">
                          <p className="user-menu-name">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="user-menu-email">{user?.email}</p>
                        </div>
                      </div>

                      <div className="user-menu-items">
                        <Link
                          to="/dashboard"
                          className="user-menu-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📊</span> Dashboard
                        </Link>
                        
                        <Link
                          to="/dashboard/bookings"
                          className="user-menu-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📋</span> My Bookings
                        </Link>
                        
                        <Link
                          to="/dashboard/profile"
                          className="user-menu-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>👤</span> Profile
                        </Link>
                        
                        <Link
                          to="/dashboard/notifications"
                          className="user-menu-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>🔔</span> Notifications
                        </Link>
                        
                        <div className="user-menu-divider" />
                        
                        <button
                          className="user-menu-item user-menu-logout"
                          onClick={handleLogout}
                        >
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm hide-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
      )}
    </header>
  );
};

export default Header;
