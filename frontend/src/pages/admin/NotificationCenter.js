import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('sms');

  // SMS Templates
  const [smsTemplates, setSmsTemplates] = useState([
    {
      id: 1,
      name: 'Booking Confirmation SMS',
      slug: 'booking_confirmation_sms',
      category: 'Booking',
      enabled: true,
      message: 'Dear {{customer_name}}, your Umrah booking {{booking_id}} is confirmed for {{travel_date}}. Total: ₹{{amount}}. - UmrahConnect',
      variables: ['customer_name', 'booking_id', 'travel_date', 'amount'],
      sentCount: 1850,
      deliveryRate: 98.5,
    },
    {
      id: 2,
      name: 'Payment Received SMS',
      slug: 'payment_received_sms',
      category: 'Payment',
      enabled: true,
      message: 'Payment of ₹{{amount}} received for booking {{booking_id}}. Receipt: {{receipt_url}} - UmrahConnect',
      variables: ['amount', 'booking_id', 'receipt_url'],
      sentCount: 2100,
      deliveryRate: 99.2,
    },
    {
      id: 3,
      name: 'Visa Approved SMS',
      slug: 'visa_approved_sms',
      category: 'Visa',
      enabled: true,
      message: 'Great news! Your visa is approved. Visa No: {{visa_number}}. Delivery in 2-3 days. - UmrahConnect',
      variables: ['visa_number'],
      sentCount: 920,
      deliveryRate: 97.8,
    },
    {
      id: 4,
      name: 'OTP Verification',
      slug: 'otp_verification',
      category: 'Account',
      enabled: true,
      message: 'Your OTP for UmrahConnect is {{otp}}. Valid for 10 minutes. Do not share with anyone.',
      variables: ['otp'],
      sentCount: 5200,
      deliveryRate: 99.8,
    },
  ]);

  // WhatsApp Templates
  const [whatsappTemplates, setWhatsappTemplates] = useState([
    {
      id: 1,
      name: 'Booking Confirmation WhatsApp',
      slug: 'booking_confirmation_wa',
      category: 'Booking',
      enabled: true,
      approved: true,
      message: `🕌 *Booking Confirmed!*

Dear {{customer_name}},

Your Umrah booking is confirmed! ✅

📋 *Booking Details:*
• Booking ID: {{booking_id}}
• Package: {{package_name}}
• Travel Date: {{travel_date}}
• Amount: ₹{{amount}}

We'll send you further details soon.

_UmrahConnect - Your Spiritual Journey Partner_`,
      variables: ['customer_name', 'booking_id', 'package_name', 'travel_date', 'amount'],
      sentCount: 1650,
      deliveryRate: 96.5,
      readRate: 89.2,
    },
    {
      id: 2,
      name: 'Payment Receipt WhatsApp',
      slug: 'payment_receipt_wa',
      category: 'Payment',
      enabled: true,
      approved: true,
      message: `💰 *Payment Received*

Dear {{customer_name}},

We have received your payment! ✅

💳 *Payment Details:*
• Payment ID: {{payment_id}}
• Amount: ₹{{amount}}
• Method: {{payment_method}}
• Date: {{payment_date}}

Thank you for your payment!

_UmrahConnect_`,
      variables: ['customer_name', 'payment_id', 'amount', 'payment_method', 'payment_date'],
      sentCount: 1980,
      deliveryRate: 97.8,
      readRate: 92.5,
    },
    {
      id: 3,
      name: 'Travel Reminder WhatsApp',
      slug: 'travel_reminder_wa',
      category: 'Booking',
      enabled: true,
      approved: true,
      message: `✈️ *Travel Reminder*

Dear {{customer_name}},

Your Umrah journey starts in *{{days_left}} days*! 🕌

📅 Travel Date: {{travel_date}}
📦 Package: {{package_name}}

Please ensure:
✅ Passport is valid
✅ Visa is ready
✅ Documents are packed
✅ Vaccinations are done

Have a blessed journey! 🤲

_UmrahConnect_`,
      variables: ['customer_name', 'days_left', 'travel_date', 'package_name'],
      sentCount: 780,
      deliveryRate: 98.2,
      readRate: 94.8,
    },
  ]);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    sms: {
      provider: 'twilio',
      accountSid: 'AC***************',
      authToken: '***************',
      fromNumber: '+1234567890',
      enabled: true,
    },
    whatsapp: {
      provider: 'twilio',
      accountSid: 'AC***************',
      authToken: '***************',
      fromNumber: '+1234567890',
      enabled: true,
    },
    push: {
      fcmServerKey: '***************',
      enabled: true,
    },
  });

  // SMS Providers
  const smsProviders = [
    { value: 'twilio', label: 'Twilio', icon: '📱' },
    { value: 'msg91', label: 'MSG91', icon: '📲' },
    { value: 'aws_sns', label: 'AWS SNS', icon: '☁️' },
    { value: 'nexmo', label: 'Nexmo/Vonage', icon: '📞' },
  ];

  const handleToggleSMSTemplate = (templateId) => {
    setSmsTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, enabled: !t.enabled } : t
      )
    );
    toast.success('SMS template status updated');
  };

  const handleToggleWhatsAppTemplate = (templateId) => {
    setWhatsappTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, enabled: !t.enabled } : t
      )
    );
    toast.success('WhatsApp template status updated');
  };

  const handleSendTestSMS = (templateId) => {
    toast.info('Sending test SMS...');
    setTimeout(() => {
      toast.success('Test SMS sent successfully!');
    }, 2000);
  };

  const handleSendTestWhatsApp = (templateId) => {
    toast.info('Sending test WhatsApp message...');
    setTimeout(() => {
      toast.success('Test WhatsApp message sent successfully!');
    }, 2000);
  };

  return (
    <div className="notification-center-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">📱 Notification Center</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Notifications</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>➕</span>
            Create Template
          </button>
        </div>

        {/* Stats */}
        <div className="notification-stats-grid">
          <div className="notification-stat-card stat-blue">
            <div className="stat-icon">📨</div>
            <div className="stat-content">
              <div className="stat-value">
                {smsTemplates.reduce((sum, t) => sum + t.sentCount, 0).toLocaleString()}
              </div>
              <div className="stat-label">SMS Sent</div>
            </div>
          </div>
          <div className="notification-stat-card stat-green">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-value">
                {whatsappTemplates.reduce((sum, t) => sum + t.sentCount, 0).toLocaleString()}
              </div>
              <div className="stat-label">WhatsApp Sent</div>
            </div>
          </div>
          <div className="notification-stat-card stat-orange">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {(smsTemplates.reduce((sum, t) => sum + t.deliveryRate, 0) / smsTemplates.length).toFixed(1)}%
              </div>
              <div className="stat-label">SMS Delivery Rate</div>
            </div>
          </div>
          <div className="notification-stat-card stat-purple">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <div className="stat-value">
                {(whatsappTemplates.reduce((sum, t) => sum + t.readRate, 0) / whatsappTemplates.length).toFixed(1)}%
              </div>
              <div className="stat-label">WhatsApp Read Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="notification-tabs">
          <button
            className={`notification-tab-btn ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            <span>📱</span>
            SMS Templates
          </button>
          <button
            className={`notification-tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <span>💬</span>
            WhatsApp Templates
          </button>
          <button
            className={`notification-tab-btn ${activeTab === 'push' ? 'active' : ''}`}
            onClick={() => setActiveTab('push')}
          >
            <span>🔔</span>
            Push Notifications
          </button>
          <button
            className={`notification-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="notification-content">
          {/* SMS Templates Tab */}
          {activeTab === 'sms' && (
            <div className="sms-section">
              <div className="templates-grid">
                {smsTemplates.map((template) => (
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
                          onChange={() => handleToggleSMSTemplate(template.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="template-message">
                      <strong>Message:</strong>
                      <p>{template.message}</p>
                      <div className="message-length">
                        {template.message.length} characters
                      </div>
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
                        <span>📊 Delivery:</span>
                        <strong>{template.deliveryRate}%</strong>
                      </div>
                    </div>

                    <div className="template-actions">
                      <button className="btn btn-sm btn-secondary">
                        <span>✏️</span> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSendTestSMS(template.id)}
                      >
                        <span>📤</span> Test
                      </button>
                      <button className="btn btn-sm btn-primary">
                        <span>📋</span> Duplicate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Templates Tab */}
          {activeTab === 'whatsapp' && (
            <div className="whatsapp-section">
              <div className="whatsapp-notice">
                <span>ℹ️</span>
                <p>WhatsApp templates must be approved by WhatsApp before use. Approval typically takes 24-48 hours.</p>
              </div>

              <div className="templates-grid">
                {whatsappTemplates.map((template) => (
                  <div key={template.id} className="template-card whatsapp-card">
                    <div className="template-header">
                      <div className="template-title">
                        <h3>{template.name}</h3>
                        <div className="template-badges">
                          <span className="template-category">{template.category}</span>
                          {template.approved && (
                            <span className="approved-badge">✅ Approved</span>
                          )}
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={template.enabled}
                          onChange={() => handleToggleWhatsAppTemplate(template.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="template-message whatsapp-preview">
                      <div className="whatsapp-bubble">
                        <pre>{template.message}</pre>
                      </div>
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
                        <span>📊 Delivery:</span>
                        <strong>{template.deliveryRate}%</strong>
                      </div>
                      <div className="stat-item">
                        <span>👁️ Read:</span>
                        <strong>{template.readRate}%</strong>
                      </div>
                    </div>

                    <div className="template-actions">
                      <button className="btn btn-sm btn-secondary">
                        <span>✏️</span> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSendTestWhatsApp(template.id)}
                      >
                        <span>📤</span> Test
                      </button>
                      <button className="btn btn-sm btn-primary">
                        <span>📋</span> Duplicate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Push Notifications Tab */}
          {activeTab === 'push' && (
            <div className="push-section">
              <div className="push-composer">
                <h3>Send Push Notification</h3>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-input" placeholder="Notification title" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="form-input" rows="4" placeholder="Notification message"></textarea>
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select className="form-input">
                    <option>All Users</option>
                    <option>Customers Only</option>
                    <option>Vendors Only</option>
                    <option>Custom Segment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Action URL (Optional)</label>
                  <input type="text" className="form-input" placeholder="https://..." />
                </div>
                <button className="btn btn-primary btn-lg">
                  <span>📤</span>
                  Send Notification
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-grid">
                {/* SMS Settings */}
                <div className="settings-card">
                  <h3>📱 SMS Settings</h3>
                  <div className="form-group">
                    <label>SMS Provider</label>
                    <select
                      className="form-input"
                      value={notificationSettings.sms.provider}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          sms: { ...notificationSettings.sms, provider: e.target.value },
                        })
                      }
                    >
                      {smsProviders.map((provider) => (
                        <option key={provider.value} value={provider.value}>
                          {provider.icon} {provider.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account SID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={notificationSettings.sms.accountSid}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          sms: { ...notificationSettings.sms, accountSid: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Auth Token</label>
                    <input
                      type="password"
                      className="form-input"
                      value={notificationSettings.sms.authToken}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          sms: { ...notificationSettings.sms, authToken: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>From Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={notificationSettings.sms.fromNumber}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          sms: { ...notificationSettings.sms, fromNumber: e.target.value },
                        })
                      }
                    />
                  </div>
                  <button className="btn btn-primary">Save SMS Settings</button>
                </div>

                {/* WhatsApp Settings */}
                <div className="settings-card">
                  <h3>💬 WhatsApp Settings</h3>
                  <div className="form-group">
                    <label>WhatsApp Provider</label>
                    <select className="form-input" value={notificationSettings.whatsapp.provider}>
                      <option value="twilio">Twilio WhatsApp</option>
                      <option value="whatsapp_business">WhatsApp Business API</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account SID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={notificationSettings.whatsapp.accountSid}
                    />
                  </div>
                  <div className="form-group">
                    <label>Auth Token</label>
                    <input
                      type="password"
                      className="form-input"
                      value={notificationSettings.whatsapp.authToken}
                    />
                  </div>
                  <div className="form-group">
                    <label>From Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={notificationSettings.whatsapp.fromNumber}
                    />
                  </div>
                  <button className="btn btn-primary">Save WhatsApp Settings</button>
                </div>

                {/* Push Notification Settings */}
                <div className="settings-card">
                  <h3>🔔 Push Notification Settings</h3>
                  <div className="form-group">
                    <label>FCM Server Key</label>
                    <input
                      type="password"
                      className="form-input"
                      value={notificationSettings.push.fcmServerKey}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push.enabled}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            push: { ...notificationSettings.push, enabled: e.target.checked },
                          })
                        }
                      />
                      Enable Push Notifications
                    </label>
                  </div>
                  <button className="btn btn-primary">Save Push Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
