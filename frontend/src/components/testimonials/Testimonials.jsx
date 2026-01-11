import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../../services/api';
import './Testimonials.css';

const Testimonials = ({ limit = 6 }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, [limit]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsAPI.getFeaturedTestimonials(limit);
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return (
      <div className="testimonial-stars">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`star ${index < rating ? 'filled' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">What Our Pilgrims Say</h2>
          <p className="section-subtitle">
            Real experiences from thousands of satisfied travelers
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-slider">
          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className={`testimonial-card ${
                  index === currentIndex ? 'active' : ''
                }`}
              >
                {/* Quote Icon */}
                <div className="quote-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating */}
                {renderStars(testimonial.rating)}

                {/* Testimonial Text */}
                <p className="testimonial-text">{testimonial.testimonial}</p>

                {/* User Info */}
                <div className="testimonial-user">
                  <div className="user-avatar">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <h4 className="user-name">{testimonial.name}</h4>
                    {testimonial.designation && (
                      <p className="user-designation">{testimonial.designation}</p>
                    )}
                    {testimonial.location && (
                      <p className="user-location">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Package Info */}
                {testimonial.packageName && (
                  <div className="testimonial-package">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span>{testimonial.packageName}</span>
                  </div>
                )}

                {/* Verified Badge */}
                {testimonial.isVerified && (
                  <div className="verified-badge">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                className="testimonial-arrow testimonial-arrow-left"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="testimonial-arrow testimonial-arrow-right"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots */}
              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${
                      index === currentIndex ? 'active' : ''
                    }`}
                    onClick={() => goToTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Grid View for Desktop */}
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial._id} className="testimonial-grid-card">
              {renderStars(testimonial.rating)}
              <p className="testimonial-text">{testimonial.testimonial}</p>
              <div className="testimonial-user">
                <div className="user-avatar">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h4 className="user-name">{testimonial.name}</h4>
                  {testimonial.location && (
                    <p className="user-location">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
