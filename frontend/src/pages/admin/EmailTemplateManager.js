import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EmailTemplateManager.css';

const EmailTemplateManager = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Booking Confirmation',
      slug: 'booking_confirmation',
      category: 'Booking',
      subject: 'Your Umrah Booking is Confirmed! 🕌',
      description: 'Sent when a booking is confirmed',
      enabled: true,
      variables: ['customer_name', 'booking_id', 'package_name', 'travel_date', 'total_amount'],
      content: `
        <h1>Booking Confirmed!</h1>
        <p>Dear {{customer_name}},</p>
        <p>Your Umrah booking has been confirmed. Here are your booking details:</p>
        <ul>
          <li><strong>Booking ID:</strong> {{booking_id}}</li>
          <li><strong>Package:</strong> {{package_name}}</li>
          <li><strong>Travel Date:</strong> {{travel_date}}</li>
          <li><strong>Total Amount:</strong> ₹{{total_amount}}</li>
        </ul>
        <p>We will send you further details soon.</p>
      `,
      sentCount: 1250,
      openRate: 85.5,
      clickRate: 42.3,
    },
    {
      id: 2,
      name: 'Payment Receipt',
      slug: 'payment_receipt',
      category: 'Payment',
      subject: 'Payment Receipt - ₹{{amount}} Received',
      description: 'Sent when payment is received',
      enabled: true,
      variables: ['customer_name', 'payment_id', 'amount', 'payment_method', 'payment_date'],
      content: `
        <h1>Payment Received</h1>
        <p>Dear {{customer_name}},</p>
        <p>We have received your payment. Here are the details:</p>
        <ul>
          <li><strong>Payment ID:</strong> {{payment_id}}</li>
          <li><strong>Amount:</strong> ₹{{amount}}</li>
          <li><strong>Method:</strong> {{payment_method}}</li>
          <li><strong>Date:</strong> {{payment_date}}</li>
        </ul>
        <p>Thank you for your payment!</p>
      `,
      sentCount: 2100,
      openRate: 92.1,
      clickRate: 15.8,
    },
    {
      id: 3,
      name: 'Visa Approved',
      slug: 'visa_approved',
      category: 'Visa',
      subject: 'Great News! Your Visa is Approved ✅',
      description: 'Sent when visa is approved',
      enabled: true,
      variables: ['customer_name', 'visa_number', 'approval_date', 'expiry_date'],
      content: `
        <h1>Visa Approved!</h1>
        <p>Dear {{customer_name}},</p>
        <p>Congratulations! Your visa has been approved.</p>
        <ul>
          <li><strong>Visa Number:</strong> {{visa_number}}</li>
          <li><strong>Approval Date:</strong> {{approval_date}}</li>
          <li><strong>Expiry Date:</strong> {{expiry_date}}</li>
        </ul>
        <p>Your visa will be delivered within 2-3 business days.</p>
      `,
      sentCount: 850,
      openRate: 95.2,
      clickRate: 38.5,
    },
    {
      id: 4,
      name: 'Welcome Email',
      slug: 'welcome_email',
      category: 'Account',
      subject: 'Welcome to UmrahConnect! 🌟',
      description: 'Sent to new users',
      enabled: true,
      variables: ['customer_name', 'email'],
      content: `
        <h1>Welcome to UmrahConnect!</h1>
        <p>Dear {{customer_name}},</p>
        <p>Thank you for joining UmrahConnect. We're excited to help you plan your spiritual journey.</p>
        <p>Your account has been created with email: {{email}}</p>
        <p>Start exploring our packages and book your Umrah today!</p>
      `,
      sentCount: 3200,
      openRate: 78.5,
      clickRate: 52.1,
    },
    {
      id: 5,
      name: 'Password Reset',
      slug: 'password_reset',
      category: 'Account',
      subject: 'Reset Your Password',
      description: 'Sent when password reset is requested',
      enabled: true,
      variables: ['customer_name', 'reset_link', 'expiry_time'],
      content: `
        <h1>Password Reset Request</h1>
        <p>Dear {{customer_name}},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="{{reset_link}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
        <p>This link will expire in {{expiry_time}}.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      sentCount: 450,
      openRate: 88.2,
      clickRate: 65.4,
    },
    {
      id: 6,
      name: 'Booking Reminder',
      slug: 'booking_reminder',
      category: 'Booking',
      subject: 'Your Umrah Journey Starts in {{days_left}} Days! 🕌',
      description: 'Sent before travel date',
      enabled: true,
      variables: ['customer_name', 'days_left', 'travel_date', 'package_name'],
      content: `
        <h1>Travel Reminder</h1>
        <p>Dear {{customer_name}},</p>
        <p>Your Umrah journey is approaching! Only {{days_left}} days left.</p>
        <ul>
          <li><strong>Package:</strong> {{package_name}}</li>
          <li><strong>Travel Date:</strong> {{travel_date}}</li>
        </ul>
        <p>Please ensure all your documents are ready.</p>
      `,
      sentCount: 680,
      openRate: 91.5,
      clickRate: 45.2,
    },
  ]);

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    fromName: 'UmrahConnect',
    fromEmail: 'noreply@umrahconnect.com',
    replyTo: 'support@umrahconnect.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@umrahconnect.com',
    smtpPassword: '***************',
    enableTracking: true,
    enableUnsubscribe: true,
  });

  const categories = ['All', 'Booking', 'Payment', 'Visa', 'Account', 'Marketing'];

  const handleToggleTemplate = (templateId) => {
    setEmailTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, enabled: !t.enabled } : t
      )
    );
    toast.success('Template status updated');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewMode(false);
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleSendTestEmail = (templateId) => {
    toast.info('Sending test email...');
    setTimeout(() => {
      toast.success('Test email sent successfully!');
    }, 2000);
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: emailTemplates.length + 1,
      name: `${template.name} (Copy)`,
      slug: `${template.slug}_copy`,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
    };
    setEmailTemplates([...emailTemplates, newTemplate]);
    toast.success('Template duplicated successfully');
  };

  return (
    <div className="email-template-manager-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">📧 Email Template Manager</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Email Templates</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📤</span>
              Import Template
            </button>
            <button className="btn btn-primary">
              <span>➕</span>
              Create Template
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="email-stats-grid">
          <div className="email-stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <div className="stat-value">{emailTemplates.length}</div>
              <div className="stat-label">Total Templates</div>
            </div>
          </div>
          <div className="email-stat-card">
            <div className="stat-icon">📨</div>
            <div className="stat-content">
              <div className="stat-value">
                {emailTemplates.reduce((sum, t) => sum + t.sentCount, 0).toLocaleString()}
              </div>
              <div className="stat-label">Emails Sent</div>
            </div>
          </div>
          <div className="email-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {(emailTemplates.reduce((sum, t) => sum + t.openRate, 0) / emailTemplates.length).toFixed(1)}%
              </div>
              <div className="stat-label">Avg Open Rate</div>
            </div>
          </div>
          <div className="email-stat-card">
            <div className="stat-icon">🖱️</div>
            <div className="stat-content">
              <div className="stat-value">
                {(emailTemplates.reduce((sum, t) => sum + t.clickRate, 0) / emailTemplates.length).toFixed(1)}%
              </div>
              <div className="stat-label">Avg Click Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="email-tabs">
          <button
            className={`email-tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span>📧</span>
            Templates
          </button>
          <button
            className={`email-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            SMTP Settings
          </button>
          <button
            className={`email-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <span>📊</span>
            Email Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="email-content">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="templates-section">
              {/* Category Filter */}
              <div className="category-filter">
                {categories.map((category) => (
                  <button key={category} className="category-btn">
                    {category}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="templates-grid">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-header">
                      <div className="template-title">
                        <h3>{template.name}</h3>
                        <span className="template-category">{template.category}</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={template.enabled}
                          onChange={() => handleToggleTemplate(template.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <p className="template-description">{template.description}</p>

                    <div className="template-subject">
                      <strong>Subject:</strong> {template.subject}
                    </div>

                    <div className="template-variables">
                      <strong>Variables:</strong>
                      <div className="variable-tags">
                        {template.variables.map((variable, index) => (
                          <span key={index} className="variable-tag">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="template-stats">
                      <div className="stat-item">
                        <span>📨 Sent:</span>
                        <strong>{template.sentCount.toLocaleString()}</strong>
                      </div>
                      <div className="stat-item">
                        <span>📊 Open:</span>
                        <strong>{template.openRate}%</strong>
                      </div>
                      <div className="stat-item">
                        <span>🖱️ Click:</span>
                        <strong>{template.clickRate}%</strong>
                      </div>
                    </div>

                    <div className="template-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <span>👁️</span> Preview
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSendTestEmail(template.id)}
                      >
                        <span>📤</span> Test
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <span>📋</span> Duplicate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SMTP Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-form">
                <h3>SMTP Configuration</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>From Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emailSettings.fromName}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, fromName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>From Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={emailSettings.fromEmail}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reply-To Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={emailSettings.replyTo}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, replyTo: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>SMTP Host</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Port</label>
                    <input
                      type="number"
                      className="form-input"
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>SMTP Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emailSettings.smtpUser}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={emailSettings.smtpPassword}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.enableTracking}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, enableTracking: e.target.checked })
                      }
                    />
                    Enable Email Tracking (Open & Click tracking)
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.enableUnsubscribe}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, enableUnsubscribe: e.target.checked })
                      }
                    />
                    Include Unsubscribe Link
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn btn-secondary">
                    <span>🧪</span>
                    Test Connection
                  </button>
                  <button className="btn btn-primary">
                    <span>💾</span>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Logs Tab */}
          {activeTab === 'logs' && (
            <div className="logs-section">
              <div className="logs-table-container">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Template</th>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Opened</th>
                      <th>Clicked</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2026-01-08 14:30</td>
                      <td>Booking Confirmation</td>
                      <td>ahmed@example.com</td>
                      <td>Your Umrah Booking is Confirmed!</td>
                      <td><span className="status-badge status-success">Delivered</span></td>
                      <td>✅ Yes</td>
                      <td>✅ Yes</td>
                      <td>
                        <button className="table-action-btn">👁️</button>
                        <button className="table-action-btn">📤</button>
                      </td>
                    </tr>
                    {/* More rows... */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateManager;
