<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Create a new payment.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'payment_gateway' => 'required|in:razorpay,stripe,paypal',
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::findOrFail($request->booking_id);

        // Authorization check
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if amount is valid
        $remainingAmount = $booking->total_amount - $booking->paid_amount;
        if ($request->amount > $remainingAmount) {
            return response()->json([
                'success' => false,
                'message' => 'Payment amount exceeds remaining balance'
            ], 400);
        }

        // Create payment record
        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'payment_gateway' => $request->payment_gateway,
            'amount' => $request->amount,
            'currency' => config('app.default_currency', 'INR'),
            'status' => 'pending',
        ]);

        // Generate payment gateway order
        $orderData = $this->createGatewayOrder($payment);

        return response()->json([
            'success' => true,
            'message' => 'Payment initiated successfully',
            'data' => [
                'payment' => $payment,
                'order' => $orderData
            ]
        ], 201);
    }

    /**
     * Create payment gateway order.
     */
    private function createGatewayOrder($payment)
    {
        switch ($payment->payment_gateway) {
            case 'razorpay':
                return $this->createRazorpayOrder($payment);
            case 'stripe':
                return $this->createStripeOrder($payment);
            case 'paypal':
                return $this->createPaypalOrder($payment);
            default:
                return null;
        }
    }

    /**
     * Create Razorpay order.
     */
    private function createRazorpayOrder($payment)
    {
        try {
            $api = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $order = $api->order->create([
                'receipt' => $payment->transaction_id,
                'amount' => $payment->amount * 100, // Amount in paise
                'currency' => $payment->currency,
                'notes' => [
                    'booking_id' => $payment->booking_id,
                    'user_id' => $payment->user_id,
                ]
            ]);

            return [
                'order_id' => $order['id'],
                'amount' => $order['amount'],
                'currency' => $order['currency'],
                'key' => config('services.razorpay.key'),
            ];
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create Stripe payment intent.
     */
    private function createStripeOrder($payment)
    {
        try {
            \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

            $intent = \Stripe\PaymentIntent::create([
                'amount' => $payment->amount * 100, // Amount in cents
                'currency' => strtolower($payment->currency),
                'metadata' => [
                    'booking_id' => $payment->booking_id,
                    'user_id' => $payment->user_id,
                    'transaction_id' => $payment->transaction_id,
                ],
            ]);

            return [
                'client_secret' => $intent->client_secret,
                'publishable_key' => config('services.stripe.key'),
            ];
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create PayPal order.
     */
    private function createPaypalOrder($payment)
    {
        // PayPal integration logic
        return [
            'order_id' => 'PAYPAL-' . $payment->transaction_id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
        ];
    }

    /**
     * Verify payment.
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id',
            'gateway_response' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $payment = Payment::findOrFail($request->payment_id);

        // Verify based on gateway
        $verified = $this->verifyGatewayPayment($payment, $request->gateway_response);

        if ($verified) {
            $payment->markAsSuccessful();
            $payment->update([
                'gateway_response' => $request->gateway_response
            ]);

            // Update booking paid amount
            $booking = $payment->booking;
            $booking->increment('paid_amount', $payment->amount);

            // Update payment status
            if ($booking->paid_amount >= $booking->total_amount) {
                $booking->update(['payment_status' => 'paid']);
            } else {
                $booking->update(['payment_status' => 'partial']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'data' => $payment->load('booking')
            ]);
        } else {
            $payment->markAsFailed();

            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed'
            ], 400);
        }
    }

    /**
     * Verify gateway payment.
     */
    private function verifyGatewayPayment($payment, $gatewayResponse)
    {
        switch ($payment->payment_gateway) {
            case 'razorpay':
                return $this->verifyRazorpayPayment($payment, $gatewayResponse);
            case 'stripe':
                return $this->verifyStripePayment($payment, $gatewayResponse);
            case 'paypal':
                return $this->verifyPaypalPayment($payment, $gatewayResponse);
            default:
                return false;
        }
    }

    /**
     * Verify Razorpay payment.
     */
    private function verifyRazorpayPayment($payment, $response)
    {
        try {
            $api = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $attributes = [
                'razorpay_order_id' => $response['razorpay_order_id'],
                'razorpay_payment_id' => $response['razorpay_payment_id'],
                'razorpay_signature' => $response['razorpay_signature']
            ];

            $api->utility->verifyPaymentSignature($attributes);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Verify Stripe payment.
     */
    private function verifyStripePayment($payment, $response)
    {
        try {
            \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
            $intent = \Stripe\PaymentIntent::retrieve($response['payment_intent_id']);
            return $intent->status === 'succeeded';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Verify PayPal payment.
     */
    private function verifyPaypalPayment($payment, $response)
    {
        // PayPal verification logic
        return true;
    }

    /**
     * Get payment history.
     */
    public function history(Request $request)
    {
        $query = Payment::with(['booking.package']);

        if (auth()->user()->isCustomer()) {
            $query->where('user_id', auth()->id());
        }

        $payments = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Razorpay webhook handler.
     */
    public function razorpayWebhook(Request $request)
    {
        $webhookSecret = config('services.razorpay.webhook_secret');
        $webhookSignature = $request->header('X-Razorpay-Signature');

        // Verify webhook signature
        $expectedSignature = hash_hmac('sha256', $request->getContent(), $webhookSecret);

        if ($webhookSignature !== $expectedSignature) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $event = $request->all();

        // Handle different events
        switch ($event['event']) {
            case 'payment.captured':
                // Handle successful payment
                break;
            case 'payment.failed':
                // Handle failed payment
                break;
            case 'refund.created':
                // Handle refund
                break;
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Stripe webhook handler.
     */
    public function stripeWebhook(Request $request)
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                $webhookSecret
            );

            // Handle different events
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    // Handle successful payment
                    break;
                case 'payment_intent.payment_failed':
                    // Handle failed payment
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * PayPal webhook handler.
     */
    public function paypalWebhook(Request $request)
    {
        // PayPal webhook logic
        return response()->json(['status' => 'success']);
    }
}
