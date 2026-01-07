import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🕌',
      title: 'Umrah Packages',
      description: 'Complete Umrah packages with flights, hotels, visa, and transport',
      link: '/packages?type=umrah',
      color: 'green'
    },
    {
      icon: '🌙',
      title: 'Hajj Packages',
      description: 'Comprehensive Hajj packages with expert guidance and support',
      link: '/packages?type=hajj',
      color: 'gold'
    },
    {
      icon: '🏨',
      title: 'Hotels',
      description: '3-star to 5-star hotels near Haram with verified reviews',
      link: '/services/hotels',
      color: 'blue'
    },
    {
      icon: '✈️',
      title: 'Flights',
      description: 'Direct and connecting flights from major Indian cities',
      link: '/services/flights',
      color: 'purple'
    },
    {
      icon: '🚗',
      title: 'Transport',
      description: 'Airport transfers, Ziyarat tours, and local transport',
      link: '/services/transport',
      color: 'orange'
    },
    {
      icon: '📄',
      title: 'Visa Services',
      description: 'Fast-track visa processing with document assistance',
      link: '/services/visa',
      color: 'red'
    },
    {
      icon: '👨‍🏫',
      title: 'Religious Guides',
      description: 'Experienced guides for Ziyarat and religious education',
      link: '/services/guides',
      color: 'teal'
    },
    {
      icon: '🍽️',
      title: 'Catering',
      description: 'Halal meal plans and catering services',
      link: '/services/catering',
      color: 'pink'
    },
    {
      icon: '📸',
      title: 'Photography',
      description: 'Professional photography and videography services',
      link: '/services/photography',
      color: 'indigo'
    },
    {
      icon: '💱',
      title: 'Forex',
      description: 'Currency exchange at competitive rates',
      link: '/services/forex',
      color: 'yellow'
    },
    {
      icon: '📱',
      title: 'eSIM',
      description: 'International eSIM and connectivity solutions',
      link: '/services/esim',
      color: 'cyan'
    },
    {
      icon: '🎒',
      title: 'Travel Insurance',
      description: 'Comprehensive travel and health insurance',
      link: '/services/insurance',
      color: 'lime'
    }
  ];

  return (
    <section className="services-section section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-badge badge badge-primary">
            🌟 Our Services
          </span>
          <h2 className="section-title">
            Everything You Need for Your Sacred Journey
          </h2>
          <p className="section-subtitle">
            From packages to individual services, we've got you covered with verified vendors
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="service-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`service-icon service-icon-${service.color}`}>
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <span className="service-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
