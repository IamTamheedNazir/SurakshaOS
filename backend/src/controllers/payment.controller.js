const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const Stripe = require('stripe');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

/**
 * @desc    Get active payment gateway settings
 */
const getPaymentGatewaySettings = async (gatewayName) => {
  const [settings] = await db.query(
    'SELECT * FROM payment_gateway_settings WHERE gateway_name = ? AND enabled = true',
    [gatewayName]
  );
  return settings[0] || null;
};

/**
 * @desc    Create payment order (Razorpay/Stripe/PayPal)
 * @route   POST /api/payments/create-order
 * @access  Private
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { booking_id, amount, currency, payment_method } = req.body;
    
    // Validate booking
    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [booking_id, userId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookings[0];
    
    // Get payment gateway settings
    const gatewaySettings = await getPaymentGatewaySettings(payment_method);
    
    if (!gatewaySettings) {
      return res.status(400).json({
        success: false,
        message: `Payment method ${payment_method} is not available`
      });
    }
    
    let paymentOrder;
    let gatewayPaymentId;
    
    // Create order based on payment method
    switch (payment_method) {
      case 'razorpay':
        const razorpay = new Razorpay({
          key_id: gatewaySettings.api_key,
          key_secret: gatewaySettings.api_secret
        });
        
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(amount * 100), // Convert to paise
          currency: currency,
          receipt: `receipt_${booking.booking_number}`,
          notes: {
            booking_id: booking_id,
            booking_number: booking.booking_number
          }
        });
        
        gatewayPaymentId = razorpayOrder.id;
        paymentOrder = razorpayOrder;
        break;
        
      case 'stripe':
        const stripe = Stripe(gatewaySettings.api_secret);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata: {
            booking_id: booking_id,
            booking_number: booking.booking_number
          }
        });
        
        gatewayPaymentId = paymentIntent.id;
        paymentOrder = paymentIntent;
        break;
        
      case 'paypal':
        // PayPal integration
        gatewayPaymentId = `paypal_${uuidv4()}`;
        paymentOrder = {
          id: gatewayPaymentId,
          amount: amount,
          currency: currency
        };
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method'
        });
    }
    
    // Create payment record
    const paymentId = uuidv4();
    await db.query(`
      INSERT INTO payments (
        id, payment_id, booking_id, user_id, vendor_id,
        amount, currency, payment_method, payment_gateway,
        gateway_payment_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      paymentId,
      `PAY${Date.now()}`,
      booking_id,
      userId,
      booking.vendor_id,
      amount,
      currency,
      payment_method,
      payment_method,
      gatewayPaymentId
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        payment_id: paymentId,
        gateway_order_id: gatewayPaymentId,
        amount: amount,
        currency: currency,
        payment_method: payment_method,
        order_details: paymentOrder,
        api_key: gatewaySettings.api_key // For client-side integration
      }
    });
    
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

/**
 * @desc    Verify payment after completion
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const userId = req.user.id;
    const {
      payment_id,
      gateway_payment_id,
      gateway_order_id,
      signature,
      booking_id,
      payment_method
    } = req.body;
    
    // Get payment record
    const [payments] = await connection.query(
      'SELECT * FROM payments WHERE id = ? AND user_id = ?',
      [payment_id, userId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const payment = payments[0];
    
    // Get gateway settings
    const gatewaySettings = await getPaymentGatewaySettings(payment_method);
    
    let isValid = false;
    
    // Verify signature based on payment method
    switch (payment_method) {
      case 'razorpay':
        const razorpaySignature = crypto
          .createHmac('sha256', gatewaySettings.api_secret)
          .update(`${gateway_order_id}|${gateway_payment_id}`)
          .digest('hex');
        
        isValid = razorpaySignature === signature;
        break;
        
      case 'stripe':
        // Stripe verification
        const stripe = Stripe(gatewaySettings.api_secret);
        const paymentIntent = await stripe.paymentIntents.retrieve(gateway_payment_id);
        isValid = paymentIntent.status === 'succeeded';
        break;
        
      case 'paypal':
        // PayPal verification
        isValid = true; // Implement PayPal verification
        break;
        
      default:
        isValid = false;
    }
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
    
    // Update payment status
    await connection.query(`
      UPDATE payments
      SET status = 'completed', payment_date = NOW()
      WHERE id = ?
    `, [payment_id]);
    
    // Update booking payment status
    await connection.query(`
      UPDATE bookings
      SET payment_status = 'paid', booking_status = 'confirmed'
      WHERE id = ?
    `, [booking_id]);
    
    // Get booking details
    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [booking_id]
    );
    const booking = bookings[0];
    
    // Calculate commission
    const [commissionRules] = await connection.query(`
      SELECT commission_percentage FROM commission_rules
      WHERE (rule_type = 'vendor' AND target_id = ?)
         OR (rule_type = 'global' AND enabled = true)
      ORDER BY priority DESC
      LIMIT 1
    `, [booking.vendor_id]);
    
    const commissionRate = commissionRules.length > 0 
      ? commissionRules[0].commission_percentage 
      : 15;
    
    const commissionAmount = (payment.amount * commissionRate) / 100;
    const vendorAmount = payment.amount - commissionAmount;
    
    // Update vendor revenue
    await connection.query(`
      UPDATE vendors
      SET total_revenue = total_revenue + ?,
          total_bookings = total_bookings + 1
      WHERE id = ?
    `, [vendorAmount, booking.vendor_id]);
    
    // Create activity log
    await connection.query(`
      INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, data)
      VALUES (?, ?, 'payment_completed', 'payment', ?, ?)
    `, [
      uuidv4(),
      userId,
      payment_id,
      JSON.stringify({
        amount: payment.amount,
        booking_number: booking.booking_number
      })
    ]);
    
    // Create notification
    await connection.query(`
      INSERT INTO notifications (id, user_id, type, title, message, data)
      VALUES (?, ?, 'payment_success', 'Payment Successful', ?, ?)
    `, [
      uuidv4(),
      userId,
      `Your payment of ${payment.currency} ${payment.amount} has been received successfully.`,
      JSON.stringify({ booking_id: booking_id, payment_id: payment_id })
    ]);
    
    await connection.commit();
    
    // Send confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Payment Confirmation - ${booking.booking_number}`,
        template: 'payment_success',
        data: {
          booking_number: booking.booking_number,
          amount: payment.amount,
          currency: payment.currency,
          payment_id: payment.payment_id
        }
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }
    
    // Send SMS
    if (req.user.phone) {
      try {
        await sendSMS({
          to: req.user.phone,
          message: `Payment successful! ${payment.currency} ${payment.amount} received for booking ${booking.booking_number}.`
        });
      } catch (smsError) {
        console.error('SMS send error:', smsError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment_id: payment_id,
        booking_id: booking_id,
        status: 'completed',
        amount: payment.amount,
        currency: payment.currency
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * @desc    Razorpay webhook handler
 * @route   POST /api/payments/razorpay/webhook
 * @access  Public (Webhook)
 */
exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    // Get Razorpay settings
    const gatewaySettings = await getPaymentGatewaySettings('razorpay');
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', gatewaySettings.webhook_secret)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
    
    const event = req.body.event;
    const payload = req.body.payload.payment.entity;
    
    // Handle different events
    switch (event) {
      case 'payment.captured':
        // Update payment status
        await db.query(`
          UPDATE payments
          SET status = 'completed', payment_date = NOW()
          WHERE gateway_payment_id = ?
        `, [payload.id]);
        break;
        
      case 'payment.failed':
        await db.query(`
          UPDATE payments
          SET status = 'failed'
          WHERE gateway_payment_id = ?
        `, [payload.id]);
        break;
    }
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/payments/stripe/webhook
 * @access  Public (Webhook)
 */
exports.stripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const gatewaySettings = await getPaymentGatewaySettings('stripe');
    const stripe = Stripe(gatewaySettings.api_secret);
    
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      gatewaySettings.webhook_secret
    );
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await db.query(`
          UPDATE payments
          SET status = 'completed', payment_date = NOW()
          WHERE gateway_payment_id = ?
        `, [paymentIntent.id]);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await db.query(`
          UPDATE payments
          SET status = 'failed'
          WHERE gateway_payment_id = ?
        `, [failedPayment.id]);
        break;
    }
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

