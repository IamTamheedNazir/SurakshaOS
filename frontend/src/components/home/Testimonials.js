import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Mohammed Ahmed',
      location: 'Mumbai, India',
      rating: 5,
      image: '👨',
      text: 'Alhamdulillah! The entire process was smooth from booking to returning. The hotel was exactly as shown, and the vendor support was excellent. Highly recommend UmrahConnect.in!',
      package: 'Gold Umrah Package',
      date: 'December 2023'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      location: 'Delhi, India',
      rating: 5,
      image: '👩',
      text: 'Best decision to book through UmrahConnect.in. The partial payment option helped us manage our budget. Real-time visa tracking was very helpful. JazakAllah Khair!',
      package: 'Diamond Umrah Package',
      date: 'November 2023'
    },
    {
      id: 3,
      name: 'Abdul Rahman',
      location: 'Bangalore, India',
      rating: 5,
      image: '👨‍🦱',
      text: 'Professional service from start to finish. The guide was knowledgeable, hotels were comfortable, and everything was well-organized. May Allah bless the team!',
      package: 'Economy Umrah Package',
      date: 'October 2023'
    },
    {
      id: 4,
      name: 'Aisha Siddiqui',
      location: 'Hyderabad, India',
      rating: 5,
      image: '👩‍🦱',
      text: 'Traveled with my family of 5. The group booking was hassle-free. WhatsApp updates kept us informed throughout. Excellent experience, MashaAllah!',
      package: 'Platinum Family Package',
      date: 'September 2023'
    }
  ];

  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-badge badge badge-gold">
            💬 Testimonials
          </span>
          <h2 className="section-title">
            What Our Pilgrims Say
          </h2>
          <p className="section-subtitle">
            Real experiences from thousands of satisfied pilgrims who trusted us with their sacred journey
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.image}</div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-location">{testimonial.location}</p>
                </div>
                <div className="testimonial-rating">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
              </div>

              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>

              <div className="testimonial-footer">
                <div className="testimonial-package">
                  <span className="package-icon">📦</span>
                  <span>{testimonial.package}</span>
                </div>
                <div className="testimonial-date">{testimonial.date}</div>
              </div>

              <div className="testimonial-verified">
                <span className="verified-icon">✓</span>
                Verified Booking
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta">
          <p className="cta-text">Join thousands of satisfied pilgrims</p>
          <a href="/reviews" className="btn btn-outline btn-lg">
            Read More Reviews
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
