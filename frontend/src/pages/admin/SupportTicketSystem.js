import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SupportTicketSystem.css';

const SupportTicketSystem = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock tickets data
  const [tickets, setTickets] = useState([
    {
      id: 'TKT001',
      subject: 'Payment not reflecting in account',
      category: 'Payment',
      priority: 'high',
      status: 'open',
      customer: {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan',
      },
      assignedTo: 'Sarah Ahmed',
      createdAt: '2026-01-08 10:30',
      updatedAt: '2026-01-08 14:20',
      messages: [
        {
          id: 1,
          sender: 'Ahmed Khan',
          senderType: 'customer',
          message: 'I made a payment of ₹58,000 yesterday but it is not showing in my booking.',
          timestamp: '2026-01-08 10:30',
          attachments: ['receipt.pdf'],
        },
        {
          id: 2,
          sender: 'Sarah Ahmed',
          senderType: 'agent',
          message: 'Thank you for contacting us. I can see your payment. Let me check with our accounts team.',
          timestamp: '2026-01-08 11:15',
          attachments: [],
        },
      ],
    },
    {
      id: 'TKT002',
      subject: 'Need to change travel dates',
      category: 'Booking',
      priority: 'medium',
      status: 'in_progress',
      customer: {
        name: 'Fatima Sheikh',
        email: 'fatima@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Fatima+Sheikh',
      },
      assignedTo: 'Mohammed Ali',
      createdAt: '2026-01-07 15:45',
      updatedAt: '2026-01-08 09:30',
      messages: [
        {
          id: 1,
          sender: 'Fatima Sheikh',
          senderType: 'customer',
          message: 'I need to change my travel dates from March 15 to March 20. Is this possible?',
          timestamp: '2026-01-07 15:45',
          attachments: [],
        },
      ],
    },
    {
      id: 'TKT003',
      subject: 'Visa application status',
      category: 'Visa',
      priority: 'low',
      status: 'resolved',
      customer: {
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Mohammed+Ali',
      },
      assignedTo: 'John Doe',
      createdAt: '2026-01-06 12:00',
      updatedAt: '2026-01-07 16:30',
      messages: [
        {
          id: 1,
          sender: 'Mohammed Ali',
          senderType: 'customer',
          message: 'What is the status of my visa application?',
          timestamp: '2026-01-06 12:00',
          attachments: [],
        },
        {
          id: 2,
          sender: 'John Doe',
          senderType: 'agent',
          message: 'Your visa has been approved and will be delivered within 2 days.',
          timestamp: '2026-01-07 16:30',
          attachments: [],
        },
      ],
    },
  ]);

  const categories = [
    { value: 'Payment', label: 'Payment', icon: '💰', color: '#10b981' },
    { value: 'Booking', label: 'Booking', icon: '📋', color: '#3b82f6' },
    { value: 'Visa', label: 'Visa', icon: '📄', color: '#8b5cf6' },
    { value: 'Package', label: 'Package', icon: '📦', color: '#f59e0b' },
    { value: 'Technical', label: 'Technical', icon: '🔧', color: '#ef4444' },
    { value: 'Other', label: 'Other', icon: '❓', color: '#6b7280' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'urgent', label: 'Urgent', color: '#dc2626' },
  ];

  const statuses = [
    { value: 'open', label: 'Open', color: '#3b82f6' },
    { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'resolved', label: 'Resolved', color: '#10b981' },
    { value: 'closed', label: 'Closed', color: '#6b7280' },
  ];

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className="status-badge" style={{ backgroundColor: statusObj?.color }}>
        {statusObj?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return (
      <span className="priority-badge" style={{ backgroundColor: priorityObj?.color }}>
        {priorityObj?.label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.icon || '📋';
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    return ticket.status === activeTab;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const handleSendMessage = (ticketId, message) => {
    toast.success('Message sent successfully');
  };

  const handleUpdateStatus = (ticketId, newStatus) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    toast.success('Ticket status updated');
  };

  const handleAssignTicket = (ticketId, agent) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, assignedTo: agent } : t))
    );
    toast.success('Ticket assigned successfully');
  };

  return (
    <div className="support-ticket-system-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">🎫 Support Ticket System</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Support</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>➕</span>
            Create Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="ticket-stats-grid">
          <div className="ticket-stat-card stat-blue">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
          </div>
          <div className="ticket-stat-card stat-orange">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{stats.open}</div>
              <div className="stat-label">Open Tickets</div>
            </div>
          </div>
          <div className="ticket-stat-card stat-yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="ticket-stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ticket-tabs">
          <button
            className={`ticket-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Tickets ({tickets.length})
          </button>
          <button
            className={`ticket-tab-btn ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Open ({stats.open})
          </button>
          <button
            className={`ticket-tab-btn ${activeTab === 'in_progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in_progress')}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            className={`ticket-tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({stats.resolved})
          </button>
        </div>

        {/* Ticket Layout */}
        <div className="ticket-layout">
          {/* Ticket List */}
          <div className="ticket-list">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-item ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-item-header">
                  <div className="ticket-customer">
                    <img src={ticket.customer.avatar} alt={ticket.customer.name} />
                    <div>
                      <strong>{ticket.customer.name}</strong>
                      <span className="ticket-id">{ticket.id}</span>
                    </div>
                  </div>
                  <div className="ticket-badges">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
                <div className="ticket-item-content">
                  <div className="ticket-category">
                    <span>{getCategoryIcon(ticket.category)}</span>
                    {ticket.category}
                  </div>
                  <h4>{ticket.subject}</h4>
                  <p className="ticket-preview">
                    {ticket.messages[ticket.messages.length - 1]?.message}
                  </p>
                </div>
                <div className="ticket-item-footer">
                  <span className="ticket-time">Updated {ticket.updatedAt}</span>
                  <span className="ticket-assigned">👤 {ticket.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Details */}
          {selectedTicket ? (
            <div className="ticket-details">
              <div className="ticket-details-header">
                <div>
                  <h2>{selectedTicket.subject}</h2>
                  <div className="ticket-meta">
                    <span>{getCategoryIcon(selectedTicket.category)} {selectedTicket.category}</span>
                    <span>•</span>
                    <span>{selectedTicket.id}</span>
                    <span>•</span>
                    <span>Created {selectedTicket.createdAt}</span>
                  </div>
                </div>
                <div className="ticket-actions-header">
                  <select
                    className="status-select"
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </div>

              <div className="ticket-customer-info">
                <img src={selectedTicket.customer.avatar} alt={selectedTicket.customer.name} />
                <div>
                  <strong>{selectedTicket.customer.name}</strong>
                  <p>{selectedTicket.customer.email}</p>
                </div>
                <div className="customer-actions">
                  <button className="btn btn-sm btn-secondary">📧 Email</button>
                  <button className="btn btn-sm btn-secondary">📞 Call</button>
                </div>
              </div>

              <div className="ticket-messages">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${message.senderType === 'agent' ? 'agent-message' : 'customer-message'}`}
                  >
                    <div className="message-header">
                      <strong>{message.sender}</strong>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <div className="message-content">
                      <p>{message.message}</p>
                      {message.attachments.length > 0 && (
                        <div className="message-attachments">
                          {message.attachments.map((file, index) => (
                            <a key={index} href="#" className="attachment-link">
                              📎 {file}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ticket-reply-section">
                <textarea
                  className="reply-textarea"
                  placeholder="Type your reply..."
                  rows="4"
                ></textarea>
                <div className="reply-actions">
                  <button className="btn btn-secondary">
                    <span>📎</span>
                    Attach File
                  </button>
                  <button className="btn btn-primary">
                    <span>📤</span>
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ticket-details-empty">
              <div className="empty-icon">🎫</div>
              <h3>Select a ticket to view details</h3>
              <p>Choose a ticket from the list to see the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketSystem;
