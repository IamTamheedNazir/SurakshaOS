import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './VendorDashboard.css';

// Icons
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Mock vendor data
const mockVendor = {
  name: 'Al-Haramain Tours',
  email: 'contact@alharamain.com',
  phone: '+91 98765 43210',
  avatar: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours&background=0f6b3f&color=fff&size=200',
  memberSince: '2022',
  totalPackages: 12,
  activeBookings: 24,
  totalRevenue: 3250000,
  rating: 4.8
};

// Mock packages data
const mockPackages = [
  {
    id: 1,
    name: '15 Days Premium Umrah Package',
    price: 135000,
    duration: '15 Days / 14 Nights',
    bookings: 45,
    revenue: 6075000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400',
    rating: 4.9,
    reviews: 38
  },
  {
    id: 2,
    name: '10 Days Economy Umrah Package',
    price: 95000,
    duration: '10 Days / 9 Nights',
    bookings: 67,
    revenue: 6365000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
    rating: 4.7,
    reviews: 52
  },
  {
    id: 3,
    name: '12 Days Deluxe Umrah Package',
    price: 125000,
    duration: '12 Days / 11 Nights',
    bookings: 32,
    revenue: 4000000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400',
    rating: 4.8,
    reviews: 28
  }
];

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    reference: 'UC12345678',
    customerName: 'Ahmed Khan',
    packageName: '15 Days Premium Umrah Package',
    travelers: 2,
    amount: 270000,
    status: 'confirmed',
    date: '2024-03-15',
    bookingDate: '2024-01-10'
  },
  {
    id: 2,
    reference: 'UC87654321',
    customerName: 'Fatima Ali',
    packageName: '10 Days Economy Umrah Package',
    travelers: 4,
    amount: 380000,
    status: 'pending',
    date: '2024-02-20',
    bookingDate: '2024-01-12'
  },
  {
    id: 3,
    reference: 'UC11223344',
    customerName: 'Mohammed Raza',
    packageName: '12 Days Deluxe Umrah Package',
    travelers: 3,
    amount: 375000,
    status: 'confirmed',
    date: '2024-04-05',
    bookingDate: '2024-01-13'
  }
];

