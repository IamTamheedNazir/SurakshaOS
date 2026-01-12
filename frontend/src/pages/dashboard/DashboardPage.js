import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { bookingsAPI, paymentsAPI, documentsAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const { data: bookingsData } = useQuery('userBookings', bookingsAPI.getUserBookings);
  const { data: paymentsData } = useQuery('userPayments', paymentsAPI.getUserPayments);
  const { data: documentsData } = useQuery('userDocuments', documentsAPI.getUserDocuments);

  // Mock data for development
  const mockBookings = [
    {
      id: 'BK001',
      packageTitle: 'Gold Umrah Package - 15 Days',
      departureDate: '2024-03-15',
      status: 'confirmed',
      travelers: 2,
      totalAmount: 220000,
      paidAmount: 22000,
      remainingAmount: 198000,
      visaStatus: 'processing',
      bookingDate: '2024-01-15',
    },
    {
      id: 'BK002',
      packageTitle: 'Economy Umrah Package - 10 Days',
      departureDate: '2024-04-20',
      status: 'pending_documents',
      travelers: 1,
      totalAmount: 58000,
      paidAmount: 5800,
      remainingAmount: 52200,
      visaStatus: 'pending',
      bookingDate: '2024-01-20',
    },
  ];

  const mockPayments = [
    {
      id: 'PAY001',
      bookingId: 'BK001',
      amount: 22000,
      type: 'booking',
      method: 'UPI',
      status: 'completed',
      date: '2024-01-15',
      transactionId: 'TXN123456789',
    },
    {
      id: 'PAY002',
      bookingId: 'BK002',
      amount: 5800,
      type: 'booking',
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-20',
      transactionId: 'TXN987654321',
    },
  ];

  const mockDocuments = [
    {
      id: 'DOC001',
      bookingId: 'BK001',
      type: 'passport',
      travelerName: 'Ahmed Khan',
      status: 'approved',
      uploadDate: '2024-01-16',
    },
    {
      id: 'DOC002',
      bookingId: 'BK001',
      type: 'photo',
      travelerName: 'Ahmed Khan',
      status: 'approved',
      uploadDate: '2024-01-16',
    },
    {
      id: 'DOC003',
      bookingId: 'BK002',
      type: 'passport',
      travelerName: 'Fatima Sheikh',
      status: 'pending',
      uploadDate: '2024-01-21',
    },
  ];

  const bookings = bookingsData?.data || mockBookings;
  const payments = paymentsData?.data || mockPayments;
  const documents = documentsData?.data || mockDocuments;

  const stats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalSpent: payments.reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: bookings.reduce((sum, b) => sum + b.remainingAmount, 0),
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', class: 'badge-success' },
      pending_documents: { label: 'Pending Documents', class: 'badge-warning' },
      pending_payment: { label: 'Pending Payment', class: 'badge-warning' },
      cancelled: { label: 'Cancelled', class: 'badge-error' },
      completed: { label: 'Completed', class: 'badge-blue' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getVisaStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', class: 'badge-gray', icon: '⏳' },
      processing: { label: 'Processing', class: 'badge-blue', icon: '🔄' },
      approved: { label: 'Approved', class: 'badge-success', icon: '✅' },
      rejected: { label: 'Rejected', class: 'badge-error', icon: '❌' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray', icon: '❓' };
    return (
      <span className={`badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name || 'Traveler'}! 👋</h1>
            <p className="dashboard-subtitle">Manage your bookings, payments, and documents</p>
          </div>
          <Link to="/packages" className="btn btn-primary">
            <span>🔍</span>
            Browse Packages
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activeBookings}</div>
              <div className="stat-label">Active Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.totalSpent.toLocaleString()}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">⏳</div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.pendingPayments.toLocaleString()}</div>
              <div className="stat-label">Pending Payments</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span>
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span>📦</span>
            My Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span>💳</span>
            Payments
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span>📄</span>
            Documents
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span>
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content-section">
              <div className="content-grid">
                {/* Recent Bookings */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>📦 Recent Bookings</h3>
                    <Link to="#" onClick={() => setActiveTab('bookings')} className="view-all-link">
                      View All →
                    </Link>
                  </div>
                  <div className="bookings-list">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="booking-item">
                        <div className="booking-info">
                          <h4>{booking.packageTitle}</h4>
                          <div className="booking-meta">
                            <span>📅 {booking.departureDate}</span>
                            <span>👥 {booking.travelers} Traveler(s)</span>
                          </div>
                        </div>
                        <div className="booking-status">
                          {getStatusBadge(booking.status)}
                          {getVisaStatusBadge(booking.visaStatus)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Payments */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>💰 Upcoming Payments</h3>
                    <Link to="#" onClick={() => setActiveTab('payments')} className="view-all-link">
                      View All →
                    </Link>
                  </div>
                  <div className="payments-list">
                    {bookings
                      .filter(b => b.remainingAmount > 0)
                      .map((booking) => (
                        <div key={booking.id} className="payment-item">
                          <div className="payment-info">
                            <h4>{booking.packageTitle}</h4>
                            <p>Due: 30 days before departure</p>
                          </div>
                          <div className="payment-amount">
                            <strong>₹{booking.remainingAmount.toLocaleString()}</strong>
                            <button className="btn btn-sm btn-primary">Pay Now</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Visa Tracking */}
                <div className="content-card card-full">
                  <div className="card-header">
                    <h3>📱 Visa Tracking</h3>
                  </div>
                  <div className="visa-tracking-grid">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="visa-tracking-card">
                        <h4>{booking.packageTitle}</h4>
                        <div className="visa-stages">
                          {[
                            'Application Prepared',
                            'Submitted to Embassy',
                            'Biometrics Scheduled',
                            'Under Processing',
                            'Visa Approved',
                            'Document Uploaded',
                            'Ready to Travel',
                          ].map((stage, index) => (
                            <div
                              key={index}
                              className={`visa-stage ${index < 3 ? 'completed' : 'pending'}`}
                            >
                              <div className="stage-icon">
                                {index < 3 ? '✅' : '⏳'}
                              </div>
                              <div className="stage-label">{stage}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-content-section">
              <div className="content-card">
                <div className="card-header">
                  <h3>📦 All Bookings</h3>
                  <div className="filter-buttons">
                    <button className="filter-btn active">All</button>
                    <button className="filter-btn">Confirmed</button>
                    <button className="filter-btn">Pending</button>
                    <button className="filter-btn">Completed</button>
                  </div>
                </div>
                <div className="bookings-table">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-card-header">
                        <div>
                          <h4>{booking.packageTitle}</h4>
                          <p className="booking-id">Booking ID: {booking.id}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="booking-card-details">
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <div>
                            <strong>Departure Date</strong>
                            <p>{booking.departureDate}</p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">👥</span>
                          <div>
                            <strong>Travelers</strong>
                            <p>{booking.travelers} Person(s)</p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">💰</span>
                          <div>
                            <strong>Total Amount</strong>
                            <p>₹{booking.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📱</span>
                          <div>
                            <strong>Visa Status</strong>
                            <p>{getVisaStatusBadge(booking.visaStatus)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="booking-card-actions">
                        <button className="btn btn-sm btn-secondary">View Details</button>
                        <button className="btn btn-sm btn-primary">Track Visa</button>
                        {booking.remainingAmount > 0 && (
                          <button className="btn btn-sm btn-success">Pay ₹{booking.remainingAmount.toLocaleString()}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="tab-content-section">
              <div className="content-card">
                <div className="card-header">
                  <h3>💳 Payment History</h3>
                  <button className="btn btn-sm btn-primary">Download Statement</button>
                </div>
                <div className="payments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Booking ID</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="font-mono">{payment.transactionId}</td>
                          <td>{payment.bookingId}</td>
                          <td>{payment.date}</td>
                          <td>
                            <span className="badge badge-blue">
                              {payment.type === 'booking' ? 'Booking' : 'Balance'}
                            </span>
                          </td>
                          <td>{payment.method}</td>
                          <td className="font-bold">₹{payment.amount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${payment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                              {payment.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-secondary">Receipt</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="tab-content-section">
              <div className="content-card">
                <div className="card-header">
                  <h3>📄 Documents</h3>
                  <button className="btn btn-sm btn-primary">
                    <span>📤</span>
                    Upload Document
                  </button>
                </div>
                <div className="documents-grid">
                  {documents.map((doc) => (
                    <div key={doc.id} className="document-card">
                      <div className="document-icon">
                        {doc.type === 'passport' ? '📘' : doc.type === 'photo' ? '📷' : '📄'}
                      </div>
                      <div className="document-info">
                        <h4>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</h4>
                        <p>{doc.travelerName}</p>
                        <p className="document-date">Uploaded: {doc.uploadDate}</p>
                      </div>
                      <div className="document-status">
                        <span className={`badge ${doc.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                          {doc.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="document-actions">
                        <button className="btn btn-sm btn-secondary">View</button>
                        <button className="btn btn-sm btn-primary">Replace</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content-section">
              <div className="content-grid">
                <div className="content-card">
                  <div className="card-header">
                    <h3>👤 Personal Information</h3>
                    <button className="btn btn-sm btn-primary">Edit</button>
                  </div>
                  <div className="profile-info">
                    <div className="profile-field">
                      <label>Full Name</label>
                      <p>{user?.name || 'Ahmed Khan'}</p>
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <p>{user?.email || 'ahmed@example.com'}</p>
                    </div>
                    <div className="profile-field">
                      <label>Phone</label>
                      <p>{user?.phone || '+91 98765 43210'}</p>
                    </div>
                    <div className="profile-field">
                      <label>Date of Birth</label>
                      <p>15 Jan 1990</p>
                    </div>
                  </div>
                </div>

                <div className="content-card">
                  <div className="card-header">
                    <h3>🔒 Security</h3>
                  </div>
                  <div className="security-options">
                    <button className="security-btn">
                      <span>🔑</span>
                      <div>
                        <strong>Change Password</strong>
                        <p>Update your password regularly</p>
                      </div>
                      <span>→</span>
                    </button>
                    <button className="security-btn">
                      <span>📱</span>
                      <div>
                        <strong>Two-Factor Authentication</strong>
                        <p>Add extra security to your account</p>
                      </div>
                      <span>→</span>
                    </button>
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

export default DashboardPage;
