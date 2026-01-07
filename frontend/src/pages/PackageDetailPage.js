import React from 'react';
import { Link } from 'react-router-dom';

const PackageDetailPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>🕌 Package Details</h1>
      <p style={{ marginBottom: '2rem' }}>Coming Soon - Detailed package information</p>
      <Link to="/packages" className="btn btn-primary">
        Back to Packages
      </Link>
    </div>
  );
};

export default PackageDetailPage;
