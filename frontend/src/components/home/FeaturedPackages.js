import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI } from '../../services/api';
import PackageCard from '../packages/PackageCard';
import './FeaturedPackages.css';

const FeaturedPackages = () => {
  const { data, isLoading, error } = useQuery(
    'featuredPackages',
    () => packagesAPI.getFeatured(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Mock data for development (remove when API is ready)
  const mockPackages = [
    {
      id: '1',
      title: 'Economy Umrah Package',
      packageType: 'umrah',
      serviceClass: 'economy',
      duration: 15,
      departureCity: 'Mumbai',
      basePrice: 85000,
      discountedPrice: 75000,
      makkahDays: 8,
      madinahDays: 7,
      hotelDetails: {
        makkah: { name: 'Al Safwah Hotel', stars: 3, distance: '500m from Haram' },
        madinah: { name: 'Dar Al Eiman Hotel', stars: 3, distance: '300m from Masjid' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat'],
      rating: 4.5,
      reviewsCount: 234,
      seatsRemaining: 12,
      featured: true,
      vendor: {
        name: 'Al Haramain Tours',
        trustScore: 95
      }
    },
    {
      id: '2',
      title: 'Gold Umrah Package',
      packageType: 'umrah',
      serviceClass: 'gold',
      duration: 15,
      departureCity: 'Delhi',
      basePrice: 125000,
      discountedPrice: 110000,
      makkahDays: 8,
      madinahDays: 7,
      hotelDetails: {
        makkah: { name: 'Swissotel Makkah', stars: 5, distance: '100m from Haram' },
        madinah: { name: 'Pullman Zamzam', stars: 5, distance: '50m from Masjid' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat', 'Meals'],
      rating: 4.8,
      reviewsCount: 456,
      seatsRemaining: 8,
      featured: true,
      vendor: {
        name: 'Makkah Express',
        trustScore: 98
      }
    },
    {
      id: '3',
      title: 'Diamond Umrah Package',
      packageType: 'umrah',
      serviceClass: 'diamond',
      duration: 20,
      departureCity: 'Bangalore',
      basePrice: 185000,
      discountedPrice: 165000,
      makkahDays: 12,
      madinahDays: 8,
      hotelDetails: {
        makkah: { name: 'Fairmont Makkah', stars: 5, distance: 'Connected to Haram' },
        madinah: { name: 'Oberoi Madinah', stars: 5, distance: 'Haram View' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat', 'Meals', 'Guide'],
      rating: 4.9,
      reviewsCount: 789,
      seatsRemaining: 5,
      featured: true,
      vendor: {
        name: 'Premium Hajj & Umrah',
        trustScore: 99
      }
    }
  ];

  const packages = data?.data || mockPackages;

  return (
    <section className="featured-packages-section section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-header-content">
            <span className="section-badge badge badge-gold">
              ⭐ Featured Packages
            </span>
            <h2 className="section-title">
              Handpicked Umrah Packages for You
            </h2>
            <p className="section-subtitle">
              Carefully selected packages from our most trusted vendors with the best value for money
            </p>
          </div>
          <Link to="/packages" className="btn btn-outline">
            View All Packages →
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="packages-loading">
            <div className="spinner spinner-lg"></div>
            <p>Loading packages...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            Failed to load packages. Please try again later.
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && !error && (
          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="featured-cta">
          <p className="featured-cta-text">
            Can't find what you're looking for?
          </p>
          <Link to="/packages" className="btn btn-primary btn-lg">
            Browse All Packages
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
