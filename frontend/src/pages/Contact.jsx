import React, { useState } from 'react';
import './Contact.css';

// Icons
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MailIcon />,
      title: 'Email Us',
      details: ['support@umrahconnect.com', 'info@umrahconnect.com'],
      link: 'mailto:support@umrahconnect.com'
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211'],
      link: 'tel:+919876543210'
    },
    {
      icon: <LocationIcon />,
      title: 'Visit Us',
      details: ['123 Business Center', 'Mumbai, Maharashtra 400001'],
      link: '#'
    },
    {
      icon: <ClockIcon />,
      title: 'Working Hours',
      details: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
      link: '#'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p>
            Have questions? We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="contact-info-grid">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              className="contact-info-card"
              onClick={(e) => info.link === '#' && e.preventDefault()}
            >
              <div className="info-icon">
                {info.icon}
              </div>
              <h3>{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx}>{detail}</p>
              ))}
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="form-container">
          <div className="form-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll respond within 24 hours</p>
          </div>

          {submitSuccess && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* FAQ Quick Links */}
        <div className="faq-sidebar">
          <h3>Quick Help</h3>
          <p>Looking for quick answers? Check out our FAQ section</p>
          <a href="/faq" className="faq-link">
            Visit FAQ →
          </a>

          <div className="support-hours">
            <h4>Support Hours</h4>
            <div className="hours-list">
              <div className="hours-item">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="hours-item">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="hours-item">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="emergency-contact">
            <h4>Emergency Support</h4>
            <p>For urgent matters during your Umrah journey:</p>
            <a href="tel:+919876543210" className="emergency-number">
              +91 98765 43210
            </a>
            <span className="emergency-note">Available 24/7</span>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="map-section">
        <div className="map-placeholder">
          <LocationIcon />
          <h3>Our Location</h3>
          <p>123 Business Center, Mumbai, Maharashtra 400001</p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
            Open in Google Maps →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
