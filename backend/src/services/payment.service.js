const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const crypto = require('crypto');
const db = require('../config/database');

/**
 * Payment Service
 * Handles payment gateway integrations
 */

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Initialize PayPal
const paypalEnvironment = process.env.PAYPAL_MODE === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

/**
 * RAZORPAY INTEGRATION
 */

// Create Razorpay order
exports.createRazorpayOrder = async (bookingId, amount, currency = 'INR') => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: currency,
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };

    const order = await razorpayInstance.orders.create(options);

    // Save payment record
    await db.query(
      `INSERT INTO payments (
        booking_id, payment_method, amount, currency, 
        gateway_order_id, status, created_at
      ) VALUES ($1, 'razorpay', $2, $3, $4, 'pending', NOW())`,
      [bookingId, amount, currency, order.id]
    );

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (paymentData) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = paymentData;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Update payment record
    const result = await db.query(
      `UPDATE payments SET
        gateway_payment_id = $1,
        status = 'completed',
        paid_at = NOW(),
        updated_at = NOW()
      WHERE gateway_order_id = $2
      RETURNING *`,
      [razorpay_payment_id, razorpay_order_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment record not found');
    }

    const payment = result.rows[0];

    // Update booking status
    await updateBookingPaymentStatus(payment.booking_id);

    return {
      success: true,
      payment: payment
    };
  } catch (error) {
    console.error('Razorpay verification error:', error);
    throw error;
  }
};

/**
 * STRIPE INTEGRATION
 */

// Create Stripe payment intent
exports.createStripePaymentIntent = async (bookingId, amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        booking_id: bookingId
      }
    });

    // Save payment record
    await db.query(
      `INSERT INTO payments (
        booking_id, payment_method, amount, currency,
        gateway_order_id, status, created_at
      ) VALUES ($1, 'stripe', $2, $3, $4, 'pending', NOW())`,
      [bookingId, amount, currency, paymentIntent.id]
    );

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw new Error('Failed to create Stripe payment intent');
  }
};

// Verify Stripe payment
exports.verifyStripePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    // Update payment record
    const result = await db.query(
      `UPDATE payments SET
        gateway_payment_id = $1,
        status = 'completed',
        paid_at = NOW(),
        updated_at = NOW()
      WHERE gateway_order_id = $2
      RETURNING *`,
      [paymentIntent.id, paymentIntent.id]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment record not found');
    }

    const payment = result.rows[0];

    // Update booking status
    await updateBookingPaymentStatus(payment.booking_id);

    return {
      success: true,
      payment: payment
    };
  } catch (error) {
    console.error('Stripe verification error:', error);
    throw error;
  }
};

/**
 * PAYPAL INTEGRATION
 */

// Create PayPal order
exports.createPayPalOrder = async (bookingId, amount, currency = 'USD') => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `booking_${bookingId}`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        }
      }]
    });

    const order = await paypalClient.execute(request);

    // Save payment record
    await db.query(
      `INSERT INTO payments (
        booking_id, payment_method, amount, currency,
        gateway_order_id, status, created_at
      ) VALUES ($1, 'paypal', $2, $3, $4, 'pending', NOW())`,
      [bookingId, amount, currency, order.result.id]
    );

    return {
      success: true,
      orderId: order.result.id
    };
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw new Error('Failed to create PayPal order');
  }
};

// Capture PayPal payment
exports.capturePayPalPayment = async (orderId) => {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      throw new Error('Payment not completed');
    }

    // Update payment record
    const result = await db.query(
      `UPDATE payments SET
        gateway_payment_id = $1,
        status = 'completed',
        paid_at = NOW(),
        updated_at = NOW()
      WHERE gateway_order_id = $2
      RETURNING *`,
      [capture.result.id, orderId]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment record not found');
    }

    const payment = result.rows[0];

    // Update booking status
    await updateBookingPaymentStatus(payment.booking_id);

    return {
      success: true,
      payment: payment
    };
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw error;
  }
};

/**
 * REFUND PROCESSING
 */

