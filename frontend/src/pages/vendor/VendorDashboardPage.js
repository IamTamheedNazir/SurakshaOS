import React from 'react';

const VendorDashboardPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>💼 Vendor Dashboard</h1>
      <p style={{ marginBottom: '2rem' }}>Coming Soon - Complete vendor management with CRM & Accounting</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>📊 Dashboard</h3>
          <p>Overview & Stats</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>📦 Packages</h3>
          <p>Manage packages</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>📋 Bookings</h3>
          <p>All bookings</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>👥 CRM</h3>
          <p>Customer management</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>💰 Accounting</h3>
          <p>Financial reports</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h3>📄 Documents</h3>
          <p>Visa & documents</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
