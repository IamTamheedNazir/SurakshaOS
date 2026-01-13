import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User,
  Package,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    savedPackages: 0,
  });

  useEffect(() => {
    // Fetch user stats from API
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    // TODO: Replace with actual API call
    setStats({
      totalBookings: 5,
      activeBookings: 2,
      completedBookings: 3,
      savedPackages: 12,
    });
  };

  const recentBookings = [
    {
      id: 1,
      packageName: 'Premium Umrah Package',
      vendor: 'Al-Haramain Tours',
      date: '2024-03-15',
      status: 'confirmed',
      amount: 149999,
    },
    {
      id: 2,
      packageName: 'Economy Umrah Package',
      vendor: 'Makkah Travels',
      date: '2024-02-20',
      status: 'completed',
      amount: 89999,
    },
    {
      id: 3,
      packageName: 'Hajj Package 2025',
      vendor: 'Royal Pilgrimage',
      date: '2024-01-10',
      status: 'pending',
      amount: 449999,
    },
  ];

  const savedPackages = [
    {
      id: 1,
      name: 'Luxury Umrah Experience',
      vendor: 'Royal Pilgrimage',
      price: 249999,
      rating: 5.0,
    },
    {
      id: 2,
      name: 'Family Umrah Package',
      vendor: 'Family Tours',
      price: 119999,
      rating: 4.7,
    },
  ];

  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Your booking for Premium Umrah Package has been confirmed',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'New package available: Early Bird Hajj 2025',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'warning',
      message: 'Payment pending for Economy Umrah Package',
      time: '3 days ago',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#0f6b3f';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(15, 107, 63, 0.1)' }}>
            <Package size={24} style={{ color: '#0f6b3f' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <TrendingUp size={24} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeBookings}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <CheckCircle size={24} style={{ color: '#d4af37' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedBookings}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <Heart size={24} style={{ color: '#ef4444' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.savedPackages}</div>
            <div className="stat-label">Saved Packages</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">Recent Bookings</h3>
          <button className="view-all-btn">
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="bookings-list">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-info">
                  <h4 className="booking-name">{booking.packageName}</h4>
                  <p className="booking-vendor">{booking.vendor}</p>
                </div>
                <div 
                  className="booking-status"
                  style={{ 
                    background: `${getStatusColor(booking.status)}20`,
                    color: getStatusColor(booking.status)
                  }}
                >
                  {getStatusIcon(booking.status)}
                  <span>{booking.status}</span>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-detail">
                  <Calendar size={16} />
                  <span>{new Date(booking.date).toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="booking-detail">
                  <span className="booking-amount">₹{booking.amount.toLocaleString()}</span>
                </div>
              </div>

              <button className="booking-action-btn">
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Packages */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">Saved Packages</h3>
          <button className="view-all-btn">
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="saved-packages-grid">
          {savedPackages.map((pkg) => (
            <div key={pkg.id} className="saved-package-card">
              <div className="package-header">
                <h4 className="package-name">{pkg.name}</h4>
                <button className="package-wishlist-btn">
                  <Heart size={20} fill="#ef4444" color="#ef4444" />
                </button>
              </div>
              <p className="package-vendor">{pkg.vendor}</p>
              <div className="package-footer">
                <div className="package-rating">
                  <Star size={16} fill="#d4af37" color="#d4af37" />
                  <span>{pkg.rating}</span>
                </div>
                <div className="package-price">₹{pkg.price.toLocaleString()}</div>
              </div>
              <button className="package-view-btn">View Package</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-profile">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user?.fullName || 'User Name'}</h3>
            <p className="profile-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail-item">
            <Phone size={20} />
            <div>
              <div className="detail-label">Phone</div>
              <div className="detail-value">{user?.phone || '+91 XXXXX XXXXX'}</div>
            </div>
          </div>

          <div className="profile-detail-item">
            <MapPin size={20} />
            <div>
              <div className="detail-label">Location</div>
              <div className="detail-value">{user?.city || 'City'}, {user?.state || 'State'}</div>
            </div>
          </div>

          <div className="profile-detail-item">
            <Mail size={20} />
            <div>
              <div className="detail-label">Email</div>
              <div className="detail-value">{user?.email || 'user@example.com'}</div>
            </div>
          </div>

          <div className="profile-detail-item">
            <Calendar size={20} />
            <div>
              <div className="detail-label">Member Since</div>
              <div className="detail-value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', { 
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'January 2024'
                }
              </div>
            </div>
          </div>
        </div>

        <button className="edit-profile-btn">
          <Settings size={20} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="dashboard-notifications">
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div 
              className="notification-icon"
              style={{
                background: notification.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.1)'
                  : notification.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                color: notification.type === 'success'
                  ? '#10b981'
                  : notification.type === 'warning'
                  ? '#f59e0b'
                  : '#3b82f6'
              }}
            >
              <Bell size={20} />
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="user-avatar">
              <User size={32} />
            </div>
            <div className="user-info">
              <h3 className="user-name">{user?.fullName || 'User Name'}</h3>
              <p className="user-type">{user?.userType === 'vendor' ? 'Vendor' : 'Pilgrim'}</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Package size={20} />
              <span>Overview</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              <span>Notifications</span>
              <span className="notification-badge">3</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>

            <button className="nav-item logout-btn" onClick={logout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'profile' && 'My Profile'}
                {activeTab === 'notifications' && 'Notifications'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="dashboard-subtitle">
                {activeTab === 'overview' && 'Welcome back! Here\'s your activity summary'}
                {activeTab === 'profile' && 'Manage your personal information'}
                {activeTab === 'notifications' && 'Stay updated with your bookings'}
                {activeTab === 'settings' && 'Customize your preferences'}
              </p>
            </div>
          </div>

          <div className="dashboard-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'settings' && (
              <div className="coming-soon">
                <Settings size={48} />
                <h3>Settings Coming Soon</h3>
                <p>We're working on bringing you more customization options</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
