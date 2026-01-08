import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ReferralLoyaltyProgram.css';

const ReferralLoyaltyProgram = () => {
  const [activeTab, setActiveTab] = useState('referrals');

  // Referral program settings
  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    referrerReward: 500,
    refereeReward: 300,
    rewardType: 'credit',
    minimumBookingAmount: 10000,
    expiryDays: 90,
    maxReferrals: 50,
  });

  // Loyalty tiers
  const [loyaltyTiers, setLoyaltyTiers] = useState([
    {
      id: 1,
      name: 'Bronze',
      icon: '🥉',
      color: '#cd7f32',
      minPoints: 0,
      maxPoints: 999,
      benefits: ['5% discount', 'Priority support', 'Early access'],
      discount: 5,
      members: 1250,
    },
    {
      id: 2,
      name: 'Silver',
      icon: '🥈',
      color: '#c0c0c0',
      minPoints: 1000,
      maxPoints: 4999,
      benefits: ['10% discount', 'Free visa assistance', 'Priority booking'],
      discount: 10,
      members: 680,
    },
    {
      id: 3,
      name: 'Gold',
      icon: '🥇',
      color: '#ffd700',
      minPoints: 5000,
      maxPoints: 9999,
      benefits: ['15% discount', 'Free airport transfer', 'Dedicated manager'],
      discount: 15,
      members: 245,
    },
    {
      id: 4,
      name: 'Platinum',
      icon: '💎',
      color: '#e5e4e2',
      minPoints: 10000,
      maxPoints: 999999,
      benefits: ['20% discount', 'VIP lounge access', 'Complimentary upgrades'],
      discount: 20,
      members: 89,
    },
  ]);

  // Referral activities
  const [referralActivities, setReferralActivities] = useState([
    {
      id: 1,
      referrer: {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan',
      },
      referee: {
        name: 'Fatima Sheikh',
        email: 'fatima@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Fatima+Sheikh',
      },
      status: 'completed',
      referralCode: 'AHMED2026',
      bookingAmount: 58000,
      referrerReward: 500,
      refereeReward: 300,
      date: '2026-01-05',
    },
    {
      id: 2,
      referrer: {
        name: 'Mohammed Ali',
        email: 'mohammed@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Mohammed+Ali',
      },
      referee: {
        name: 'Aisha Rahman',
        email: 'aisha@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Aisha+Rahman',
      },
      status: 'pending',
      referralCode: 'MOHAMMED2026',
      bookingAmount: 42000,
      referrerReward: 500,
      refereeReward: 300,
      date: '2026-01-07',
    },
  ]);

  // Loyalty points activities
  const [loyaltyActivities, setLoyaltyActivities] = useState([
    {
      id: 1,
      user: {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan',
        tier: 'Gold',
      },
      action: 'Booking Completed',
      points: 580,
      type: 'earned',
      date: '2026-01-05',
      description: 'Booking #BK001 - Premium Umrah Package',
    },
    {
      id: 2,
      user: {
        name: 'Fatima Sheikh',
        email: 'fatima@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Fatima+Sheikh',
        tier: 'Silver',
      },
      action: 'Discount Redeemed',
      points: -200,
      type: 'redeemed',
      date: '2026-01-06',
      description: 'Used 200 points for ₹200 discount',
    },
  ]);

  // Points earning rules
  const [pointsRules, setPointsRules] = useState([
    {
      id: 1,
      action: 'Complete Booking',
      points: '1 point per ₹100',
      icon: '🎫',
      enabled: true,
    },
    {
      id: 2,
      action: 'Write Review',
      points: '50 points',
      icon: '⭐',
      enabled: true,
    },
    {
      id: 3,
      action: 'Refer a Friend',
      points: '500 points',
      icon: '👥',
      enabled: true,
    },
    {
      id: 4,
      action: 'Social Media Share',
      points: '20 points',
      icon: '📱',
      enabled: true,
    },
    {
      id: 5,
      action: 'Birthday Bonus',
      points: '100 points',
      icon: '🎂',
      enabled: true,
    },
    {
      id: 6,
      action: 'Complete Profile',
      points: '50 points',
      icon: '👤',
      enabled: true,
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: '#10b981' },
      pending: { label: 'Pending', color: '#f59e0b' },
      expired: { label: 'Expired', color: '#ef4444' },
    };
    const config = statusConfig[status];
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  const handleToggleRule = (ruleId) => {
    setPointsRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    toast.success('Points rule updated');
  };

  const totalReferrals = referralActivities.length;
  const completedReferrals = referralActivities.filter(r => r.status === 'completed').length;
  const totalRewardsGiven = referralActivities
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.referrerReward + r.refereeReward, 0);
  const totalMembers = loyaltyTiers.reduce((sum, t) => sum + t.members, 0);

  return (
    <div className="referral-loyalty-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">🎁 Referral & Loyalty Program</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Referral & Loyalty</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>📊</span>
            View Analytics
          </button>
        </div>

        {/* Stats */}
        <div className="program-stats-grid">
          <div className="program-stat-card stat-blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{totalReferrals}</div>
              <div className="stat-label">Total Referrals</div>
            </div>
          </div>
          <div className="program-stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{completedReferrals}</div>
              <div className="stat-label">Completed Referrals</div>
            </div>
          </div>
          <div className="program-stat-card stat-purple">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{totalRewardsGiven.toLocaleString()}</div>
              <div className="stat-label">Rewards Given</div>
            </div>
          </div>
          <div className="program-stat-card stat-orange">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{totalMembers.toLocaleString()}</div>
              <div className="stat-label">Loyalty Members</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="program-tabs">
          <button
            className={`program-tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => setActiveTab('referrals')}
          >
            <span>👥</span>
            Referral Program
          </button>
          <button
            className={`program-tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            <span>🏆</span>
            Loyalty Tiers
          </button>
          <button
            className={`program-tab-btn ${activeTab === 'points' ? 'active' : ''}`}
            onClick={() => setActiveTab('points')}
          >
            <span>⭐</span>
            Points Rules
          </button>
          <button
            className={`program-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <span>📊</span>
            Activities
          </button>
          <button
            className={`program-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="program-content">
          {/* Referral Program Tab */}
          {activeTab === 'referrals' && (
            <div className="referrals-section">
              <div className="referral-info-card">
                <h3>How Referral Program Works</h3>
                <div className="referral-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Share Referral Code</h4>
                      <p>User shares their unique referral code with friends</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Friend Signs Up</h4>
                      <p>Friend uses the code during registration</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Complete Booking</h4>
                      <p>Friend completes their first booking</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Both Get Rewards</h4>
                      <p>Referrer gets ₹{referralSettings.referrerReward}, Referee gets ₹{referralSettings.refereeReward}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="referrals-table-container">
                <h3>Recent Referrals</h3>
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Referrer</th>
                      <th>Referee</th>
                      <th>Code</th>
                      <th>Booking Amount</th>
                      <th>Rewards</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.date}</td>
                        <td>
                          <div className="user-info">
                            <img src={activity.referrer.avatar} alt={activity.referrer.name} />
                            <div>
                              <strong>{activity.referrer.name}</strong>
                              <p>{activity.referrer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-info">
                            <img src={activity.referee.avatar} alt={activity.referee.name} />
                            <div>
                              <strong>{activity.referee.name}</strong>
                              <p>{activity.referee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code>{activity.referralCode}</code>
                        </td>
                        <td>
                          <strong>₹{activity.bookingAmount.toLocaleString()}</strong>
                        </td>
                        <td>
                          <div className="rewards-info">
                            <span>Referrer: ₹{activity.referrerReward}</span>
                            <span>Referee: ₹{activity.refereeReward}</span>
                          </div>
                        </td>
                        <td>{getStatusBadge(activity.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Loyalty Tiers Tab */}
          {activeTab === 'loyalty' && (
            <div className="loyalty-section">
              <div className="loyalty-tiers-grid">
                {loyaltyTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="loyalty-tier-card"
                    style={{ borderColor: tier.color }}
                  >
                    <div className="tier-header" style={{ backgroundColor: tier.color }}>
                      <div className="tier-icon">{tier.icon}</div>
                      <h3>{tier.name}</h3>
                    </div>

                    <div className="tier-content">
                      <div className="tier-points">
                        <strong>Points Range:</strong>
                        <p>
                          {tier.minPoints.toLocaleString()} - {tier.maxPoints === 999999 ? '∞' : tier.maxPoints.toLocaleString()}
                        </p>
                      </div>

                      <div className="tier-discount">
                        <strong>Discount:</strong>
                        <p className="discount-value">{tier.discount}%</p>
                      </div>

                      <div className="tier-benefits">
                        <strong>Benefits:</strong>
                        <ul>
                          {tier.benefits.map((benefit, index) => (
                            <li key={index}>✓ {benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="tier-members">
                        <span>👥 {tier.members.toLocaleString()} members</span>
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

          {/* Points Rules Tab */}
          {activeTab === 'points' && (
            <div className="points-section">
              <div className="points-rules-grid">
                {pointsRules.map((rule) => (
                  <div key={rule.id} className="points-rule-card">
                    <div className="rule-header">
                      <div className="rule-icon">{rule.icon}</div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => handleToggleRule(rule.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <h3>{rule.action}</h3>
                    <div className="rule-points">
                      <span className="points-badge">{rule.points}</span>
                    </div>

                    <button className="btn btn-secondary btn-block">
                      <span>✏️</span>
                      Edit Rule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="activities-section">
              <div className="activities-table-container">
                <table className="activities-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Tier</th>
                      <th>Action</th>
                      <th>Points</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loyaltyActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.date}</td>
                        <td>
                          <div className="user-info">
                            <img src={activity.user.avatar} alt={activity.user.name} />
                            <div>
                              <strong>{activity.user.name}</strong>
                              <p>{activity.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="tier-badge">{activity.user.tier}</span>
                        </td>
                        <td>{activity.action}</td>
                        <td>
                          <strong
                            className={activity.type === 'earned' ? 'points-earned' : 'points-redeemed'}
                          >
                            {activity.points > 0 ? '+' : ''}{activity.points}
                          </strong>
                        </td>
                        <td>
                          <span className={`type-badge type-${activity.type}`}>
                            {activity.type}
                          </span>
                        </td>
                        <td>{activity.description}</td>
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
              <div className="settings-grid">
                {/* Referral Settings */}
                <div className="settings-card">
                  <h3>Referral Program Settings</h3>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={referralSettings.enabled}
                        onChange={(e) =>
                          setReferralSettings({ ...referralSettings, enabled: e.target.checked })
                        }
                      />
                      Enable Referral Program
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Referrer Reward (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={referralSettings.referrerReward}
                      onChange={(e) =>
                        setReferralSettings({
                          ...referralSettings,
                          referrerReward: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Referee Reward (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={referralSettings.refereeReward}
                      onChange={(e) =>
                        setReferralSettings({
                          ...referralSettings,
                          refereeReward: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Minimum Booking Amount (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={referralSettings.minimumBookingAmount}
                      onChange={(e) =>
                        setReferralSettings({
                          ...referralSettings,
                          minimumBookingAmount: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Reward Expiry (Days)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={referralSettings.expiryDays}
                      onChange={(e) =>
                        setReferralSettings({
                          ...referralSettings,
                          expiryDays: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <button className="btn btn-primary">
                    <span>💾</span>
                    Save Settings
                  </button>
                </div>

                {/* Loyalty Settings */}
                <div className="settings-card">
                  <h3>Loyalty Program Settings</h3>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Enable Loyalty Program
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Points Conversion Rate</label>
                    <input
                      type="text"
                      className="form-input"
                      defaultValue="1 point = ₹1"
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Points Expiry (Days)</label>
                    <input type="number" className="form-input" defaultValue="365" />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Allow points redemption
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Send tier upgrade notifications
                    </label>
                  </div>

                  <button className="btn btn-primary">
                    <span>💾</span>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralLoyaltyProgram;
