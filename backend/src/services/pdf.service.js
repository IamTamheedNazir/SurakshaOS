const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * PDF Service
 * Generates invoices, tickets, and receipts
 */

const STORAGE_PATH = process.env.UPLOAD_DIR || './storage/uploads';
const PDF_PATH = path.join(STORAGE_PATH, 'pdfs');

// Ensure PDF directory exists
if (!fs.existsSync(PDF_PATH)) {
  fs.mkdirSync(PDF_PATH, { recursive: true });
}

/**
 * Generate Invoice PDF
 */
exports.generateInvoice = async (bookingData) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `invoice_${bookingData.booking_number}_${uuidv4()}.pdf`;
      const filepath = path.join(PDF_PATH, filename);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();

      // Company Info
      doc.fontSize(12).text('UmrahConnect', { align: 'left' });
      doc.fontSize(10).text('Your Trusted Umrah Partner');
      doc.text('Email: info@umrahconnect.com');
      doc.text('Phone: +91 1234567890');
      doc.moveDown();

      // Invoice Details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${bookingData.booking_number}`);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Due Date: ${bookingData.due_date || 'Immediate'}`);
      doc.moveDown();

      // Customer Details
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.fontSize(10);
      doc.text(`${bookingData.customer_name}`);
      doc.text(`Email: ${bookingData.customer_email}`);
      doc.text(`Phone: ${bookingData.customer_phone}`);
      doc.moveDown();

      // Package Details
      doc.fontSize(12).text('Package Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Package: ${bookingData.package_title}`);
      doc.text(`Destination: ${bookingData.destination}`);
      doc.text(`Duration: ${bookingData.duration} days`);
      doc.text(`Departure: ${new Date(bookingData.departure_date).toLocaleDateString()}`);
      doc.text(`Return: ${new Date(bookingData.return_date).toLocaleDateString()}`);
      doc.text(`Number of Travelers: ${bookingData.number_of_travelers}`);
      doc.moveDown();

      // Pricing Table
      doc.fontSize(12).text('Pricing Breakdown:', { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const itemX = 50;
      const priceX = 450;

      // Table Header
      doc.fontSize(10).text('Item', itemX, tableTop, { bold: true });
      doc.text('Amount', priceX, tableTop);
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let currentY = tableTop + 25;

      // Package Price
      doc.text('Package Price', itemX, currentY);
      doc.text(`₹${bookingData.package_price.toFixed(2)}`, priceX, currentY);
      currentY += 20;

      // Additional charges
      if (bookingData.additional_charges > 0) {
        doc.text('Additional Charges', itemX, currentY);
        doc.text(`₹${bookingData.additional_charges.toFixed(2)}`, priceX, currentY);
        currentY += 20;
      }

      // Discount
      if (bookingData.discount > 0) {
        doc.text('Discount', itemX, currentY);
        doc.text(`-₹${bookingData.discount.toFixed(2)}`, priceX, currentY);
        currentY += 20;
      }

      // Tax
      if (bookingData.tax > 0) {
        doc.text('Tax (GST)', itemX, currentY);
        doc.text(`₹${bookingData.tax.toFixed(2)}`, priceX, currentY);
        currentY += 20;
      }

      // Total
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      currentY += 10;
      doc.fontSize(12).text('Total Amount', itemX, currentY, { bold: true });
      doc.text(`₹${bookingData.total_amount.toFixed(2)}`, priceX, currentY, { bold: true });
      currentY += 20;

      // Paid Amount
      if (bookingData.paid_amount > 0) {
        doc.fontSize(10).text('Paid Amount', itemX, currentY);
        doc.text(`₹${bookingData.paid_amount.toFixed(2)}`, priceX, currentY);
        currentY += 20;
      }

      // Balance Due
      const balanceDue = bookingData.total_amount - (bookingData.paid_amount || 0);
      if (balanceDue > 0) {
        doc.fontSize(12).text('Balance Due', itemX, currentY, { bold: true });
        doc.text(`₹${balanceDue.toFixed(2)}`, priceX, currentY, { bold: true });
      }

      doc.moveDown(2);

      // Payment Instructions
      doc.fontSize(10).text('Payment Instructions:', { underline: true });
      doc.fontSize(9);
      doc.text('Please make payment to the following account:');
      doc.text('Bank: HDFC Bank');
      doc.text('Account Name: UmrahConnect Pvt Ltd');
      doc.text('Account Number: 1234567890');
      doc.text('IFSC Code: HDFC0001234');
      doc.moveDown();

      // Terms & Conditions
      doc.fontSize(10).text('Terms & Conditions:', { underline: true });
      doc.fontSize(8);
      doc.text('1. Full payment must be received before departure.');
      doc.text('2. Cancellation charges apply as per our cancellation policy.');
      doc.text('3. Prices are subject to change without prior notice.');
      doc.text('4. All disputes subject to jurisdiction of courts in India.');

      // Footer
      doc.fontSize(8).text('Thank you for choosing UmrahConnect!', { align: 'center' });
      doc.text('May Allah accept your Umrah', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          url: `/uploads/pdfs/${filename}`
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate Booking Ticket PDF
 */
exports.generateTicket = async (bookingData) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `ticket_${bookingData.booking_number}_${uuidv4()}.pdf`;
      const filepath = path.join(PDF_PATH, filename);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header with Islamic design
      doc.fontSize(24).fillColor('#10b981').text('🕌 UMRAH TICKET', { align: 'center' });
      doc.fontSize(12).fillColor('#000000').text('UmrahConnect', { align: 'center' });
      doc.moveDown(2);

      // Booking Number (Large)
      doc.fontSize(16).text(`Booking #${bookingData.booking_number}`, { align: 'center', bold: true });
      doc.moveDown();

      // QR Code placeholder (you can integrate a QR code library)
      doc.fontSize(10).text('[QR CODE]', { align: 'center' });
      doc.moveDown(2);

      // Package Information
      doc.fontSize(14).fillColor('#10b981').text('Package Details', { underline: true });
      doc.fillColor('#000000');
      doc.fontSize(11);
      doc.text(`Package: ${bookingData.package_title}`);
      doc.text(`Destination: ${bookingData.destination}`);
      doc.text(`Duration: ${bookingData.duration} days`);
      doc.moveDown();

      // Travel Dates
      doc.fontSize(14).fillColor('#10b981').text('Travel Dates', { underline: true });
      doc.fillColor('#000000');
      doc.fontSize(11);
      doc.text(`Departure: ${new Date(bookingData.departure_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`Return: ${new Date(bookingData.return_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`Departure City: ${bookingData.departure_city}`);
      doc.moveDown();

      // Traveler Information
      doc.fontSize(14).fillColor('#10b981').text('Traveler Information', { underline: true });
      doc.fillColor('#000000');
      doc.fontSize(11);
      
      if (bookingData.travelers && bookingData.travelers.length > 0) {
        bookingData.travelers.forEach((traveler, index) => {
          doc.text(`${index + 1}. ${traveler.first_name} ${traveler.last_name}`);
          doc.text(`   Passport: ${traveler.passport_number}`, { indent: 20 });
        });
      }
      doc.moveDown();

      // Vendor Information
      doc.fontSize(14).fillColor('#10b981').text('Vendor Information', { underline: true });
      doc.fillColor('#000000');
      doc.fontSize(11);
      doc.text(`Company: ${bookingData.vendor_name}`);
      doc.text(`Contact: ${bookingData.vendor_phone}`);
      doc.text(`Email: ${bookingData.vendor_email}`);
      doc.moveDown();

      // Important Instructions
      doc.fontSize(14).fillColor('#10b981').text('Important Instructions', { underline: true });
      doc.fillColor('#000000');
      doc.fontSize(10);
      doc.list([
        'Carry this ticket along with your passport and visa',
        'Report at departure point 3 hours before departure',
        'Carry all required documents as per checklist',
        'Follow all instructions from your tour guide',
        'Keep emergency contact numbers handy'
      ]);
      doc.moveDown();

      // Emergency Contact
      doc.fontSize(12).fillColor('#ef4444').text('Emergency Contact: +91 1234567890', { align: 'center' });
      doc.moveDown();

      // Footer
      doc.fontSize(9).fillColor('#000000');
      doc.text('May Allah accept your Umrah and grant you a blessed journey', { align: 'center' });
      doc.text('Taqabbal Allahu minna wa minkum', { align: 'center', italics: true });

      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          url: `/uploads/pdfs/${filename}`
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate Payment Receipt PDF
 */
exports.generateReceipt = async (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `receipt_${paymentData.payment_id}_${uuidv4()}.pdf`;
      const filepath = path.join(PDF_PATH, filename);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('PAYMENT RECEIPT', { align: 'center' });
      doc.moveDown();

      // Company Info
      doc.fontSize(12).text('UmrahConnect', { align: 'left' });
      doc.fontSize(10).text('Your Trusted Umrah Partner');
      doc.moveDown();

      // Receipt Details
      doc.fontSize(10);
      doc.text(`Receipt Number: ${paymentData.payment_id}`);
      doc.text(`Date: ${new Date(paymentData.paid_at).toLocaleDateString()}`);
      doc.text(`Booking Number: ${paymentData.booking_number}`);
      doc.moveDown();

      // Customer Details
      doc.fontSize(12).text('Received From:', { underline: true });
      doc.fontSize(10);
      doc.text(`${paymentData.customer_name}`);
      doc.text(`Email: ${paymentData.customer_email}`);
      doc.moveDown();

      // Payment Details
      doc.fontSize(12).text('Payment Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Amount Paid: ₹${paymentData.amount.toFixed(2)}`);
      doc.text(`Payment Method: ${paymentData.payment_method.toUpperCase()}`);
      doc.text(`Transaction ID: ${paymentData.gateway_payment_id}`);
      doc.text(`Status: ${paymentData.status.toUpperCase()}`);
      doc.moveDown();

      // Package Info
      doc.fontSize(12).text('For:', { underline: true });
      doc.fontSize(10);
      doc.text(`${paymentData.package_title}`);
      doc.moveDown(2);

      // Signature
      doc.fontSize(10).text('Authorized Signature', 400, doc.y);
      doc.moveTo(400, doc.y + 5).lineTo(550, doc.y + 5).stroke();

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).text('This is a computer generated receipt and does not require signature.', { align: 'center' });
      doc.text('For any queries, contact: support@umrahconnect.com', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          url: `/uploads/pdfs/${filename}`
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete PDF file
 */
exports.deletePDF = async (filename) => {
  try {
    const filepath = path.join(PDF_PATH, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return { success: true };
    }
    return { success: false, message: 'File not found' };
  } catch (error) {
    console.error('Delete PDF error:', error);
    throw error;
  }
};

module.exports = exports;
