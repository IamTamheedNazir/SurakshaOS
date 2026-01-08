import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './PaymentsAccounting.css';

const PaymentsAccounting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this_month');

  // Mock data
  const mockFinancialData = {
    totalRevenue: 2850000,
    totalExpenses: 450000,
    netProfit: 2400000,
    pendingPayments: 380000,
    monthlyRevenue: [
      { month: 'Jan', revenue: 450000, expenses: 75000 },
      { month: 'Feb', revenue: 520000, expenses: 82000 },
      { month: 'Mar', revenue: 480000, expenses: 78000 },
      { month: 'Apr', revenue: 550000, expenses: 85000 },
      { month: 'May', revenue: 420000, expenses: 65000 },
      { month: 'Jun', revenue: 430000, expenses: 65000 },
    ],
  };

  const mockPayments = [
    {
      id: 'PAY001',
      requestId: 'REQ480334',
      customerName: 'Ahmed Khan',
      packageName: '15 Days Premium Umrah',
      amount: 425000,
      paidAmount: 425000,
      pendingAmount: 0,
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      date: '2026-01-05',
      transactionId: 'TXN123456789',
    },
    {
      id: 'PAY002',
      requestId: 'REQ480335',
      customerName: 'Fatima Sheikh',
      packageName: '10 Days Economy Umrah',
      amount: 58000,
      paidAmount: 5800,
      pendingAmount: 52200,
      paymentMethod: 'UPI',
      status: 'partial',
      date: '2026-01-03',
      transactionId: 'TXN987654321',
    },
    {
      id: 'PAY003',
      requestId: 'REQ480336',
      customerName: 'Mohammed Ali',
      packageName: '20 Days Luxury Umrah',
      amount: 225000,
      paidAmount: 0,
      pendingAmount: 225000,
      paymentMethod: null,
      status: 'pending',
      date: '2026-01-07',
      transactionId: null,
    },
  ];

  const mockExpenses = [
    {
      id: 'EXP001',
      category: 'Hotel Booking',
      description: 'Advance payment for Makkah hotels',
      amount: 150000,
      date: '2026-01-05',
      paymentMethod: 'Bank Transfer',
      vendor: 'Swissotel Makkah',
      status: 'paid',
      receipt: 'REC001.pdf',
    },
    {
      id: 'EXP002',
      category: 'Flight Tickets',
      description: 'Group booking for 15 passengers',
      amount: 180000,
      date: '2026-01-04',
      paymentMethod: 'Credit Card',
      vendor: 'Saudi Airlines',
      status: 'paid',
      receipt: 'REC002.pdf',
    },
    {
      id: 'EXP003',
      category: 'Transport',
      description: 'Bus rental for Ziyarat tours',
      amount: 25000,
      date: '2026-01-06',
      paymentMethod: 'Cash',
      vendor: 'Al-Haramain Transport',
      status: 'paid',
      receipt: 'REC003.pdf',
    },
    {
      id: 'EXP004',
      category: 'Marketing',
      description: 'Social media advertising',
      amount: 15000,
      date: '2026-01-07',
      paymentMethod: 'UPI',
      vendor: 'Facebook Ads',
      status: 'pending',
      receipt: null,
    },
  ];

  const mockInvoices = [
    {
      id: 'INV001',
      requestId: 'REQ480334',
      customerName: 'Ahmed Khan',
      amount: 425000,
      issueDate: '2025-12-28',
      dueDate: '2026-01-05',
      paidDate: '2026-01-05',
      status: 'paid',
    },
    {
      id: 'INV002',
      requestId: 'REQ480335',
      customerName: 'Fatima Sheikh',
      amount: 58000,
      issueDate: '2025-12-30',
      dueDate: '2026-01-10',
      paidDate: null,
      status: 'partial',
    },
    {
      id: 'INV003',
      requestId: 'REQ480336',
      customerName: 'Mohammed Ali',
      amount: 225000,
      issueDate: '2026-01-02',
      dueDate: '2026-01-15',
      paidDate: null,
      status: 'unpaid',
    },
  ];

  const financialData = mockFinancialData;
  const payments = mockPayments;
  const expenses = mockExpenses;
  const invoices = mockInvoices;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', class: 'badge-success' },
      partial: { label: 'Partial', class: 'badge-warning' },
      pending: { label: 'Pending', class: 'badge-error' },
      paid: { label: 'Paid', class: 'badge-success' },
      unpaid: { label: 'Unpaid', class: 'badge-error' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-gray' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Hotel Booking': '🏨',
      'Flight Tickets': '✈️',
      'Transport': '🚌',
      'Marketing': '📢',
      'Visa Processing': '📄',
      'Staff Salary': '👥',
      'Office Rent': '🏢',
      'Utilities': '💡',
    };
    return icons[category] || '💰';
  };

  return (
    <div className="payments-accounting-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">💰 Payments & Accounting</h1>
            <div className="breadcrumb">
              <Link to="/vendor/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Payments</span>
            </div>
          </div>
          <div className="header-actions">
            <select
              className="date-range-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="btn btn-secondary">
              <span>📊</span>
              Export Report
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/vendor/payments/add-expense')}>
              <span>➕</span>
              Add Expense
            </button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="financial-stats-grid">
          <div className="financial-stat-card stat-green">
            <div className="stat-header">
              <div className="stat-icon">💵</div>
              <h3>Total Revenue</h3>
            </div>
            <div className="stat-value">₹{(financialData.totalRevenue / 100000).toFixed(2)}L</div>
            <div className="stat-change positive">
              <span>↑ 12.5%</span>
              <span>vs last month</span>
            </div>
          </div>

          <div className="financial-stat-card stat-red">
            <div className="stat-header">
              <div className="stat-icon">💸</div>
              <h3>Total Expenses</h3>
            </div>
            <div className="stat-value">₹{(financialData.totalExpenses / 100000).toFixed(2)}L</div>
            <div className="stat-change negative">
              <span>↑ 8.3%</span>
              <span>vs last month</span>
            </div>
          </div>

          <div className="financial-stat-card stat-blue">
            <div className="stat-header">
              <div className="stat-icon">💰</div>
              <h3>Net Profit</h3>
            </div>
            <div className="stat-value">₹{(financialData.netProfit / 100000).toFixed(2)}L</div>
            <div className="stat-change positive">
              <span>↑ 15.2%</span>
              <span>vs last month</span>
            </div>
          </div>

          <div className="financial-stat-card stat-orange">
            <div className="stat-header">
              <div className="stat-icon">⏳</div>
              <h3>Pending Payments</h3>
            </div>
            <div className="stat-value">₹{(financialData.pendingPayments / 100000).toFixed(2)}L</div>
            <div className="stat-change neutral">
              <span>3 invoices</span>
              <span>awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="revenue-chart-section">
          <div className="chart-header">
            <h2>📈 Revenue vs Expenses</h2>
            <div className="chart-legend">
              <span className="legend-item legend-revenue">
                <span className="legend-dot"></span>
                Revenue
              </span>
              <span className="legend-item legend-expenses">
                <span className="legend-dot"></span>
                Expenses
              </span>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {financialData.monthlyRevenue.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars-wrapper">
                    <div
                      className="chart-bar revenue-bar"
                      style={{ height: `${(data.revenue / 600000) * 100}%` }}
                      title={`Revenue: ₹${data.revenue.toLocaleString()}`}
                    >
                      <span className="bar-value">₹{(data.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div
                      className="chart-bar expense-bar"
                      style={{ height: `${(data.expenses / 600000) * 100}%` }}
                      title={`Expenses: ₹${data.expenses.toLocaleString()}`}
                    >
                      <span className="bar-value">₹{(data.expenses / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="chart-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="accounting-tabs">
          <button
            className={`accounting-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span>
            Overview
          </button>
          <button
            className={`accounting-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span>💳</span>
            Payments
          </button>
          <button
            className={`accounting-tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <span>💸</span>
            Expenses
          </button>
          <button
            className={`accounting-tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <span>📄</span>
            Invoices
          </button>
        </div>

        {/* Tab Content */}
        <div className="accounting-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>💵 Recent Payments</h3>
                  <div className="overview-list">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="overview-item">
                        <div className="overview-item-info">
                          <strong>{payment.customerName}</strong>
                          <p>{payment.packageName}</p>
                        </div>
                        <div className="overview-item-amount">
                          <strong>₹{payment.paidAmount.toLocaleString()}</strong>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/vendor/payments?tab=payments" className="view-all-link">
                    View All Payments →
                  </Link>
                </div>

                <div className="overview-card">
                  <h3>💸 Recent Expenses</h3>
                  <div className="overview-list">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="overview-item">
                        <div className="overview-item-info">
                          <span className="expense-icon">{getCategoryIcon(expense.category)}</span>
                          <div>
                            <strong>{expense.category}</strong>
                            <p>{expense.description}</p>
                          </div>
                        </div>
                        <div className="overview-item-amount">
                          <strong>₹{expense.amount.toLocaleString()}</strong>
                          {getStatusBadge(expense.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/vendor/payments?tab=expenses" className="view-all-link">
                    View All Expenses →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="payments-section">
              <div className="payments-table-container">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Customer</th>
                      <th>Package</th>
                      <th>Total Amount</th>
                      <th>Paid Amount</th>
                      <th>Pending</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <strong>{payment.id}</strong>
                          <p className="table-meta">{payment.requestId}</p>
                        </td>
                        <td>{payment.customerName}</td>
                        <td>{payment.packageName}</td>
                        <td>
                          <strong>₹{payment.amount.toLocaleString()}</strong>
                        </td>
                        <td className="paid-amount">
                          ₹{payment.paidAmount.toLocaleString()}
                        </td>
                        <td className="pending-amount">
                          ₹{payment.pendingAmount.toLocaleString()}
                        </td>
                        <td>{payment.paymentMethod || '-'}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>{payment.date}</td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="View">👁️</button>
                            <button className="table-action-btn" title="Receipt">📄</button>
                            <button className="table-action-btn" title="Remind">🔔</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="expenses-section">
              <div className="expenses-grid">
                {expenses.map((expense) => (
                  <div key={expense.id} className="expense-card">
                    <div className="expense-header">
                      <div className="expense-icon-large">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div className="expense-info">
                        <h3>{expense.category}</h3>
                        <p>{expense.description}</p>
                      </div>
                      {getStatusBadge(expense.status)}
                    </div>
                    <div className="expense-amount">
                      ₹{expense.amount.toLocaleString()}
                    </div>
                    <div className="expense-details">
                      <div className="expense-detail-row">
                        <span>Vendor:</span>
                        <strong>{expense.vendor}</strong>
                      </div>
                      <div className="expense-detail-row">
                        <span>Payment Method:</span>
                        <strong>{expense.paymentMethod}</strong>
                      </div>
                      <div className="expense-detail-row">
                        <span>Date:</span>
                        <strong>{expense.date}</strong>
                      </div>
                      {expense.receipt && (
                        <div className="expense-detail-row">
                          <span>Receipt:</span>
                          <a href="#" className="receipt-link">{expense.receipt}</a>
                        </div>
                      )}
                    </div>
                    <div className="expense-actions">
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

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="invoices-section">
              <div className="invoices-table-container">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Paid Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <strong>{invoice.id}</strong>
                          <p className="table-meta">{invoice.requestId}</p>
                        </td>
                        <td>{invoice.customerName}</td>
                        <td>
                          <strong>₹{invoice.amount.toLocaleString()}</strong>
                        </td>
                        <td>{invoice.issueDate}</td>
                        <td>{invoice.dueDate}</td>
                        <td>{invoice.paidDate || '-'}</td>
                        <td>{getStatusBadge(invoice.status)}</td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="View">👁️</button>
                            <button className="table-action-btn" title="Download">📥</button>
                            <button className="table-action-btn" title="Send">📧</button>
                          </div>
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

export default PaymentsAccounting;
