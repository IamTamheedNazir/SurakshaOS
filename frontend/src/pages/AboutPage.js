import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About UmrahConnect.in</h1>
      <div className="card" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          UmrahConnect.in is India's first comprehensive, verified marketplace for all Islamic pilgrimage services.
        </p>
        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          We connect pilgrims with 500+ verified vendors, offering transparent pricing, flexible payments, 
          and real-time tracking for a seamless sacred journey.
        </p>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
