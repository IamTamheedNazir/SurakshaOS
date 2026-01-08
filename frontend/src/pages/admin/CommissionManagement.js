import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CommissionManagement.css';

const CommissionManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Commission settings
  const [commissionSettings, setCommissionSettings] = useState({
    defaultRate: 10,
    minimumPayout: 5000,
    payoutSchedule: 'monthly',
    payoutDay: 1,
    taxDeduction: 0,
    processingFee: 0,
  });

  // Commission tiers
  const [commissionTiers, setCommissionTiers] = useState([
    {
      id: 1,
      name: 'Free Plan',
      minBookings: 0,
      maxBookings: 10,
      rate: 15,
      color: '#6b7280',
    },
    {
      id: 2,
      name: 'Basic Plan',
      minBookings: 11,
      maxBookings: 50,
      rate: 10,
      color: '#3b82f6',
    },
    {
      id: 3,
      name: 'Pro Plan',
      minBookings: 51,
      maxBookings: 200,
      rate: 7,
      color: '#10b981',
    },
    {
      id: 4,
      name: 'Enterprise Plan',
      minBookings: 201,
      maxBookings: 999999,
      rate: 5,
      color: '#8b5cf6',
    },
  ]);

  // Commission transactions
  const [commissionTransactions, setCommissionTransactions] = useState([
    {
      id: 1,
      vendor: {
        name: 'Al-Haramain Tours',
        email: 'info@alharamain.com',
        avatar: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours',
      },
      booking: {
        id: 'BK001',
        customer: 'Ahmed Khan',
        package: 'Premium Umrah Package',
      },
      bookingAmount: 58000,
      commissionRate: 7,
      commissionAmount: 4060,
      status: 'paid',
      date: '2026-01-05',
      payoutDate: '2026-01-31',
    },
    {
      id: 2,
      vendor: {
        name: 'Makkah Express',
        email: 'contact@makkahexpress.com',
        avatar: 'https://ui-avatars.com/api/?name=Makkah+Express',
      },
      booking: {
        id: 'BK002',
        customer: 'Fatima Sheikh',
        package: 'Economy Umrah Package',
      },
      bookingAmount: 42000,
      commissionRate: 10,
      commissionAmount: 4200,
      status: 'pending',
      date: '2026-01-07',
      payoutDate: '2026-01-31',
    },
    {
      id: 3,
      vendor: {
        name: 'Umrah Travels',
        email: 'info@umrahtravels.com',
        avatar: 'https://ui-avatars.com/api/?name=Umrah+Travels',
      },
      booking: {
        id: 'BK003',
        customer: 'Mohammed Ali',
        package: 'Deluxe Umrah Package',
      },
      bookingAmount: 75000,
      commissionRate: 7,
      commissionAmount: 5250,
      status: 'pending',
      date: '2026-01-08',
      payoutDate: '2026-01-31',
    },
  ]);

  // Vendor payouts
  const [vendorPayouts, setVendorPayouts] = useState([
    {
      id: 1,
      vendor: {
        name: 'Al-Haramain Tours',
        email: 'info@alharamain.com',
        avatar: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours',
      },
      period: 'December 2025',
      totalBookings: 45,
      totalRevenue: 2250000,
      totalCommission: 157500,
      netPayout: 2092500,
      status: 'paid',
      paidDate: '2026-01-01',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 2,
      vendor: {
        name: 'Makkah Express',
        email: 'contact@makkahexpress.com',
        avatar: 'https://ui-avatars.com/api/?name=Makkah+Express',
      },
      period: 'December 2025',
      totalBookings: 32,
      totalRevenue: 1680000,
      totalCommission: 168000,
      netPayout: 1512000,
      status: 'paid',
      paidDate: '2026-01-01',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 3,
      vendor: {
        name: 'Umrah Travels',
        email: 'info@umrahtravels.com',
        avatar: 'https://ui-avatars.com/api/?name=Umrah+Travels',
      },
      period: 'January 2026',
      totalBookings: 18,
      totalRevenue: 945000,
      totalCommission: 66150,
      netPayout: 878850,
      status: 'pending',
      paidDate: null,
      paymentMethod: 'Bank Transfer',
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Paid', color: '#10b981' },
      pending: { label: 'Pending', color: '#f59e0b' },
      processing: { label: 'Processing', color: '#3b82f6' },
      failed: { label: 'Failed', color: '#ef4444' },
    };
    const config = statusConfig[status];
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  const handleMarkAsPaid = (transactionId) => {
    setCommissionTransactions(prev =>
      prev.map(t =>
        t.id === transactionId ? { ...t, status: 'paid' } : t
      )
    );
    toast.success('Transaction marked as paid');
  };

  const handleProcessPayout = (payoutId) => {
    setVendorPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? { ...p, status: 'processing', paidDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    toast.success('Payout is being processed');
  };

  const totalCommissionEarned = commissionTransactions.reduce(
    (sum, t) => sum + t.commissionAmount,
    0
  );
  const pendingCommission = commissionTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.commissionAmount, 0);
  const paidCommission = commissionTransactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.commissionAmount, 0);

  return (
    <div className="commission-management-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">💰 Commission Management</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Commission</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📊</span>
              Export Report
            </button>
            <button className="btn btn-primary">
              <span>💸</span>
              Process Payouts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="commission-stats-grid">
          <div className="commission-stat-card stat-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{totalCommissionEarned.toLocaleString()}</div>
              <div className="stat-label">Total Commission</div>
            </div>
          </div>
          <div className="commission-stat-card stat-orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">₹{pendingCommission.toLocaleString()}</div>
              <div className="stat-label">Pending Commission</div>
            </div>
          </div>
          <div className="commission-stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">₹{paidCommission.toLocaleString()}</div>
              <div className="stat-label">Paid Commission</div>
            </div>
          </div>
          <div className="commission-stat-card stat-purple">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{commissionSettings.defaultRate}%</div>
              <div className="stat-label">Default Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="commission-tabs">
          <button
            className={`commission-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span>
            Overview
          </button>
          <button
            className={`commission-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <span>💳</span>
            Transactions
          </button>
          <button
            className={`commission-tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            <span>💸</span>
            Vendor Payouts
          </button>
          <button
            className={`commission-tab-btn ${activeTab === 'tiers' ? 'active' : ''}`}
            onClick={() => setActiveTab('tiers')}
          >
            <span>🎯</span>
            Commission Tiers
          </button>
          <button
            className={`commission-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="commission-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>📈 Commission Breakdown</h3>
                  <div className="breakdown-chart">
                    {commissionTiers.map((tier) => (
                      <div key={tier.id} className="breakdown-item">
                        <div className="breakdown-label">
                          <span style={{ backgroundColor: tier.color }}></span>
                          {tier.name} ({tier.rate}%)
                        </div>
                        <div className="breakdown-bar">
                          <div
                            className="breakdown-fill"
                            style={{
                              width: `${(tier.rate / 15) * 100}%`,
                              backgroundColor: tier.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>💸 Recent Payouts</h3>
                  <div className="recent-payouts-list">
                    {vendorPayouts.slice(0, 5).map((payout) => (
                      <div key={payout.id} className="payout-item">
                        <img src={payout.vendor.avatar} alt={payout.vendor.name} />
                        <div className="payout-info">
                          <strong>{payout.vendor.name}</strong>
                          <p>{payout.period}</p>
                        </div>
                        <div className="payout-amount">
                          <strong>₹{payout.netPayout.toLocaleString()}</strong>
                          {getStatusBadge(payout.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <div className="transactions-table-container">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Vendor</th>
                      <th>Booking</th>
                      <th>Customer</th>
                      <th>Booking Amount</th>
                      <th>Rate</th>
                      <th>Commission</th>
                      <th>Status</th>
                      <th>Payout Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>
                          <div className="vendor-info">
                            <img src={transaction.vendor.avatar} alt={transaction.vendor.name} />
                            <div>
                              <strong>{transaction.vendor.name}</strong>
                              <p>{transaction.vendor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Link to={`/admin/bookings/${transaction.booking.id}`}>
                            {transaction.booking.id}
                          </Link>
                        </td>
                        <td>{transaction.booking.customer}</td>
                        <td>
                          <strong>₹{transaction.bookingAmount.toLocaleString()}</strong>
                        </td>
                        <td>
                          <span className="rate-badge">{transaction.commissionRate}%</span>
                        </td>
                        <td>
                          <strong className="commission-amount">
                            ₹{transaction.commissionAmount.toLocaleString()}
                          </strong>
                        </td>
                        <td>{getStatusBadge(transaction.status)}</td>
                        <td>{transaction.payoutDate}</td>
                        <td>
                          <div className="table-actions">
                            {transaction.status === 'pending' && (
                              <button
                                className="table-action-btn"
                                title="Mark as Paid"
                                onClick={() => handleMarkAsPaid(transaction.id)}
                              >
                                ✅
                              </button>
                            )}
                            <button className="table-action-btn" title="View Details">
                              👁️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vendor Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="payouts-section">
              <div className="payouts-table-container">
                <table className="payouts-table">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Period</th>
                      <th>Bookings</th>
                      <th>Total Revenue</th>
                      <th>Commission</th>
                      <th>Net Payout</th>
                      <th>Status</th>
                      <th>Paid Date</th>
                      <th>Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorPayouts.map((payout) => (
                      <tr key={payout.id}>
                        <td>
                          <div className="vendor-info">
                            <img src={payout.vendor.avatar} alt={payout.vendor.name} />
                            <div>
                              <strong>{payout.vendor.name}</strong>
                              <p>{payout.vendor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td><strong>{payout.period}</strong></td>
                        <td>{payout.totalBookings}</td>
                        <td>₹{payout.totalRevenue.toLocaleString()}</td>
                        <td className="commission-amount">
                          ₹{payout.totalCommission.toLocaleString()}
                        </td>
                        <td>
                          <strong className="net-payout">
                            ₹{payout.netPayout.toLocaleString()}
                          </strong>
                        </td>
                        <td>{getStatusBadge(payout.status)}</td>
                        <td>{payout.paidDate || '-'}</td>
                        <td>{payout.paymentMethod}</td>
                        <td>
                          <div className="table-actions">
                            {payout.status === 'pending' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleProcessPayout(payout.id)}
                              >
                                💸 Process
                              </button>
                            )}
                            <button className="btn btn-sm btn-secondary">
                              📄 Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Commission Tiers Tab */}
          {activeTab === 'tiers' && (
            <div className="tiers-section">
              <div className="tiers-grid">
                {commissionTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="tier-card"
                    style={{ borderColor: tier.color }}
                  >
                    <div className="tier-header" style={{ backgroundColor: tier.color }}>
                      <h3>{tier.name}</h3>
                      <div className="tier-rate">{tier.rate}%</div>
                    </div>

                    <div className="tier-content">
                      <div className="tier-range">
                        <strong>Booking Range:</strong>
                        <p>
                          {tier.minBookings} - {tier.maxBookings === 999999 ? '∞' : tier.maxBookings} bookings/month
                        </p>
                      </div>

                      <div className="tier-example">
                        <h4>Example Calculation:</h4>
                        <div className="example-item">
                          <span>Booking Amount:</span>
                          <strong>₹50,000</strong>
                        </div>
                        <div className="example-item">
                          <span>Commission ({tier.rate}%):</span>
                          <strong>₹{(50000 * tier.rate / 100).toLocaleString()}</strong>
                        </div>
                        <div className="example-item">
                          <span>Vendor Receives:</span>
                          <strong>₹{(50000 - (50000 * tier.rate / 100)).toLocaleString()}</strong>
                        </div>
                      </div>

                      <button className="btn btn-secondary btn-block">
                        <span>✏️</span>
                        Edit Tier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-form">
                <h3>Commission Settings</h3>

                <div className="form-group">
                  <label>Default Commission Rate (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={commissionSettings.defaultRate}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        defaultRate: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Payout Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={commissionSettings.minimumPayout}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        minimumPayout: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Payout Schedule</label>
                  <select
                    className="form-input"
                    value={commissionSettings.payoutSchedule}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        payoutSchedule: e.target.value,
                      })
                    }
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payout Day of Month</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="31"
                    value={commissionSettings.payoutDay}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        payoutDay: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Tax Deduction (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={commissionSettings.taxDeduction}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        taxDeduction: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Processing Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={commissionSettings.processingFee}
                    onChange={(e) =>
                      setCommissionSettings({
                        ...commissionSettings,
                        processingFee: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <button className="btn btn-primary btn-lg">
                  <span>💾</span>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionManagement;
