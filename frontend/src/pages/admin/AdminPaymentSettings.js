import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminPaymentSettings.css';

const AdminPaymentSettings = () => {
  const [activeTab, setActiveTab] = useState('gateways');
  const [editingGateway, setEditingGateway] = useState(null);

  // Mock payment gateways data
  const [paymentGateways, setPaymentGateways] = useState([
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: '💳',
      enabled: true,
      apiKey: 'rzp_test_***************',
      apiSecret: '***************',
      webhookSecret: '***************',
      processingFee: 2.0,
      supportedMethods: ['card', 'upi', 'netbanking', 'wallet'],
      testMode: true,
      currency: 'INR',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💰',
      enabled: true,
      apiKey: 'sk_test_***************',
      apiSecret: '***************',
      webhookSecret: 'whsec_***************',
      processingFee: 2.5,
      supportedMethods: ['card', 'apple_pay', 'google_pay'],
      testMode: true,
      currency: 'USD',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      enabled: false,
      clientId: '***************',
      clientSecret: '***************',
      processingFee: 3.0,
      supportedMethods: ['paypal', 'card'],
      testMode: true,
      currency: 'USD',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      enabled: true,
      processingFee: 0,
      supportedMethods: ['neft', 'rtgs', 'imps'],
      testMode: false,
      currency: 'INR',
    },
  ]);

  // Bank account details
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      accountName: 'UmrahConnect Pvt Ltd',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Mumbai Main Branch',
      accountType: 'Current Account',
      upiId: 'umrahconnect@hdfcbank',
      qrCode: 'https://example.com/qr-code.png',
      isDefault: true,
    },
  ]);

  const handleToggleGateway = (gatewayId) => {
    setPaymentGateways(prev =>
      prev.map(g =>
        g.id === gatewayId ? { ...g, enabled: !g.enabled } : g
      )
    );
    toast.success('Gateway status updated');
  };

  const handleSaveGateway = (gateway) => {
    setPaymentGateways(prev =>
      prev.map(g => (g.id === gateway.id ? gateway : g))
    );
    setEditingGateway(null);
    toast.success('Gateway settings saved');
  };

  const handleTestGateway = (gatewayId) => {
    toast.info(`Testing ${gatewayId} connection...`);
    setTimeout(() => {
      toast.success('Connection successful!');
    }, 2000);
  };

  return (
    <div className="admin-payment-settings-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">💳 Payment Gateway Settings</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Payment Gateways</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={`settings-tab-btn ${activeTab === 'gateways' ? 'active' : ''}`}
            onClick={() => setActiveTab('gateways')}
          >
            <span>💳</span>
            Payment Gateways
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <span>🏦</span>
            Bank Accounts
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            <span>💰</span>
            Processing Fees
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {/* Payment Gateways Tab */}
          {activeTab === 'gateways' && (
            <div className="gateways-section">
              <div className="section-header">
                <h2>Configure Payment Gateways</h2>
                <p>Manage your payment gateway integrations and API keys</p>
              </div>

              <div className="gateways-grid">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="gateway-settings-card">
                    <div className="gateway-card-header">
                      <div className="gateway-title">
                        <span className="gateway-icon-large">{gateway.icon}</span>
                        <div>
                          <h3>{gateway.name}</h3>
                          <span className={`status-badge ${gateway.enabled ? 'status-active' : 'status-inactive'}`}>
                            {gateway.enabled ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={gateway.enabled}
                          onChange={() => handleToggleGateway(gateway.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    {editingGateway?.id === gateway.id ? (
                      <div className="gateway-edit-form">
                        <div className="form-group">
                          <label>API Key / Client ID</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingGateway.apiKey || editingGateway.clientId}
                            onChange={(e) =>
                              setEditingGateway({
                                ...editingGateway,
                                [gateway.id === 'paypal' ? 'clientId' : 'apiKey']: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>API Secret / Client Secret</label>
                          <input
                            type="password"
                            className="form-input"
                            value={editingGateway.apiSecret || editingGateway.clientSecret}
                            onChange={(e) =>
                              setEditingGateway({
                                ...editingGateway,
                                [gateway.id === 'paypal' ? 'clientSecret' : 'apiSecret']: e.target.value,
                              })
                            }
                          />
                        </div>
                        {gateway.webhookSecret && (
                          <div className="form-group">
                            <label>Webhook Secret</label>
                            <input
                              type="password"
                              className="form-input"
                              value={editingGateway.webhookSecret}
                              onChange={(e) =>
                                setEditingGateway({
                                  ...editingGateway,
                                  webhookSecret: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Processing Fee (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={editingGateway.processingFee}
                            onChange={(e) =>
                              setEditingGateway({
                                ...editingGateway,
                                processingFee: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={editingGateway.testMode}
                              onChange={(e) =>
                                setEditingGateway({
                                  ...editingGateway,
                                  testMode: e.target.checked,
                                })
                              }
                            />
                            Test Mode
                          </label>
                        </div>
                        <div className="form-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingGateway(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSaveGateway(editingGateway)}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="gateway-details">
                        <div className="detail-row">
                          <span>Processing Fee:</span>
                          <strong>{gateway.processingFee}%</strong>
                        </div>
                        <div className="detail-row">
                          <span>Currency:</span>
                          <strong>{gateway.currency}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Mode:</span>
                          <strong>{gateway.testMode ? 'Test' : 'Live'}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Supported Methods:</span>
                          <div className="methods-tags">
                            {gateway.supportedMethods?.map((method, index) => (
                              <span key={index} className="method-tag">{method}</span>
                            ))}
                          </div>
                        </div>
                        <div className="gateway-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingGateway(gateway)}
                          >
                            <span>⚙️</span> Configure
                          </button>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleTestGateway(gateway.id)}
                          >
                            <span>🧪</span> Test Connection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === 'bank' && (
            <div className="bank-accounts-section">
              <div className="section-header">
                <h2>Bank Account Details</h2>
                <p>Manage bank accounts for direct transfers</p>
                <button className="btn btn-primary">
                  <span>➕</span>
                  Add Bank Account
                </button>
              </div>

              <div className="bank-accounts-list">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="bank-account-card">
                    <div className="bank-account-header">
                      <h3>{account.accountName}</h3>
                      {account.isDefault && (
                        <span className="default-badge">Default</span>
                      )}
                    </div>
                    <div className="bank-account-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span>Account Number:</span>
                          <strong>{account.accountNumber}</strong>
                        </div>
                        <div className="detail-item">
                          <span>IFSC Code:</span>
                          <strong>{account.ifscCode}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Bank Name:</span>
                          <strong>{account.bankName}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Branch:</span>
                          <strong>{account.branch}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Account Type:</span>
                          <strong>{account.accountType}</strong>
                        </div>
                        <div className="detail-item">
                          <span>UPI ID:</span>
                          <strong>{account.upiId}</strong>
                        </div>
                      </div>
                      <div className="qr-code-section">
                        <img src={account.qrCode} alt="QR Code" />
                        <button className="btn btn-sm btn-secondary">
                          <span>📤</span>
                          Upload New QR
                        </button>
                      </div>
                    </div>
                    <div className="bank-account-actions">
                      <button className="btn btn-sm btn-secondary">
                        <span>✏️</span> Edit
                      </button>
                      <button className="btn btn-sm btn-error">
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Fees Tab */}
          {activeTab === 'fees' && (
            <div className="fees-section">
              <div className="section-header">
                <h2>Processing Fees Configuration</h2>
                <p>Set processing fees for different payment methods</p>
              </div>

              <div className="fees-table">
                <table>
                  <thead>
                    <tr>
                      <th>Payment Gateway</th>
                      <th>Processing Fee (%)</th>
                      <th>Fixed Fee</th>
                      <th>Pass to Customer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentGateways.map((gateway) => (
                      <tr key={gateway.id}>
                        <td>
                          <div className="gateway-name">
                            <span>{gateway.icon}</span>
                            {gateway.name}
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            className="fee-input"
                            value={gateway.processingFee}
                            onChange={(e) => {
                              const newFee = parseFloat(e.target.value);
                              setPaymentGateways(prev =>
                                prev.map(g =>
                                  g.id === gateway.id
                                    ? { ...g, processingFee: newFee }
                                    : g
                                )
                              );
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="fee-input"
                            placeholder="₹0"
                          />
                        </td>
                        <td>
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary">
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
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

export default AdminPaymentSettings;
