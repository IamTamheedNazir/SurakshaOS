import React, { useState, useEffect } from 'react';
import { bannersAPI } from '../../services/api';
import './BannerSlider.css';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getActiveBanners();
      if (response.success && response.data) {
        setBanners(response.data);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="banner-slider-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="banner-slider">
      <div className="slider-container">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundColor: banner.backgroundColor || '#10b981'
            }}
          >
            {/* Background Image */}
            <div 
              className="slide-background"
              style={{
                backgroundImage: `url(${banner.image})`
              }}
            ></div>

            {/* Overlay */}
            <div className="slide-overlay"></div>

            {/* Content */}
            <div className="slide-content">
              <div className="container">
                <div className="slide-text">
                  <h1 
                    className="slide-title"
                    style={{ color: banner.textColor || '#ffffff' }}
                  >
                    {banner.title}
                  </h1>
                  
                  {banner.subtitle && (
                    <p 
                      className="slide-subtitle"
                      style={{ color: banner.textColor || '#ffffff' }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                  
                  {banner.description && (
                    <p 
                      className="slide-description"
                      style={{ color: banner.textColor || '#ffffff' }}
                    >
                      {banner.description}
                    </p>
                  )}
                  
                  {banner.buttonText && banner.buttonLink && (
                    <a 
                      href={banner.buttonLink} 
                      className="slide-button"
                    >
                      {banner.buttonText}
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            className="slider-arrow slider-arrow-left" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="slider-arrow slider-arrow-right" 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="slider-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
