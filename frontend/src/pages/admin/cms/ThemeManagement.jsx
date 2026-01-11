import React, { useState, useEffect } from 'react';
import { themesAPI } from '../../../services/api';
import { useTheme } from '../../../contexts/ThemeContext';
import './ThemeManagement.css';

const ThemeManagement = () => {
  const { theme: activeTheme, refreshTheme } = useTheme();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    colors: {
      primary: '#10b981',
      primaryDark: '#059669',
      secondary: '#d4af37',
      accent: '#fef3c7',
      background: '#ffffff',
      text: '#1f2937',
      textLight: '#6b7280'
    },
    isActive: false
  });

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await themesAPI.getAllThemes();
      if (response.success) {
        setThemes(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      alert('Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorChange = (colorKey, value) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTheme) {
        const response = await themesAPI.updateTheme(editingTheme._id, formData);
        if (response.success) {
          alert('Theme updated successfully!');
          fetchThemes();
          closeModal();
        }
      } else {
        const response = await themesAPI.createTheme(formData);
        if (response.success) {
          alert('Theme created successfully!');
          fetchThemes();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert(error.response?.data?.message || 'Failed to save theme');
    }
  };

  const handleEdit = (theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      displayName: theme.displayName,
      description: theme.description || '',
      colors: theme.colors,
      isActive: theme.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theme?')) return;

    try {
      const response = await themesAPI.deleteTheme(id);
      if (response.success) {
        alert('Theme deleted successfully!');
        fetchThemes();
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('Failed to delete theme');
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await themesAPI.activateTheme(id);
      if (response.success) {
        alert('Theme activated successfully!');
        fetchThemes();
        refreshTheme(); // Refresh theme context
      }
    } catch (error) {
      console.error('Error activating theme:', error);
      alert('Failed to activate theme');
    }
  };

  const openCreateModal = () => {
    setEditingTheme(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      colors: {
        primary: '#10b981',
        primaryDark: '#059669',
        secondary: '#d4af37',
        accent: '#fef3c7',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      },
      isActive: false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTheme(null);
  };

  const presetThemes = [
    {
      name: 'Islamic Green',
      colors: {
        primary: '#10b981',
        primaryDark: '#059669',
        secondary: '#d4af37',
        accent: '#fef3c7',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      }
    },
    {
      name: 'Royal Blue',
      colors: {
        primary: '#1e40af',
        primaryDark: '#1e3a8a',
        secondary: '#d4af37',
        accent: '#dbeafe',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      }
    },
    {
      name: 'Elegant Purple',
      colors: {
        primary: '#7c3aed',
        primaryDark: '#6d28d9',
        secondary: '#d4af37',
        accent: '#ede9fe',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      }
    }
  ];

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      colors: preset.colors
    }));
  };

  return (
    <div className="theme-management">
      <div className="page-header">
        <div>
          <h1>Theme Management</h1>
          <p className="page-subtitle">Customize your site's appearance</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Theme
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="themes-grid">
          {themes.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h3>No Themes Yet</h3>
              <p>Create your first theme to customize your site</p>
            </div>
          ) : (
            themes.map((theme) => (
              <div key={theme._id} className={`theme-card ${theme.isActive ? 'active-theme' : ''}`}>
                {theme.isActive && (
                  <div className="active-badge">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </div>
                )}

                <div className="theme-preview">
                  <div className="color-palette">
                    <div className="color-swatch" style={{ background: theme.colors.primary }} title="Primary">
                      <span>Primary</span>
                    </div>
                    <div className="color-swatch" style={{ background: theme.colors.primaryDark }} title="Primary Dark">
                      <span>Dark</span>
                    </div>
                    <div className="color-swatch" style={{ background: theme.colors.secondary }} title="Secondary">
                      <span>Secondary</span>
                    </div>
                    <div className="color-swatch" style={{ background: theme.colors.accent }} title="Accent">
                      <span>Accent</span>
                    </div>
                  </div>
                </div>

                <div className="theme-info">
                  <h3>{theme.displayName}</h3>
                  {theme.description && <p>{theme.description}</p>}
                  
                  <div className="theme-colors-list">
                    <div className="color-item">
                      <span className="color-dot" style={{ background: theme.colors.primary }}></span>
                      <span className="color-label">Primary: {theme.colors.primary}</span>
                    </div>
                    <div className="color-item">
                      <span className="color-dot" style={{ background: theme.colors.secondary }}></span>
                      <span className="color-label">Secondary: {theme.colors.secondary}</span>
                    </div>
                  </div>
                </div>

                <div className="theme-actions">
                  {!theme.isActive && (
                    <button className="btn-activate" onClick={() => handleActivate(theme._id)}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Activate
                    </button>
                  )}
                  
                  <button className="btn-icon btn-edit" onClick={() => handleEdit(theme)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {!theme.isActive && (
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(theme._id)}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTheme ? 'Edit Theme' : 'Create Theme'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {/* Preset Themes */}
              {!editingTheme && (
                <div className="preset-themes">
                  <label>Quick Start with Preset:</label>
                  <div className="preset-grid">
                    {presetThemes.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        className="preset-button"
                        onClick={() => applyPreset(preset)}
                      >
                        <div className="preset-colors">
                          {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                            <div key={i} className="preset-color" style={{ background: color }}></div>
                          ))}
                        </div>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Theme Name (ID) *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., islamic-green"
                    pattern="[a-z0-9-]+"
                    title="Only lowercase letters, numbers, and hyphens"
                  />
                </div>

                <div className="form-group">
                  <label>Display Name *</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Islamic Green"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Brief description of this theme"
                />
              </div>

              <div className="colors-section">
                <h3>Theme Colors</h3>
                <div className="colors-grid">
                  <div className="color-input-group">
                    <label>Primary Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Primary Dark</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.primaryDark}
                        onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.primaryDark}
                        onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                        placeholder="#059669"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Secondary Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        placeholder="#d4af37"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Accent Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        placeholder="#fef3c7"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Background</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Text Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>

                  <div className="color-input-group">
                    <label>Text Light</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={formData.colors.textLight}
                        onChange={(e) => handleColorChange('textLight', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.colors.textLight}
                        onChange={(e) => handleColorChange('textLight', e.target.value)}
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTheme ? 'Update Theme' : 'Create Theme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeManagement;
