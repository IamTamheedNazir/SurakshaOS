import React, { useState } from 'react';
import './FAQ.css';

// Icons
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'booking', label: 'Booking' },
    { id: 'payment', label: 'Payment' },
    { id: 'packages', label: 'Packages' },
    { id: 'travel', label: 'Travel' },
    { id: 'account', label: 'Account' }
  ];

  const faqs = [
    {
      category: 'booking',
      question: 'How do I book an Umrah package?',
      answer: 'To book an Umrah package, browse our packages page, select your preferred package, choose your travel dates and number of travelers, and proceed to checkout. You can pay online or choose other payment options available.'
    },
    {
      category: 'booking',
      question: 'Can I modify my booking after confirmation?',
      answer: 'Yes, you can modify your booking up to 30 days before departure. However, modification charges may apply depending on the vendor\'s policy. Contact our support team for assistance with modifications.'
    },
    {
      category: 'booking',
      question: 'What is the cancellation policy?',
      answer: 'Cancellation policies vary by vendor and package. Generally, cancellations made 45+ days before departure receive 80-90% refund, 30-44 days receive 50-70% refund, and less than 30 days may not be eligible for refund. Check specific package details for exact terms.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, and digital wallets. For large bookings, we also offer EMI options and bank transfers.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, absolutely. We use industry-standard SSL encryption and comply with PCI DSS standards. Your payment information is never stored on our servers and is processed through secure payment gateways.'
    },
    {
      category: 'payment',
      question: 'Can I pay in installments?',
      answer: 'Yes, we offer EMI options for bookings above ₹50,000. You can choose from 3, 6, 9, or 12-month EMI plans. Interest rates vary by bank and tenure.'
    },
    {
      category: 'packages',
      question: 'What is included in an Umrah package?',
      answer: 'Typical packages include round-trip airfare, hotel accommodation in Makkah and Madinah, visa processing, ground transportation, and Ziyarat (religious site visits). Specific inclusions vary by package - check package details for complete information.'
    },
    {
      category: 'packages',
      question: 'Can I customize a package?',
      answer: 'Yes, many vendors offer customization options. You can request changes to hotel categories, add extra nights, include additional services, or modify the itinerary. Contact the vendor directly or our support team for customization requests.'
    },
    {
      category: 'packages',
      question: 'What is the difference between Economy, Deluxe, and Premium packages?',
      answer: 'Economy packages offer 3-star hotels and basic amenities. Deluxe packages include 4-star hotels with better locations and services. Premium packages feature 5-star hotels near Haram, private transportation, and additional services like personal guides.'
    },
    {
      category: 'travel',
      question: 'What documents do I need for Umrah?',
      answer: 'You need a valid passport (minimum 6 months validity), passport-size photographs, vaccination certificates (Meningitis, COVID-19), and completed visa application forms. Women under 45 must travel with a Mahram (male guardian).'
    },
    {
      category: 'travel',
      question: 'How long does visa processing take?',
      answer: 'Umrah visa processing typically takes 7-15 working days. We recommend applying at least 30 days before your intended travel date. Express processing may be available for urgent cases with additional fees.'
    },
    {
      category: 'travel',
      question: 'What vaccinations are required?',
      answer: 'Meningitis (ACWY) vaccination is mandatory and must be taken at least 10 days before travel. COVID-19 vaccination is also required. Yellow fever vaccination is needed if traveling from endemic countries. Carry vaccination certificates with you.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" in the top right corner, enter your details (name, email, phone), create a password, and verify your email. You can also sign up using Google for faster registration.'
    },
    {
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and you\'ll receive a password reset link. Follow the link to create a new password.'
    },
    {
      category: 'account',
      question: 'Can I have multiple bookings under one account?',
      answer: 'Yes, you can make multiple bookings under a single account. All your bookings will be visible in your dashboard for easy management and tracking.'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about UmrahConnect</p>
          
          {/* Search Bar */}
          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section">
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section">
        <div className="faq-container">
          {filteredFaqs.length > 0 ? (
            <div className="faq-list">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon />
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No results found</h3>
              <p>Try adjusting your search or browse all questions</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="contact-cta">
        <h2>Still have questions?</h2>
        <p>Can't find the answer you're looking for? Our support team is here to help.</p>
        <div className="cta-buttons">
          <a href="/contact" className="btn-primary">
            Contact Support
          </a>
          <a href="tel:+919876543210" className="btn-secondary">
            Call Us: +91 98765 43210
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
