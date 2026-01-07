import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: '🔍',
      title: 'Search & Compare',
      description: 'Browse verified packages from trusted vendors. Compare prices, hotels, and services to find your perfect match.',
      features: ['500+ Verified Vendors', 'Real-time Availability', 'Transparent Pricing']
    },
    {
      number: '2',
      icon: '📝',
      title: 'Book & Pay',
      description: 'Book with just 10% upfront payment. Choose flexible installment plans that suit your budget.',
      features: ['10% Booking Amount', 'Flexible Installments', 'Secure Payment Gateway']
    },
    {
      number: '3',
      icon: '📄',
      title: 'Documents & Visa',
      description: 'Upload documents online. Track your visa application through 7 stages with real-time updates.',
      features: ['Online Document Upload', '7-Stage Visa Tracking', 'WhatsApp Updates']
    },
    {
      number: '4',
      icon: '✈️',
      title: 'Travel & Enjoy',
      description: 'Receive all travel documents. Get 24/7 support during your journey. Focus on your spiritual experience.',
      features: ['E-Tickets & Vouchers', '24/7 Support', 'Dedicated Guide']
    }
  ];

  return (
    <section className="how-it-works-section section islamic-pattern-gold">
      <div className="container">
        <div className="section-header-center">
          <span className="section-badge badge badge-gold">
            📋 How It Works
          </span>
          <h2 className="section-title">
            Your Journey in 4 Simple Steps
          </h2>
          <p className="section-subtitle">
            From booking to boarding, we make your pilgrimage planning effortless
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <ul className="step-features">
                {step.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {index < steps.length - 1 && (
                <div className="step-connector">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="how-it-works-cta">
          <p className="cta-text">Ready to start your sacred journey?</p>
          <a href="/packages" className="btn btn-primary btn-lg">
            Start Booking Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
