const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateReceiptPdf(data) {
  
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const dataPricingBreakdown = data?.booking?.services.map(item => `
    <tr>
        <td>${item.title}}</td>
        <td>${item.price}</td>
        <td>${item.price}</td>
    </tr>
    `).join('');

    const imagePath = path.join(__dirname, '..', '..', 'public', 'logo.png'); // Adjust the path to point to the public folder
    let base64String = '';
    
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        base64String = imageBuffer.toString('base64');
    } catch (error) {
        console.error('Error reading the image file:', error);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
      console.log("Data", data)
    const formattedDate = formatDate(data?.payment.createdAt);

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 30px;
                font-size: 12px;
                line-height: 1.5;
                color: #333;
                background-color: #ffffff;
            }

            .receipt-container {
                max-width: 800px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
                color: white;
                padding: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-info h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 8px;
                color: white;
            }

            .header-info h2 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                color: rgba(255, 255, 255, 0.9);
            }

            .header-info p {
                font-size: 11px;
                margin-bottom: 3px;
                color: rgba(255, 255, 255, 0.8);
            }

            .header img {
                width: 120px;
                height: auto;
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .content {
                padding: 30px;
            }

            .customer-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid #eab308;
            }

            .customer-section h2 {
                font-size: 18px;
                color: #2d3748;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }

            .customer-section h2:before {
                content: '👤';
                margin-right: 8px;
                font-size: 16px;
            }

            .receipt-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }

            .detail-group {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }

            .detail-group h3 {
                font-size: 14px;
                color: #eab308;
                margin-bottom: 10px;
                font-weight: 600;
            }

            .detail-group p {
                font-size: 12px;
                color: #4a5568;
                margin-bottom: 5px;
            }

            .detail-group p strong {
                color: #2d3748;
            }

            .services-section {
                margin-bottom: 30px;
            }

            .services-section h3 {
                font-size: 16px;
                color: #2d3748;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }

            .services-section h3:before {
                content: '📋';
                margin-right: 8px;
                font-size: 14px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            th {
                background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #e2e8f0;
                font-size: 12px;
            }

            tr:hover {
                background-color: #f7fafc;
            }

            .amount-summary {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #eab308;
                margin-bottom: 25px;
            }

            .amount-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 13px;
            }

            .amount-row.total {
                font-size: 16px;
                font-weight: bold;
                color: #2d3748;
                border-top: 2px solid #eab308;
                padding-top: 10px;
                margin-top: 15px;
            }

            .paid-status {
                text-align: center;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 30px;
                font-size: 20px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            }

            .paid-status:before {
                content: '✓';
                margin-right: 10px;
                font-size: 24px;
            }

            .notes-section {
                background: #f7fafc;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #eab308;
            }

            .notes-section h3 {
                font-size: 16px;
                color: #2d3748;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }

            .notes-section h3:before {
                content: '📝';
                margin-right: 8px;
                font-size: 14px;
            }

            .notes-content {
                font-size: 11px;
                color: #4a5568;
                line-height: 1.6;
            }

            .notes-content h4 {
                color: #eab308;
                font-size: 12px;
                margin: 15px 0 8px 0;
                font-weight: 600;
            }

            .contact-info {
                background: #2d3748;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-top: 15px;
            }

            .contact-info h4 {
                color: #eab308;
                margin-bottom: 10px;
                font-size: 13px;
            }

            .contact-info p {
                font-size: 11px;
                margin-bottom: 5px;
                color: #e2e8f0;
            }

            .divider {
                height: 2px;
                background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
                margin: 25px 0;
                border-radius: 1px;
            }

            @media print {
                body {
                    padding: 0;
                }
                .receipt-container {
                    box-shadow: none;
                    border-radius: 0;
                }
            }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <!-- Header Section -->
                <div class="header">
                    <div class="header-info">
                        <h1>Africa Jipende Wellness Limited</h1>
                        <h2>Payment Receipt</h2>
                        <p>Company ID: PVT-27UAXMJ</p>
                        <p>Tax ID: P051789014L</p>
                        <p>Nairobi 42124-00100, Kenya</p>
                    </div>
                    <img src="data:image/png;base64,${base64String}" alt="Company Logo"/>
                </div>

                <!-- Content Section -->
                <div class="content">
                    <!-- Customer Information -->
                    <div class="customer-section">
                        <h2>Bill To</h2>
                        <p><strong>Name:</strong> ${data?.client?.first_name + " " + data?.client?.second_name}</p>
                        <p><strong>Phone:</strong> ${data?.client.phone_number}</p>
                        <p><strong>Email:</strong> ${data?.client?.email || 'N/A'}</p>
                    </div>

                    <!-- Receipt Details -->
                    <div class="receipt-details">
                        <div class="detail-group">
                            <h3>Receipt Information</h3>
                            <p><strong>Receipt ID:</strong> ${data?.payment._id}</p>
                            <p><strong>Receipt Date:</strong> ${formattedDate}</p>
                            <p><strong>Payment Method:</strong> ${data?.payment.payment_method || 'Online Payment'}</p>
                        </div>
                        <div class="detail-group">
                            <h3>Booking Information</h3>
                            <p><strong>Booking ID:</strong> ${data?.booking?._id || 'N/A'}</p>
                            <p><strong>Service Type:</strong> Therapy Session</p>
                            <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
                        </div>
                    </div>

                    <!-- Services Section -->
                    <div class="services-section">
                        <h3>Service Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Service Description</th>
                                    <th>Rate (KSH)</th>
                                    <th>Amount (KSH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dataPricingBreakdown}
                            </tbody>
                        </table>
                    </div>

                    <!-- Amount Summary -->
                    <div class="amount-summary">
                        <div class="amount-row">
                            <span>Subtotal:</span>
                            <span>KSH ${data?.payment.final_amount_invoiced}</span>
                        </div>
                        <div class="amount-row">
                            <span>Tax (Inclusive):</span>
                            <span>KSH 0.00</span>
                        </div>
                        <div class="amount-row total">
                            <span>Total Amount:</span>
                            <span>KSH ${data?.payment.final_amount_invoiced}</span>
                        </div>
                    </div>

                    <!-- Payment Status -->
                    <div class="paid-status">
                        PAID IN FULL
                    </div>

                    <div class="divider"></div>

                    <!-- Notes Section -->
                    <div class="notes-section">
                        <h3>About Africa Jipende Wellness</h3>
                        <div class="notes-content">
                            <p><strong>Founded by Rubie B.A Miseda BA(Hons), MSc, GMBPsS</strong></p>
                            <p>Based in Nairobi, Kenya, we are dedicated to providing quality mental health and wellness services.</p>
                            
                            <h4>Professional Accreditations:</h4>
                            <p>• Registered Psychologist by the Counsellors And Psychologist (C&P) Board of The Republic Of Kenya</p>
                            <p>• Registration No. C&P/P/0639/2024 | License No. C & P/P/0639/10088</p>
                            <p>• Graduate Member of the British Psychological Society (BPS) - Member No. 387388 (UK)</p>
                            <p>• Certified Support Worker by the Care Quality Commission (CQC) at Keyfort Group LTD (UK)</p>

                            <div class="contact-info">
                                <h4>Contact Information</h4>
                                <p><strong>Phone:</strong> +254-745-601-992 | +254-735-432-045</p>
                                <p><strong>Email:</strong> info@africajipendewellness.com | jipendewellness@gmail.com</p>
                                <p><strong>Website:</strong> www.africajipendewellness.com</p>
                                <p><strong>Social Media:</strong> @jipendewellness (Twitter, Instagram, Facebook, YouTube)</p>
                                <p style="margin-top: 15px; font-style: italic; color: #eab308;">
                                    "Your well-being journey matters to us. Thank you for choosing Africa Jipende Wellness."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;


    await page.setContent(htmlContent);
    await page.emulateMediaType('screen');

    // const filename = `public/receipt_${data.booking.pos + "-" + data.payment.payment_date}.pdf`;
    const filename = `public/receipt.pdf`;

    await page.pdf({
        path: filename,
        format: 'A4',
        printBackground: true,
        timeout: 100000
    });

    console.log('PDF generated successfully:', filename);

    await browser.close();

    return filename;
  
}

module.exports = { generateReceiptPdf };