/**
 * @desc    PayPal webhook handler
 * @route   POST /api/payments/paypal/webhook
 * @access  Public (Webhook)
 */
exports.paypalWebhook = async (req, res) => {
  try {
    // Implement PayPal webhook verification
    const event = req.body;
    
    // Handle PayPal events
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

/**
 * @desc    Get payment details
 * @route   GET /api/payments/:id
 * @access  Private
 */
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const [payments] = await db.query(`
      SELECT 
        p.*,
        b.booking_number,
        b.package_id,
        pkg.title as package_title
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN packages pkg ON b.package_id = pkg.id
      WHERE p.id = ? AND p.user_id = ?
    `, [id, userId]);
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payments[0]
    });
    
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

/**
 * @desc    Get all payments for a booking
 * @route   GET /api/payments/booking/:bookingId
 * @access  Private
 */
exports.getBookingPayments = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    
    // Verify booking belongs to user
    const [bookings] = await db.query(
      'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC',
      [bookingId]
    );
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
    
  } catch (error) {
    console.error('Get booking payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

/**
 * @desc    Process refund
 * @route   POST /api/payments/:id/refund
 * @access  Private (Admin/Vendor)
 */
exports.processRefund = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { amount, reason } = req.body;
    
    // Get payment details
    const [payments] = await connection.query(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const payment = payments[0];
    
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }
    
    // Get gateway settings
    const gatewaySettings = await getPaymentGatewaySettings(payment.payment_method);
    
    let refundResult;
    
    // Process refund based on payment method
    switch (payment.payment_method) {
      case 'razorpay':
        const razorpay = new Razorpay({
          key_id: gatewaySettings.api_key,
          key_secret: gatewaySettings.api_secret
        });
        
        refundResult = await razorpay.payments.refund(payment.gateway_payment_id, {
          amount: Math.round(amount * 100),
          notes: { reason: reason }
        });
        break;
        
      case 'stripe':
        const stripe = Stripe(gatewaySettings.api_secret);
        refundResult = await stripe.refunds.create({
          payment_intent: payment.gateway_payment_id,
          amount: Math.round(amount * 100)
        });
        break;
    }
    
    // Update payment status
    await connection.query(`
      UPDATE payments
      SET status = 'refunded'
      WHERE id = ?
    `, [id]);
    
    // Update booking
    await connection.query(`
      UPDATE bookings
      SET payment_status = 'refunded'
      WHERE id = ?
    `, [payment.booking_id]);
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        payment_id: id,
        refund_amount: amount,
        refund_details: refundResult
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * @desc    Get available payment methods
 * @route   GET /api/payments/methods/available
 * @access  Public
 */
exports.getAvailablePaymentMethods = async (req, res) => {
  try {
    const [methods] = await db.query(`
      SELECT 
        id,
        gateway_name,
        display_name,
        transaction_fee_percentage,
        transaction_fee_fixed,
        mode
      FROM payment_gateway_settings
      WHERE enabled = true
      ORDER BY display_name ASC
    `);
    
    res.status(200).json({
      success: true,
      count: methods.length,
      data: methods
    });
    
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message
    });
  }
};

// Export remaining functions (to be implemented)
exports.getReceipt = async (req, res) => { /* Implementation */ };
exports.downloadReceipt = async (req, res) => { /* Implementation */ };
exports.createPartialPayment = async (req, res) => { /* Implementation */ };
exports.verifyBankTransfer = async (req, res) => { /* Implementation */ };
exports.verifyUPIPayment = async (req, res) => { /* Implementation */ };
exports.getUserPaymentHistory = async (req, res) => { /* Implementation */ };
exports.resendReceipt = async (req, res) => { /* Implementation */ };
exports.checkPaymentStatus = async (req, res) => { /* Implementation */ };