// Process refund
exports.processRefund = async (paymentId, amount, reason) => {
  try {
    const paymentQuery = 'SELECT * FROM payments WHERE id = $1';
    const paymentResult = await db.query(paymentQuery, [paymentId]);

    if (paymentResult.rows.length === 0) {
      throw new Error('Payment not found');
    }

    const payment = paymentResult.rows[0];
    let refundResult;

    // Process refund based on payment method
    switch (payment.payment_method) {
      case 'razorpay':
        refundResult = await razorpayInstance.payments.refund(
          payment.gateway_payment_id,
          {
            amount: Math.round(amount * 100),
            notes: { reason }
          }
        );
        break;

      case 'stripe':
        refundResult = await stripe.refunds.create({
          payment_intent: payment.gateway_payment_id,
          amount: Math.round(amount * 100),
          reason: 'requested_by_customer'
        });
        break;

      case 'paypal':
        const refundRequest = new paypal.payments.CapturesRefundRequest(payment.gateway_payment_id);
        refundRequest.requestBody({
          amount: {
            value: amount.toFixed(2),
            currency_code: payment.currency
          }
        });
        refundResult = await paypalClient.execute(refundRequest);
        break;

      default:
        throw new Error('Unsupported payment method');
    }

    // Create refund record
    await db.query(
      `INSERT INTO refunds (
        payment_id, booking_id, amount, reason,
        gateway_refund_id, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, 'completed', NOW())`,
      [paymentId, payment.booking_id, amount, reason, refundResult.id]
    );

    // Update payment status
    await db.query(
      'UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2',
      [amount >= payment.amount ? 'refunded' : 'partially_refunded', paymentId]
    );

    // Update booking status
    await db.query(
      "UPDATE bookings SET status = 'refunded', updated_at = NOW() WHERE id = $1",
      [payment.booking_id]
    );

    return {
      success: true,
      refundId: refundResult.id,
      amount: amount
    };
  } catch (error) {
    console.error('Refund processing error:', error);
    throw error;
  }
};

/**
 * INSTALLMENT MANAGEMENT
 */

// Create installment schedule
exports.createInstallmentSchedule = async (bookingId, totalAmount, downPayment, installments) => {
  try {
    const remainingAmount = totalAmount - downPayment;
    const installmentAmount = remainingAmount / installments;

    const schedules = [];
    for (let i = 1; i <= installments; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      const result = await db.query(
        `INSERT INTO payment_installments (
          booking_id, installment_number, amount, due_date, status, created_at
        ) VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING *`,
        [bookingId, i, installmentAmount, dueDate]
      );

      schedules.push(result.rows[0]);
    }

    return {
      success: true,
      schedules: schedules
    };
  } catch (error) {
    console.error('Installment schedule error:', error);
    throw error;
  }
};

// Get installment schedule
exports.getInstallmentSchedule = async (bookingId) => {
  try {
    const result = await db.query(
      'SELECT * FROM payment_installments WHERE booking_id = $1 ORDER BY installment_number',
      [bookingId]
    );

    return {
      success: true,
      installments: result.rows
    };
  } catch (error) {
    console.error('Get installment schedule error:', error);
    throw error;
  }
};

/**
 * HELPER FUNCTIONS
 */

// Update booking payment status
async function updateBookingPaymentStatus(bookingId) {
  try {
    // Get total paid amount
    const paidQuery = `
      SELECT SUM(amount) as paid_amount
      FROM payments
      WHERE booking_id = $1 AND status = 'completed'
    `;
    const paidResult = await db.query(paidQuery, [bookingId]);
    const paidAmount = parseFloat(paidResult.rows[0].paid_amount) || 0;

    // Get booking total
    const bookingQuery = 'SELECT total_amount FROM bookings WHERE id = $1';
    const bookingResult = await db.query(bookingQuery, [bookingId]);
    const totalAmount = parseFloat(bookingResult.rows[0].total_amount);

    // Update booking status
    let status = 'pending';
    if (paidAmount >= totalAmount) {
      status = 'confirmed';
    } else if (paidAmount > 0) {
      status = 'partially_paid';
    }

    await db.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, bookingId]
    );
  } catch (error) {
    console.error('Update booking payment status error:', error);
  }
}

// Get payment by ID
exports.getPaymentById = async (paymentId) => {
  try {
    const result = await db.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    return result.rows[0];
  } catch (error) {
    console.error('Get payment error:', error);
    throw error;
  }
};

// Get payments by booking
exports.getPaymentsByBooking = async (bookingId) => {
  try {
    const result = await db.query(
      'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC',
      [bookingId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get payments error:', error);
    throw error;
  }
};

module.exports = exports;
