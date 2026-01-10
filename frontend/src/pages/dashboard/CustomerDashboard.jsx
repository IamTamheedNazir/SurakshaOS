import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/dashboard/DashboardCard';
import PackageCard from '../../components/package/PackageCard';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/users/dashboard');
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setStats({
          totalBookings: 5,
          upcomingTrips: 2,
          completedTrips: 3,
          totalSpent: 450000
        });
        setRecentBookings([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🕌</span>
            My Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's your journey overview
          </p>
        </div>
        <Link to="/packages" className="btn btn-primary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Package
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="green"
          link="/bookings"
          loading={loading}
        />

        <DashboardCard
          title="Upcoming Trips"
          value={stats.upcomingTrips}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="blue"
          trend="up"
          trendValue="+1"
          link="/bookings?status=upcoming"
          loading={loading}
        />

        <DashboardCard
          title="Completed Trips"
          value={stats.completedTrips}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="purple"
          link="/bookings?status=completed"
          loading={loading}
        />

        <DashboardCard
          title="Total Spent"
          value={`₹${stats.totalSpent.toLocaleString()}`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="gold"
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
          <Link to="/packages" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Browse Packages</h3>
            <p className="quick-action-desc">Explore Umrah & Hajj packages</p>
          </Link>

          <Link to="/bookings" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="quick-action-title">My Bookings</h3>
            <p className="quick-action-desc">View all your bookings</p>
          </Link>

          <Link to="/profile" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="quick-action-title">My Profile</h3>
            <p className="quick-action-desc">Update your information</p>
          </Link>

          <Link to="/documents" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Documents</h3>
            <p className="quick-action-desc">Manage your documents</p>
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
          <Link to="/bookings" className="section-link">
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
          <div className="bookings-list">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                {/* Booking details */}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No Bookings Yet</h3>
            <p className="empty-description">
              Start your sacred journey by booking your first package
            </p>
            <Link to="/packages" className="btn btn-primary">
              Browse Packages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
