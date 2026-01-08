import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './PackageManagement.css';

const PackageManagement = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
  });
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch packages
  const { data: packagesData, isLoading } = useQuery('vendorPackages', vendorAPI.getPackages);

  // Mock data
  const mockPackages = [
    {
      id: 'PKG001',
      name: '15 Days Premium Umrah Package',
      category: 'Umrah',
      type: 'Gold',
      duration: 15,
      makkahDays: 8,
      madinahDays: 7,
      price: 110000,
      discountedPrice: 105000,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      status: 'active',
      bookings: 28,
      views: 456,
      rating: 4.8,
      reviews: 24,
      inclusions: ['Flight', 'Hotel', 'Meals', 'Transport', 'Ziyarat'],
      createdDate: '2025-12-01',
      lastUpdated: '2026-01-05',
    },
    {
      id: 'PKG002',
      name: '10 Days Economy Umrah Package',
      category: 'Umrah',
      type: 'Silver',
      duration: 10,
      makkahDays: 5,
      madinahDays: 5,
      price: 58000,
      discountedPrice: null,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
      status: 'active',
      bookings: 45,
      views: 789,
      rating: 4.6,
      reviews: 38,
      inclusions: ['Flight', 'Hotel', 'Transport'],
      createdDate: '2025-11-15',
      lastUpdated: '2026-01-03',
    },
    {
      id: 'PKG003',
      name: '20 Days Luxury Umrah Package',
      category: 'Umrah',
      type: 'Platinum',
      duration: 20,
      makkahDays: 12,
      madinahDays: 8,
      price: 225000,
      discountedPrice: 215000,
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800',
      status: 'active',
      bookings: 12,
      views: 234,
      rating: 4.9,
      reviews: 10,
      inclusions: ['Flight', 'Hotel', 'Meals', 'Transport', 'Ziyarat', 'VIP Services'],
      createdDate: '2025-12-20',
      lastUpdated: '2026-01-07',
    },
    {
      id: 'PKG004',
      name: '7 Days Quick Umrah Package',
      category: 'Umrah',
      type: 'Bronze',
      duration: 7,
      makkahDays: 4,
      madinahDays: 3,
      price: 42000,
      discountedPrice: null,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
      status: 'draft',
      bookings: 0,
      views: 0,
      rating: 0,
      reviews: 0,
      inclusions: ['Flight', 'Hotel'],
      createdDate: '2026-01-08',
      lastUpdated: '2026-01-08',
    },
  ];

  const packages = packagesData?.data || mockPackages;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'badge-success' },
      draft: { label: 'Draft', class: 'badge-gray' },
      inactive: { label: 'Inactive', class: 'badge-warning' },
      archived: { label: 'Archived', class: 'badge-error' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const handleDuplicate = (packageId) => {
    toast.success('Package duplicated successfully!');
  };

  const handleDelete = (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      toast.success('Package deleted successfully!');
    }
  };

  const handleStatusChange = (packageId, newStatus) => {
    toast.success(`Package status changed to ${newStatus}`);
  };

  const filteredPackages = packages.filter(pkg => {
    if (filters.search && !pkg.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && pkg.status !== filters.status) {
      return false;
    }
    if (filters.category !== 'all' && pkg.category !== filters.category) {
      return false;
    }
    return true;
  });

  const stats = {
    total: packages.length,
    active: packages.filter(p => p.status === 'active').length,
    draft: packages.filter(p => p.status === 'draft').length,
    totalBookings: packages.reduce((sum, p) => sum + p.bookings, 0),
  };

  return (
    <div className="package-management-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">📦 Package Management</h1>
            <div className="breadcrumb">
              <Link to="/vendor/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Packages</span>
            </div>
          </div>
          <Link to="/vendor/packages/create" className="btn btn-primary">
            <span>➕</span>
            Create New Package
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="package-stats-grid">
          <div className="package-stat-card stat-blue">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Packages</div>
            </div>
          </div>
          <div className="package-stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active Packages</div>
            </div>
          </div>
          <div className="package-stat-card stat-orange">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.draft}</div>
              <div className="stat-label">Draft Packages</div>
            </div>
          </div>
          <div className="package-stat-card stat-purple">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="filters-section">
          <div className="filters-left">
            <input
              type="text"
              className="search-input"
              placeholder="Search packages..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">All Categories</option>
              <option value="Umrah">Umrah</option>
              <option value="Hajj">Hajj</option>
              <option value="Ziyarat">Ziyarat</option>
              <option value="Ramzan">Ramzan</option>
            </select>
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span>⊞</span> Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <span>☰</span> List
            </button>
          </div>
        </div>

        {/* Packages Grid/List */}
        {viewMode === 'grid' ? (
          <div className="packages-grid">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-image-container">
                  <img src={pkg.image} alt={pkg.name} className="package-image" />
                  <div className="package-overlay">
                    {getStatusBadge(pkg.status)}
                    <span className="package-type-badge">{pkg.type}</span>
                  </div>
                </div>
                <div className="package-content">
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-meta">
                    <span>📅 {pkg.duration} Days</span>
                    <span>🕋 {pkg.makkahDays}D Makkah</span>
                    <span>🕌 {pkg.madinahDays}D Madinah</span>
                  </div>
                  <div className="package-stats-row">
                    <div className="stat-item">
                      <span className="stat-icon">🎫</span>
                      <span className="stat-text">{pkg.bookings} Bookings</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-text">{pkg.views} Views</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-text">{pkg.rating} ({pkg.reviews})</span>
                    </div>
                  </div>
                  <div className="package-price-row">
                    {pkg.discountedPrice ? (
                      <>
                        <span className="original-price">₹{pkg.price.toLocaleString()}</span>
                        <span className="discounted-price">₹{pkg.discountedPrice.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="package-price">₹{pkg.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="package-actions">
                    <button
                      className="action-btn action-btn-primary"
                      onClick={() => navigate(`/vendor/packages/${pkg.id}/edit`)}
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      className="action-btn action-btn-secondary"
                      onClick={() => navigate(`/vendor/packages/${pkg.id}`)}
                    >
                      <span>👁️</span> View
                    </button>
                    <button
                      className="action-btn action-btn-info"
                      onClick={() => handleDuplicate(pkg.id)}
                    >
                      <span>📋</span> Duplicate
                    </button>
                    <button
                      className="action-btn action-btn-error"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="packages-list">
            <table className="packages-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Bookings</th>
                  <th>Views</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <div className="package-list-item">
                        <img src={pkg.image} alt={pkg.name} className="package-list-image" />
                        <div>
                          <strong>{pkg.name}</strong>
                          <p className="package-list-meta">
                            🕋 {pkg.makkahDays}D Makkah | 🕌 {pkg.madinahDays}D Madinah
                          </p>
                        </div>
                      </div>
                    </td>
                    <td><span className="type-badge">{pkg.type}</span></td>
                    <td>{pkg.duration} Days</td>
                    <td>
                      {pkg.discountedPrice ? (
                        <div>
                          <span className="list-original-price">₹{pkg.price.toLocaleString()}</span>
                          <strong className="list-discounted-price">₹{pkg.discountedPrice.toLocaleString()}</strong>
                        </div>
                      ) : (
                        <strong>₹{pkg.price.toLocaleString()}</strong>
                      )}
                    </td>
                    <td>{pkg.bookings}</td>
                    <td>{pkg.views}</td>
                    <td>⭐ {pkg.rating} ({pkg.reviews})</td>
                    <td>{getStatusBadge(pkg.status)}</td>
                    <td>
                      <div className="list-actions">
                        <button
                          className="list-action-btn"
                          onClick={() => navigate(`/vendor/packages/${pkg.id}/edit`)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="list-action-btn"
                          onClick={() => navigate(`/vendor/packages/${pkg.id}`)}
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          className="list-action-btn"
                          onClick={() => handleDuplicate(pkg.id)}
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          className="list-action-btn"
                          onClick={() => handleDelete(pkg.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No packages found</h3>
            <p>Try adjusting your filters or create a new package</p>
            <Link to="/vendor/packages/create" className="btn btn-primary">
              <span>➕</span>
              Create New Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageManagement;
