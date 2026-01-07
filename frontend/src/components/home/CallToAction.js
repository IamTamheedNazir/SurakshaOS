import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section islamic-pattern">
      <div className="cta-overlay"></div>
      <div className="container">
        <div className="cta-content">
          {/* Main CTA */}
          <div className="cta-main">
            <span className="cta-badge badge badge-gold">
              ✨ Start Your Journey Today
            </span>
            <h2 className="cta-title">
              Ready to Begin Your Sacred Journey?
            </h2>
            <p className="cta-subtitle">
              Join 25,000+ pilgrims who trusted UmrahConnect.in for their Umrah and Hajj journey. 
              Book now with just 10% payment and flexible installments.
            </p>

            <div className="cta-buttons">
              <Link to="/packages" className="btn btn-gold btn-xl">
                <span>🕌</span>
                Browse Packages
              </Link>
              <Link to="/register" className="btn btn-secondary btn-xl">
                <span>📝</span>
                Create Account
              </Link>
            </div>

            {/* Features */}
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>10% Booking Amount</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>Flexible Installments</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>Real-time Tracking</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Vendor CTA */}
          <div className="cta-vendor">
            <div className="vendor-card">
              <h3 className="vendor-title">Are You a Travel Agent?</h3>
              <p className="vendor-description">
                Join 500+ verified vendors on India's largest Umrah marketplace. 
                Grow your business with our powerful CRM and accounting tools.
              </p>
              <ul className="vendor-benefits">
                <li>
                  <span className="benefit-icon">💼</span>
                  Complete CRM System
                </li>
                <li>
                  <span className="benefit-icon">📊</span>
                  Accounting & Reports
                </li>
                <li>
                  <span className="benefit-icon">📱</span>
                  WhatsApp Integration
                </li>
                <li>
                  <span className="benefit-icon">🎯</span>
                  Lead Management
                </li>
              </ul>
              <Link to="/vendors/register" className="btn btn-primary btn-lg">
                Become a Vendor →
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="cta-contact">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div className="contact-details">
              <span className="contact-label">Call Us</span>
              <a href="tel:+911800XXXXXXX" className="contact-value">+91 1800-XXX-XXXX</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">💬</span>
            <div className="contact-details">
              <span className="contact-label">WhatsApp</span>
              <a href="https://wa.me/911800XXXXXXX" className="contact-value">Chat with us</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div className="contact-details">
              <span className="contact-label">Email</span>
              <a href="mailto:support@umrahconnect.in" className="contact-value">support@umrahconnect.in</a>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="cta-quote">
          <p className="arabic-text">
            ﴿ وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ ﴾
          </p>
          <p className="quote-translation">
            "And complete the Hajj and Umrah for Allah" - Quran 2:196
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="cta-decoration cta-decoration-1"></div>
      <div className="cta-decoration cta-decoration-2"></div>
    </section>
  );
};

export default CallToAction;
