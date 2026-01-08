import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import './ReportsAnalytics.css';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('this_month');
  const [reportType, setReportType] = useState('overview');

  // Mock data
  const mockAnalytics = {
    overview: {
      totalBookings: 85,
      totalRevenue: 2850000,
      averageBookingValue: 33529,
      conversionRate: 24.5,
      customerRetention: 68.2,
      packagePerformance: [
        { name: '15 Days Premium', bookings: 28, revenue: 1120000, percentage: 39.3 },
        { name: '10 Days Economy', bookings: 45, revenue: 810000, percentage: 28.4 },
        { name: '20 Days Luxury', bookings: 12, revenue: 920000, percentage: 32.3 },
      ],
      topCustomers: [
        { name: 'Ahmed Khan', bookings: 3, spent: 425000 },
        { name: 'Fatima Sheikh', bookings: 2, spent: 116000 },
        { name: 'Mohammed Ali', bookings: 2, spent: 450000 },
      ],
      monthlyTrends: [
        { month: 'Jan', bookings: 12, revenue: 450000 },
        { month: 'Feb', bookings: 15, revenue: 520000 },
        { month: 'Mar', bookings: 14, revenue: 480000 },
        { month: 'Apr', bookings: 16, revenue: 550000 },
        { month: 'May', bookings: 13, revenue: 420000 },
        { month: 'Jun', bookings: 15, revenue: 430000 },
      ],
      sourceBreakdown: [
        { source: 'Website', bookings: 35, percentage: 41.2 },
        { source: 'Referral', bookings: 28, percentage: 32.9 },
        { source: 'Social Media', bookings: 15, percentage: 17.6 },
        { source: 'Phone', bookings: 7, percentage: 8.3 },
      ],
    },
  };

  const analytics = mockAnalytics.overview;

  return (
    <div className="reports-analytics-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">📊 Reports & Analytics</h1>
            <div className="breadcrumb">
              <Link to="/vendor/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Reports</span>
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
            <button className="btn btn-primary">
              <span>📥</span>
              Download Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="analytics-metrics-grid">
          <div className="analytics-metric-card metric-blue">
            <div className="metric-header">
              <span className="metric-icon">📋</span>
              <h3>Total Bookings</h3>
            </div>
            <div className="metric-value">{analytics.totalBookings}</div>
            <div className="metric-trend positive">
              <span>↑ 18.5%</span>
              <span>vs last period</span>
            </div>
          </div>

          <div className="analytics-metric-card metric-green">
            <div className="metric-header">
              <span className="metric-icon">💰</span>
              <h3>Total Revenue</h3>
            </div>
            <div className="metric-value">₹{(analytics.totalRevenue / 100000).toFixed(2)}L</div>
            <div className="metric-trend positive">
              <span>↑ 22.3%</span>
              <span>vs last period</span>
            </div>
          </div>

          <div className="analytics-metric-card metric-purple">
            <div className="metric-header">
              <span className="metric-icon">💵</span>
              <h3>Avg Booking Value</h3>
            </div>
            <div className="metric-value">₹{(analytics.averageBookingValue / 1000).toFixed(1)}K</div>
            <div className="metric-trend positive">
              <span>↑ 5.2%</span>
              <span>vs last period</span>
            </div>
          </div>

          <div className="analytics-metric-card metric-orange">
            <div className="metric-header">
              <span className="metric-icon">📈</span>
              <h3>Conversion Rate</h3>
            </div>
            <div className="metric-value">{analytics.conversionRate}%</div>
            <div className="metric-trend positive">
              <span>↑ 3.1%</span>
              <span>vs last period</span>
            </div>
          </div>

          <div className="analytics-metric-card metric-teal">
            <div className="metric-header">
              <span className="metric-icon">🔄</span>
              <h3>Customer Retention</h3>
            </div>
            <div className="metric-value">{analytics.customerRetention}%</div>
            <div className="metric-trend positive">
              <span>↑ 7.8%</span>
              <span>vs last period</span>
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="trends-chart-section">
          <div className="chart-header">
            <h2>📈 Monthly Trends</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot legend-bookings"></span>
                Bookings
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-revenue"></span>
                Revenue
              </span>
            </div>
          </div>
          <div className="trends-chart-container">
            <div className="trends-chart">
              {analytics.monthlyTrends.map((data, index) => (
                <div key={index} className="trend-bar-group">
                  <div className="trend-bars-wrapper">
                    <div
                      className="trend-bar bookings-bar"
                      style={{ height: `${(data.bookings / 20) * 100}%` }}
                      title={`Bookings: ${data.bookings}`}
                    >
                      <span className="trend-value">{data.bookings}</span>
                    </div>
                    <div
                      className="trend-bar revenue-bar"
                      style={{ height: `${(data.revenue / 600000) * 100}%` }}
                      title={`Revenue: ₹${data.revenue.toLocaleString()}`}
                    >
                      <span className="trend-value">₹{(data.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="trend-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          {/* Package Performance */}
          <div className="analytics-card">
            <h3 className="analytics-card-title">📦 Package Performance</h3>
            <div className="package-performance-list">
              {analytics.packagePerformance.map((pkg, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-header">
                    <span className="performance-name">{pkg.name}</span>
                    <span className="performance-percentage">{pkg.percentage}%</span>
                  </div>
                  <div className="performance-bar-container">
                    <div
                      className="performance-bar"
                      style={{ width: `${pkg.percentage}%` }}
                    ></div>
                  </div>
                  <div className="performance-stats">
                    <span>{pkg.bookings} bookings</span>
                    <span>₹{(pkg.revenue / 1000).toFixed(0)}K revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="analytics-card">
            <h3 className="analytics-card-title">👥 Top Customers</h3>
            <div className="top-customers-list">
              {analytics.topCustomers.map((customer, index) => (
                <div key={index} className="customer-item">
                  <div className="customer-rank">{index + 1}</div>
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="customer-info">
                    <strong>{customer.name}</strong>
                    <p>{customer.bookings} bookings</p>
                  </div>
                  <div className="customer-spent">
                    ₹{(customer.spent / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="analytics-card">
            <h3 className="analytics-card-title">🎯 Booking Sources</h3>
            <div className="source-breakdown-chart">
              <div className="donut-chart">
                <svg viewBox="0 0 200 200" className="donut-svg">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="40"
                  />
                  {analytics.sourceBreakdown.map((source, index) => {
                    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
                    const offset = analytics.sourceBreakdown
                      .slice(0, index)
                      .reduce((sum, s) => sum + s.percentage, 0);
                    return (
                      <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={colors[index]}
                        strokeWidth="40"
                        strokeDasharray={`${source.percentage * 5.03} ${502.4 - source.percentage * 5.03}`}
                        strokeDashoffset={-offset * 5.03}
                        transform="rotate(-90 100 100)"
                      />
                    );
                  })}
                </svg>
                <div className="donut-center">
                  <div className="donut-total">{analytics.totalBookings}</div>
                  <div className="donut-label">Total</div>
                </div>
              </div>
              <div className="source-legend">
                {analytics.sourceBreakdown.map((source, index) => {
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
                  return (
                    <div key={index} className="source-legend-item">
                      <span
                        className="source-color"
                        style={{ backgroundColor: colors[index] }}
                      ></span>
                      <span className="source-name">{source.source}</span>
                      <span className="source-count">{source.bookings}</span>
                      <span className="source-percent">{source.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="analytics-card">
            <h3 className="analytics-card-title">💡 Quick Insights</h3>
            <div className="insights-list">
              <div className="insight-item insight-success">
                <span className="insight-icon">✅</span>
                <div className="insight-content">
                  <strong>Best Performing Package</strong>
                  <p>15 Days Premium Umrah with 39.3% of total bookings</p>
                </div>
              </div>
              <div className="insight-item insight-info">
                <span className="insight-icon">📊</span>
                <div className="insight-content">
                  <strong>Peak Booking Month</strong>
                  <p>April recorded highest revenue of ₹5.5L</p>
                </div>
              </div>
              <div className="insight-item insight-warning">
                <span className="insight-icon">⚠️</span>
                <div className="insight-content">
                  <strong>Attention Needed</strong>
                  <p>Phone inquiries have lowest conversion at 8.3%</p>
                </div>
              </div>
              <div className="insight-item insight-success">
                <span className="insight-icon">🎯</span>
                <div className="insight-content">
                  <strong>Top Source</strong>
                  <p>Website generates 41.2% of all bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3>📥 Export Reports</h3>
          <div className="export-options">
            <button className="export-btn">
              <span>📊</span>
              <div>
                <strong>Excel Report</strong>
                <p>Detailed data in spreadsheet format</p>
              </div>
            </button>
            <button className="export-btn">
              <span>📄</span>
              <div>
                <strong>PDF Report</strong>
                <p>Professional formatted report</p>
              </div>
            </button>
            <button className="export-btn">
              <span>📧</span>
              <div>
                <strong>Email Report</strong>
                <p>Send report to your email</p>
              </div>
            </button>
            <button className="export-btn">
              <span>🔗</span>
              <div>
                <strong>Share Link</strong>
                <p>Generate shareable report link</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
