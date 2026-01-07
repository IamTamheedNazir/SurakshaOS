import React from 'react';
import { Link } from 'react-router-dom';

const PackagesPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>📦 Packages Page</h1>
      <p style={{ marginBottom: '2rem' }}>Coming Soon - Package listing with filters</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default PackagesPage;
