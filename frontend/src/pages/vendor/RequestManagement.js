import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './RequestManagement.css';

const RequestManagement = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    status: 'all',
  });
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch requests
  const { data: requestsData, isLoading } = useQuery('vendorRequests', vendorAPI.getRequests);

  // Mock data
  const mockRequests = [
    {
      id: 'REQ480334',
      passenger: {
        name: 'Jabeena',
        phone: '8899146593',
        email: 'jabeena@example.com',
      },
      service: 'Umrah',
      packageName: '15 Days Regular',
      packageType: 'Bronze (quint)',
      travelers: {
        adults: 3,
        childWithBed: 0,
        childNoBed: 0,
        infant: 0,
        beds: 3,
        seats: 3,
        pax: 3,
      },
      amount: 237000,
      paidAmount: 23700,
      remainingAmount: 213300,
      status: 'pending_agent',
      createdDate: '07 January 2026',
      travelDate: '28 January 2026',
    },
    {
      id: 'REQ480335',
      passenger: {
        name: 'Ahmed Khan',
        phone: '9876543210',
        email: 'ahmed@example.com',
      },
      service: 'Umrah',
      packageName: '20 Days Premium',
      packageType: 'Gold (double)',
      travelers: {
        adults: 2,
        childWithBed: 1,
        childNoBed: 0,
        infant: 0,
        beds: 3,
        seats: 3,
        pax: 3,
      },
      amount: 425000,
      paidAmount: 425000,
      remainingAmount: 0,
      status: 'confirmed',
      createdDate: '06 January 2026',
      travelDate: '15 February 2026',
    },
    {
      id: 'REQ480336',
      passenger: {
        name: 'Fatima Sheikh',
        phone: '9988776655',
        email: 'fatima@example.com',
      },
      service: 'Umrah',
      packageName: '10 Days Economy',
      packageType: 'Silver (triple)',
      travelers: {
        adults: 1,
        childWithBed: 0,
        childNoBed: 0,
        infant: 0,
        beds: 1,
        seats: 1,
        pax: 1,
      },
      amount: 58000,
      paidAmount: 5800,
      remainingAmount: 52200,
      status: 'processing',
      createdDate: '05 January 2026',
      travelDate: '10 March 2026',
    },
  ];

  const requests = requestsData?.data || mockRequests;

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

  const handleAction = (action, requestId) => {
    setActiveDropdown(null);
    
    switch(action) {
      case 'view':
        navigate(`/vendor/requests/${requestId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this request?')) {
          toast.success('Request deleted successfully');
        }
        break;
      case 'negotiate':
        navigate(`/vendor/requests/${requestId}/negotiate`);
        break;
      case 'payment':
        navigate(`/vendor/requests/${requestId}/payment`);
        break;
      case 'add-passengers':
        navigate(`/vendor/requests/${requestId}/passengers/add`);
        break;
      case 'view-passengers':
        navigate(`/vendor/requests/${requestId}/passengers`);
        break;
      case 'view-package':
        navigate(`/vendor/requests/${requestId}/package`);
        break;
      case 'proforma':
        toast.success('Generating Proforma Invoice...');
        break;
      case 'receipt':
        toast.success('Generating Receipt...');
        break;
      case 'view-payments':
        navigate(`/vendor/requests/${requestId}/payments`);
        break;
      case 'itinerary':
        navigate(`/vendor/requests/${requestId}/itinerary`);
        break;
      default:
        break;
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filters.search && !request.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && request.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="request-management-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Request Management</h1>
            <div className="breadcrumb">
              <Link to="/vendor/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Requests</span>
            </div>
          </div>
          <Link to="/vendor/requests/new" className="btn btn-primary">
            <span>➕</span>
            Add New Request
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-left">
            <button className="filter-tab active">All Requests</button>
            <input
              type="text"
              className="search-input"
              placeholder="Search by Booking ID"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="filters-right">
            <div className="date-filter">
              <label>From:</label>
              <input
                type="date"
                className="date-input"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="date-filter">
              <label>To:</label>
              <input
                type="date"
                className="date-input"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <button className="btn btn-secondary">
              <span>🔍</span>
              Filter
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="requests-table-section">
          <div className="table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Request ID</th>
                  <th>Passenger</th>
                  <th>Service</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="request-id-cell">
                        <strong className="request-id">ID: {request.id}</strong>
                        <p className="request-dates">
                          Created: {request.createdDate}<br />
                          Travel: {request.travelDate}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="passenger-cell">
                        <strong className="passenger-name">{request.passenger.name}</strong>
                        <div className="passenger-contact">
                          <span className="passenger-phone">({request.passenger.phone})</span>
                          <a href={`tel:${request.passenger.phone}`} className="contact-icon">📞</a>
                          <a href={`https://wa.me/${request.passenger.phone}`} className="contact-icon">💬</a>
                        </div>
                        <p className="passenger-details">
                          Adults: {request.travelers.adults} | Child With Bed: {request.travelers.childWithBed} | 
                          Child No Bed: {request.travelers.childNoBed} | Infant: {request.travelers.infant}<br />
                          Beds: {request.travelers.beds} | Seats: {request.travelers.seats} | PAX: {request.travelers.pax}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="service-cell">
                        <strong className="service-name">{request.service}</strong>
                        <p className="package-name">{request.packageName}</p>
                        <p className="package-type">{request.packageType}</p>
                      </div>
                    </td>
                    <td>
                      <div className="amount-cell">
                        <strong className="total-amount">₹{request.amount.toLocaleString()}</strong>
                        {request.remainingAmount > 0 && (
                          <p className="remaining-amount">
                            Remaining: ₹{request.remainingAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="action-dropdown-container">
                        <button
                          className="btn btn-sm btn-secondary actions-btn"
                          onClick={() => setActiveDropdown(activeDropdown === request.id ? null : request.id)}
                        >
                          Actions ▼
                        </button>
                        {activeDropdown === request.id && (
                          <div className="actions-dropdown">
                            <button onClick={() => handleAction('view', request.id)}>
                              <span>👁️</span> View
                            </button>
                            <button onClick={() => handleAction('delete', request.id)}>
                              <span>🗑️</span> Delete
                            </button>
                            <button onClick={() => handleAction('negotiate', request.id)}>
                              <span>🤝</span> Negotiate
                            </button>
                            <button onClick={() => handleAction('payment', request.id)}>
                              <span>💳</span> Make Payment
                            </button>
                            <button onClick={() => handleAction('add-passengers', request.id)}>
                              <span>👥</span> Add Passengers
                            </button>
                            <button onClick={() => handleAction('view-passengers', request.id)}>
                              <span>👥</span> View Passengers
                            </button>
                            <button onClick={() => handleAction('view-package', request.id)}>
                              <span>📦</span> View Package
                            </button>
                            <button onClick={() => handleAction('itinerary', request.id)}>
                              <span>📋</span> Generate Itinerary
                            </button>
                            <button onClick={() => handleAction('proforma', request.id)}>
                              <span>📄</span> Proforma Invoice
                            </button>
                            <button onClick={() => handleAction('receipt', request.id)}>
                              <span>📃</span> Generate Receipt
                            </button>
                            <button onClick={() => handleAction('view-payments', request.id)}>
                              <span>💰</span> View Payments
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination-section">
          <div className="pagination-info">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>← Previous</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;
