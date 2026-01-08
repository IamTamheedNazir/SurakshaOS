import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdvertisementSystem.css';

const AdvertisementSystem = () => {
  const [activeTab, setActiveTab] = useState('ads');

  // Advertisement types
  const adTypes = [
    {
      id: 1,
      name: 'Banner Ad',
      slug: 'banner',
      icon: '🖼️',
      description: 'Display banner on homepage',
      positions: ['Top', 'Middle', 'Bottom', 'Sidebar'],
      price: {
        daily: 500,
        weekly: 3000,
        monthly: 10000,
      },
      dimensions: '1200x300px',
      active: 12,
    },
    {
      id: 2,
      name: 'Featured Package',
      slug: 'featured_package',
      icon: '⭐',
      description: 'Highlight package at top of listings',
      positions: ['Top of Search', 'Homepage Featured'],
      price: {
        daily: 300,
        weekly: 1800,
        monthly: 6000,
      },
      dimensions: 'N/A',
      active: 28,
    },
    {
      id: 3,
      name: 'Sponsored Listing',
      slug: 'sponsored',
      icon: '📌',
      description: 'Pin package to top of category',
      positions: ['Category Top', 'Search Results'],
      price: {
        daily: 200,
        weekly: 1200,
        monthly: 4000,
      },
      dimensions: 'N/A',
      active: 45,
    },
    {
      id: 4,
      name: 'Featured Vendor',
      slug: 'featured_vendor',
      icon: '👑',
      description: 'Highlight vendor profile',
      positions: ['Vendor Directory', 'Homepage'],
      price: {
        daily: 400,
        weekly: 2400,
        monthly: 8000,
      },
      dimensions: 'N/A',
      active: 15,
    },
    {
      id: 5,
      name: 'Pop-up Ad',
      slug: 'popup',
      icon: '💬',
      description: 'Display pop-up on page load',
      positions: ['Homepage', 'Package Pages'],
      price: {
        daily: 600,
        weekly: 3600,
        monthly: 12000,
      },
      dimensions: '600x400px',
      active: 5,
    },
  ];

  // Active advertisements
  const [advertisements, setAdvertisements] = useState([
    {
      id: 1,
      vendor: {
        name: 'Al-Haramain Tours',
        email: 'info@alharamain.com',
        avatar: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours',
      },
      type: 'Featured Package',
      title: 'Premium Umrah Package 2026',
      description: '15 Days All-Inclusive Umrah Package',
      image: 'https://via.placeholder.com/300x200',
      position: 'Homepage Featured',
      duration: 'monthly',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      status: 'active',
      impressions: 15420,
      clicks: 892,
      ctr: 5.78,
      spent: 6000,
    },
    {
      id: 2,
      vendor: {
        name: 'Makkah Express',
        email: 'contact@makkahexpress.com',
        avatar: 'https://ui-avatars.com/api/?name=Makkah+Express',
      },
      type: 'Banner Ad',
      title: 'Special Ramadan Offer',
      description: 'Book now and save 20%',
      image: 'https://via.placeholder.com/1200x300',
      position: 'Top',
      duration: 'weekly',
      startDate: '2026-01-05',
      endDate: '2026-01-12',
      status: 'active',
      impressions: 28540,
      clicks: 1245,
      ctr: 4.36,
      spent: 3000,
    },
    {
      id: 3,
      vendor: {
        name: 'Umrah Travels',
        email: 'info@umrahtravels.com',
        avatar: 'https://ui-avatars.com/api/?name=Umrah+Travels',
      },
      type: 'Sponsored Listing',
      title: 'Economy Umrah Package',
      description: '10 Days Budget-Friendly Package',
      image: 'https://via.placeholder.com/300x200',
      position: 'Category Top',
      duration: 'monthly',
      startDate: '2025-12-15',
      endDate: '2026-01-15',
      status: 'expiring_soon',
      impressions: 12380,
      clicks: 654,
      ctr: 5.28,
      spent: 4000,
    },
  ]);

  // Promotion boosts
  const [promotionBoosts, setPromotionBoosts] = useState([
    {
      id: 1,
      name: 'Visibility Boost',
      icon: '👁️',
      description: 'Increase package visibility by 3x',
      duration: '7 days',
      price: 1500,
      benefits: ['3x more impressions', 'Top of search results', 'Homepage visibility'],
    },
    {
      id: 2,
      name: 'Featured Badge',
      icon: '⭐',
      description: 'Add featured badge to your packages',
      duration: '30 days',
      price: 2500,
      benefits: ['Featured badge', 'Priority in listings', 'Trust indicator'],
    },
    {
      id: 3,
      name: 'Social Media Promotion',
      icon: '📱',
      description: 'Promote on our social media channels',
      duration: '14 days',
      price: 3500,
      benefits: ['Instagram post', 'Facebook post', 'Twitter mention'],
    },
    {
      id: 4,
      name: 'Email Campaign',
      icon: '📧',
      description: 'Send to our email subscribers',
      duration: 'One-time',
      price: 5000,
      benefits: ['10,000+ subscribers', 'Targeted audience', 'Analytics report'],
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: '#10b981' },
      expiring_soon: { label: 'Expiring Soon', color: '#f59e0b' },
      expired: { label: 'Expired', color: '#ef4444' },
      paused: { label: 'Paused', color: '#6b7280' },
      pending: { label: 'Pending Approval', color: '#3b82f6' },
    };
    const config = statusConfig[status];
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  const handlePauseAd = (adId) => {
    setAdvertisements(prev =>
      prev.map(ad =>
        ad.id === adId ? { ...ad, status: ad.status === 'active' ? 'paused' : 'active' } : ad
      )
    );
    toast.success('Advertisement status updated');
  };

  const totalImpressions = advertisements.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = advertisements.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalSpent = advertisements.reduce((sum, ad) => sum + ad.spent, 0);
  const avgCTR = advertisements.length > 0
    ? (advertisements.reduce((sum, ad) => sum + ad.ctr, 0) / advertisements.length).toFixed(2)
    : 0;

  return (
    <div className="advertisement-system-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">📢 Advertisement & Promotion System</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Advertisements</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>➕</span>
            Create Advertisement
          </button>
        </div>

        {/* Stats */}
        <div className="ad-stats-grid">
          <div className="ad-stat-card stat-blue">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{totalImpressions.toLocaleString()}</div>
              <div className="stat-label">Total Impressions</div>
            </div>
          </div>
          <div className="ad-stat-card stat-green">
            <div className="stat-icon">🖱️</div>
            <div className="stat-content">
              <div className="stat-value">{totalClicks.toLocaleString()}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
          </div>
          <div className="ad-stat-card stat-purple">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{avgCTR}%</div>
              <div className="stat-label">Average CTR</div>
            </div>
          </div>
          <div className="ad-stat-card stat-orange">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{totalSpent.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ad-tabs">
          <button
            className={`ad-tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <span>📢</span>
            Active Ads
          </button>
          <button
            className={`ad-tab-btn ${activeTab === 'types' ? 'active' : ''}`}
            onClick={() => setActiveTab('types')}
          >
            <span>🎯</span>
            Ad Types
          </button>
          <button
            className={`ad-tab-btn ${activeTab === 'boosts' ? 'active' : ''}`}
            onClick={() => setActiveTab('boosts')}
          >
            <span>🚀</span>
            Promotion Boosts
          </button>
          <button
            className={`ad-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span>📊</span>
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="ad-content">
          {/* Active Ads Tab */}
          {activeTab === 'ads' && (
            <div className="ads-section">
              <div className="ads-grid">
                {advertisements.map((ad) => (
                  <div key={ad.id} className="ad-card">
                    <div className="ad-image">
                      <img src={ad.image} alt={ad.title} />
                      <div className="ad-type-badge">{ad.type}</div>
                    </div>

                    <div className="ad-content-section">
                      <div className="ad-header">
                        <div className="vendor-info">
                          <img src={ad.vendor.avatar} alt={ad.vendor.name} />
                          <div>
                            <strong>{ad.vendor.name}</strong>
                            <p>{ad.vendor.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(ad.status)}
                      </div>

                      <h3>{ad.title}</h3>
                      <p className="ad-description">{ad.description}</p>

                      <div className="ad-details">
                        <div className="detail-item">
                          <span>📍 Position:</span>
                          <strong>{ad.position}</strong>
                        </div>
                        <div className="detail-item">
                          <span>⏱️ Duration:</span>
                          <strong>{ad.duration}</strong>
                        </div>
                        <div className="detail-item">
                          <span>📅 Period:</span>
                          <strong>{ad.startDate} - {ad.endDate}</strong>
                        </div>
                      </div>

                      <div className="ad-stats">
                        <div className="stat-item">
                          <span>👁️ Impressions:</span>
                          <strong>{ad.impressions.toLocaleString()}</strong>
                        </div>
                        <div className="stat-item">
                          <span>🖱️ Clicks:</span>
                          <strong>{ad.clicks.toLocaleString()}</strong>
                        </div>
                        <div className="stat-item">
                          <span>📈 CTR:</span>
                          <strong>{ad.ctr}%</strong>
                        </div>
                        <div className="stat-item">
                          <span>💰 Spent:</span>
                          <strong>₹{ad.spent.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="ad-actions">
                        <button className="btn btn-sm btn-secondary">
                          <span>✏️</span> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handlePauseAd(ad.id)}
                        >
                          <span>{ad.status === 'active' ? '⏸️' : '▶️'}</span>
                          {ad.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button className="btn btn-sm btn-info">
                          <span>📊</span> Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Types Tab */}
          {activeTab === 'types' && (
            <div className="ad-types-section">
              <div className="ad-types-grid">
                {adTypes.map((type) => (
                  <div key={type.id} className="ad-type-card">
                    <div className="type-header">
                      <div className="type-icon">{type.icon}</div>
                      <h3>{type.name}</h3>
                    </div>

                    <p className="type-description">{type.description}</p>

                    <div className="type-pricing">
                      <h4>Pricing</h4>
                      <div className="price-item">
                        <span>Daily:</span>
                        <strong>₹{type.price.daily.toLocaleString()}</strong>
                      </div>
                      <div className="price-item">
                        <span>Weekly:</span>
                        <strong>₹{type.price.weekly.toLocaleString()}</strong>
                      </div>
                      <div className="price-item">
                        <span>Monthly:</span>
                        <strong>₹{type.price.monthly.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="type-positions">
                      <h4>Available Positions</h4>
                      {type.positions.map((position, index) => (
                        <span key={index} className="position-tag">{position}</span>
                      ))}
                    </div>

                    {type.dimensions !== 'N/A' && (
                      <div className="type-dimensions">
                        <strong>Dimensions:</strong> {type.dimensions}
                      </div>
                    )}

                    <div className="type-active">
                      <span>📊 {type.active} active ads</span>
                    </div>

                    <button className="btn btn-primary btn-block">
                      <span>➕</span>
                      Create {type.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promotion Boosts Tab */}
          {activeTab === 'boosts' && (
            <div className="boosts-section">
              <div className="boosts-grid">
                {promotionBoosts.map((boost) => (
                  <div key={boost.id} className="boost-card">
                    <div className="boost-icon">{boost.icon}</div>
                    <h3>{boost.name}</h3>
                    <p className="boost-description">{boost.description}</p>

                    <div className="boost-price">
                      <span className="price-label">Price:</span>
                      <span className="price-amount">₹{boost.price.toLocaleString()}</span>
                      <span className="price-duration">/ {boost.duration}</span>
                    </div>

                    <div className="boost-benefits">
                      <h4>Benefits:</h4>
                      <ul>
                        {boost.benefits.map((benefit, index) => (
                          <li key={index}>✓ {benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <button className="btn btn-success btn-block">
                      <span>🚀</span>
                      Activate Boost
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h3>📊 Performance Overview</h3>
                  <div className="performance-stats">
                    <div className="perf-stat">
                      <span>Total Ads:</span>
                      <strong>{advertisements.length}</strong>
                    </div>
                    <div className="perf-stat">
                      <span>Active Ads:</span>
                      <strong>{advertisements.filter(a => a.status === 'active').length}</strong>
                    </div>
                    <div className="perf-stat">
                      <span>Total Impressions:</span>
                      <strong>{totalImpressions.toLocaleString()}</strong>
                    </div>
                    <div className="perf-stat">
                      <span>Total Clicks:</span>
                      <strong>{totalClicks.toLocaleString()}</strong>
                    </div>
                    <div className="perf-stat">
                      <span>Average CTR:</span>
                      <strong>{avgCTR}%</strong>
                    </div>
                    <div className="perf-stat">
                      <span>Total Revenue:</span>
                      <strong>₹{totalSpent.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>🎯 Top Performing Ads</h3>
                  <div className="top-ads-list">
                    {advertisements
                      .sort((a, b) => b.ctr - a.ctr)
                      .slice(0, 5)
                      .map((ad, index) => (
                        <div key={ad.id} className="top-ad-item">
                          <span className="rank">#{index + 1}</span>
                          <div className="ad-info">
                            <strong>{ad.title}</strong>
                            <p>{ad.vendor.name}</p>
                          </div>
                          <div className="ad-metrics">
                            <span>CTR: {ad.ctr}%</span>
                            <span>{ad.clicks} clicks</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementSystem;
