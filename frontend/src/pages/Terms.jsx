import React, { useState } from 'react';
import './Terms.css';

// Icons
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Terms = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'services', title: '2. Services Description' },
    { id: 'registration', title: '3. User Registration' },
    { id: 'booking', title: '4. Booking & Payment' },
    { id: 'cancellation', title: '5. Cancellation & Refunds' },
    { id: 'vendor', title: '6. Vendor Responsibilities' },
    { id: 'user', title: '7. User Responsibilities' },
    { id: 'intellectual', title: '8. Intellectual Property' },
    { id: 'privacy', title: '9. Privacy & Data Protection' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'disputes', title: '11. Dispute Resolution' },
    { id: 'modifications', title: '12. Modifications to Terms' },
    { id: 'contact', title: '13. Contact Information' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="terms-page">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="hero-content">
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last Updated: January 14, 2024</p>
          <p className="hero-description">
            Please read these terms and conditions carefully before using UmrahConnect platform
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="terms-container">
        {/* Sidebar Navigation */}
        <aside className="terms-sidebar">
          <div className="sidebar-sticky">
            <h3>Table of Contents</h3>
            <nav className="terms-nav">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Terms Content */}
        <main className="terms-content">
          {/* Acceptance of Terms */}
          <section id="acceptance" className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using UmrahConnect ("Platform", "Service", "we", "us", or "our"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use our services.
            </p>
            <p>
              These terms apply to all users of the Platform, including but not limited to customers, vendors, and administrators. Your use of the Platform constitutes your acceptance of these terms.
            </p>
            <div className="info-box">
              <InfoIcon />
              <p>By creating an account or making a booking, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement.</p>
            </div>
          </section>

          {/* Services Description */}
          <section id="services" className="terms-section">
            <h2>2. Services Description</h2>
            <p>
              UmrahConnect is an online marketplace that connects customers seeking Umrah packages with verified service providers (vendors). Our platform facilitates:
            </p>
            <ul>
              <li>Browsing and comparing Umrah packages from multiple vendors</li>
              <li>Booking and payment processing for selected packages</li>
              <li>Communication between customers and vendors</li>
              <li>Review and rating system for packages and vendors</li>
              <li>Customer support and dispute resolution assistance</li>
            </ul>
            <p>
              <strong>Important:</strong> UmrahConnect acts as an intermediary platform. We do not directly provide Umrah services, flights, accommodations, or visa processing. These services are provided by independent vendors listed on our platform.
            </p>
          </section>

          {/* User Registration */}
          <section id="registration" className="terms-section">
            <h2>3. User Registration</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3>3.2 Account Types</h3>
            <p>The Platform offers different account types:</p>
            <ul>
              <li><strong>Customer Account:</strong> For individuals booking Umrah packages</li>
              <li><strong>Vendor Account:</strong> For service providers offering Umrah packages (subject to verification and approval)</li>
              <li><strong>Admin Account:</strong> For platform administrators (by invitation only)</li>
            </ul>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent, illegal, or harmful activities.
            </p>
          </section>

          {/* Booking & Payment */}
          <section id="booking" className="terms-section">
            <h2>4. Booking & Payment</h2>
            <h3>4.1 Booking Process</h3>
            <p>
              When you make a booking through our Platform:
            </p>
            <ul>
              <li>You enter into a direct contract with the vendor providing the service</li>
              <li>You must provide accurate traveler information and documentation</li>
              <li>You agree to the vendor's specific terms and conditions for that package</li>
              <li>You authorize us to process payment on behalf of the vendor</li>
            </ul>

            <h3>4.2 Pricing</h3>
            <p>
              All prices displayed on the Platform are:
            </p>
            <ul>
              <li>Set by individual vendors and may vary</li>
              <li>Displayed in Indian Rupees (INR) unless otherwise stated</li>
              <li>Subject to change without notice until booking is confirmed</li>
              <li>Inclusive of applicable taxes unless specified otherwise</li>
            </ul>

            <h3>4.3 Payment</h3>
            <p>
              Payment terms:
            </p>
            <ul>
              <li>Full or partial payment may be required at the time of booking</li>
              <li>We accept credit/debit cards, UPI, net banking, and digital wallets</li>
              <li>EMI options are available for eligible bookings</li>
              <li>Payment processing is handled through secure, PCI-DSS compliant gateways</li>
              <li>Platform service fees may apply and will be clearly disclosed</li>
            </ul>

            <h3>4.4 Booking Confirmation</h3>
            <p>
              Your booking is confirmed only when:
            </p>
            <ul>
              <li>Payment is successfully processed</li>
              <li>You receive a booking confirmation email</li>
              <li>The vendor accepts your booking request</li>
            </ul>
          </section>

          {/* Cancellation & Refunds */}
          <section id="cancellation" className="terms-section">
            <h2>5. Cancellation & Refunds</h2>
            <h3>5.1 Cancellation Policy</h3>
            <p>
              Cancellation policies vary by vendor and package. Generally:
            </p>
            <ul>
              <li><strong>45+ days before departure:</strong> 80-90% refund (minus processing fees)</li>
              <li><strong>30-44 days before departure:</strong> 50-70% refund</li>
              <li><strong>15-29 days before departure:</strong> 25-40% refund</li>
              <li><strong>Less than 15 days:</strong> No refund or minimal refund</li>
            </ul>
            <div className="warning-box">
              <InfoIcon />
              <p><strong>Important:</strong> Always check the specific cancellation policy for your chosen package before booking. Some packages may have stricter or more lenient policies.</p>
            </div>

            <h3>5.2 Refund Process</h3>
            <p>
              Refunds will be processed:
            </p>
            <ul>
              <li>To the original payment method within 7-14 business days</li>
              <li>After deducting applicable cancellation charges and processing fees</li>
              <li>Subject to vendor approval and verification</li>
            </ul>

            <h3>5.3 Force Majeure</h3>
            <p>
              In cases of force majeure (natural disasters, pandemics, war, government restrictions), special cancellation and refund policies may apply as determined by vendors and applicable laws.
            </p>
          </section>

          {/* Vendor Responsibilities */}
          <section id="vendor" className="terms-section">
            <h2>6. Vendor Responsibilities</h2>
            <p>
              Vendors using our Platform agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information about their packages</li>
              <li>Honor all bookings made through the Platform</li>
              <li>Deliver services as described in package details</li>
              <li>Maintain necessary licenses, permits, and insurance</li>
              <li>Respond promptly to customer inquiries and issues</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Pay platform commission fees as agreed</li>
              <li>Not engage in fraudulent or deceptive practices</li>
            </ul>
            <p>
              Vendors are solely responsible for the quality and delivery of their services. UmrahConnect is not liable for vendor performance or service quality.
            </p>
          </section>

          {/* User Responsibilities */}
          <section id="user" className="terms-section">
            <h2>7. User Responsibilities</h2>
            <p>
              As a user of the Platform, you agree to:
            </p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Use the Platform only for lawful purposes</li>
              <li>Not engage in fraudulent activities or misrepresentation</li>
              <li>Respect intellectual property rights</li>
              <li>Not interfere with Platform operations or security</li>
              <li>Not post offensive, defamatory, or inappropriate content</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Obtain necessary travel documents (passport, visa, vaccinations)</li>
              <li>Verify all booking details before confirmation</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual" className="terms-section">
            <h2>8. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, images, software, and design, is the property of UmrahConnect or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not:
            </p>
            <ul>
              <li>Copy, modify, or distribute Platform content without permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on Platform content</li>
            </ul>
          </section>

          {/* Privacy & Data Protection */}
          <section id="privacy" className="terms-section">
            <h2>9. Privacy & Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection, use, and protection of your personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p>
              Key points:
            </p>
            <ul>
              <li>We collect only necessary information for service delivery</li>
              <li>Your data is stored securely and encrypted</li>
              <li>We do not sell your personal information to third parties</li>
              <li>You have rights to access, correct, and delete your data</li>
              <li>We comply with applicable data protection laws</li>
            </ul>
            <p>
              For complete details, please read our <a href="/privacy">Privacy Policy</a>.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section id="liability" className="terms-section">
            <h2>10. Limitation of Liability</h2>
            <h3>10.1 Platform Role</h3>
            <p>
              UmrahConnect acts solely as an intermediary platform connecting customers with vendors. We are not responsible for:
            </p>
            <ul>
              <li>Quality, safety, or legality of services provided by vendors</li>
              <li>Accuracy of vendor-provided information</li>
              <li>Vendor performance or failure to deliver services</li>
              <li>Travel delays, cancellations, or disruptions</li>
              <li>Loss, damage, or injury during travel</li>
              <li>Visa rejections or travel document issues</li>
            </ul>

            <h3>10.2 Disclaimer</h3>
            <p>
              The Platform is provided "as is" without warranties of any kind, either express or implied. We do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted or error-free operation</li>
              <li>Accuracy or completeness of information</li>
              <li>Availability of specific packages or vendors</li>
              <li>Specific results from using the Platform</li>
            </ul>

            <h3>10.3 Maximum Liability</h3>
            <p>
              To the maximum extent permitted by law, our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section id="disputes" className="terms-section">
            <h2>11. Dispute Resolution</h2>
            <h3>11.1 Customer-Vendor Disputes</h3>
            <p>
              For disputes between customers and vendors:
            </p>
            <ul>
              <li>First, attempt to resolve directly with the vendor</li>
              <li>Contact our support team for mediation assistance</li>
              <li>We will facilitate communication and fair resolution</li>
              <li>Final decisions rest with the parties involved</li>
            </ul>

            <h3>11.2 Governing Law</h3>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
            </p>

            <h3>11.3 Arbitration</h3>
            <p>
              For disputes exceeding ₹5,00,000, parties agree to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.
            </p>
          </section>

          {/* Modifications to Terms */}
          <section id="modifications" className="terms-section">
            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
            </p>
            <p>
              We will notify users of significant changes via:
            </p>
            <ul>
              <li>Email notification to registered users</li>
              <li>Prominent notice on the Platform</li>
              <li>Update to the "Last Updated" date</li>
            </ul>
            <p>
              We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact" className="terms-section">
            <h2>13. Contact Information</h2>
            <p>
              For questions, concerns, or complaints regarding these Terms, please contact us:
            </p>
            <div className="contact-info-box">
              <div className="contact-item">
                <strong>Email:</strong>
                <a href="mailto:legal@umrahconnect.com">legal@umrahconnect.com</a>
              </div>
              <div className="contact-item">
                <strong>Phone:</strong>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="contact-item">
                <strong>Address:</strong>
                <p>UmrahConnect Private Limited<br />
                123 Business Center<br />
                Mumbai, Maharashtra 400001<br />
                India</p>
              </div>
              <div className="contact-item">
                <strong>Business Hours:</strong>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
                Sunday: Closed</p>
              </div>
            </div>
          </section>

          {/* Acceptance Checkbox */}
          <div className="acceptance-box">
            <CheckIcon />
            <p>
              By using UmrahConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Terms;
