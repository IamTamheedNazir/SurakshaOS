import React from 'react';
import { Link } from 'react-router-dom';

const BookingPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>📝 Booking Page</h1>
      <p style={{ marginBottom: '2rem' }}>Coming Soon - 4-step booking process</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
          <strong>Package Selection</strong>
        </div>
        <div className="card" style={{ padding: '1.5rem', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
          <strong>Traveler Info</strong>
        </div>
        <div className="card" style={{ padding: '1.5rem', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
          <strong>Payment</strong>
        </div>
        <div className="card" style={{ padding: '1.5rem', minWidth: '150px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>4️⃣</div>
          <strong>Confirmation</strong>
        </div>
      </div>
      <Link to="/packages" className="btn btn-primary" style={{ marginTop: '2rem' }}>
        Back to Packages
      </Link>
    </div>
  );
};

export default BookingPage;
