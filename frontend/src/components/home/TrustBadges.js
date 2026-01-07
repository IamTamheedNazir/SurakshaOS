import React from 'react';
import './TrustBadges.css';

const TrustBadges = () => {
  const badges = [
    {
      icon: '✓',
      text: 'Government Verified',
      color: 'green'
    },
    {
      icon: '🔒',
      text: 'Secure Payments',
      color: 'green'
    },
    {
      icon: '💳',
      text: 'Partial Payments',
      color: 'gold'
    },
    {
      icon: '⭐',
      text: '4.8/5 Rating',
      color: 'gold'
    },
    {
      icon: '📱',
      text: 'Real-time Tracking',
      color: 'green'
    },
    {
      icon: '🌍',
      text: 'Global Coverage',
      color: 'green'
    }
  ];

  return (
    <section className="trust-badges-section">
      <div className="container">
        <div className="trust-badges">
          {badges.map((badge, index) => (
            <div key={index} className="trust-badge">
              <span className={`trust-icon trust-icon-${badge.color}`}>
                {badge.icon}
              </span>
              <span className="trust-text">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
