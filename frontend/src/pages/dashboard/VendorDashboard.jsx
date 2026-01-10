import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/dashboard/DashboardCard';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topPackages, setTopPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/vendor/dashboard');
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setStats({
          totalPackages: 12,
          activePackages: 8,
          totalBookings: 45,
          totalRevenue: 2500000,
          pendingBookings: 5,
          completedBookings: 40
        });
        setRecentBookings([]);
        setTopPackages([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🏢</span>
            Vendor Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Manage your packages and bookings
          </p>
        </div>
        <Link to="/vendor/packages/create" className="btn btn-primary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Package
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <DashboardCard
          title="Total Packages"
          value={stats.totalPackages}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="green"
          link="/vendor/packages"
          loading={loading}
        />

        <DashboardCard
          title="Active Packages"
          value={stats.activePackages}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
          trend="up"
          trendValue="+2"
          link="/vendor/packages?status=active"
          loading={loading}
        />

        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="purple"
          link="/vendor/bookings"
          loading={loading}
        />

        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="gold"
          trend="up"
          trendValue="+15%"
          loading={loading}
        />

        <DashboardCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
          link="/vendor/bookings?status=pending"
          loading={loading}
        />

        <DashboardCard
          title="Completed Bookings"
          value={stats.completedBookings}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          link="/vendor/bookings?status=completed"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration">✦</span>
            Quick Actions
          </h2>
        </div>

        <div className="quick-actions-grid">
          <Link to="/vendor/packages/create" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="quick-action-title">Create Package</h3>
            <p className="quick-action-desc">Add a new Umrah/Hajj package</p>
          </Link>

          <Link to="/vendor/packages" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="quick-action-title">Manage Packages</h3>
            <p className="quick-action-desc">View and edit your packages</p>
          </Link>

          <Link to="/vendor/bookings" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="quick-action-title">View Bookings</h3>
            <p className="quick-action-desc">Manage customer bookings</p>
          </Link>

          <Link to="/vendor/profile" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Settings</h3>
            <p className="quick-action-desc">Update vendor profile</p>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration">✦</span>
            Recent Bookings
          </h2>
          <Link to="/vendor/bookings" className="section-link">
            View All
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="booking-skeleton"></div>
            ))}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="bookings-table">
            {/* Bookings table will go here */}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No Recent Bookings</h3>
            <p className="empty-description">
              Your recent bookings will appear here
            </p>
          </div>
        )}
      </div>

      {/* Top Performing Packages */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration">✦</span>
            Top Performing Packages
          </h2>
          <Link to="/vendor/packages" className="section-link">
            View All
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="package-skeleton"></div>
            ))}
          </div>
        ) : topPackages.length > 0 ? (
          <div className="packages-grid">
            {/* Top packages will go here */}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No Packages Yet</h3>
            <p className="empty-description">
              Create your first package to start receiving bookings
            </p>
            <Link to="/vendor/packages/create" className="btn btn-primary">
              Create Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
