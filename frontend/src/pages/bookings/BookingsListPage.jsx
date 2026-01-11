import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BookingsListPage.css';

const BookingsListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/bookings?status=${filter}`);
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setBookings([
          {
            id: 'BK001',
            packageTitle: '14 Days Premium Umrah Package',
            packageType: 'Umrah',
            bookingDate: '2024-01-15',
            departureDate: '2024-03-20',
            travelers: 2,
            totalAmount: 170000,
            status: 'confirmed',
            paymentStatus: 'paid'
          },
          {
            id: 'BK002',
            packageTitle: '21 Days Hajj Package',
            packageType: 'Hajj',
            bookingDate: '2024-01-10',
            departureDate: '2024-06-15',
            travelers: 4,
            totalAmount: 450000,
            status: 'pending',
            paymentStatus: 'partial'
          },
          {
            id: 'BK003',
            packageTitle: '10 Days Economy Umrah',
            packageType: 'Umrah',
            bookingDate: '2023-12-20',
            departureDate: '2024-02-10',
            travelers: 1,
            totalAmount: 65000,
            status: 'completed',
            paymentStatus: 'paid'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', class: 'status-confirmed' },
      pending: { label: 'Pending', class: 'status-pending' },
      completed: { label: 'Completed', class: 'status-completed' },
      cancelled: { label: 'Cancelled', class: 'status-cancelled' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getPaymentBadge = (status) => {
    const paymentConfig = {
      paid: { label: 'Paid', class: 'payment-paid' },
      partial: { label: 'Partial', class: 'payment-partial' },
      pending: { label: 'Pending', class: 'payment-pending' }
    };
    return paymentConfig[status] || paymentConfig.pending;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.packageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bookings-list-page">
      <div className="bookings-container">
        {/* Header */}
        <div className="bookings-header">
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">📋</span>
              My Bookings
            </h1>
            <p className="page-subtitle">
              View and manage all your bookings
            </p>
          </div>
          <Link to="/packages" className="btn btn-primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="bookings-stats">
          <div className="stat-card">
            <div className="stat-icon stat-icon-total">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-confirmed">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="stat-label">Confirmed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-pending">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-completed">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bookings-controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Bookings
            </button>
            <button
              className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>

          <div className="search-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {loading ? (
            <div className="loading-grid">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="booking-skeleton"></div>
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">
                    <span className="id-label">Booking ID:</span>
                    <span className="id-value">{booking.id}</span>
                  </div>
                  <div className="booking-badges">
                    <span className={`status-badge ${getStatusBadge(booking.status).class}`}>
                      {getStatusBadge(booking.status).label}
                    </span>
                    <span className={`payment-badge ${getPaymentBadge(booking.paymentStatus).class}`}>
                      {getPaymentBadge(booking.paymentStatus).label}
                    </span>
                  </div>
                </div>

                <div className="booking-body">
                  <div className="booking-main">
                    <div className="package-type-badge">{booking.packageType}</div>
                    <h3 className="package-title">{booking.packageTitle}</h3>
                    
                    <div className="booking-details">
                      <div className="detail-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="detail-content">
                          <span className="detail-label">Departure Date</span>
                          <span className="detail-value">
                            {new Date(booking.departureDate).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <div className="detail-content">
                          <span className="detail-label">Travelers</span>
                          <span className="detail-value">{booking.travelers} Person(s)</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="detail-content">
                          <span className="detail-label">Total Amount</span>
                          <span className="detail-value">₹{booking.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="detail-content">
                          <span className="detail-label">Booked On</span>
                          <span className="detail-value">
                            {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <Link to={`/bookings/${booking.id}`} className="btn btn-secondary btn-sm">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </Link>
                  
                  {booking.status === 'confirmed' && (
                    <button className="btn btn-primary btn-sm">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Download Invoice
                    </button>
                  )}

                  {booking.status === 'pending' && (
                    <button className="btn btn-primary btn-sm">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Complete Payment
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No Bookings Found</h3>
              <p className="empty-description">
                {searchQuery 
                  ? 'No bookings match your search criteria'
                  : filter === 'all'
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings found`
                }
              </p>
              {!searchQuery && filter === 'all' && (
                <Link to="/packages" className="btn btn-primary">
                  Browse Packages
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsListPage;
