import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { bookingsAPI, paymentsAPI, documentsAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const { data: bookingsData } = useQuery('userBookings', bookingsAPI.getUserBookings);
  const { data: paymentsData } = useQuery('userPayments', paymentsAPI.getUserPayments);
  const { data: documentsData } = useQuery('userDocuments', documentsAPI.getUserDocuments);

  // Mock data for development
  const mockBookings = [
    {
      id: 'BK001',
      packageTitle: 'Gold Umrah Package - 15 Days',
      departureDate: '2024-03-15',
      status: 'confirmed',
      travelers: 2,
      totalAmount: 220000,
      paidAmount: 22000,
      remainingAmount: 198000,
      visaStatus: 'processing',
      bookingDate: '2024-01-15',
    },
    {
      id: 'BK002',
      packageTitle: 'Economy Umrah Package - 10 Days',
      departureDate: '2024-04-20',
      status: 'pending_documents',
      travelers: 1,
      totalAmount: 58000,
      paidAmount: 5800,
      remainingAmount: 52200,
      visaStatus: 'pending',
      bookingDate: '2024-01-20',
    },
  ];

  const mockPayments = [
    {
      id: 'PAY001',
      bookingId: 'BK001',
      amount: 22000,
      type: 'booking',
      method: 'UPI',
      status: 'completed',
      date: '2024-01-15',
      transactionId: 'TXN123456789',
    },
    {
      id: 'PAY002',
      bookingId: 'BK002',
      amount: 5800,
      type: 'booking',
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-20',
      transactionId: 'TXN987654321',
    },
  ];

  const mockDocuments = [
    {
      id: 'DOC001',
      bookingId: 'BK001',
      type: 'passport',
      travelerName: 'Ahmed Khan',
      status: 'approved',
      uploadDate: '2024-01-16',
    },
    {
      id: 'DOC002',
      bookingId: 'BK001',
      type: 'photo',
      travelerName: 'Ahmed Khan',
      status: 'approved',
      uploadDate: '2024-01-16',
    },
    {
      id: 'DOC003',
      bookingId: 'BK002',
      type: 'passport',
      travelerName: 'Fatima Sheikh',
      status: 'pending',
      uploadDate: '2024-01-21',
    },
  ];

  const bookings = bookingsData?.data || mockBookings;
  const payments = paymentsData?.data || mockPayments;
  const documents = documentsData?.data || mockDocuments;

  const stats = {
