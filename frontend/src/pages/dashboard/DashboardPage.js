import React from 'react';
import { Routes, Route } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>📊 Customer Dashboard</h1>
      <p style={{ marginBottom: '2rem' }}>Coming Soon - Your bookings, payments, and profile</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '2rem', minWidth: '200px' }}>
          <h3>My Bookings</h3>
          <p>View all bookings</p>
        </div>
        <div className="card" style={{ padding: '2rem', minWidth: '200px' }}>
          <h3>Payments</h3>
          <p>Payment history</p>
        </div>
        <div className="card" style={{ padding: '2rem', minWidth: '200px' }}>
          <h3>Documents</h3>
          <p>Upload documents</p>
        </div>
        <div className="card" style={{ padding: '2rem', minWidth: '200px' }}>
          <h3>Profile</h3>
          <p>Manage profile</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
