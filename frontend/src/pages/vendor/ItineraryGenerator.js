import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './ItineraryGenerator.css';

const ItineraryGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState({
    packageName: '15 Days Premium Umrah Package',
    duration: 15,
    makkahDays: 8,
    madinahDays: 7,
    departureCity: 'Mumbai',
    departureDate: '2026-03-15',
    returnDate: '2026-03-30',
    days: [
      {
        day: 1,
        title: 'Departure from Mumbai',
        location: 'Mumbai → Jeddah',
        activities: [
          { time: '18:00', icon: '✈️', title: 'Departure', description: 'Flight departure from Chhatrapati Shivaji International Airport' },
          { time: '21:30', icon: '🛬', title: 'Arrival in Jeddah', description: 'Arrival at King Abdulaziz International Airport' },
          { time: '23:00', icon: '🚌', title: 'Transfer to Makkah', description: 'Comfortable coach transfer to hotel in Makkah' },
        ],
      },
      {
        day: 2,
        title: 'First Day in Makkah',
        location: 'Makkah',
        activities: [
          { time: '02:00', icon: '🏨', title: 'Hotel Check-in', description: 'Check-in at hotel near Haram' },
          { time: '05:00', icon: '🕌', title: 'Fajr Prayer', description: 'First prayer at Masjid al-Haram' },
          { time: '09:00', icon: '🍽️', title: 'Breakfast', description: 'Buffet breakfast at hotel' },
          { time: '11:00', icon: '🕋', title: 'Umrah Performance', description: 'Perform your first Umrah with group guidance' },
          { time: '14:00', icon: '🍲', title: 'Lunch', description: 'Lunch at hotel' },
          { time: '16:00', icon: '😴', title: 'Rest Time', description: 'Rest and relaxation at hotel' },
          { time: '20:00', icon: '🍽️', title: 'Dinner', description: 'Dinner at hotel' },
          { time: '22:00', icon: '🕌', title: 'Isha Prayer', description: 'Evening prayer at Haram' },
        ],
      },
      {
        day: 3,
        title: 'Ziyarat in Makkah',
        location: 'Makkah',
        activities: [
          { time: '09:00', icon: '🚌', title: 'Ziyarat Tour Begins', description: 'Visit to historical Islamic sites' },
          { time: '10:00', icon: '⛰️', title: 'Jabal al-Nour', description: 'Visit Cave of Hira where first revelation came' },
          { time: '12:00', icon: '🏔️', title: 'Jabal Thawr', description: 'Visit the cave where Prophet stayed during migration' },
          { time: '14:00', icon: '🍲', title: 'Lunch Break', description: 'Lunch at local restaurant' },
          { time: '16:00', icon: '🕌', title: 'Masjid Aisha', description: 'Visit Masjid Aisha (Miqat for Umrah)' },
          { time: '18:00', icon: '🏨', title: 'Return to Hotel', description: 'Return to hotel for rest' },
          { time: '20:00', icon: '🍽️', title: 'Dinner', description: 'Dinner at hotel' },
        ],
      },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleAddDay = () => {
    const newDay = {
      day: itinerary.days.length + 1,
      title: `Day ${itinerary.days.length + 1}`,
      location: 'Makkah',
      activities: [],
    };
    setItinerary({ ...itinerary, days: [...itinerary.days, newDay] });
  };

  const handleAddActivity = (dayIndex) => {
    const newActivity = {
      time: '09:00',
      icon: '📍',
      title: 'New Activity',
      description: 'Activity description',
    };
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities.push(newActivity);
    setItinerary({ ...itinerary, days: updatedDays });
  };

  const handleUpdateActivity = (dayIndex, activityIndex, field, value) => {
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities[activityIndex][field] = value;
    setItinerary({ ...itinerary, days: updatedDays });
  };

  const handleDeleteActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setItinerary({ ...itinerary, days: updatedDays });
  };

  const handleGeneratePDF = () => {
    toast.success('Generating beautiful PDF itinerary...');
    // PDF generation logic here
  };

  const handleSendEmail = () => {
    toast.success('Sending itinerary via email...');
    // Email sending logic here
  };

  const handleShare = () => {
    toast.success('Generating shareable link...');
    // Share link generation logic here
  };

  return (
    <div className="itinerary-generator-page">
      <div className="container">
        {/* Header */}
        <div className="itinerary-header">
          <div>
            <h1 className="itinerary-title">📋 Itinerary Generator</h1>
            <p className="itinerary-subtitle">Create beautiful, detailed itineraries for your packages</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
              <span>{editMode ? '👁️' : '✏️'}</span>
              {editMode ? 'Preview Mode' : 'Edit Mode'}
            </button>
            <button className="btn btn-success" onClick={handleGeneratePDF}>
              <span>📄</span>
              Generate PDF
            </button>
            <button className="btn btn-primary" onClick={handleSendEmail}>
              <span>📧</span>
              Send Email
            </button>
            <button className="btn btn-info" onClick={handleShare}>
              <span>🔗</span>
              Share Link
            </button>
          </div>
        </div>

        {/* Package Info Card */}
        <div className="package-info-card">
          <div className="package-header">
            <div className="package-icon">🕌</div>
            <div className="package-details">
              <h2>{itinerary.packageName}</h2>
              <div className="package-meta">
                <span>📅 {itinerary.duration} Days</span>
                <span>🕋 {itinerary.makkahDays} Days in Makkah</span>
                <span>🕌 {itinerary.madinahDays} Days in Madinah</span>
                <span>✈️ {itinerary.departureCity}</span>
              </div>
            </div>
          </div>
          <div className="package-dates">
            <div className="date-item">
              <span className="date-label">Departure</span>
              <span className="date-value">{itinerary.departureDate}</span>
            </div>
            <div className="date-arrow">→</div>
            <div className="date-item">
              <span className="date-label">Return</span>
              <span className="date-value">{itinerary.returnDate}</span>
            </div>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="itinerary-timeline">
          {itinerary.days.map((day, dayIndex) => (
            <div key={dayIndex} className="day-section">
              <div className="day-header">
                <div className="day-number">Day {day.day}</div>
                <div className="day-info">
                  <h3 className="day-title">{day.title}</h3>
                  <p className="day-location">📍 {day.location}</p>
                </div>
                {editMode && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddActivity(dayIndex)}
                  >
                    ➕ Add Activity
                  </button>
                )}
              </div>

              <div className="activities-timeline">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="activity-item">
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-connector">
                      <div className="activity-dot"></div>
                      {activityIndex < day.activities.length - 1 && (
                        <div className="activity-line"></div>
                      )}
                    </div>
                    <div className="activity-content">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-details">
                        {editMode ? (
                          <>
                            <input
                              type="text"
                              className="activity-title-input"
                              value={activity.title}
                              onChange={(e) =>
                                handleUpdateActivity(dayIndex, activityIndex, 'title', e.target.value)
                              }
                            />
                            <textarea
                              className="activity-description-input"
                              value={activity.description}
                              onChange={(e) =>
                                handleUpdateActivity(dayIndex, activityIndex, 'description', e.target.value)
                              }
                            />
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDeleteActivity(dayIndex, activityIndex)}
                            >
                              🗑️ Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <h4 className="activity-title">{activity.title}</h4>
                            <p className="activity-description">{activity.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {editMode && (
            <div className="add-day-section">
              <button className="btn btn-lg btn-primary" onClick={handleAddDay}>
                <span>➕</span>
                Add New Day
              </button>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="important-notes-card">
          <h3>📌 Important Notes</h3>
          <ul className="notes-list">
            <li>Please carry your passport and visa documents at all times</li>
            <li>Dress modestly and respectfully in all holy places</li>
            <li>Stay hydrated and take regular breaks</li>
            <li>Follow the group leader's instructions during Ziyarat tours</li>
            <li>Keep emergency contact numbers saved in your phone</li>
            <li>Inform the tour guide if you need any special assistance</li>
          </ul>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="inclusions-grid">
          <div className="inclusions-card">
            <h3>✅ Package Inclusions</h3>
            <ul className="inclusions-list">
              <li>✈️ Round-trip airfare</li>
              <li>🏨 Hotel accommodation (near Haram)</li>
              <li>🍽️ Daily breakfast and dinner</li>
              <li>🚌 All transfers and transportation</li>
              <li>🗺️ Guided Ziyarat tours</li>
              <li>📱 24/7 support and assistance</li>
              <li>💼 Travel insurance</li>
            </ul>
          </div>
          <div className="exclusions-card">
            <h3>❌ Package Exclusions</h3>
            <ul className="exclusions-list">
              <li>🍲 Lunch (available at extra cost)</li>
              <li>🛍️ Personal shopping expenses</li>
              <li>📞 International phone calls</li>
              <li>🧳 Excess baggage charges</li>
              <li>💊 Personal medications</li>
              <li>🎁 Tips and gratuities</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="itinerary-footer">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
            ← Back to Requests
          </button>
          <div className="footer-actions">
            <button className="btn btn-success btn-lg" onClick={handleGeneratePDF}>
              <span>📄</span>
              Download PDF
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleSendEmail}>
              <span>📧</span>
              Email to Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerator;
