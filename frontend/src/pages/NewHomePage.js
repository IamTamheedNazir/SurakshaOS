import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Building2, 
  Package, 
  Star,
  Shield,
  Clock,
  HeadphonesIcon,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Plane,
  Hotel,
  FileText,
  DollarSign,
  Utensils,
  Bus,
  Smartphone,
  MapPin
} from 'lucide-react';
import './NewHomePage.css';

const NewHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // All services we offer (from PDF)
  const services = [
    {
      id: 1,
      name: 'Umrah Packages',
      description: 'Complete Umrah packages with flights, hotels & visa',
      icon: <Package size={32} />,
      color: '#0d7c66',
      link: '/packages?type=umrah',
      popular: true
    },
    {
      id: 2,
      name: 'Hajj Packages',
      description: 'Comprehensive Hajj services with expert guidance',
      icon: <Users size={32} />,
      color: '#d4af37',
      link: '/packages?type=hajj',
      popular: true
    },
    {
      id: 3,
      name: 'Hotels',
      description: 'Premium hotels near Haram with best rates',
      icon: <Hotel size={32} />,
      color: '#3b82f6',
      link: '/services/hotels'
    },
    {
      id: 4,
      name: 'Flights',
      description: 'Direct & connecting flights to Jeddah & Madinah',
      icon: <Plane size={32} />,
      color: '#10b981',
      link: '/services/flights'
    },
    {
      id: 5,
      name: 'Visa Services',
      description: 'Fast visa processing with document assistance',
      icon: <FileText size={32} />,
      color: '#f59e0b',
      link: '/services/visa'
    },
    {
      id: 6,
      name: 'Transport',
      description: 'Comfortable AC buses & private cars',
      icon: <Bus size={32} />,
      color: '#8b5cf6',
      link: '/services/transport'
    },
    {
      id: 7,
      name: 'Forex Exchange',
      description: 'Best currency exchange rates for Saudi Riyal',
      icon: <DollarSign size={32} />,
      color: '#ec4899',
      link: '/services/forex'
    },
    {
      id: 8,
      name: 'Catering',
      description: 'Halal meals & catering services',
      icon: <Utensils size={32} />,
      color: '#ef4444',
      link: '/services/catering'
    },
    {
      id: 9,
      name: 'eSIM Services',
      description: 'Stay connected with affordable data plans',
      icon: <Smartphone size={32} />,
      color: '#06b6d4',
      link: '/services/esim'
    },
    {
      id: 10,
      name: 'Ziyarat Tours',
      description: 'Guided tours to historical Islamic sites',
      icon: <MapPin size={32} />,
      color: '#84cc16',
      link: '/services/ziyarat'
    }
  ];

  // Platform statistics
  const stats = [
    { icon: <Users size={24} />, value: '50,000+', label: 'Happy Pilgrims' },
    { icon: <Building2 size={24} />, value: '500+', label: 'Verified Vendors' },
    { icon: <Package size={24} />, value: '1,000+', label: 'Packages Available' },
    { icon: <Star size={24} />, value: '4.8/5', label: 'Average Rating' }
  ];

  // Why choose us features
  const features = [
    {
      icon: <Shield size={28} />,
      title: 'Verified Vendors',
      description: 'All vendors are government-verified and licensed'
    },
    {
      icon: <DollarSign size={28} />,
      title: 'Flexible Payments',
      description: 'Pay in installments - 10% booking, rest later'
    },
    {
      icon: <Clock size={28} />,
      title: 'Real-time Tracking',
      description: 'Track your application status 24/7'
    },
    {
      icon: <HeadphonesIcon size={28} />,
      title: '24/7 Support',
      description: 'Dedicated support team always available'
    },
    {
      icon: <Award size={28} />,
      title: 'Best Prices',
      description: 'Competitive rates with no hidden charges'
    },
    {
      icon: <CheckCircle size={28} />,
      title: 'Quality Assured',
      description: 'Verified reviews from real customers'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="new-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Trusted Partner for
              <span className="highlight"> Hajj & Umrah</span>
            </h1>
            <p className="hero-subtitle">
              Compare 500+ verified vendors, book with confidence, and embark on your spiritual journey with complete peace of mind
            </p>

            {/* Search Bar */}
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search packages, destinations, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            {/* Quick Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Everything you need for your pilgrimage journey in one place
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                className="service-card"
                style={{ '--service-color': service.color }}
              >
                {service.popular && (
                  <span className="popular-badge">
                    <TrendingUp size={14} /> Popular
                  </span>
                )}
                <div className="service-icon" style={{ color: service.color }}>
                  {service.icon}
                </div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-arrow">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose UmrahConnect?</h2>
            <p className="section-subtitle">
              We make your pilgrimage journey hassle-free and memorable
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied pilgrims who trusted us for their spiritual journey
            </p>
            <div className="cta-buttons">
              <Link to="/packages" className="cta-btn primary">
                Browse Packages
              </Link>
              <Link to="/register?type=vendor" className="cta-btn secondary">
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHomePage;
