import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CurrencySettings.css';

const CurrencySettings = () => {
  const [activeTab, setActiveTab] = useState('currencies');

  // Supported currencies
  const [currencies, setCurrencies] = useState([
    {
      id: 1,
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      flag: '🇮🇳',
      exchangeRate: 1.0,
      isDefault: true,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 2,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      exchangeRate: 0.012,
      isDefault: false,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 3,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: '🇪🇺',
      exchangeRate: 0.011,
      isDefault: false,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: '.',
      decimalSeparator: ',',
    },
    {
      id: 4,
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      exchangeRate: 0.0095,
      isDefault: false,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 5,
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      flag: '🇦🇪',
      exchangeRate: 0.044,
      isDefault: false,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 6,
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'ر.س',
      flag: '🇸🇦',
      exchangeRate: 0.045,
      isDefault: false,
      enabled: true,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 7,
      code: 'PKR',
      name: 'Pakistani Rupee',
      symbol: '₨',
      flag: '🇵🇰',
      exchangeRate: 3.35,
      isDefault: false,
      enabled: false,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
    {
      id: 8,
      code: 'BDT',
      name: 'Bangladeshi Taka',
      symbol: '৳',
      flag: '🇧🇩',
      exchangeRate: 1.32,
      isDefault: false,
      enabled: false,
      position: 'before',
      decimalPlaces: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.',
    },
  ]);

  // Currency settings
  const [currencySettings, setCurrencySettings] = useState({
    autoUpdate: true,
    updateFrequency: 'daily',
    apiProvider: 'exchangerate-api',
    apiKey: '***************',
    fallbackCurrency: 'INR',
    showCurrencySwitcher: true,
    detectUserCurrency: true,
  });

  // Exchange rate providers
  const exchangeRateProviders = [
    { value: 'exchangerate-api', label: 'ExchangeRate-API', icon: '💱' },
    { value: 'fixer', label: 'Fixer.io', icon: '💰' },
    { value: 'openexchangerates', label: 'Open Exchange Rates', icon: '🌍' },
    { value: 'currencylayer', label: 'CurrencyLayer', icon: '📊' },
  ];

  const handleToggleCurrency = (currencyId) => {
    setCurrencies(prev =>
      prev.map(c =>
        c.id === currencyId ? { ...c, enabled: !c.enabled } : c
      )
    );
    toast.success('Currency status updated');
  };

  const handleSetDefaultCurrency = (currencyId) => {
    setCurrencies(prev =>
      prev.map(c => ({
        ...c,
        isDefault: c.id === currencyId,
      }))
    );
    toast.success('Default currency updated');
  };

  const handleUpdateExchangeRates = () => {
    toast.info('Updating exchange rates...');
    setTimeout(() => {
      toast.success('Exchange rates updated successfully!');
    }, 2000);
  };

  const formatCurrency = (amount, currency) => {
    const formatted = amount.toFixed(currency.decimalPlaces);
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator);
    const value = parts.join(currency.decimalSeparator);
    
    return currency.position === 'before'
      ? `${currency.symbol}${value}`
      : `${value}${currency.symbol}`;
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    const inBaseCurrency = amount / fromCurrency.exchangeRate;
    return inBaseCurrency * toCurrency.exchangeRate;
  };

  return (
    <div className="currency-settings-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">💱 Currency Settings</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Currency</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleUpdateExchangeRates}>
              <span>🔄</span>
              Update Rates
            </button>
            <button className="btn btn-primary">
              <span>➕</span>
              Add Currency
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="currency-stats-grid">
          <div className="currency-stat-card">
            <div className="stat-icon">💱</div>
            <div className="stat-content">
              <div className="stat-value">{currencies.length}</div>
              <div className="stat-label">Total Currencies</div>
            </div>
          </div>
          <div className="currency-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{currencies.filter(c => c.enabled).length}</div>
              <div className="stat-label">Active Currencies</div>
            </div>
          </div>
          <div className="currency-stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <div className="stat-value">
                {currencies.find(c => c.isDefault)?.code}
              </div>
              <div className="stat-label">Default Currency</div>
            </div>
          </div>
          <div className="currency-stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">
                {currencySettings.autoUpdate ? 'Auto' : 'Manual'}
              </div>
              <div className="stat-label">Update Mode</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="currency-tabs">
          <button
            className={`currency-tab-btn ${activeTab === 'currencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('currencies')}
          >
            <span>💱</span>
            Currencies
          </button>
          <button
            className={`currency-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveTab('converter')}
          >
            <span>🔄</span>
            Currency Converter
          </button>
          <button
            className={`currency-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="currency-content">
          {/* Currencies Tab */}
          {activeTab === 'currencies' && (
            <div className="currencies-section">
              <div className="currencies-table-container">
                <table className="currencies-table">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Code</th>
                      <th>Symbol</th>
                      <th>Exchange Rate</th>
                      <th>Format</th>
                      <th>Status</th>
                      <th>Default</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencies.map((currency) => (
                      <tr key={currency.id}>
                        <td>
                          <div className="currency-name">
                            <span className="currency-flag">{currency.flag}</span>
                            <strong>{currency.name}</strong>
                          </div>
                        </td>
                        <td><code>{currency.code}</code></td>
                        <td><strong>{currency.symbol}</strong></td>
                        <td>
                          <input
                            type="number"
                            step="0.0001"
                            className="rate-input"
                            value={currency.exchangeRate}
                            onChange={(e) => {
                              const newRate = parseFloat(e.target.value);
                              setCurrencies(prev =>
                                prev.map(c =>
                                  c.id === currency.id
                                    ? { ...c, exchangeRate: newRate }
                                    : c
                                )
                              );
                            }}
                          />
                        </td>
                        <td>
                          <code>{formatCurrency(1234.56, currency)}</code>
                        </td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={currency.enabled}
                              onChange={() => handleToggleCurrency(currency.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          {currency.isDefault ? (
                            <span className="default-badge">✓ Default</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleSetDefaultCurrency(currency.id)}
                              disabled={!currency.enabled}
                            >
                              Set Default
                            </button>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="Edit">✏️</button>
                            <button className="table-action-btn" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Currency Converter Tab */}
          {activeTab === 'converter' && (
            <div className="converter-section">
              <div className="converter-card">
                <h3>💱 Currency Converter</h3>
                <div className="converter-form">
                  <div className="converter-row">
                    <div className="converter-input-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        className="converter-input"
                        placeholder="1000"
                        defaultValue="1000"
                      />
                    </div>
                    <div className="converter-select-group">
                      <label>From</label>
                      <select className="converter-select">
                        {currencies.filter(c => c.enabled).map((currency) => (
                          <option key={currency.id} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="converter-swap">
                    <button className="swap-btn">⇅</button>
                  </div>

                  <div className="converter-row">
                    <div className="converter-input-group">
                      <label>Converted Amount</label>
                      <input
                        type="number"
                        className="converter-input"
                        placeholder="0.00"
                        readOnly
                      />
                    </div>
                    <div className="converter-select-group">
                      <label>To</label>
                      <select className="converter-select">
                        {currencies.filter(c => c.enabled).map((currency) => (
                          <option key={currency.id} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-lg btn-block">
                    <span>🔄</span>
                    Convert
                  </button>
                </div>

                <div className="exchange-rate-info">
                  <p>1 INR = 0.012 USD</p>
                  <p className="rate-update">Last updated: 2 hours ago</p>
                </div>
              </div>

              {/* Quick Conversion Table */}
              <div className="quick-conversion-table">
                <h3>Quick Conversion Table (Base: INR)</h3>
                <table className="conversion-table">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>₹1,000</th>
                      <th>₹10,000</th>
                      <th>₹50,000</th>
                      <th>₹1,00,000</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencies.filter(c => c.enabled && !c.isDefault).map((currency) => (
                      <tr key={currency.id}>
                        <td>
                          <strong>{currency.flag} {currency.code}</strong>
                        </td>
                        <td>{formatCurrency(convertAmount(1000, currencies[0], currency), currency)}</td>
                        <td>{formatCurrency(convertAmount(10000, currencies[0], currency), currency)}</td>
                        <td>{formatCurrency(convertAmount(50000, currencies[0], currency), currency)}</td>
                        <td>{formatCurrency(convertAmount(100000, currencies[0], currency), currency)}</td>
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
                <h3>Currency Settings</h3>

                <div className="form-group">
                  <label>Exchange Rate Provider</label>
                  <select
                    className="form-input"
                    value={currencySettings.apiProvider}
                    onChange={(e) =>
                      setCurrencySettings({ ...currencySettings, apiProvider: e.target.value })
                    }
                  >
                    {exchangeRateProviders.map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.icon} {provider.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>API Key</label>
                  <input
                    type="password"
                    className="form-input"
                    value={currencySettings.apiKey}
                    onChange={(e) =>
                      setCurrencySettings({ ...currencySettings, apiKey: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currencySettings.autoUpdate}
                      onChange={(e) =>
                        setCurrencySettings({ ...currencySettings, autoUpdate: e.target.checked })
                      }
                    />
                    Auto-update exchange rates
                  </label>
                </div>

                {currencySettings.autoUpdate && (
                  <div className="form-group">
                    <label>Update Frequency</label>
                    <select
                      className="form-input"
                      value={currencySettings.updateFrequency}
                      onChange={(e) =>
                        setCurrencySettings({ ...currencySettings, updateFrequency: e.target.value })
                      }
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Fallback Currency</label>
                  <select
                    className="form-input"
                    value={currencySettings.fallbackCurrency}
                    onChange={(e) =>
                      setCurrencySettings({ ...currencySettings, fallbackCurrency: e.target.value })
                    }
                  >
                    {currencies.filter(c => c.enabled).map((currency) => (
                      <option key={currency.id} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currencySettings.showCurrencySwitcher}
                      onChange={(e) =>
                        setCurrencySettings({
                          ...currencySettings,
                          showCurrencySwitcher: e.target.checked,
                        })
                      }
                    />
                    Show currency switcher on frontend
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currencySettings.detectUserCurrency}
                      onChange={(e) =>
                        setCurrencySettings({
                          ...currencySettings,
                          detectUserCurrency: e.target.checked,
                        })
                      }
                    />
                    Auto-detect user currency based on location
                  </label>
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

export default CurrencySettings;
