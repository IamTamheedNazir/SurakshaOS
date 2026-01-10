import React from 'react';
import { Link } from 'react-router-dom';
import './PackageCard.css';

const PackageCard = ({ package: pkg }) => {
  const {
    id,
    title,
    destination,
    duration,
    price,
    discounted_price,
    images,
    avg_rating,
    review_count,
    vendor_name,
    type,
    departure_date
  } = pkg;

  const mainImage = images && images.length > 0 ? images[0] : '/placeholder-package.jpg';
  const discount = discounted_price ? Math.round(((price - discounted_price) / price) * 100) : 0;
  const displayPrice = discounted_price || price;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPackageTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'umrah':
        return '🕋';
      case 'hajj':
        return '🕌';
      case 'ziyarat':
        return '🏛️';
      default:
        return '✈️';
    }
  };

  return (
    <div className="package-card">
      {/* Image Section */}
      <div className="package-card-image">
        <img src={mainImage} alt={title} />
        
        {/* Overlay Badges */}
        <div className="package-card-badges">
          {discount > 0 && (
            <span className="badge badge-discount">
              {discount}% OFF
            </span>
          )}
          <span className="badge badge-type">
            {getPackageTypeIcon(type)} {type}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="favorite-btn" aria-label="Add to favorites">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="package-card-content">
        {/* Vendor */}
        <div className="package-vendor">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>{vendor_name}</span>
        </div>

        {/* Title */}
        <h3 className="package-card-title">{title}</h3>

        {/* Destination & Duration */}
        <div className="package-card-info">
          <div className="info-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{destination}</span>
          </div>
          <div className="info-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{duration} Days</span>
          </div>
        </div>

        {/* Departure Date */}
        {departure_date && (
          <div className="package-departure">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Departs: {formatDate(departure_date)}</span>
          </div>
        )}

        {/* Rating */}
        {avg_rating && (
          <div className="package-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={index < Math.round(avg_rating) ? 'star-filled' : 'star-empty'}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="rating-text">
              {avg_rating.toFixed(1)} ({review_count} reviews)
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="package-divider"></div>

        {/* Price & CTA */}
        <div className="package-card-footer">
          <div className="package-price">
            {discounted_price && (
              <span className="price-original">₹{price.toLocaleString()}</span>
            )}
            <div className="price-current">
              <span className="price-label">From</span>
              <span className="price-amount">₹{displayPrice.toLocaleString()}</span>
            </div>
            <span className="price-per">per person</span>
          </div>

          <Link to={`/packages/${id}`} className="btn btn-primary">
            View Details
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Islamic Decorative Corner */}
      <div className="islamic-corner"></div>
    </div>
  );
};

export default PackageCard;
