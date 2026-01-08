import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './CRMSystem.css';

const CRMSystem = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    source: 'all',
  });

  // Mock data
  const mockCustomers = [
    {
      id: 'CUST001',
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210',
      status: 'active',
      source: 'website',
      totalBookings: 3,
      totalSpent: 425000,
      lastBooking: '2026-01-05',
      joinedDate: '2025-06-15',
      tags: ['VIP', 'Repeat Customer'],
      notes: 'Prefers Gold packages, travels with family',
    },
    {
      id: 'CUST002',
      name: 'Fatima Sheikh',
      email: 'fatima@example.com',
      phone: '+91 9988776655',
      whatsapp: '+91 9988776655',
      status: 'active',
      source: 'referral',
      totalBookings: 1,
      totalSpent: 58000,
      lastBooking: '2026-01-03',
      joinedDate: '2025-12-20',
      tags: ['New Customer'],
      notes: 'Budget conscious, looking for economy packages',
    },
    {
      id: 'CUST003',
      name: 'Mohammed Ali',
      email: 'mohammed@example.com',
      phone: '+91 9123456789',
      whatsapp: '+91 9123456789',
      status: 'lead',
      source: 'social_media',
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: null,
      joinedDate: '2026-01-07',
      tags: ['Hot Lead'],
      notes: 'Interested in Ramzan package, requested callback',
    },
  ];

  const mockLeads = [
    {
      id: 'LEAD001',
      name: 'Ayesha Begum',
      email: 'ayesha@example.com',
      phone: '+91 9876501234',
      source: 'website',
      status: 'new',
      interest: 'Umrah - 15 Days Premium',
      budget: '100000-150000',
      travelDate: '2026-03-15',
      notes: 'Looking for family package, 4 people',
      createdDate: '2026-01-08',
      lastContact: null,
      assignedTo: 'Sales Team',
    },
    {
      id: 'LEAD002',
      name: 'Imran Patel',
      email: 'imran@example.com',
      phone: '+91 9988001122',
      source: 'phone',
      status: 'contacted',
      interest: 'Hajj Package',
      budget: '200000+',
      travelDate: '2026-06-01',
      notes: 'Wants premium accommodation near Haram',
      createdDate: '2026-01-06',
      lastContact: '2026-01-07',
      assignedTo: 'Zarkha',
    },
    {
      id: 'LEAD003',
      name: 'Zainab Ahmed',
      email: 'zainab@example.com',
      phone: '+91 9123450000',
      source: 'referral',
      status: 'qualified',
      interest: 'Umrah - 10 Days Economy',
      budget: '50000-75000',
      travelDate: '2026-02-20',
      notes: 'Referred by Ahmed Khan, ready to book',
      createdDate: '2026-01-05',
      lastContact: '2026-01-07',
      assignedTo: 'Zarkha',
    },
  ];

  const mockCommunications = [
    {
      id: 'COMM001',
      customerId: 'CUST001',
      customerName: 'Ahmed Khan',
      type: 'call',
      subject: 'Follow-up on Ramzan Package',
      notes: 'Discussed pricing and availability. Customer interested in booking for 5 people.',
      date: '2026-01-07',
      time: '14:30',
      duration: '15 mins',
      outcome: 'positive',
      nextAction: 'Send quotation',
      nextActionDate: '2026-01-08',
    },
    {
      id: 'COMM002',
      customerId: 'CUST002',
      customerName: 'Fatima Sheikh',
      type: 'email',
      subject: 'Package Details Sent',
      notes: 'Sent detailed itinerary and pricing for Economy package',
      date: '2026-01-06',
      time: '10:15',
      duration: null,
      outcome: 'neutral',
      nextAction: 'Follow-up call',
      nextActionDate: '2026-01-09',
    },
    {
      id: 'COMM003',
      customerId: 'LEAD002',
      customerName: 'Imran Patel',
      type: 'whatsapp',
      subject: 'Initial Inquiry',
      notes: 'Customer asked about Hajj packages and visa requirements',
      date: '2026-01-07',
      time: '16:45',
      duration: null,
      outcome: 'positive',
      nextAction: 'Schedule meeting',
      nextActionDate: '2026-01-10',
    },
  ];

  const customers = mockCustomers;
  const leads = mockLeads;
  const communications = mockCommunications;

  const stats = {
    totalCustomers: customers.filter(c => c.status === 'active').length,
    totalLeads: leads.length,
    hotLeads: leads.filter(l => l.status === 'qualified').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'badge-success' },
      inactive: { label: 'Inactive', class: 'badge-gray' },
      lead: { label: 'Lead', class: 'badge-blue' },
      new: { label: 'New', class: 'badge-blue' },
      contacted: { label: 'Contacted', class: 'badge-purple' },
      qualified: { label: 'Qualified', class: 'badge-success' },
      converted: { label: 'Converted', class: 'badge-green' },
      lost: { label: 'Lost', class: 'badge-error' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      website: { label: 'Website', icon: '🌐' },
      referral: { label: 'Referral', icon: '👥' },
      social_media: { label: 'Social Media', icon: '📱' },
      phone: { label: 'Phone', icon: '📞' },
      email: { label: 'Email', icon: '📧' },
      walk_in: { label: 'Walk-in', icon: '🚶' },
    };
    const config = sourceConfig[source] || { label: source, icon: '❓' };
    return (
      <span className="source-badge">
        {config.icon} {config.label}
      </span>
    );
  };

  const getCommunicationIcon = (type) => {
    const icons = {
      call: '📞',
      email: '📧',
      whatsapp: '💬',
      meeting: '🤝',
      sms: '💬',
    };
    return icons[type] || '📝';
  };

  return (
    <div className="crm-system-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">👥 CRM System</h1>
            <div className="breadcrumb">
              <Link to="/vendor/dashboard">Dashboard</Link>
              <span>›</span>
              <span>CRM</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📤</span>
              Export Data
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/vendor/crm/add-customer')}>
              <span>➕</span>
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="crm-stats-grid">
          <div className="crm-stat-card stat-blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCustomers}</div>
              <div className="stat-label">Total Customers</div>
            </div>
          </div>
          <div className="crm-stat-card stat-purple">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalLeads}</div>
              <div className="stat-label">Active Leads</div>
            </div>
          </div>
          <div className="crm-stat-card stat-green">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.hotLeads}</div>
              <div className="stat-label">Hot Leads</div>
            </div>
          </div>
          <div className="crm-stat-card stat-gold">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="crm-tabs">
          <button
            className={`crm-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <span>👥</span>
            Customers
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <span>🎯</span>
            Leads
          </button>
          <button
            className={`crm-tab-btn ${activeTab === 'communications' ? 'active' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            <span>💬</span>
            Communications
          </button>
        </div>

        {/* Tab Content */}
        <div className="crm-content">
          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="crm-section">
              {/* Filters */}
              <div className="crm-filters">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search customers..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                </select>
                <select
                  className="filter-select"
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                >
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {/* Customers Grid */}
              <div className="customers-grid">
                {customers.map((customer) => (
                  <div key={customer.id} className="customer-card">
                    <div className="customer-header">
                      <div className="customer-avatar">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="customer-info">
                        <h3 className="customer-name">{customer.name}</h3>
                        <p className="customer-id">ID: {customer.id}</p>
                      </div>
                      {getStatusBadge(customer.status)}
                    </div>

                    <div className="customer-details">
                      <div className="detail-row">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">{customer.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{customer.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">💬</span>
                        <a href={`https://wa.me/${customer.whatsapp.replace(/\s/g, '')}`} className="detail-link">
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="customer-stats">
                      <div className="stat-item">
                        <span className="stat-value">{customer.totalBookings}</span>
                        <span className="stat-label">Bookings</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">₹{(customer.totalSpent / 1000).toFixed(0)}K</span>
                        <span className="stat-label">Spent</span>
                      </div>
                    </div>

                    <div className="customer-meta">
                      {getSourceBadge(customer.source)}
                      <span className="join-date">Joined: {customer.joinedDate}</span>
                    </div>

                    <div className="customer-tags">
                      {customer.tags.map((tag, index) => (
                        <span key={index} className="customer-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="customer-actions">
                      <button
                        className="action-btn action-btn-primary"
                        onClick={() => navigate(`/vendor/crm/customers/${customer.id}`)}
                      >
                        <span>👁️</span> View
                      </button>
                      <button className="action-btn action-btn-secondary">
                        <span>✏️</span> Edit
                      </button>
                      <button className="action-btn action-btn-success">
                        <span>📞</span> Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="crm-section">
              <div className="leads-table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Name & Contact</th>
                      <th>Interest</th>
                      <th>Budget</th>
                      <th>Travel Date</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <strong>{lead.id}</strong>
                          <p className="table-meta">Created: {lead.createdDate}</p>
                        </td>
                        <td>
                          <strong>{lead.name}</strong>
                          <p className="table-meta">{lead.phone}</p>
                          <p className="table-meta">{lead.email}</p>
                        </td>
                        <td>{lead.interest}</td>
                        <td>₹{lead.budget}</td>
                        <td>{lead.travelDate}</td>
                        <td>{getSourceBadge(lead.source)}</td>
                        <td>{getStatusBadge(lead.status)}</td>
                        <td>{lead.assignedTo}</td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="View">👁️</button>
                            <button className="table-action-btn" title="Call">📞</button>
                            <button className="table-action-btn" title="Convert">✓</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <div className="crm-section">
              <div className="communications-timeline">
                {communications.map((comm) => (
                  <div key={comm.id} className="communication-item">
                    <div className="comm-icon">
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <div className="comm-content">
                      <div className="comm-header">
                        <h4 className="comm-subject">{comm.subject}</h4>
                        <span className="comm-date">{comm.date} at {comm.time}</span>
                      </div>
                      <p className="comm-customer">
                        <strong>{comm.customerName}</strong> ({comm.customerId})
                      </p>
                      <p className="comm-notes">{comm.notes}</p>
                      {comm.duration && (
                        <p className="comm-duration">Duration: {comm.duration}</p>
                      )}
                      <div className="comm-footer">
                        <span className={`outcome-badge outcome-${comm.outcome}`}>
                          {comm.outcome === 'positive' && '✓ Positive'}
                          {comm.outcome === 'neutral' && '○ Neutral'}
                          {comm.outcome === 'negative' && '✗ Negative'}
                        </span>
                        <span className="next-action">
                          Next: {comm.nextAction} on {comm.nextActionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMSystem;
