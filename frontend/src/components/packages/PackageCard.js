import React from 'react';
import { Link } from 'react-router-dom';
import './PackageCard.css';

const PackageCard = ({ package: pkg, index }) => {
  const discount = pkg.basePrice && pkg.discountedPrice 
    ? Math.round(((pkg.basePrice - pkg.discountedPrice) / pkg.basePrice) * 100)
    : 0;

  const serviceClassColors = {
    economy: 'blue',
    gold: 'gold',
    diamond: 'purple',
    platinum: 'black'
  };

  const serviceClassColor = serviceClassColors[pkg.serviceClass] || 'green';

  return (
    <div className="package-card" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Featured Badge */}
      {pkg.featured && (
        <div className="package-featured-badge">
          <span>⭐ Featured</span>
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="package-discount-badge">
          {discount}% OFF
        </div>
      )}

      {/* Package Header */}
      <div className="package-header">
        <div className="package-type-badge">
          <span className="package-icon">🕌</span>
          <span>{pkg.packageType.toUpperCase()}</span>
        </div>
        <div className={`package-class-badge badge-${serviceClassColor}`}>
          {pkg.serviceClass.charAt(0).toUpperCase() + pkg.serviceClass.slice(1)}
        </div>
      </div>

      {/* Package Title */}
      <h3 className="package-title">{pkg.title}</h3>

      {/* Package Info */}
      <div className="package-info">
        <div className="package-info-item">
          <span className="info-icon">📅</span>
          <span>{pkg.duration} Days</span>
        </div>
        <div className="package-info-item">
          <span className="info-icon">📍</span>
          <span>{pkg.departureCity}</span>
        </div>
        <div className="package-info-item">
          <span className="info-icon">🕌</span>
          <span>{pkg.makkahDays}D Makkah</span>
        </div>
        <div className="package-info-item">
          <span className="info-icon">🕋</span>
          <span>{pkg.madinahDays}D Madinah</span>
        </div>
      </div>

      {/* Hotels */}
      <div className="package-hotels">
        <div className="hotel-item">
          <div className="hotel-name">{pkg.hotelDetails.makkah.name}</div>
          <div className="hotel-stars">
            {'⭐'.repeat(pkg.hotelDetails.makkah.stars)}
          </div>
          <div className="hotel-distance">{pkg.hotelDetails.makkah.distance}</div>
        </div>
        <div className="hotel-item">
          <div className="hotel-name">{pkg.hotelDetails.madinah.name}</div>
          <div className="hotel-stars">
            {'⭐'.repeat(pkg.hotelDetails.madinah.stars)}
          </div>
          <div className="hotel-distance">{pkg.hotelDetails.madinah.distance}</div>
        </div>
      </div>

      {/* Inclusions */}
      <div className="package-inclusions">
        {pkg.inclusions.slice(0, 5).map((inclusion, idx) => (
          <span key={idx} className="inclusion-badge">
            ✓ {inclusion}
          </span>
        ))}
        {pkg.inclusions.length > 5 && (
          <span className="inclusion-badge">+{pkg.inclusions.length - 5} more</span>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="package-rating">
        <div className="rating-stars">
          <span className="rating-value">{pkg.rating}</span>
          <span className="stars">⭐⭐⭐⭐⭐</span>
        </div>
        <span className="reviews-count">({pkg.reviewsCount} reviews)</span>
      </div>

      {/* Vendor Info */}
      <div className="package-vendor">
        <div className="vendor-info">
          <span className="vendor-name">{pkg.vendor.name}</span>
          <span className="trust-score">
            ✓ Trust Score: {pkg.vendor.trustScore}%
          </span>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="package-footer">
        <div className="package-price">
          {pkg.basePrice && pkg.discountedPrice && (
            <span className="price-original">₹{pkg.basePrice.toLocaleString()}</span>
          )}
          <div className="price-current">
            <span className="price-amount">₹{(pkg.discountedPrice || pkg.basePrice).toLocaleString()}</span>
            <span className="price-label">per person</span>
          </div>
        </div>
        <Link to={`/packages/${pkg.id}`} className="btn btn-primary">
          View Details →
        </Link>
      </div>

      {/* Seats Remaining */}
      {pkg.seatsRemaining && pkg.seatsRemaining <= 10 && (
        <div className="package-urgency">
          🔥 Only {pkg.seatsRemaining} seats left!
        </div>
      )}
    </div>
  );
};

export default PackageCard;
