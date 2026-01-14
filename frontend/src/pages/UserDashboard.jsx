import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

// Icons
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BookingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Mock user data
const mockUser = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan&background=0f6b3f&color=fff&size=200',
  memberSince: '2023',
  totalBookings: 3,
  upcomingTrips: 1
};

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    reference: 'UC12345678',
    packageName: '15 Days Premium Umrah Package',
    vendor: 'Al-Haramain Tours',
    departureDate: '2024-03-15',
    travelers: 2,
    status: 'confirmed',
    amount: 283500,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400'
  },
  {
    id: 2,
    reference: 'UC87654321',
    packageName: '10 Days Economy Umrah Package',
    vendor: 'Makkah Express',
    departureDate: '2024-02-20',
    travelers: 4,
    status: 'completed',
    amount: 380000,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400'
  },
  {
    id: 3,
    reference: 'UC11223344',
    packageName: '12 Days Deluxe Umrah Package',
    vendor: 'Madinah Travels',
    departureDate: '2023-12-10',
    travelers: 3,
    status: 'completed',
    amount: 405000,
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400'
  }
];

// Mock saved packages
const mockSavedPackages = [
  {
    id: 4,
    name: '20 Days VIP Umrah Package',
    vendor: 'Royal Umrah Services',
    price: 185000,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400',
    duration: '20 Days / 19 Nights'
  },
  {
    id: 5,
    name: '14 Days Family Umrah Package',
    vendor: 'Family Tours',
    price: 125000,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
    duration: '14 Days / 13 Nights'
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    }, 500);
  };

  const handleRemoveSaved = (id) => {
    alert(`Package ${id} removed from saved items`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { label: 'Confirmed', color: '#0f6b3f' },
      completed: { label: 'Completed', color: '#6b7280' },
      pending: { label: 'Pending', color: '#f59e0b' },
      cancelled: { label: 'Cancelled', color: '#ef4444' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <img src={mockUser.avatar} alt={mockUser.name} />
          </div>
          <h3>{mockUser.name}</h3>
          <p>{mockUser.email}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <UserIcon />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <BookingIcon />
            <span>My Bookings</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <HeartIcon />
            <span>Saved Packages</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <SettingsIcon />
            <span>Account Settings</span>
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
              <h1>Welcome back, {mockUser.name.split(' ')[0]}! 👋</h1>
              <p>Here's what's happening with your bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(15, 107, 63, 0.1)' }}>
                  <BookingIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">{mockUser.totalBookings}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <CalendarIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Upcoming Trips</span>
                  <span className="stat-value">{mockUser.upcomingTrips}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <HeartIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Saved Packages</span>
                  <span className="stat-value">{mockSavedPackages.length}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <ClockIcon />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">{mockUser.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Booking */}
            <div className="section">
              <h2>Upcoming Trip</h2>
              {mockBookings.filter(b => b.status === 'confirmed').map(booking => (
                <div key={booking.id} className="upcoming-booking-card">
                  <img src={booking.image} alt={booking.packageName} />
                  <div className="booking-details">
                    <div className="booking-header">
                      <div>
                        <h3>{booking.packageName}</h3>
                        <p className="vendor-name">{booking.vendor}</p>
                      </div>
                      <span className="status-badge" style={{ background: getStatusBadge(booking.status).color }}>
                        {getStatusBadge(booking.status).label}
                      </span>
                    </div>
                    <div className="booking-info">
                      <div className="info-item">
                        <CalendarIcon />
                        <span>{new Date(booking.departureDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="info-item">
                        <UserIcon />
                        <span>{booking.travelers} Travelers</span>
                      </div>
                      <div className="info-item">
                        <span className="reference">Ref: {booking.reference}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-secondary">
                        <DownloadIcon />
                        Download Invoice
                      </button>
                      <button className="btn-primary">
                        <EyeIcon />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <Link to="#" onClick={() => setActiveTab('bookings')}>View All</Link>
              </div>
              <div className="bookings-list">
                {mockBookings.slice(1, 3).map(booking => (
                  <div key={booking.id} className="booking-card-small">
                    <img src={booking.image} alt={booking.packageName} />
                    <div className="booking-info-small">
                      <h4>{booking.packageName}</h4>
                      <p>{booking.vendor}</p>
                      <div className="booking-meta">
                        <span>{new Date(booking.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="status-badge-small" style={{ background: getStatusBadge(booking.status).color }}>
                          {getStatusBadge(booking.status).label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>My Bookings</h1>
              <p>View and manage all your Umrah bookings</p>
            </div>

            <div className="bookings-grid">
              {mockBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-image">
                    <img src={booking.image} alt={booking.packageName} />
                    <span className="status-badge" style={{ background: getStatusBadge(booking.status).color }}>
                      {getStatusBadge(booking.status).label}
                    </span>
                  </div>
                  <div className="booking-card-content">
                    <h3>{booking.packageName}</h3>
                    <p className="vendor-name">{booking.vendor}</p>
                    
                    <div className="booking-details-grid">
                      <div className="detail-item">
                        <CalendarIcon />
                        <div>
                          <span className="detail-label">Departure</span>
                          <span className="detail-value">
                            {new Date(booking.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <UserIcon />
                        <div>
                          <span className="detail-label">Travelers</span>
                          <span className="detail-value">{booking.travelers} Person(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-footer">
                      <div className="booking-amount">
                        <span className="amount-label">Total Amount</span>
                        <span className="amount-value">₹{booking.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="booking-reference">
                        Ref: {booking.reference}
                      </div>
                    </div>

                    <div className="booking-card-actions">
                      <button className="btn-outline">
                        <DownloadIcon />
                        Invoice
                      </button>
                      <button className="btn-primary">
                        <EyeIcon />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Packages Tab */}
        {activeTab === 'saved' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>Saved Packages</h1>
              <p>Your favorite Umrah packages</p>
            </div>

            <div className="saved-packages-grid">
              {mockSavedPackages.map(pkg => (
                <div key={pkg.id} className="saved-package-card">
                  <div className="package-image">
                    <img src={pkg.image} alt={pkg.name} />
                    <button className="remove-btn" onClick={() => handleRemoveSaved(pkg.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="package-content">
                    <h3>{pkg.name}</h3>
                    <p className="vendor-name">{pkg.vendor}</p>
                    
                    <div className="package-meta">
                      <div className="rating">
                        <span className="star">⭐</span>
                        <span>{pkg.rating}</span>
                        <span className="reviews">({pkg.reviews} reviews)</span>
                      </div>
                      <span className="duration">{pkg.duration}</span>
                    </div>

                    <div className="package-footer">
                      <div className="price">
                        <span className="price-label">Starting from</span>
                        <span className="price-value">₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <Link to={`/packages/${pkg.id}`} className="btn-primary">
                        View Package
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>Account Settings</h1>
              <p>Manage your profile and preferences</p>
            </div>

            <div className="profile-section">
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>Personal Information</h3>
                  {!isEditingProfile && (
                    <button className="btn-edit" onClick={() => setIsEditingProfile(true)}>
                      <EditIcon />
                      Edit
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-actions">
                      <button className="btn-secondary" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </button>
                      <button className="btn-primary" onClick={handleProfileUpdate}>
                        <CheckIcon />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{mockUser.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email Address</span>
                      <span className="info-value">{mockUser.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone Number</span>
                      <span className="info-value">{mockUser.phone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Member Since</span>
                      <span className="info-value">{mockUser.memberSince}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>Security</h3>
                </div>
                <div className="security-options">
                  <button className="security-btn">
                    Change Password
                  </button>
                  <button className="security-btn">
                    Two-Factor Authentication
                  </button>
                </div>
              </div>

              <div className="profile-card danger-zone">
                <div className="profile-card-header">
                  <h3>Danger Zone</h3>
                </div>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
