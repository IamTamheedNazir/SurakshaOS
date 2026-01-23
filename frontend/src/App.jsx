import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - Using correct paths
import HomePage from './pages/HomePage.jsx';
import PackagesPage from './pages/packages/PackagesPage.jsx';
import PackageDetailsPage from './pages/packages/PackageDetailsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Terms from './pages/Terms.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/package/:id" element={<PackageDetailsPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Auth Routes (redirect if logged in) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Customer */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="customer">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Vendor */}
          <Route 
            path="/vendor-dashboard" 
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
