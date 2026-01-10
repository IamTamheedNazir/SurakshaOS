import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false, message = '' }) => {
  const loaderClass = `loader-container ${fullScreen ? 'loader-fullscreen' : ''} loader-${size}`;

  return (
    <div className={loaderClass}>
      <div className="loader-content">
        {/* Islamic Spinner */}
        <div className="islamic-spinner">
          <div className="spinner-ring spinner-ring-1"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-ring spinner-ring-3"></div>
          <div className="spinner-center">
            <span className="spinner-icon">🕌</span>
          </div>
        </div>

        {/* Loading Message */}
        {message && (
          <p className="loader-message">{message}</p>
        )}

        {/* Loading Dots */}
        <div className="loader-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
