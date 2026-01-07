import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero islamic-pattern">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-fadeInDown">
            <span className="badge badge-gold">
              ✨ Trusted by 25,000+ Pilgrims
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title animate-fadeInUp">
            Your Complete Journey to
            <span className="hero-title-highlight"> Sacred Lands</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-fadeInUp">
            The world's first comprehensive, verified marketplace for all Islamic pilgrimage services.
            Book Umrah, Hajj, and religious tours with complete transparency and trust.
          </p>

          {/* Arabic Quote */}
          <div className="hero-arabic animate-fadeInUp">
            <p className="arabic-text">﴿ وَأَذِّن فِي النَّاسِ بِالْحَجِّ ﴾</p>
            <p className="hero-arabic-translation">
              "And proclaim to the people the Hajj" - Quran 22:27
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions animate-fadeInUp">
            <Link to="/packages" className="btn btn-primary btn-xl">
              <span>🕌</span>
              Explore Umrah Packages
            </Link>
            <Link to="/track" className="btn btn-secondary btn-xl">
              <span>📱</span>
              Track Your Application
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fadeInUp">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Verified Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25K+</div>
              <div className="stat-label">Happy Pilgrims</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="hero-decoration hero-decoration-1"></div>
      <div className="hero-decoration hero-decoration-2"></div>
    </section>
  );
};

export default Hero;