const VendorDashboard = () => {
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
      confirmed: { label: 'Confirmed', color: '#0f6b3f' },
      pending: { label: 'Pending', color: '#f59e0b' },
      completed: { label: 'Completed', color: '#6b7280' },
      cancelled: { label: 'Cancelled', color: '#ef4444' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="vendor-avatar">
            <img src={mockVendor.avatar} alt={mockVendor.name} />
          </div>
          <h3>{mockVendor.name}</h3>
          <p>{mockVendor.email}</p>
          <div className="vendor-rating">
            <span className="star">⭐</span>
            <span>{mockVendor.rating}</span>
          </div>
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
            className={`nav-item ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <PackageIcon />
            <span>My Packages</span>
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
                <h1>Welcome back! 👋</h1>
                <p>Here's what's happening with your business</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('packages')}>
                <PlusIcon />
                Add New Package
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(15, 107, 63, 0.1)' }}>
                  <PackageIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Packages</span>
                  <span className="stat-value">{mockVendor.totalPackages}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +2 this month
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <BookingIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Active Bookings</span>
                  <span className="stat-value">{mockVendor.activeBookings}</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +8 this week
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <MoneyIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{(mockVendor.totalRevenue / 100000).toFixed(1)}L</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +12% this month
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <UsersIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Customers</span>
                  <span className="stat-value">144</span>
                  <span className="stat-change positive">
                    <TrendUpIcon />
                    +15 this month
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <Link to="#" onClick={() => setActiveTab('bookings')}>View All</Link>
              </div>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Package</th>
                      <th>Travelers</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="reference">{booking.reference}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.packageName}</td>
                        <td>{booking.travelers}</td>
                        <td className="amount">₹{booking.amount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className="status-badge" style={{ background: getStatusBadge(booking.status).color }}>
                            {getStatusBadge(booking.status).label}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon">
                            <EyeIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performing Packages */}
            <div className="section">
              <div className="section-header">
                <h2>Top Performing Packages</h2>
                <Link to="#" onClick={() => setActiveTab('packages')}>View All</Link>
              </div>
              <div className="packages-grid-small">
                {mockPackages.slice(0, 3).map(pkg => (
                  <div key={pkg.id} className="package-card-small">
                    <img src={pkg.image} alt={pkg.name} />
                    <div className="package-info">
                      <h4>{pkg.name}</h4>
                      <div className="package-stats">
                        <span>{pkg.bookings} bookings</span>
                        <span className="revenue">₹{(pkg.revenue / 100000).toFixed(1)}L revenue</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h1>My Packages</h1>
                <p>Manage your Umrah packages</p>
              </div>
              <button className="btn-primary">
                <PlusIcon />
                Add New Package
              </button>
            </div>

            <div className="packages-grid">
              {mockPackages.map(pkg => (
                <div key={pkg.id} className="package-card">
                  <div className="package-card-image">
                    <img src={pkg.image} alt={pkg.name} />
                    <span className="status-badge" style={{ background: getStatusBadge(pkg.status).color }}>
                      {getStatusBadge(pkg.status).label}
                    </span>
                  </div>
                  <div className="package-card-content">
                    <h3>{pkg.name}</h3>
                    <p className="duration">{pkg.duration}</p>
                    
                    <div className="package-metrics">
                      <div className="metric">
                        <span className="metric-label">Price</span>
                        <span className="metric-value">₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Bookings</span>
                        <span className="metric-value">{pkg.bookings}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Revenue</span>
                        <span className="metric-value">₹{(pkg.revenue / 100000).toFixed(1)}L</span>
                      </div>
                    </div>

                    <div className="package-rating">
                      <span className="star">⭐</span>
                      <span>{pkg.rating}</span>
                      <span className="reviews">({pkg.reviews} reviews)</span>
                    </div>

                    <div className="package-actions">
                      <button className="btn-outline">
                        <EditIcon />
                        Edit
                      </button>
                      <button className="btn-outline">
                        <EyeIcon />
                        View
                      </button>
                      <button className="btn-danger-outline">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>All Bookings</h1>
              <p>Manage customer bookings</p>
            </div>

            <div className="bookings-table-full">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Travelers</th>
                    <th>Departure</th>
                    <th>Booked On</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="reference">{booking.reference}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.packageName}</td>
                      <td>{booking.travelers}</td>
                      <td>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="amount">₹{booking.amount.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusBadge(booking.status).color }}>
                          {getStatusBadge(booking.status).label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon">
                            <EyeIcon />
                          </button>
                          <button className="btn-icon">
                            <EditIcon />
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
              <h1>Analytics & Reports</h1>
              <p>Track your business performance</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Overview</h3>
                <div className="chart-placeholder">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                  <div className="chart-bar" style={{ height: '75%' }}></div>
                  <div className="chart-bar" style={{ height: '95%' }}></div>
                </div>
                <p className="chart-label">Last 6 months</p>
              </div>

              <div className="analytics-card">
                <h3>Booking Trends</h3>
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
            </div>

            <div className="analytics-summary">
              <div className="summary-card">
                <h4>Total Bookings</h4>
                <p className="summary-value">144</p>
                <span className="summary-change positive">+15% from last month</span>
              </div>
              <div className="summary-card">
                <h4>Average Booking Value</h4>
                <p className="summary-value">₹2.25L</p>
                <span className="summary-change positive">+8% from last month</span>
              </div>
              <div className="summary-card">
                <h4>Conversion Rate</h4>
                <p className="summary-value">68%</p>
                <span className="summary-change positive">+5% from last month</span>
              </div>
              <div className="summary-card">
                <h4>Customer Satisfaction</h4>
                <p className="summary-value">4.8/5</p>
                <span className="summary-change positive">+0.2 from last month</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>Settings</h1>
              <p>Manage your vendor account</p>
            </div>

            <div className="settings-section">
              <div className="settings-card">
                <h3>Business Information</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" value={mockVendor.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={mockVendor.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={mockVendor.phone} readOnly />
                  </div>
                  <button className="btn-primary">Update Information</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Security</h3>
                <div className="security-options">
                  <button className="security-btn">Change Password</button>
                  <button className="security-btn">Two-Factor Authentication</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
