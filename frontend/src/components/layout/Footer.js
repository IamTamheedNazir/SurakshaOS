import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top islamic-pattern-gold">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <span className="footer-logo-icon">☪️</span>
                <div className="footer-logo-text">
                  <span className="footer-logo-main">UmrahConnect</span>
                  <span className="footer-logo-version">2.0</span>
                </div>
              </div>
              <p className="footer-description">
                The world's first comprehensive, verified marketplace for all Islamic pilgrimage services. 
                Book Umrah, Hajj, and religious tours with complete transparency and trust.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  📘
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  🐦
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  📷
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  💼
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  📺
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li><Link to="/packages?type=umrah">Umrah Packages</Link></li>
                <li><Link to="/packages?type=hajj">Hajj Packages</Link></li>
                <li><Link to="/packages?type=iran">Iran Tours</Link></li>
                <li><Link to="/packages?type=iraq">Iraq Tours</Link></li>
                <li><Link to="/packages?type=turkey">Turkey Tours</Link></li>
                <li><Link to="/services/hotels">Hotels</Link></li>
                <li><Link to="/services/transport">Transport</Link></li>
                <li><Link to="/services/visa">Visa Services</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/vendors">Become a Vendor</Link></li>
                <li><Link to="/affiliate">Affiliate Program</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/press">Press Kit</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/track">Track Application</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/refund">Refund Policy</Link></li>
                <li><Link to="/cancellation">Cancellation Policy</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h4 className="footer-title">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:+911800XXXXXXX">+91 1800-XXX-XXXX</a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:support@umrahconnect.com">support@umrahconnect.com</a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">💬</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <a href="https://wa.me/911800XXXXXXX" target="_blank" rel="noopener noreferrer">
                      Chat with us
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">🕐</span>
                  <div>
                    <strong>Support Hours</strong>
                    <span>24/7 Available</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {currentYear} UmrahConnect 2.0. All rights reserved.</p>
              <p className="footer-tagline">
                Built with ❤️ for the Muslim Ummah
              </p>
            </div>

            <div className="footer-badges">
              <div className="footer-badge">
                <span>🔒</span>
                <span>Secure Payments</span>
              </div>
              <div className="footer-badge">
                <span>✓</span>
                <span>Verified Platform</span>
              </div>
              <div className="footer-badge">
                <span>🏆</span>
                <span>Trusted by 25K+</span>
              </div>
              <div className="footer-badge">
                <span>⭐</span>
                <span>4.8/5 Rating</span>
              </div>
            </div>

            <div className="footer-payment-methods">
              <p className="footer-payment-title">We Accept</p>
              <div className="payment-icons">
                <span className="payment-icon" title="Visa">💳</span>
                <span className="payment-icon" title="Mastercard">💳</span>
                <span className="payment-icon" title="UPI">📱</span>
                <span className="payment-icon" title="Net Banking">🏦</span>
                <span className="payment-icon" title="Wallets">💰</span>
              </div>
            </div>
          </div>

          {/* Islamic Quote */}
          <div className="footer-quote">
            <p className="arabic-text">
              ﴿ وَأَذِّن فِي النَّاسِ بِالْحَجِّ ﴾
            </p>
            <p className="footer-quote-translation">
              "And proclaim to the people the Hajj" - Quran 22:27
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
