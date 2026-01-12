import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import NewHomePage from './pages/NewHomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorProfilePage from './pages/VendorProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<NewHomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/vendors/:vendorId" element={<VendorProfilePage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track/:bookingNumber" element={<TrackingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Customer Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Vendor Routes */}
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Booking Flow */}
          <Route
            path="/booking/:packageId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
