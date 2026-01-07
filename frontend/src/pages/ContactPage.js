import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Contact Us</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
            <h3>Phone</h3>
            <p>+91 1800-XXX-XXXX</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>24/7 Support</p>
          </div>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <h3>Email</h3>
            <p>support@umrahconnect.in</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Response within 24hrs</p>
          </div>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3>WhatsApp</h3>
            <p>+91 1800-XXX-XXXX</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Instant Support</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
