import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: 1,
      name: 'Free',
      slug: 'free',
      description: 'Perfect for getting started',
      icon: '🆓',
      color: '#6b7280',
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        { name: 'List up to 3 packages', included: true },
        { name: 'Basic dashboard', included: true },
        { name: 'Email support', included: true },
        { name: 'Commission: 15%', included: true },
        { name: 'Featured listings', included: false },
        { name: 'Priority support', included: false },
        { name: 'Analytics', included: false },
        { name: 'API access', included: false },
      ],
      limits: {
        packages: 3,
        bookings: 10,
        customers: 50,
        storage: '500 MB',
        apiCalls: 0,
      },
      commission: 15,
      popular: false,
      subscribers: 45,
    },
    {
      id: 2,
      name: 'Basic',
      slug: 'basic',
      description: 'For small travel agencies',
      icon: '📦',
      color: '#3b82f6',
      price: {
        monthly: 999,
        yearly: 9990,
      },
      features: [
        { name: 'List up to 10 packages', included: true },
        { name: 'Advanced dashboard', included: true },
        { name: 'Email & chat support', included: true },
        { name: 'Commission: 10%', included: true },
        { name: '2 Featured listings/month', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
      ],
      limits: {
        packages: 10,
        bookings: 50,
        customers: 200,
        storage: '2 GB',
        apiCalls: 1000,
      },
      commission: 10,
      popular: false,
      subscribers: 128,
    },
    {
      id: 3,
      name: 'Pro',
      slug: 'pro',
      description: 'For growing businesses',
      icon: '🚀',
      color: '#10b981',
      price: {
        monthly: 2499,
        yearly: 24990,
      },
      features: [
        { name: 'List up to 50 packages', included: true },
        { name: 'Premium dashboard', included: true },
        { name: 'Priority support (24/7)', included: true },
        { name: 'Commission: 7%', included: true },
        { name: '10 Featured listings/month', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
      ],
      limits: {
        packages: 50,
        bookings: 200,
        customers: 1000,
        storage: '10 GB',
        apiCalls: 10000,
      },
      commission: 7,
      popular: true,
      subscribers: 89,
    },
    {
      id: 4,
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'For large organizations',
      icon: '👑',
      color: '#8b5cf6',
      price: {
        monthly: 4999,
        yearly: 49990,
      },
      features: [
        { name: 'Unlimited packages', included: true },
        { name: 'Enterprise dashboard', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Commission: 5%', included: true },
        { name: 'Unlimited featured listings', included: true },
        { name: 'Advanced analytics & reports', included: true },
        { name: 'White-label solution', included: true },
        { name: 'Full API access', included: true },
      ],
      limits: {
        packages: 'Unlimited',
        bookings: 'Unlimited',
        customers: 'Unlimited',
        storage: '100 GB',
        apiCalls: 'Unlimited',
      },
      commission: 5,
      popular: false,
      subscribers: 23,
    },
  ]);

  // Active subscriptions
  const [activeSubscriptions, setActiveSubscriptions] = useState([
    {
      id: 1,
      vendor: {
        name: 'Al-Haramain Tours',
        email: 'info@alharamain.com',
        avatar: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours',
      },
      plan: 'Pro',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      billingCycle: 'yearly',
      amount: 24990,
      nextBilling: '2026-12-31',
      autoRenew: true,
    },
    {
      id: 2,
      vendor: {
        name: 'Makkah Express',
        email: 'contact@makkahexpress.com',
        avatar: 'https://ui-avatars.com/api/?name=Makkah+Express',
      },
      plan: 'Basic',
      status: 'active',
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      billingCycle: 'monthly',
      amount: 999,
      nextBilling: '2026-02-15',
      autoRenew: true,
    },
    {
      id: 3,
      vendor: {
        name: 'Umrah Travels',
        email: 'info@umrahtravels.com',
        avatar: 'https://ui-avatars.com/api/?name=Umrah+Travels',
      },
      plan: 'Pro',
      status: 'expiring_soon',
      startDate: '2025-12-10',
      endDate: '2026-01-10',
      billingCycle: 'monthly',
      amount: 2499,
      nextBilling: '2026-01-10',
      autoRenew: false,
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: '#10b981' },
      expiring_soon: { label: 'Expiring Soon', color: '#f59e0b' },
      expired: { label: 'Expired', color: '#ef4444' },
      cancelled: { label: 'Cancelled', color: '#6b7280' },
    };
    const config = statusConfig[status];
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  const handleToggleAutoRenew = (subscriptionId) => {
    setActiveSubscriptions(prev =>
      prev.map(s =>
        s.id === subscriptionId ? { ...s, autoRenew: !s.autoRenew } : s
      )
    );
    toast.success('Auto-renew setting updated');
  };

  const handleCancelSubscription = (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      toast.success('Subscription cancelled successfully');
    }
  };

  const totalRevenue = activeSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalSubscribers = subscriptionPlans.reduce((sum, p) => sum + p.subscribers, 0);

  return (
    <div className="subscription-plans-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">💳 Subscription Plans</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Subscriptions</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>➕</span>
            Create Plan
          </button>
        </div>

        {/* Stats */}
        <div className="subscription-stats-grid">
          <div className="subscription-stat-card stat-blue">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{subscriptionPlans.length}</div>
              <div className="stat-label">Total Plans</div>
            </div>
          </div>
          <div className="subscription-stat-card stat-green">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{totalSubscribers}</div>
              <div className="stat-label">Total Subscribers</div>
            </div>
          </div>
          <div className="subscription-stat-card stat-purple">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>
          <div className="subscription-stat-card stat-orange">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">
                {activeSubscriptions.filter(s => s.status === 'active').length}
              </div>
              <div className="stat-label">Active Subscriptions</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="subscription-tabs">
          <button
            className={`subscription-tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            <span>📦</span>
            Plans
          </button>
          <button
            className={`subscription-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <span>👥</span>
            Active Subscriptions
          </button>
          <button
            className={`subscription-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="subscription-content">
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="plans-section">
              {/* Billing Cycle Toggle */}
              <div className="billing-cycle-toggle">
                <button
                  className={`cycle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`cycle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                  <span className="discount-badge">Save 17%</span>
                </button>
              </div>

              {/* Plans Grid */}
              <div className="plans-grid">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`plan-card ${plan.popular ? 'popular' : ''}`}
                    style={{ borderColor: plan.color }}
                  >
                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                    
                    <div className="plan-header">
                      <div className="plan-icon" style={{ backgroundColor: plan.color }}>
                        {plan.icon}
                      </div>
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                    </div>

                    <div className="plan-price">
                      <div className="price-amount">
                        <span className="currency">₹</span>
                        <span className="amount">
                          {billingCycle === 'monthly'
                            ? plan.price.monthly.toLocaleString()
                            : plan.price.yearly.toLocaleString()}
                        </span>
                        <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                        <div className="price-note">
                          ₹{(plan.price.yearly / 12).toFixed(0)}/month billed annually
                        </div>
                      )}
                    </div>

                    <div className="plan-features">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <span className={`feature-icon ${feature.included ? 'included' : 'excluded'}`}>
                            {feature.included ? '✓' : '✗'}
                          </span>
                          <span className={feature.included ? '' : 'excluded-text'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="plan-limits">
                      <h4>Plan Limits</h4>
                      <div className="limit-item">
                        <span>Packages:</span>
                        <strong>{plan.limits.packages}</strong>
                      </div>
                      <div className="limit-item">
                        <span>Bookings/month:</span>
                        <strong>{plan.limits.bookings}</strong>
                      </div>
                      <div className="limit-item">
                        <span>Storage:</span>
                        <strong>{plan.limits.storage}</strong>
                      </div>
                      <div className="limit-item">
                        <span>Commission:</span>
                        <strong>{plan.commission}%</strong>
                      </div>
                    </div>

                    <div className="plan-subscribers">
                      <span>👥 {plan.subscribers} subscribers</span>
                    </div>

                    <div className="plan-actions">
                      <button className="btn btn-secondary btn-block">
                        <span>✏️</span>
                        Edit Plan
                      </button>
                      <button
                        className="btn btn-primary btn-block"
                        style={{ backgroundColor: plan.color }}
                      >
                        <span>👁️</span>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="subscriptions-section">
              <div className="subscriptions-table-container">
                <table className="subscriptions-table">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Billing</th>
                      <th>Amount</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Next Billing</th>
                      <th>Auto-Renew</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSubscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td>
                          <div className="vendor-info">
                            <img src={subscription.vendor.avatar} alt={subscription.vendor.name} />
                            <div>
                              <strong>{subscription.vendor.name}</strong>
                              <p>{subscription.vendor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="plan-badge">{subscription.plan}</span>
                        </td>
                        <td>{getStatusBadge(subscription.status)}</td>
                        <td>
                          <span className="billing-cycle">
                            {subscription.billingCycle === 'monthly' ? '📅 Monthly' : '📆 Yearly'}
                          </span>
                        </td>
                        <td>
                          <strong>₹{subscription.amount.toLocaleString()}</strong>
                        </td>
                        <td>{subscription.startDate}</td>
                        <td>{subscription.endDate}</td>
                        <td>{subscription.nextBilling}</td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={subscription.autoRenew}
                              onChange={() => handleToggleAutoRenew(subscription.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="View">👁️</button>
                            <button className="table-action-btn" title="Invoice">📄</button>
                            <button
                              className="table-action-btn"
                              title="Cancel"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              ❌
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-form">
                <h3>Subscription Settings</h3>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Enable subscription system
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Allow trial periods
                  </label>
                </div>

                <div className="form-group">
                  <label>Trial Period Duration (days)</label>
                  <input type="number" className="form-input" defaultValue="14" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Send renewal reminders
                  </label>
                </div>

                <div className="form-group">
                  <label>Reminder Days Before Expiry</label>
                  <input type="number" className="form-input" defaultValue="7" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Allow plan upgrades
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Allow plan downgrades
                  </label>
                </div>

                <div className="form-group">
                  <label>Grace Period After Expiry (days)</label>
                  <input type="number" className="form-input" defaultValue="3" />
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

export default SubscriptionPlans;
