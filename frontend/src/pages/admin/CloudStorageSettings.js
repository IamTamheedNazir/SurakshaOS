import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CloudStorageSettings.css';

const CloudStorageSettings = () => {
  const [activeTab, setActiveTab] = useState('providers');

  // Storage providers
  const [storageProviders, setStorageProviders] = useState([
    {
      id: 'aws_s3',
      name: 'Amazon S3',
      icon: '☁️',
      description: 'Amazon Simple Storage Service',
      enabled: true,
      isDefault: true,
      config: {
        accessKeyId: 'AKIA***************',
        secretAccessKey: '***************',
        region: 'ap-south-1',
        bucket: 'umrahconnect-media',
        endpoint: 's3.ap-south-1.amazonaws.com',
      },
      stats: {
        totalFiles: 1250,
        totalSize: '45.2 GB',
        bandwidth: '125 GB',
        cost: '$12.50/month',
      },
    },
    {
      id: 'wasabi',
      name: 'Wasabi',
      icon: '🗄️',
      description: 'Hot Cloud Storage',
      enabled: true,
      isDefault: false,
      config: {
        accessKeyId: 'WASA***************',
        secretAccessKey: '***************',
        region: 'ap-southeast-1',
        bucket: 'umrahconnect-backup',
        endpoint: 's3.ap-southeast-1.wasabisys.com',
      },
      stats: {
        totalFiles: 850,
        totalSize: '32.8 GB',
        bandwidth: '85 GB',
        cost: '$6.99/month',
      },
    },
    {
      id: 'cloudinary',
      name: 'Cloudinary',
      icon: '🖼️',
      description: 'Image & Video Management',
      enabled: true,
      isDefault: false,
      config: {
        cloudName: 'umrahconnect',
        apiKey: '***************',
        apiSecret: '***************',
        uploadPreset: 'umrah_uploads',
      },
      stats: {
        totalFiles: 3200,
        totalSize: '18.5 GB',
        bandwidth: '220 GB',
        cost: '$89/month',
      },
    },
    {
      id: 'digitalocean',
      name: 'DigitalOcean Spaces',
      icon: '🌊',
      description: 'Object Storage',
      enabled: false,
      isDefault: false,
      config: {
        accessKeyId: 'DO00***************',
        secretAccessKey: '***************',
        region: 'sgp1',
        bucket: 'umrahconnect-assets',
        endpoint: 'sgp1.digitaloceanspaces.com',
      },
      stats: {
        totalFiles: 0,
        totalSize: '0 GB',
        bandwidth: '0 GB',
        cost: '$0/month',
      },
    },
    {
      id: 'backblaze',
      name: 'Backblaze B2',
      icon: '💾',
      description: 'Cloud Storage',
      enabled: false,
      isDefault: false,
      config: {
        applicationKeyId: 'B2***************',
        applicationKey: '***************',
        bucketId: '***************',
        bucketName: 'umrahconnect-b2',
      },
      stats: {
        totalFiles: 0,
        totalSize: '0 GB',
        bandwidth: '0 GB',
        cost: '$0/month',
      },
    },
    {
      id: 'google_cloud',
      name: 'Google Cloud Storage',
      icon: '☁️',
      description: 'Google Cloud Platform',
      enabled: false,
      isDefault: false,
      config: {
        projectId: 'umrahconnect-***',
        keyFile: 'service-account.json',
        bucket: 'umrahconnect-gcs',
      },
      stats: {
        totalFiles: 0,
        totalSize: '0 GB',
        bandwidth: '0 GB',
        cost: '$0/month',
      },
    },
  ]);

  // File categories
  const [fileCategories, setFileCategories] = useState([
    {
      id: 1,
      name: 'Package Images',
      path: '/packages',
      provider: 'cloudinary',
      autoOptimize: true,
      maxSize: '5 MB',
      allowedFormats: ['jpg', 'png', 'webp'],
    },
    {
      id: 2,
      name: 'User Documents',
      path: '/documents',
      provider: 'aws_s3',
      autoOptimize: false,
      maxSize: '10 MB',
      allowedFormats: ['pdf', 'jpg', 'png'],
    },
    {
      id: 3,
      name: 'Invoices & Receipts',
      path: '/invoices',
      provider: 'aws_s3',
      autoOptimize: false,
      maxSize: '5 MB',
      allowedFormats: ['pdf'],
    },
    {
      id: 4,
      name: 'Backups',
      path: '/backups',
      provider: 'wasabi',
      autoOptimize: false,
      maxSize: '1 GB',
      allowedFormats: ['zip', 'sql'],
    },
  ]);

  const handleToggleProvider = (providerId) => {
    setStorageProviders(prev =>
      prev.map(p =>
        p.id === providerId ? { ...p, enabled: !p.enabled } : p
      )
    );
    toast.success('Provider status updated');
  };

  const handleSetDefault = (providerId) => {
    setStorageProviders(prev =>
      prev.map(p => ({
        ...p,
        isDefault: p.id === providerId,
      }))
    );
    toast.success('Default provider updated');
  };

  const handleTestConnection = (providerId) => {
    toast.info(`Testing connection to ${providerId}...`);
    setTimeout(() => {
      toast.success('Connection successful!');
    }, 2000);
  };

  const handleSyncFiles = (providerId) => {
    toast.info(`Syncing files with ${providerId}...`);
    setTimeout(() => {
      toast.success('Files synced successfully!');
    }, 3000);
  };

  return (
    <div className="cloud-storage-settings-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">☁️ Cloud Storage Settings</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Cloud Storage</span>
            </div>
          </div>
          <button className="btn btn-primary">
            <span>➕</span>
            Add Provider
          </button>
        </div>

        {/* Stats */}
        <div className="storage-stats-grid">
          <div className="storage-stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <div className="stat-value">
                {storageProviders.reduce((sum, p) => sum + p.stats.totalFiles, 0).toLocaleString()}
              </div>
              <div className="stat-label">Total Files</div>
            </div>
          </div>
          <div className="storage-stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <div className="stat-value">96.5 GB</div>
              <div className="stat-label">Total Storage</div>
            </div>
          </div>
          <div className="storage-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">430 GB</div>
              <div className="stat-label">Bandwidth Used</div>
            </div>
          </div>
          <div className="storage-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">$108.49</div>
              <div className="stat-label">Monthly Cost</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="storage-tabs">
          <button
            className={`storage-tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveTab('providers')}
          >
            <span>☁️</span>
            Storage Providers
          </button>
          <button
            className={`storage-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span>📁</span>
            File Categories
          </button>
          <button
            className={`storage-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span>
            Upload Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="storage-content">
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="providers-section">
              <div className="providers-grid">
                {storageProviders.map((provider) => (
                  <div key={provider.id} className="provider-card">
                    <div className="provider-header">
                      <div className="provider-title">
                        <span className="provider-icon">{provider.icon}</span>
                        <div>
                          <h3>{provider.name}</h3>
                          <p>{provider.description}</p>
                        </div>
                      </div>
                      <div className="provider-badges">
                        {provider.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={provider.enabled}
                            onChange={() => handleToggleProvider(provider.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="provider-stats">
                      <div className="stat-item">
                        <span className="stat-label">Files:</span>
                        <strong>{provider.stats.totalFiles.toLocaleString()}</strong>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Storage:</span>
                        <strong>{provider.stats.totalSize}</strong>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Bandwidth:</span>
                        <strong>{provider.stats.bandwidth}</strong>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Cost:</span>
                        <strong>{provider.stats.cost}</strong>
                      </div>
                    </div>

                    <div className="provider-config">
                      <h4>Configuration</h4>
                      {provider.id === 'cloudinary' ? (
                        <>
                          <div className="config-item">
                            <span>Cloud Name:</span>
                            <code>{provider.config.cloudName}</code>
                          </div>
                          <div className="config-item">
                            <span>API Key:</span>
                            <code>{provider.config.apiKey}</code>
                          </div>
                        </>
                      ) : provider.id === 'google_cloud' ? (
                        <>
                          <div className="config-item">
                            <span>Project ID:</span>
                            <code>{provider.config.projectId}</code>
                          </div>
                          <div className="config-item">
                            <span>Bucket:</span>
                            <code>{provider.config.bucket}</code>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="config-item">
                            <span>Region:</span>
                            <code>{provider.config.region}</code>
                          </div>
                          <div className="config-item">
                            <span>Bucket:</span>
                            <code>{provider.config.bucket}</code>
                          </div>
                          <div className="config-item">
                            <span>Endpoint:</span>
                            <code>{provider.config.endpoint}</code>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="provider-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleTestConnection(provider.id)}
                      >
                        <span>🧪</span> Test
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleSyncFiles(provider.id)}
                      >
                        <span>🔄</span> Sync
                      </button>
                      {!provider.isDefault && provider.enabled && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleSetDefault(provider.id)}
                        >
                          <span>⭐</span> Set Default
                        </button>
                      )}
                      <button className="btn btn-sm btn-primary">
                        <span>⚙️</span> Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="categories-section">
              <div className="categories-table-container">
                <table className="categories-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Path</th>
                      <th>Provider</th>
                      <th>Max Size</th>
                      <th>Formats</th>
                      <th>Auto Optimize</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileCategories.map((category) => (
                      <tr key={category.id}>
                        <td><strong>{category.name}</strong></td>
                        <td><code>{category.path}</code></td>
                        <td>
                          <span className="provider-badge">
                            {storageProviders.find(p => p.id === category.provider)?.icon}
                            {storageProviders.find(p => p.id === category.provider)?.name}
                          </span>
                        </td>
                        <td>{category.maxSize}</td>
                        <td>
                          <div className="format-tags">
                            {category.allowedFormats.map((format, index) => (
                              <span key={index} className="format-tag">{format}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={category.autoOptimize}
                              onChange={() => {}}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn">✏️</button>
                            <button className="table-action-btn">🗑️</button>
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
                <h3>Upload Settings</h3>
                
                <div className="form-group">
                  <label>Default Storage Provider</label>
                  <select className="form-input">
                    {storageProviders.filter(p => p.enabled).map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.icon} {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Maximum Upload Size</label>
                  <input type="text" className="form-input" defaultValue="50 MB" />
                </div>

                <div className="form-group">
                  <label>Allowed File Types</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="jpg, png, pdf, doc, docx, zip"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Auto-optimize images
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Generate thumbnails
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    Enable CDN
                  </label>
                </div>

                <button className="btn btn-primary">
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

export default CloudStorageSettings;
