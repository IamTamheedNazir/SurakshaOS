import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

// Icons
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AboutUs = () => {
  const values = [
    {
      icon: <HeartIcon />,
      title: 'Customer First',
      description: 'We prioritize your spiritual journey and ensure every detail is perfect for your Umrah experience.'
    },
    {
      icon: <ShieldIcon />,
      title: 'Trust & Transparency',
      description: 'Complete transparency in pricing, services, and processes. No hidden charges, ever.'
    },
    {
      icon: <UsersIcon />,
      title: 'Expert Guidance',
      description: 'Our team of experienced professionals guides you through every step of your journey.'
    },
    {
      icon: <CheckIcon />,
      title: 'Quality Assurance',
      description: 'We partner only with verified vendors who meet our strict quality standards.'
    }
  ];

  const team = [
    {
      name: 'Ahmed Al-Rashid',
      role: 'Founder & CEO',
      image: 'https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=0f6b3f&color=fff&size=200',
      bio: '15+ years in Umrah services'
    },
    {
      name: 'Fatima Hassan',
      role: 'Head of Operations',
      image: 'https://ui-avatars.com/api/?name=Fatima+Hassan&background=0f6b3f&color=fff&size=200',
      bio: 'Expert in travel logistics'
    },
    {
      name: 'Mohammed Khan',
      role: 'Customer Relations',
      image: 'https://ui-avatars.com/api/?name=Mohammed+Khan&background=0f6b3f&color=fff&size=200',
      bio: 'Dedicated to customer satisfaction'
    },
    {
      name: 'Aisha Rahman',
      role: 'Vendor Partnerships',
      image: 'https://ui-avatars.com/api/?name=Aisha+Rahman&background=0f6b3f&color=fff&size=200',
      bio: 'Building trusted relationships'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Pilgrims' },
    { value: '200+', label: 'Trusted Vendors' },
    { value: '4.8/5', label: 'Average Rating' },
    { value: '15+', label: 'Years Experience' }
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About UmrahConnect</h1>
          <p className="hero-subtitle">
            Connecting pilgrims with trusted Umrah service providers since 2009
          </p>
          <p className="hero-description">
            We are India's leading platform for Umrah packages, dedicated to making your spiritual journey 
            seamless, affordable, and memorable. Our mission is to connect you with the best service providers 
            while ensuring transparency, quality, and peace of mind.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To simplify and enhance the Umrah booking experience by connecting pilgrims with 
              verified, high-quality service providers. We strive to make the sacred journey 
              accessible, affordable, and stress-free for everyone.
            </p>
          </div>
          <div className="vision-card">
            <div className="card-icon">🌟</div>
            <h2>Our Vision</h2>
            <p>
              To become the most trusted and comprehensive platform for Umrah services globally, 
              empowering millions of Muslims to fulfill their spiritual aspirations with confidence 
              and ease.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <p className="section-subtitle">
          The principles that guide everything we do
        </p>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">
                {value.icon}
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <h2>Why Choose UmrahConnect?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>Verified Vendors</h4>
              <p>All our partners are thoroughly vetted and verified for quality and reliability</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>Best Price Guarantee</h4>
              <p>Compare packages from multiple vendors and get the best deals</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>24/7 Support</h4>
              <p>Our dedicated team is always available to assist you</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>Secure Booking</h4>
              <p>Your payments and personal information are completely secure</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>Easy Comparison</h4>
              <p>Compare packages side-by-side to make informed decisions</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h4>Trusted Reviews</h4>
              <p>Read genuine reviews from thousands of satisfied pilgrims</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p className="section-subtitle">
          Dedicated professionals committed to your spiritual journey
        </p>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-image">
                <img src={member.image} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Explore our curated Umrah packages and find the perfect one for you</p>
        <div className="cta-buttons">
          <Link to="/packages" className="btn-primary">
            Browse Packages
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
