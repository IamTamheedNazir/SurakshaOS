import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch vendor dashboard data
  const { data: statsData } = useQuery('vendorStats', vendorAPI.getStats);
  const { data: requestsData } = useQuery('vendorRequests', vendorAPI.getRequests);
  const { data: revenueData } = useQuery('vendorRevenue', vendorAPI.getRevenue);

  // Mock data for development
  const mockStats = {
    totalRequests: 45,
    pendingRequests: 12,
    confirmedBookings: 28,
    totalRevenue: 2850000,
    monthlyRevenue: 450000,
    activePackages: 15,
    totalPassengers: 156,
    pendingPayments: 380000,
  };

  const mockRecentRequests = [
    {
      id: 'REQ480334',
      passenger: 'Jabeena',
      phone: '8899146593',
      service: 'Umrah',
      packageName: '15 Days Regular',
      packageType: 'Bronze (quint)',
      adults: 3,
      children: 0,
      amount: 237000,
      status: 'pending_agent',
      createdDate: '07 January 2026',
      travelDate: '28 January 2026',
    },
    {
      id: 'REQ480335',
      passenger: 'Ahmed Khan',
      phone: '9876543210',
      service: 'Umrah',
      packageName: '20 Days Premium',
      packageType: 'Gold (double)',
      adults: 2,
      children: 1,
      amount: 425000,
      status: 'confirmed',
      createdDate: '06 January 2026',
      travelDate: '15 February 2026',
    },
  ];

  const stats = statsData?.data || mockStats;
  const recentRequests = requestsData?.data || mockRecentRequests;

  const menuItems = [
    { icon: '🏠', label: 'My Dashboard', path: '/vendor/dashboard', active: true },
    { icon: '📅', label: 'Calendars', path: '/vendor/calendars', hasSubmenu: true },
    { icon: '📦', label: 'Packages', path: '/vendor/packages', hasSubmenu: true },
    { icon: '🛎️', label: 'Services', path: '/vendor/services' },
    { icon: '⚡', label: 'Utilities', path: '/vendor/utilities' },
    { icon: '💳', label: 'Payments', path: '/vendor/payments', hasSubmenu: true },
    { icon: '📊', label: 'Reports', path: '/vendor/reports', hasSubmenu: true },
    { icon: '📥', label: 'Downloads', path: '/vendor/downloads', hasSubmenu: true },
    { icon: '🔧', label: 'Tool', path: '/vendor/tools', hasSubmenu: true },
    { icon: '🎨', label: 'Design Studio', path: '/vendor/design', hasSubmenu: true },
    { icon: '👥', label: 'Admin', path: '/vendor/admin', hasSubmenu: true },
    { icon: '🎯', label: 'Leads', path: '/vendor/leads' },
    { icon: '📢', label: 'Latest Notice', path: '/vendor/notices' },
    { icon: '❓', label: 'Help', path: '/vendor/help', hasSubmenu: true },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_agent: { label: 'Pending Agent', class: 'badge-warning' },
      confirmed: { label: 'Confirmed', class: 'badge-success' },
      processing: { label: 'Processing', class: 'badge-blue' },
      completed: { label: 'Completed', class: 'badge-success' },
      cancelled: { label: 'Cancelled', class: 'badge-error' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <aside className={`vendor-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <input
            type="text"
            className="sidebar-search"
            placeholder="Search menu..."
          />
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`menu-item ${item.active ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.hasSubmenu && <span className="menu-arrow">›</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="vendor-main">
        {/* Top Header */}
        <header className="vendor-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="header-brand">
              <h1 className="brand-name">
                UmrahConnect <span className="brand-badge">(E)</span>
              </h1>
              <p className="agency-info">
                Yatriwala Travel Technologies Pvt Ltd (Agency ID: 55145)
              </p>
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <span>🔍</span>
            </button>
            <div className="header-balance">
              <span className="balance-icon">🪙</span>
              <span className="balance-value">0 RG</span>
            </div>
            <div className="header-wallet">
              <span className="wallet-icon">💰</span>
              <span className="wallet-value">₹0.00</span>
            </div>
            <div className="header-dropdown">
              <button className="dropdown-btn">
                <span>🌍</span>
                Zone
              </button>
            </div>
            <div className="header-dropdown">
              <button className="dropdown-btn">
                <span>👤</span>
                Zarkha
              </button>
            </div>
            <button className="header-btn">
              <span>🔔</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h2 className="welcome-title">Welcome back, {user?.name || 'Vendor'}! 👋</h2>
              <p className="welcome-subtitle">Here's what's happening with your business today</p>
            </div>
            <Link to="/vendor/requests/new" className="btn btn-primary">
              <span>➕</span>
              Add New Request
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="vendor-stats-grid">
            <div className="vendor-stat-card stat-blue">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalRequests}</div>
                <div className="stat-label">Total Requests</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-orange">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">{stats.pendingRequests}</div>
                <div className="stat-label">Pending Requests</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.confirmedBookings}</div>
                <div className="stat-label">Confirmed Bookings</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-purple">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-teal">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">₹{(stats.monthlyRevenue / 1000).toFixed(0)}K</div>
                <div className="stat-label">Monthly Revenue</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-indigo">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-value">{stats.activePackages}</div>
                <div className="stat-label">Active Packages</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-pink">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalPassengers}</div>
                <div className="stat-label">Total Passengers</div>
              </div>
            </div>
            <div className="vendor-stat-card stat-red">
              <div className="stat-icon">💸</div>
              <div className="stat-content">
                <div className="stat-value">₹{(stats.pendingPayments / 1000).toFixed(0)}K</div>
                <div className="stat-label">Pending Payments</div>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>📋 Recent Requests</h3>
              <Link to="/vendor/requests" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="requests-table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Passenger</th>
                    <th>Service</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="request-id-cell">
                          <strong>ID: {request.id}</strong>
                          <p className="request-dates">
                            Created: {request.createdDate}<br />
                            Travel: {request.travelDate}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="passenger-cell">
                          <strong>{request.passenger}</strong>
                          <div className="passenger-contact">
                            <span>({request.phone})</span>
                            <button className="contact-btn">📞</button>
                            <button className="contact-btn">💬</button>
                          </div>
                          <p className="passenger-details">
                            Adults: {request.adults} | Child With Bed: 0 | Child No Bed: 0 | Infant: 0<br />
                            Beds: 3 | Seats: 3 | PAX: 3
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="service-cell">
                          <strong>{request.service}</strong>
                          <p>{request.packageName}</p>
                          <p className="package-type">{request.packageType}</p>
                        </div>
                      </td>
                      <td>
                        <strong className="amount-value">
                          ₹{request.amount.toLocaleString()}
                        </strong>
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <div className="action-dropdown">
                          <button className="btn btn-sm btn-secondary">Actions ▼</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <Link to="/vendor/packages/create" className="quick-action-card">
              <div className="action-icon">📦</div>
              <h4>Create Package</h4>
              <p>Add new Umrah package</p>
            </Link>
            <Link to="/vendor/requests/new" className="quick-action-card">
              <div className="action-icon">➕</div>
              <h4>New Request</h4>
              <p>Create booking request</p>
            </Link>
            <Link to="/vendor/payments" className="quick-action-card">
              <div className="action-icon">💳</div>
              <h4>Payments</h4>
              <p>Manage transactions</p>
            </Link>
            <Link to="/vendor/reports" className="quick-action-card">
              <div className="action-icon">📊</div>
              <h4>Reports</h4>
              <p>View analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
