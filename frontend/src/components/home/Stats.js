import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    {
      icon: '👥',
      number: '25,000+',
      label: 'Happy Pilgrims',
      description: 'Served with excellence'
    },
    {
      icon: '🕌',
      number: '500+',
      label: 'Verified Vendors',
      description: 'Trusted partners'
    },
    {
      icon: '📦',
      number: '1,000+',
      label: 'Packages',
      description: 'Available options'
    },
    {
      icon: '⭐',
      number: '4.8/5',
      label: 'Average Rating',
      description: 'Customer satisfaction'
    },
    {
      icon: '🌍',
      number: '50+',
      label: 'Cities',
      description: 'Departure locations'
    },
    {
      icon: '💰',
      number: '₹100Cr+',
      label: 'GMV',
      description: 'Transactions processed'
    }
  ];

  return (
    <section className="stats-section section">
      <div className="container">
        <div className="stats-content">
          <div className="stats-header">
            <span className="section-badge badge badge-primary">
              📊 Our Impact
            </span>
            <h2 className="section-title">
              Trusted by Thousands of Pilgrims
            </h2>
            <p className="section-subtitle">
              Join the largest community of satisfied pilgrims who chose UmrahConnect.in for their sacred journey
            </p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
