import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Send,
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Hajj Packages', href: '#hajj' },
      { name: 'Umrah Packages', href: '#umrah' },
      { name: 'Ziyarat Tours', href: '#ziyarat' },
      { name: 'Hotels', href: '#hotels' },
      { name: 'Visa Services', href: '#visa' },
      { name: 'Forex Exchange', href: '#forex' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Become a Vendor', href: '/vendor-register' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Track Application', href: '/track' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Vendor Agreement', href: '/vendor-agreement' },
      { name: 'User Agreement', href: '/user-agreement' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Youtube size={20} />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Stay Updated with Best Deals</h3>
              <p className="newsletter-subtitle">
                Subscribe to get exclusive Umrah & Hajj package offers directly in your inbox
              </p>
            </div>
            <form className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <Mail size={20} className="newsletter-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
              </div>
              <button type="submit" className="newsletter-btn">
                <span>Subscribe</span>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column footer-column-wide">
              <Link to="/" className="footer-logo">
                <div className="footer-logo-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L18.36 7 12 9.82 5.64 7 12 4.18zM4 8.27l7 3.5v7.96l-7-3.5V8.27zm9 11.46v-7.96l7-3.5v7.96l-7 3.5z" />
                  </svg>
                </div>
                <div className="footer-logo-text">
                  <span className="footer-logo-main">
                    Umrah<span className="footer-logo-highlight">Connect</span>
                  </span>
                  <div className="footer-logo-tagline">Trusted Pilgrimage Marketplace</div>
                </div>
              </Link>
              <p className="footer-description">
                India's largest marketplace connecting pilgrims with verified Umrah & Hajj service providers. 
                Transparent pricing, trusted vendors, and seamless booking experience.
              </p>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <Phone size={16} />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={16} />
                  <span>support@umrahconnect.com</span>
                </div>
                <div className="footer-contact-item">
                  <MapPin size={16} />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="footer-column">
              <h4 className="footer-column-title">Services</h4>
              <ul className="footer-links">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="footer-column">
              <h4 className="footer-column-title">Support</h4>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-bottom-left">
              <p className="footer-copyright">
                © {currentYear} UmrahConnect. All rights reserved.
              </p>
              <div className="footer-legal-links">
                {footerLinks.legal.map((link, index) => (
                  <Link key={index} to={link.href} className="footer-legal-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="footer-trust">
        <div className="container">
          <div className="trust-badges">
            <div className="trust-badge">
              <div className="trust-badge-icon">🔒</div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">Secure Payments</div>
                <div className="trust-badge-subtitle">SSL Encrypted</div>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon">✓</div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">Verified Vendors</div>
                <div className="trust-badge-subtitle">500+ Partners</div>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon">⭐</div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">4.9 Rating</div>
                <div className="trust-badge-subtitle">50K+ Reviews</div>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon">🏆</div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">Award Winning</div>
                <div className="trust-badge-subtitle">Best Platform 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
