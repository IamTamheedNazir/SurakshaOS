import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Icons
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const VendorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BookingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Mock admin data
const mockAdmin = {
  name: 'Admin User',
  email: 'admin@umrahconnect.com',
  role: 'Super Admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0f6b3f&color=fff&size=200'
};

// Mock platform stats
const mockStats = {
  totalUsers: 1248,
  totalVendors: 87,
  totalPackages: 342,
  totalBookings: 1567,
  totalRevenue: 45680000,
  activeUsers: 856,
  pendingApprovals: 12,
  recentActivity: 234
};

// Mock users data
const mockUsers = [
  { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', role: 'Customer', status: 'active', joined: '2024-01-15', bookings: 3 },
  { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', role: 'Customer', status: 'active', joined: '2024-01-18', bookings: 2 },
  { id: 3, name: 'Mohammed Raza', email: 'mohammed@example.com', role: 'Customer', status: 'inactive', joined: '2024-01-20', bookings: 1 }
];

// Mock vendors data
const mockVendors = [
  { id: 1, name: 'Al-Haramain Tours', email: 'contact@alharamain.com', status: 'approved', packages: 12, bookings: 145, rating: 4.8, joined: '2022-06-10' },
  { id: 2, name: 'Makkah Express', email: 'info@makkahexpress.com', status: 'approved', packages: 8, bookings: 98, rating: 4.6, joined: '2022-08-15' },
  { id: 3, name: 'Madinah Travels', email: 'support@madinahtravels.com', status: 'pending', packages: 5, bookings: 34, rating: 4.5, joined: '2024-01-10' }
];

// Mock packages data
const mockPackages = [
  { id: 1, name: '15 Days Premium Umrah Package', vendor: 'Al-Haramain Tours', price: 135000, status: 'active', bookings: 45 },
  { id: 2, name: '10 Days Economy Umrah Package', vendor: 'Makkah Express', price: 95000, status: 'active', bookings: 67 },
  { id: 3, name: '12 Days Deluxe Umrah Package', vendor: 'Madinah Travels', price: 125000, status: 'pending', bookings: 0 }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Active', color: '#0f6b3f' },
      inactive: { label: 'Inactive', color: '#6b7280' },
      approved: { label: 'Approved', color: '#0f6b3f' },
      pending: { label: 'Pending', color: '#f59e0b' },
      rejected: { label: 'Rejected', color: '#ef4444' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="admin-avatar">
            <img src={mockAdmin.avatar} alt={mockAdmin.name} />
          </div>
          <h3>{mockAdmin.name}</h3>
          <p>{mockAdmin.email}</p>
          <span className="admin-badge">{mockAdmin.role}</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <DashboardIcon />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <UsersIcon />
            <span>Users</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <VendorsIcon />
            <span>Vendors</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <PackageIcon />
            <span>Packages</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <BookingIcon />
            <span>Bookings</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <AnalyticsIcon />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>Platform Overview 📊</h1>
                <p>Monitor and manage your platform</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid-large">
              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(15, 107, 63, 0.1)' }}>
                  <UsersIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{mockStats.totalUsers.toLocaleString()}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +124 this month
                  </span>
                </div>
              </div>

              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <VendorsIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Vendors</span>
                  <span className="stat-value">{mockStats.totalVendors}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +8 this month
                  </span>
                </div>
              </div>

              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <PackageIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Packages</span>
                  <span className="stat-value">{mockStats.totalPackages}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +23 this month
                  </span>
                </div>
              </div>

              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <BookingIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">{mockStats.totalBookings.toLocaleString()}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +156 this month
                  </span>
                </div>
              </div>

              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <MoneyIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{(mockStats.totalRevenue / 10000000).toFixed(1)}Cr</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +18% this month
                  </span>
                </div>
              </div>

              <div className="stat-card-large">
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <ShieldIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Active Users</span>
                  <span className="stat-value">{mockStats.activeUsers}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +45 today
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                <button className="action-card" onClick={() => setActiveTab('vendors')}>
                  <div className="action-icon pending">
                    <VendorsIcon />
                  </div>
                  <div className="action-info">
                    <span className="action-label">Pending Approvals</span>
                    <span className="action-value">{mockStats.pendingApprovals}</span>
                  </div>
                </button>

                <button className="action-card" onClick={() => setActiveTab('users')}>
                  <div className="action-icon active">
                    <UsersIcon />
                  </div>
                  <div className="action-info">
                    <span className="action-label">Active Users</span>
                    <span className="action-value">{mockStats.activeUsers}</span>
                  </div>
                </button>

                <button className="action-card" onClick={() => setActiveTab('analytics')}>
                  <div className="action-icon activity">
                    <AnalyticsIcon />
                  </div>
                  <div className="action-info">
                    <span className="action-label">Recent Activity</span>
                    <span className="action-value">{mockStats.recentActivity}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section">
              <h2>Recent Vendors</h2>
              <div className="activity-table">
                <table>
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Email</th>
                      <th>Packages</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockVendors.slice(0, 3).map(vendor => (
                      <tr key={vendor.id}>
                        <td>{vendor.name}</td>
                        <td>{vendor.email}</td>
                        <td>{vendor.packages}</td>
                        <td>⭐ {vendor.rating}</td>
                        <td>
                          <span className="status-badge" style={{ background: getStatusBadge(vendor.status).color }}>
                            {getStatusBadge(vendor.status).label}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon">
                              <EyeIcon />
                            </button>
                            {vendor.status === 'pending' && (
                              <>
                                <button className="btn-icon success">
                                  <CheckIcon />
                                </button>
                                <button className="btn-icon danger">
                                  <XIcon />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>User Management</h1>
                <p>Manage platform users</p>
              </div>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusBadge(user.status).color }}>
                          {getStatusBadge(user.status).label}
                        </span>
                      </td>
                      <td>{new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>{user.bookings}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon">
                            <EyeIcon />
                          </button>
                          <button className="btn-icon">
                            <EditIcon />
                          </button>
                          <button className="btn-icon danger">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>Vendor Management</h1>
                <p>Approve and manage vendors</p>
              </div>
            </div>

            <div className="vendors-table">
              <table>
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Email</th>
                    <th>Packages</th>
                    <th>Bookings</th>
                    <th>Rating</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVendors.map(vendor => (
                    <tr key={vendor.id}>
                      <td>{vendor.name}</td>
                      <td>{vendor.email}</td>
                      <td>{vendor.packages}</td>
                      <td>{vendor.bookings}</td>
                      <td>⭐ {vendor.rating}</td>
                      <td>{new Date(vendor.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusBadge(vendor.status).color }}>
                          {getStatusBadge(vendor.status).label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon">
                            <EyeIcon />
                          </button>
                          {vendor.status === 'pending' && (
                            <>
                              <button className="btn-icon success">
                                <CheckIcon />
                              </button>
                              <button className="btn-icon danger">
                                <XIcon />
                              </button>
                            </>
                          )}
                          {vendor.status === 'approved' && (
                            <button className="btn-icon">
                              <EditIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>Package Management</h1>
                <p>Review and manage all packages</p>
              </div>
            </div>

            <div className="packages-table">
              <table>
                <thead>
                  <tr>
                    <th>Package Name</th>
                    <th>Vendor</th>
                    <th>Price</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPackages.map(pkg => (
                    <tr key={pkg.id}>
                      <td>{pkg.name}</td>
                      <td>{pkg.vendor}</td>
                      <td className="amount">₹{pkg.price.toLocaleString('en-IN')}</td>
                      <td>{pkg.bookings}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusBadge(pkg.status).color }}>
                          {getStatusBadge(pkg.status).label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon">
                            <EyeIcon />
                          </button>
                          {pkg.status === 'pending' && (
                            <>
                              <button className="btn-icon success">
                                <CheckIcon />
                              </button>
                              <button className="btn-icon danger">
                                <XIcon />
                              </button>
                            </>
                          )}
                          <button className="btn-icon danger">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>Platform Analytics</h1>
                <p>Comprehensive platform insights</p>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>User Growth</h3>
                <div className="chart-placeholder">
                  <div className="chart-bar" style={{ height: '50%' }}></div>
                  <div className="chart-bar" style={{ height: '65%' }}></div>
                  <div className="chart-bar" style={{ height: '75%' }}></div>
                  <div className="chart-bar" style={{ height: '85%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                </div>
                <p className="chart-label">Last 6 months</p>
              </div>

              <div className="analytics-card">
                <h3>Revenue Trends</h3>
                <div className="chart-placeholder">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '75%' }}></div>
                  <div className="chart-bar" style={{ height: '85%' }}></div>
                  <div className="chart-bar" style={{ height: '95%' }}></div>
                </div>
                <p className="chart-label">Last 6 months</p>
              </div>
            </div>

            <div className="analytics-summary">
              <div className="summary-card">
                <h4>Platform Growth</h4>
                <p className="summary-value">+28%</p>
                <span className="summary-change positive">Compared to last quarter</span>
              </div>
              <div className="summary-card">
                <h4>Vendor Satisfaction</h4>
                <p className="summary-value">4.7/5</p>
                <span className="summary-change positive">+0.3 from last month</span>
              </div>
              <div className="summary-card">
                <h4>User Retention</h4>
                <p className="summary-value">82%</p>
                <span className="summary-change positive">+5% from last month</span>
              </div>
              <div className="summary-card">
                <h4>Avg. Booking Value</h4>
                <p className="summary-value">₹2.9L</p>
                <span className="summary-change positive">+12% from last month</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>Platform Settings</h1>
                <p>Configure platform settings</p>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-card">
                <h3>General Settings</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Platform Name</label>
                    <input type="text" value="UmrahConnect" readOnly />
                  </div>
                  <div className="form-group">
                    <label>Support Email</label>
                    <input type="email" value="support@umrahconnect.com" readOnly />
                  </div>
                  <div className="form-group">
                    <label>Commission Rate (%)</label>
                    <input type="number" value="10" readOnly />
                  </div>
                  <button className="btn-primary">Update Settings</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Security Settings</h3>
                <div className="security-options">
                  <button className="security-btn">Change Password</button>
                  <button className="security-btn">Two-Factor Authentication</button>
                  <button className="security-btn">Activity Logs</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
