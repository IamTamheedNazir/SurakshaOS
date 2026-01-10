import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCard.css';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'green',
  link,
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return null;
  };

  const cardContent = (
    <>
      <div className="dashboard-card-header">
        <div className={`dashboard-card-icon dashboard-card-icon-${color}`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`dashboard-card-trend trend-${trend}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="dashboard-card-body">
        <h3 className="dashboard-card-title">{title}</h3>
        {loading ? (
          <div className="dashboard-card-skeleton"></div>
        ) : (
          <p className="dashboard-card-value">{value}</p>
        )}
      </div>

      {link && (
        <div className="dashboard-card-footer">
          <span className="dashboard-card-link">
            View Details
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      )}

      <div className="dashboard-card-decoration">✦</div>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="dashboard-card">
        {cardContent}
      </Link>
    );
  }

  return <div className="dashboard-card">{cardContent}</div>;
};

export default DashboardCard;
