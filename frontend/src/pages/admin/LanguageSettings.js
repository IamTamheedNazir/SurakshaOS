import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LanguageSettings.css';

const LanguageSettings = () => {
  const [activeTab, setActiveTab] = useState('languages');

  // Supported languages
  const [languages, setLanguages] = useState([
    {
      id: 1,
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      direction: 'ltr',
      isDefault: true,
      enabled: true,
      translationProgress: 100,
      totalKeys: 1250,
      translatedKeys: 1250,
    },
    {
      id: 2,
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      direction: 'rtl',
      isDefault: false,
      enabled: true,
      translationProgress: 95,
      totalKeys: 1250,
      translatedKeys: 1188,
    },
    {
      id: 3,
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      flag: '🇵🇰',
      direction: 'rtl',
      isDefault: false,
      enabled: true,
      translationProgress: 88,
      totalKeys: 1250,
      translatedKeys: 1100,
    },
    {
      id: 4,
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      direction: 'ltr',
      isDefault: false,
      enabled: true,
      translationProgress: 92,
      totalKeys: 1250,
      translatedKeys: 1150,
    },
    {
      id: 5,
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇧🇩',
      direction: 'ltr',
      isDefault: false,
      enabled: true,
      translationProgress: 75,
      totalKeys: 1250,
      translatedKeys: 938,
    },
    {
      id: 6,
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
      direction: 'ltr',
      isDefault: false,
      enabled: false,
      translationProgress: 60,
      totalKeys: 1250,
      translatedKeys: 750,
    },
    {
      id: 7,
      code: 'id',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      flag: '🇮🇩',
      direction: 'ltr',
      isDefault: false,
      enabled: false,
      translationProgress: 55,
      totalKeys: 1250,
      translatedKeys: 688,
    },
    {
      id: 8,
      code: 'ms',
      name: 'Malay',
      nativeName: 'Bahasa Melayu',
      flag: '🇲🇾',
      direction: 'ltr',
      isDefault: false,
      enabled: false,
      translationProgress: 50,
      totalKeys: 1250,
      translatedKeys: 625,
    },
  ]);

  // Translation categories
  const translationCategories = [
    { id: 1, name: 'Common', keys: 150, icon: '🌐' },
    { id: 2, name: 'Navigation', keys: 80, icon: '🧭' },
    { id: 3, name: 'Authentication', keys: 120, icon: '🔐' },
    { id: 4, name: 'Packages', keys: 200, icon: '📦' },
    { id: 5, name: 'Bookings', keys: 180, icon: '🎫' },
    { id: 6, name: 'Payments', keys: 140, icon: '💳' },
    { id: 7, name: 'Dashboard', keys: 160, icon: '📊' },
    { id: 8, name: 'Settings', keys: 100, icon: '⚙️' },
    { id: 9, name: 'Notifications', keys: 90, icon: '🔔' },
    { id: 10, name: 'Errors', keys: 30, icon: '❌' },
  ];

  // Sample translations
  const [translations, setTranslations] = useState([
    {
      key: 'common.welcome',
      category: 'Common',
      en: 'Welcome to UmrahConnect',
      ar: 'مرحبا بكم في UmrahConnect',
      ur: 'UmrahConnect میں خوش آمدید',
      hi: 'UmrahConnect में आपका स्वागत है',
      bn: 'UmrahConnect এ স্বাগতম',
    },
    {
      key: 'common.search',
      category: 'Common',
      en: 'Search',
      ar: 'بحث',
      ur: 'تلاش کریں',
      hi: 'खोजें',
      bn: 'অনুসন্ধান',
    },
    {
      key: 'nav.home',
      category: 'Navigation',
      en: 'Home',
      ar: 'الرئيسية',
      ur: 'ہوم',
      hi: 'होम',
      bn: 'হোম',
    },
    {
      key: 'nav.packages',
      category: 'Navigation',
      en: 'Packages',
      ar: 'الباقات',
      ur: 'پیکجز',
      hi: 'पैकेज',
      bn: 'প্যাকেজ',
    },
    {
      key: 'auth.login',
      category: 'Authentication',
      en: 'Login',
      ar: 'تسجيل الدخول',
      ur: 'لاگ ان',
      hi: 'लॉगिन',
      bn: 'লগইন',
    },
  ]);

  // Language settings
  const [languageSettings, setLanguageSettings] = useState({
    autoDetect: true,
    showLanguageSwitcher: true,
    fallbackLanguage: 'en',
    enableRTL: true,
    translateDynamicContent: true,
  });

  const handleToggleLanguage = (languageId) => {
    setLanguages(prev =>
      prev.map(lang =>
        lang.id === languageId ? { ...lang, enabled: !lang.enabled } : lang
      )
    );
    toast.success('Language status updated');
  };

  const handleSetDefaultLanguage = (languageId) => {
    setLanguages(prev =>
      prev.map(lang => ({
        ...lang,
        isDefault: lang.id === languageId,
      }))
    );
    toast.success('Default language updated');
  };

  const handleExportTranslations = (languageCode) => {
    toast.info(`Exporting ${languageCode} translations...`);
    setTimeout(() => {
      toast.success('Translations exported successfully!');
    }, 1500);
  };

  const handleImportTranslations = (languageCode) => {
    toast.info(`Importing ${languageCode} translations...`);
    setTimeout(() => {
      toast.success('Translations imported successfully!');
    }, 1500);
  };

  const totalLanguages = languages.length;
  const enabledLanguages = languages.filter(l => l.enabled).length;
  const avgProgress = languages.reduce((sum, l) => sum + l.translationProgress, 0) / totalLanguages;

  return (
    <div className="language-settings-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">🌐 Language Settings (i18n)</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Languages</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📥</span>
              Import Translations
            </button>
            <button className="btn btn-primary">
              <span>➕</span>
              Add Language
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="language-stats-grid">
          <div className="language-stat-card stat-blue">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <div className="stat-value">{totalLanguages}</div>
              <div className="stat-label">Total Languages</div>
            </div>
          </div>
          <div className="language-stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{enabledLanguages}</div>
              <div className="stat-label">Active Languages</div>
            </div>
          </div>
          <div className="language-stat-card stat-purple">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{avgProgress.toFixed(1)}%</div>
              <div className="stat-label">Avg Translation Progress</div>
            </div>
          </div>
          <div className="language-stat-card stat-orange">
            <div className="stat-icon">🔤</div>
            <div className="stat-content">
              <div className="stat-value">1,250</div>
              <div className="stat-label">Translation Keys</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="language-tabs">
          <button
            className={`language-tab-btn ${activeTab === 'languages' ? 'active' : ''}`}
            onClick={() => setActiveTab('languages')}
          >
            <span>🌐</span>
            Languages
          </button>
          <button
            className={`language-tab-btn ${activeTab === 'translations' ? 'active' : ''}`}
            onClick={() => setActiveTab('translations')}
          >
            <span>🔤</span>
            Translations
          </button>
          <button
            className={`language-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span>📁</span>
            Categories
          </button>
          <button
            className={`language-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="language-content">
          {/* Languages Tab */}
          {activeTab === 'languages' && (
            <div className="languages-section">
              <div className="languages-grid">
                {languages.map((language) => (
                  <div key={language.id} className="language-card">
                    <div className="language-header">
                      <div className="language-flag">{language.flag}</div>
                      <div className="language-info">
                        <h3>{language.name}</h3>
                        <p className="native-name">{language.nativeName}</p>
                        <span className="language-code">{language.code}</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={language.enabled}
                          onChange={() => handleToggleLanguage(language.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="language-details">
                      <div className="detail-item">
                        <span>Direction:</span>
                        <strong>{language.direction.toUpperCase()}</strong>
                      </div>
                      <div className="detail-item">
                        <span>Translation Keys:</span>
                        <strong>{language.translatedKeys} / {language.totalKeys}</strong>
                      </div>
                    </div>

                    <div className="translation-progress">
                      <div className="progress-header">
                        <span>Translation Progress</span>
                        <strong>{language.translationProgress}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${language.translationProgress}%`,
                            backgroundColor:
                              language.translationProgress === 100
                                ? '#10b981'
                                : language.translationProgress >= 80
                                ? '#3b82f6'
                                : language.translationProgress >= 50
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="language-actions">
                      {language.isDefault ? (
                        <span className="default-badge">✓ Default</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleSetDefaultLanguage(language.id)}
                          disabled={!language.enabled}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleExportTranslations(language.code)}
                      >
                        <span>📤</span> Export
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleImportTranslations(language.code)}
                      >
                        <span>📥</span> Import
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Translations Tab */}
          {activeTab === 'translations' && (
            <div className="translations-section">
              <div className="translations-filters">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search translations..."
                />
                <select className="filter-select">
                  <option value="">All Categories</option>
                  {translationCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary">
                  <span>➕</span>
                  Add Translation
                </button>
              </div>

              <div className="translations-table-container">
                <table className="translations-table">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Category</th>
                      <th>🇬🇧 English</th>
                      <th>🇸🇦 Arabic</th>
                      <th>🇵🇰 Urdu</th>
                      <th>🇮🇳 Hindi</th>
                      <th>🇧🇩 Bengali</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {translations.map((translation, index) => (
                      <tr key={index}>
                        <td>
                          <code>{translation.key}</code>
                        </td>
                        <td>
                          <span className="category-badge">{translation.category}</span>
                        </td>
                        <td>{translation.en}</td>
                        <td className="rtl-text">{translation.ar}</td>
                        <td className="rtl-text">{translation.ur}</td>
                        <td>{translation.hi}</td>
                        <td>{translation.bn}</td>
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

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="categories-section">
              <div className="categories-grid">
                {translationCategories.map((category) => (
                  <div key={category.id} className="category-card">
                    <div className="category-icon">{category.icon}</div>
                    <h3>{category.name}</h3>
                    <div className="category-keys">
                      <strong>{category.keys}</strong> translation keys
                    </div>
                    <button className="btn btn-primary btn-block">
                      <span>👁️</span>
                      View Translations
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-form">
                <h3>Language Settings</h3>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={languageSettings.autoDetect}
                      onChange={(e) =>
                        setLanguageSettings({
                          ...languageSettings,
                          autoDetect: e.target.checked,
                        })
                      }
                    />
                    Auto-detect user language based on browser settings
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={languageSettings.showLanguageSwitcher}
                      onChange={(e) =>
                        setLanguageSettings({
                          ...languageSettings,
                          showLanguageSwitcher: e.target.checked,
                        })
                      }
                    />
                    Show language switcher on frontend
                  </label>
                </div>

                <div className="form-group">
                  <label>Fallback Language</label>
                  <select
                    className="form-input"
                    value={languageSettings.fallbackLanguage}
                    onChange={(e) =>
                      setLanguageSettings({
                        ...languageSettings,
                        fallbackLanguage: e.target.value,
                      })
                    }
                  >
                    {languages.filter(l => l.enabled).map((lang) => (
                      <option key={lang.id} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={languageSettings.enableRTL}
                      onChange={(e) =>
                        setLanguageSettings({
                          ...languageSettings,
                          enableRTL: e.target.checked,
                        })
                      }
                    />
                    Enable RTL (Right-to-Left) support for Arabic & Urdu
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={languageSettings.translateDynamicContent}
                      onChange={(e) =>
                        setLanguageSettings({
                          ...languageSettings,
                          translateDynamicContent: e.target.checked,
                        })
                      }
                    />
                    Translate dynamic content (package names, descriptions)
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

export default LanguageSettings;
