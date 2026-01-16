<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation - {{ $booking_reference }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .header-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .customer-info h2 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .customer-info p {
            margin: 3px 0;
        }
        
        .pnr-box {
            border: 2px solid #000;
            padding: 15px;
            text-align: center;
            min-width: 150px;
        }
        
        .pnr-box .airline {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .pnr-box .pnr {
            font-size: 20px;
            font-weight: bold;
        }
        
        .trip-info {
            text-align: right;
            margin-top: 10px;
        }
        
        .trip-info h3 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .trip-info .trip-type {
            font-weight: bold;
            color: #000;
        }
        
        .trip-info .refundable {
            color: #28a745;
            font-weight: bold;
        }
        
        .section {
            margin: 20px 0;
        }
        
        .section-title {
            background: #000;
            color: #fff;
            padding: 8px 15px;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        table th {
            background: #f5f5f5;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
        }
        
        table td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        
        .highlight {
            color: #28a745;
            font-weight: bold;
        }
        
        .warning {
            color: #dc3545;
            font-weight: bold;
        }
        
        .fare-summary {
            width: 50%;
            margin-left: auto;
        }
        
        .fare-summary td {
            padding: 8px;
        }
        
        .fare-summary .total {
            font-weight: bold;
            font-size: 14px;
        }
        
        .payment-summary {
            background: #f9f9f9;
            padding: 15px;
            margin: 20px 0;
        }
        
        .payment-summary table td {
            border: none;
            padding: 5px 10px;
        }
        
        .travel-tips {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        
        .tip {
            flex: 1;
            text-align: center;
            padding: 10px;
        }
        
        .tip h4 {
            font-size: 12px;
            margin-bottom: 5px;
        }
        
        .tip p {
            font-size: 10px;
            color: #666;
        }
        
        .terms {
            margin-top: 20px;
            font-size: 10px;
        }
        
        .terms h3 {
            font-size: 12px;
            margin-bottom: 10px;
        }
        
        .terms ol {
            margin-left: 20px;
        }
        
        .terms li {
            margin: 5px 0;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #000;
            text-align: center;
        }
        
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Booking Confirmation</h1>
            
            <div class="header-info">
                <div class="customer-info">
                    <h2>{{ $customer->first_name }} {{ $customer->last_name }}</h2>
                    <p>Mobile No: {{ $customer->mobile }}</p>
                    @if($customer->email)
                    <p>Email: {{ $customer->email }}</p>
                    @endif
                </div>
                
                <div>
                    <div class="pnr-box">
                        <div class="airline">{{ $pnr->airline_code ?? substr($pnr->airline_name, 0, 2) }}</div>
                        <div class="pnr">{{ $pnr_code }}</div>
                    </div>
                    
                    <div class="trip-info">
                        <h3>{{ $from }} - {{ $to }}</h3>
                        <p class="trip-type">ONE_WAY</p>
                        <p class="refundable">Refundable</p>
                        <p>{{ $departure_date }}, {{ $passengers }} Passenger(s)</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Booking Details -->
        <div class="section">
            <div class="section-title">BOOKING DETAILS</div>
            <table>
                <tr>
                    <th>Booking Reference</th>
                    <th>PNR</th>
                    <th>Booking Status</th>
                    <th>Date of Booking</th>
                    <th>Payment Status</th>
                </tr>
                <tr>
                    <td>{{ $booking_reference }}</td>
                    <td>{{ $pnr_code }}</td>
                    <td class="highlight">Confirm</td>
                    <td>{{ $booking_date }}</td>
                    <td class="highlight">{{ ucfirst($payment_status) }}</td>
                </tr>
            </table>
        </div>
        
        <!-- Flight Details -->
        <div class="section">
            <div class="section-title">FLIGHT DETAILS</div>
            <table>
                <tr>
                    <th>Flight</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Departure Date</th>
                    <th>Departs</th>
                    <th>Arrival Date</th>
                    <th>Arrives</th>
                </tr>
                <tr>
                    <td>{{ $flight_number }}</td>
                    <td>{{ $from }}</td>
                    <td>{{ $to }}</td>
                    <td class="highlight">{{ $departure_date }}</td>
                    <td>{{ $departure_time }}</td>
                    <td>{{ $arrival_date }}</td>
                    <td>{{ $arrival_time }}</td>
                </tr>
            </table>
            <p class="warning">⚠ Check-in counters close 60 minutes prior to departure.</p>
        </div>
        
        <!-- Passenger Details -->
        <div class="section">
            <div class="section-title">PASSENGER DETAILS</div>
            <table>
                <tr>
                    <th>Passenger Name</th>
                    <th>Type</th>
                    <th>Baggage Allowance (Per pax)</th>
                </tr>
                <tr>
                    <td>{{ $customer->first_name }} {{ $customer->last_name }}</td>
                    <td>Adult</td>
                    <td>Check-In: 15 KG, Cabin: 7 KG</td>
                </tr>
            </table>
            <p class="warning">✈️ Web check-in is mandatory and must be completed at least 24 hours before departure.</p>
        </div>
        
        <!-- Fare Summary -->
        <div class="section">
            <div class="section-title">FARE SUMMARY</div>
            <table class="fare-summary">
                <tr>
                    <td>Basic</td>
                    <td style="text-align: right;">INR {{ number_format($total_amount * 0.71, 2) }}</td>
                </tr>
                <tr>
                    <td>Taxes</td>
                    <td style="text-align: right;">INR {{ number_format($total_amount * 0.29, 2) }}</td>
                </tr>
                <tr class="total">
                    <td>Grand Total:</td>
                    <td style="text-align: right;">INR {{ number_format($total_amount, 2) }}</td>
                </tr>
            </table>
        </div>
        
        <!-- Payment Summary -->
        <div class="section">
            <div class="section-title">PAYMENT SUMMARY</div>
            <div class="payment-summary">
                <table>
                    <tr>
                        <td><strong>ID</strong></td>
                        <td>{{ $sale->invoice_number }}</td>
                    </tr>
                    <tr>
                        <td><strong>Amount</strong></td>
                        <td>INR {{ number_format($total_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Date</strong></td>
                        <td>{{ $sale->created_at->format('Y-m-d H:i:s') }}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Status</strong></td>
                        <td class="highlight">{{ ucfirst($payment_status) }}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Mode</strong></td>
                        <td>{{ ucfirst($sale->sale_channel) }}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <!-- Travel Tips -->
        <div class="section">
            <h3 style="margin-bottom: 15px;">Travel Tips:</h3>
            <div class="travel-tips">
                <div class="tip">
                    <h4>Check-in online</h4>
                    <p>Check-in online between 48 hours to 60 mins before your flight</p>
                </div>
                <div class="tip">
                    <h4>Arrive early at the airport</h4>
                    <p>Reach the airport at least 120 minutes before your flight</p>
                </div>
                <div class="tip">
                    <h4>Check-in at the airport</h4>
                    <p>Check-in counter will close 60 mins prior to departure</p>
                </div>
                <div class="tip">
                    <h4>Baggage allowance</h4>
                    <p>Check-in: 15 KG, Cabin: 7 KG per person</p>
                </div>
                <div class="tip">
                    <h4>Board your flight</h4>
                    <p>Boarding gate will close 25 mins prior to departure</p>
                </div>
            </div>
        </div>
        
        <!-- Terms and Conditions -->
        <div class="terms">
            <h3>Terms and Conditions</h3>
            <ol>
                <li>For more information on your itinerary, please contact our support team</li>
                <li>To read our conditions of carriage as per Indian regulations, please visit our website</li>
                <li>For details on the Passenger Charter issued by the Ministry of Civil Aviation (MoCA), please contact us</li>
            </ol>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Your Travel Company Name</strong></p>
            <p>📞 +91 1234567890 | ✉️ support@yourcompany.com</p>
            <p>www.yourcompany.com</p>
        </div>
    </div>
</body>
</html>
