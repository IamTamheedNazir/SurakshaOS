import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrackingPage = () => {
  const [bookingNumber, setBookingNumber] = useState('');

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>📱 Track Your Application</h1>
        <p style={{ color: 'var(--gray-600)', marginTop: '1rem' }}>
          Enter your booking number to track visa status and application progress
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="form-group">
          <label htmlFor="bookingNumber" className="form-label">
            Booking Number
          </label>
          <input
            type="text"
            id="bookingNumber"
            className="form-input"
            placeholder="Enter your booking number (e.g., UMR2024001234)"
            value={bookingNumber}
            onChange={(e) => setBookingNumber(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
          Track Application
        </button>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>7-Stage Visa Tracking</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            '1. Application Prepared',
            '2. Submitted to Embassy',
            '3. Biometrics Scheduled',
            '4. Under Processing',
            '5. Visa Approved',
            '6. Document Uploaded',
            '7. Ready to Travel'
          ].map((stage, index) => (
            <div key={index} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {index < 3 ? '✅' : '⏳'}
              </div>
              <small>{stage}</small>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TrackingPage;
