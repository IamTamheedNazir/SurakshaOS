import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PaymentGateway.css';

const PaymentGateway = ({ amount, requestId, onSuccess }) => {
  const navigate = useNavigate();
  const [selectedGateway, setSelectedGateway] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Mock payment gateways (will be fetched from backend)
  const paymentGateways = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: '💳',
      enabled: true,
      description: 'Credit/Debit Card, UPI, Net Banking',
      processingFee: 2.0,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💰',
      enabled: true,
      description: 'International Cards, Apple Pay, Google Pay',
      processingFee: 2.5,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      enabled: true,
      description: 'PayPal Balance, Cards',
      processingFee: 3.0,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      enabled: true,
      description: 'Direct Bank Transfer (NEFT/RTGS/IMPS)',
      processingFee: 0,
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      enabled: true,
      description: 'Google Pay, PhonePe, Paytm',
      processingFee: 0,
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: '💵',
      enabled: true,
      description: 'Pay at office',
      processingFee: 0,
    },
  ];

  // Bank details (will be fetched from backend)
  const bankDetails = {
    accountName: 'UmrahConnect Pvt Ltd',
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Mumbai Main Branch',
    accountType: 'Current Account',
    upiId: 'umrahconnect@hdfcbank',
    qrCode: 'https://example.com/qr-code.png',
  };

  const calculateTotal = () => {
    const gateway = paymentGateways.find(g => g.id === selectedGateway);
    if (!gateway) return amount;
    const fee = (amount * gateway.processingFee) / 100;
    return amount + fee;
  };

  const handlePaymentGatewaySelect = (gatewayId) => {
    setSelectedGateway(gatewayId);
    setShowBankDetails(gatewayId === 'bank_transfer');
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      // Initialize Razorpay
      const options = {
        key: 'rzp_test_key', // Will come from backend
        amount: calculateTotal() * 100, // Amount in paise
        currency: 'INR',
        name: 'UmrahConnect',
        description: `Payment for Request #${requestId}`,
        image: '/logo.png',
        handler: function (response) {
          toast.success('Payment successful!');
          onSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      // Stripe integration
      toast.info('Redirecting to Stripe...');
      // Implement Stripe checkout
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setProcessing(true);
    try {
      // PayPal integration
      toast.info('Redirecting to PayPal...');
      // Implement PayPal checkout
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBankTransfer = () => {
    toast.success('Bank details displayed. Please complete the transfer and upload receipt.');
  };

  const handleUPIPayment = () => {
    toast.info('Opening UPI app...');
    // Open UPI deep link
  };

  const handleCashPayment = () => {
    toast.success('Cash payment option selected. Please visit our office.');
  };

  const handleProceedPayment = () => {
    if (!selectedGateway) {
      toast.error('Please select a payment method');
      return;
    }

    switch (selectedGateway) {
      case 'razorpay':
        handleRazorpayPayment();
        break;
      case 'stripe':
        handleStripePayment();
        break;
      case 'paypal':
        handlePayPalPayment();
        break;
      case 'bank_transfer':
        handleBankTransfer();
        break;
      case 'upi':
        handleUPIPayment();
        break;
      case 'cash':
        handleCashPayment();
        break;
      default:
        toast.error('Invalid payment method');
    }
  };

  return (
    <div className="payment-gateway-container">
      <div className="payment-header">
        <h2>💳 Select Payment Method</h2>
        <p>Choose your preferred payment option</p>
      </div>

      {/* Payment Amount Summary */}
      <div className="payment-summary">
        <div className="summary-row">
          <span>Package Amount:</span>
          <strong>₹{amount.toLocaleString()}</strong>
        </div>
        {selectedGateway && paymentGateways.find(g => g.id === selectedGateway)?.processingFee > 0 && (
          <div className="summary-row">
            <span>Processing Fee ({paymentGateways.find(g => g.id === selectedGateway)?.processingFee}%):</span>
            <strong>₹{((amount * paymentGateways.find(g => g.id === selectedGateway)?.processingFee) / 100).toFixed(2)}</strong>
          </div>
        )}
        <div className="summary-row summary-total">
          <span>Total Amount:</span>
          <strong>₹{calculateTotal().toLocaleString()}</strong>
        </div>
      </div>

      {/* Payment Gateways */}
      <div className="payment-gateways-grid">
        {paymentGateways.filter(g => g.enabled).map((gateway) => (
          <div
            key={gateway.id}
            className={`payment-gateway-card ${selectedGateway === gateway.id ? 'selected' : ''}`}
            onClick={() => handlePaymentGatewaySelect(gateway.id)}
          >
            <div className="gateway-icon">{gateway.icon}</div>
            <div className="gateway-info">
              <h3>{gateway.name}</h3>
              <p>{gateway.description}</p>
              {gateway.processingFee > 0 && (
                <span className="gateway-fee">+{gateway.processingFee}% fee</span>
              )}
              {gateway.processingFee === 0 && (
                <span className="gateway-fee-free">No extra fee</span>
              )}
            </div>
            <div className="gateway-radio">
              {selectedGateway === gateway.id && <span>✓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Bank Transfer Details */}
      {showBankDetails && (
        <div className="bank-details-section">
          <h3>🏦 Bank Transfer Details</h3>
          <div className="bank-details-grid">
            <div className="bank-detail-item">
              <span className="detail-label">Account Name:</span>
              <strong>{bankDetails.accountName}</strong>
            </div>
            <div className="bank-detail-item">
              <span className="detail-label">Account Number:</span>
              <strong>{bankDetails.accountNumber}</strong>
              <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText(bankDetails.accountNumber);
                toast.success('Account number copied!');
              }}>📋 Copy</button>
            </div>
            <div className="bank-detail-item">
              <span className="detail-label">IFSC Code:</span>
              <strong>{bankDetails.ifscCode}</strong>
              <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText(bankDetails.ifscCode);
                toast.success('IFSC code copied!');
              }}>📋 Copy</button>
            </div>
            <div className="bank-detail-item">
              <span className="detail-label">Bank Name:</span>
              <strong>{bankDetails.bankName}</strong>
            </div>
            <div className="bank-detail-item">
              <span className="detail-label">Branch:</span>
              <strong>{bankDetails.branch}</strong>
            </div>
            <div className="bank-detail-item">
              <span className="detail-label">Account Type:</span>
              <strong>{bankDetails.accountType}</strong>
            </div>
          </div>

          <div className="upi-section">
            <h4>📱 UPI Payment</h4>
            <div className="upi-details">
              <div className="upi-id">
                <span>UPI ID:</span>
                <strong>{bankDetails.upiId}</strong>
                <button className="copy-btn" onClick={() => {
                  navigator.clipboard.writeText(bankDetails.upiId);
                  toast.success('UPI ID copied!');
                }}>📋 Copy</button>
              </div>
              <div className="qr-code">
                <img src={bankDetails.qrCode} alt="UPI QR Code" />
                <p>Scan to pay via UPI</p>
              </div>
            </div>
          </div>

          <div className="upload-receipt-section">
            <h4>📄 Upload Payment Receipt</h4>
            <p>After completing the transfer, please upload the payment receipt</p>
            <input type="file" accept="image/*,application/pdf" className="file-input" />
            <button className="btn btn-secondary">
              <span>📤</span>
              Upload Receipt
            </button>
          </div>
        </div>
      )}

      {/* Payment Actions */}
      <div className="payment-actions">
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleProceedPayment}
          disabled={!selectedGateway || processing}
        >
          {processing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span>💳</span>
              Proceed to Pay ₹{calculateTotal().toLocaleString()}
            </>
          )}
        </button>
      </div>

      {/* Security Badge */}
      <div className="security-badge">
        <span>🔒</span>
        <p>Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
};

export default PaymentGateway;
