import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ShoppingCart, 
  User, 
  Search,
  Menu,
  X
} from 'lucide-react';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  // Service categories matching your screenshot
  const services = {
    hajj: {
      title: 'Hajj',
      items: [
        { name: 'Hajj Packages', path: '/packages?type=hajj' },
        { name: 'Economy Hajj', path: '/packages?type=hajj&class=economy' },
        { name: 'Premium Hajj', path: '/packages?type=hajj&class=premium' },
        { name: 'VIP Hajj', path: '/packages?type=hajj&class=vip' },
      ]
    },
    umrah: {
      title: 'Umrah',
      items: [
        { name: 'Umrah Packages', path: '/packages?type=umrah' },
        { name: 'Economy Umrah', path: '/packages?type=umrah&class=economy' },
        { name: 'Premium Umrah', path: '/packages?type=umrah&class=premium' },
        { name: 'Ramadan Umrah', path: '/packages?type=umrah&special=ramadan' },
        { name: 'Family Umrah', path: '/packages?type=umrah&special=family' },
      ]
    },
    utilities: {
      title: 'Utilities',
      items: [
        { name: 'eSIM Services', path: '/services/esim' },
        { name: 'Travel Insurance', path: '/services/insurance' },
        { name: 'Currency Exchange', path: '/services/forex' },
        { name: 'Travel Guides', path: '/services/guides' },
      ]
    }
  };

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <div className="mosque-icon">☪</div>
          </div>
          <div className="logo-text">
            <span className="logo-main">UMRAH</span>
            <span className="logo-sub">CENTER.COM</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          {/* Hajj Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setActiveDropdown('hajj')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link">
              Hajj <ChevronDown size={16} />
            </button>
            {activeDropdown === 'hajj' && (
              <div className="dropdown-menu">
                {services.hajj.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Umrah Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setActiveDropdown('umrah')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link">
              Umrah <ChevronDown size={16} />
            </button>
            {activeDropdown === 'umrah' && (
              <div className="dropdown-menu">
                {services.umrah.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Single Links */}
          <Link to="/services/ziyarat" className="nav-link">Ziyarat</Link>
          <Link to="/services/hotels" className="nav-link">Hotels</Link>
          <Link to="/services/visa" className="nav-link">Visa</Link>
          <Link to="/services/forex" className="nav-link">Forex</Link>
          <Link to="/services/catering" className="nav-link">Catering</Link>
          <Link to="/services/transport" className="nav-link">Transport</Link>
          <Link to="/services/flights" className="nav-link">Flights</Link>

          {/* Utilities Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setActiveDropdown('utilities')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link">
              Utilities <ChevronDown size={16} />
            </button>
            {activeDropdown === 'utilities' && (
              <div className="dropdown-menu">
                {services.utilities.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* Search Icon */}
          <button className="action-btn" aria-label="Search">
            <Search size={20} />
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="action-btn cart-btn">
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </Link>

          {/* User Profile */}
          <Link to="/login" className="action-btn user-btn">
            <User size={20} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          {/* Hajj */}
          <div className="mobile-nav-section">
            <button 
              className="mobile-nav-title"
              onClick={() => handleDropdownToggle('hajj')}
            >
              Hajj <ChevronDown size={16} className={activeDropdown === 'hajj' ? 'rotated' : ''} />
            </button>
            {activeDropdown === 'hajj' && (
              <div className="mobile-dropdown">
                {services.hajj.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="mobile-dropdown-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Umrah */}
          <div className="mobile-nav-section">
            <button 
              className="mobile-nav-title"
              onClick={() => handleDropdownToggle('umrah')}
            >
              Umrah <ChevronDown size={16} className={activeDropdown === 'umrah' ? 'rotated' : ''} />
            </button>
            {activeDropdown === 'umrah' && (
              <div className="mobile-dropdown">
                {services.umrah.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="mobile-dropdown-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Single Links */}
          <Link to="/services/ziyarat" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Ziyarat</Link>
          <Link to="/services/hotels" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Hotels</Link>
          <Link to="/services/visa" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Visa</Link>
          <Link to="/services/forex" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Forex</Link>
          <Link to="/services/catering" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Catering</Link>
          <Link to="/services/transport" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Transport</Link>
          <Link to="/services/flights" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Flights</Link>

          {/* Utilities */}
          <div className="mobile-nav-section">
            <button 
              className="mobile-nav-title"
              onClick={() => handleDropdownToggle('utilities')}
            >
              Utilities <ChevronDown size={16} className={activeDropdown === 'utilities' ? 'rotated' : ''} />
            </button>
            {activeDropdown === 'utilities' && (
              <div className="mobile-dropdown">
                {services.utilities.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className="mobile-dropdown-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
