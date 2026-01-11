import React, { useState, useEffect } from 'react';
import { bannersAPI, uploadAPI } from '../../../services/api';
import './BannerManagement.css';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getAllBanners();
      if (response.success) {
        setBanners(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Failed to fetch banners');
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadAPI.uploadFile(file, 'banners');
      if (response.success) {
        setFormData(prev => ({ ...prev, image: response.data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBanner) {
        const response = await bannersAPI.updateBanner(editingBanner._id, formData);
        if (response.success) {
          alert('Banner updated successfully!');
          fetchBanners();
          closeModal();
        }
      } else {
        const response = await bannersAPI.createBanner(formData);
        if (response.success) {
          alert('Banner created successfully!');
          fetchBanners();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image,
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      backgroundColor: banner.backgroundColor || '#10b981',
      textColor: banner.textColor || '#ffffff',
      order: banner.order,
      isActive: banner.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await bannersAPI.deleteBanner(id);
      if (response.success) {
        alert('Banner deleted successfully!');
        fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleReorder = async (bannerId, direction) => {
    const bannerIndex = banners.findIndex(b => b._id === bannerId);
    if (
      (direction === 'up' && bannerIndex === 0) ||
      (direction === 'down' && bannerIndex === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? bannerIndex - 1 : bannerIndex + 1;
    [newBanners[bannerIndex], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[bannerIndex]];

    // Update order values
    const reorderedBanners = newBanners.map((banner, index) => ({
      id: banner._id,
      order: index + 1
    }));

    try {
      await bannersAPI.reorderBanners(reorderedBanners);
      fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
      alert('Failed to reorder banners');
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      order: banners.length + 1,
      isActive: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  return (
    <div className="banner-management">
      <div className="page-header">
        <h1>Banner Management</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Banner
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="banners-list">
          {banners.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3>No Banners Yet</h3>
              <p>Create your first banner to get started</p>
            </div>
          ) : (
            banners.map((banner, index) => (
              <div key={banner._id} className="banner-item">
                <div className="banner-preview">
                  <img src={banner.image} alt={banner.title} />
                  <div className="banner-overlay" style={{ backgroundColor: banner.backgroundColor + '80' }}>
                    <h3 style={{ color: banner.textColor }}>{banner.title}</h3>
                  </div>
                </div>

                <div className="banner-details">
                  <div className="banner-info">
                    <h3>{banner.title}</h3>
                    {banner.subtitle && <p className="subtitle">{banner.subtitle}</p>}
                    {banner.description && <p className="description">{banner.description}</p>}
                    
                    <div className="banner-meta">
                      <span className={`status-badge ${banner.isActive ? 'active' : 'inactive'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="order-badge">Order: {banner.order}</span>
                    </div>

                    {banner.buttonText && (
                      <div className="banner-cta">
                        <strong>CTA:</strong> {banner.buttonText} → {banner.buttonLink}
                      </div>
                    )}
                  </div>

                  <div className="banner-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleReorder(banner._id, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    <button
                      className="btn-icon"
                      onClick={() => handleReorder(banner._id, 'down')}
                      disabled={index === banners.length - 1}
                      title="Move Down"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button className="btn-icon btn-edit" onClick={() => handleEdit(banner)} title="Edit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button className="btn-icon btn-delete" onClick={() => handleDelete(banner._id)} title="Delete">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBanner ? 'Edit Banner' : 'Create Banner'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter banner title"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Enter subtitle (optional)"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div className="form-group">
                <label>Banner Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="upload-status">Uploading...</p>}
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="e.g., View Packages"
                  />
                </div>

                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    placeholder="e.g., /packages"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Text Color</label>
                  <input
                    type="color"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
