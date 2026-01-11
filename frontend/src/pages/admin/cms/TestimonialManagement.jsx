import React, { useState, useEffect } from 'react';
import { testimonialsAPI, uploadAPI } from '../../../services/api';
import './TestimonialManagement.css';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    location: '',
    testimonial: '',
    rating: 5,
    image: '',
    packageName: '',
    isFeatured: false,
    isVerified: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsAPI.getAllTestimonials();
      if (response.success) {
        setTestimonials(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? parseInt(value) : value)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadAPI.uploadFile(file, 'testimonials');
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
      if (editingTestimonial) {
        const response = await testimonialsAPI.updateTestimonial(editingTestimonial._id, formData);
        if (response.success) {
          alert('Testimonial updated successfully!');
          fetchTestimonials();
          closeModal();
        }
      } else {
        const response = await testimonialsAPI.createTestimonial(formData);
        if (response.success) {
          alert('Testimonial created successfully!');
          fetchTestimonials();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert(error.response?.data?.message || 'Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation || '',
      location: testimonial.location || '',
      testimonial: testimonial.testimonial,
      rating: testimonial.rating,
      image: testimonial.image || '',
      packageName: testimonial.packageName || '',
      isFeatured: testimonial.isFeatured,
      isVerified: testimonial.isVerified
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await testimonialsAPI.deleteTestimonial(id);
      if (response.success) {
        alert('Testimonial deleted successfully!');
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      designation: '',
      location: '',
      testimonial: '',
      rating: 5,
      image: '',
      packageName: '',
      isFeatured: false,
      isVerified: false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`star ${index < rating ? 'filled' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="testimonial-management">
      <div className="page-header">
        <div>
          <h1>Testimonial Management</h1>
          <p className="page-subtitle">Manage customer testimonials and reviews</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="testimonials-grid">
          {testimonials.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3>No Testimonials Yet</h3>
              <p>Add your first testimonial to get started</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial._id} className="testimonial-card">
                {/* Badges */}
                <div className="testimonial-badges">
                  {testimonial.isFeatured && (
                    <span className="badge featured">Featured</span>
                  )}
                  {testimonial.isVerified && (
                    <span className="badge verified">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="testimonial-header">
                  <div className="user-avatar">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{testimonial.name}</h3>
                    {testimonial.designation && (
                      <p className="designation">{testimonial.designation}</p>
                    )}
                    {testimonial.location && (
                      <p className="location">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {renderStars(testimonial.rating)}

                {/* Testimonial Text */}
                <p className="testimonial-text">{testimonial.testimonial}</p>

                {/* Package Info */}
                {testimonial.packageName && (
                  <div className="package-info">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>{testimonial.packageName}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="testimonial-actions">
                  <button className="btn-icon btn-edit" onClick={() => handleEdit(testimonial)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button className="btn-icon btn-delete" onClick={() => handleDelete(testimonial._id)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Business Owner"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Mumbai, India"
                />
              </div>

              <div className="form-group">
                <label>Testimonial *</label>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Write the testimonial here..."
                />
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="star-label">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={formData.rating === star}
                        onChange={handleInputChange}
                      />
                      <svg
                        className={`star ${formData.rating >= star ? 'filled' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Profile Image</label>
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

              <div className="form-group">
                <label>Package Name</label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  placeholder="14 Days Premium Umrah Package"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Featured Testimonial</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                  />
                  <span>Verified Purchase</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
