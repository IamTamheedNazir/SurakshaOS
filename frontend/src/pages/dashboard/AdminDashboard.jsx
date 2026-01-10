import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/dashboard/DashboardCard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    revenueGrowth: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setStats({
          totalUsers: 1250,
          totalVendors: 85,
          totalPackages: 450,
          totalBookings: 3200,
          totalRevenue: 15000000,
          pendingApprovals: 12,
          activeUsers: 890,
          revenueGrowth: 25
        });
        setRecentUsers([]);
        setRecentBookings([]);
        setPendingVendors([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">👑</span>
            Admin Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Platform overview and management
          </p>
        </div>
        <div className="header-actions">
          <Link to="/admin/reports" className="btn btn-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </Link>
          <Link to="/admin/settings" className="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="blue"
          trend="up"
          trendValue="+12%"
          link="/admin/users"
          loading={loading}
        />

        <DashboardCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="purple"
          trend="up"
          trendValue="+5"
          link="/admin/vendors"
          loading={loading}
        />

        <DashboardCard
          title="Total Packages"
          value={stats.totalPackages}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="green"
          trend="up"
          trendValue="+18"
          link="/admin/packages"
          loading={loading}
        />

        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="orange"
          trend="up"
          trendValue="+8%"
          link="/admin/bookings"
          loading={loading}
        />

        <DashboardCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="gold"
          trend="up"
          trendValue={`+${stats.revenueGrowth}%`}
          loading={loading}
        />

        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="red"
          link="/admin/approvals"
          loading={loading}
        />

        <DashboardCard
          title="Active Users"
          value={stats.activeUsers}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          trend="up"
          trendValue="+15%"
          loading={loading}
        />

        <DashboardCard
          title="Revenue Growth"
          value={`${stats.revenueGrowth}%`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="green"
          trend="up"
          trendValue="+5%"
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
          <Link to="/admin/users" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Manage Users</h3>
            <p className="quick-action-desc">View and manage all users</p>
          </Link>

          <Link to="/admin/vendors" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="quick-action-title">Manage Vendors</h3>
            <p className="quick-action-desc">Approve and manage vendors</p>
          </Link>

          <Link to="/admin/packages" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="quick-action-title">Manage Packages</h3>
            <p className="quick-action-desc">Review all packages</p>
          </Link>

          <Link to="/admin/bookings" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="quick-action-title">View Bookings</h3>
            <p className="quick-action-desc">Monitor all bookings</p>
          </Link>

          <Link to="/admin/reports" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Generate Reports</h3>
            <p className="quick-action-desc">View analytics and reports</p>
          </Link>

          <Link to="/admin/settings" className="quick-action-card">
            <div className="quick-action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="quick-action-title">Platform Settings</h3>
            <p className="quick-action-desc">Configure platform settings</p>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Recent Users */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-decoration">✦</span>
              Recent Users
            </h2>
            <Link to="/admin/users" className="section-link">
              View All
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="loading-list">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="list-skeleton"></div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="users-list">
              {/* Users list will go here */}
            </div>
          ) : (
            <div className="empty-state-small">
              <div className="empty-icon-small">👥</div>
              <p className="empty-text">No recent users</p>
            </div>
          )}
        </div>

        {/* Pending Vendor Approvals */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-decoration">✦</span>
              Pending Approvals
            </h2>
            <Link to="/admin/approvals" className="section-link">
              View All
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="loading-list">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="list-skeleton"></div>
              ))}
            </div>
          ) : pendingVendors.length > 0 ? (
            <div className="vendors-list">
              {/* Vendors list will go here */}
            </div>
          ) : (
            <div className="empty-state-small">
              <div className="empty-icon-small">✅</div>
              <p className="empty-text">No pending approvals</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration">✦</span>
            Recent Bookings
          </h2>
          <Link to="/admin/bookings" className="section-link">
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
              Recent bookings will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
