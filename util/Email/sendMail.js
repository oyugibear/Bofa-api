const nodemailer = require('nodemailer');


async function sendForgotEmail(code, email) {
    console.log("ShortCode***", code)
    console.log("Email***", email)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.SENDERS_EMAIL,
          pass: process.env.SENDERS_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: {
            name: 'Arena 03 Kilifi',
            address: process.env.SENDERS_EMAIL,
        }, // sender address
        to: email, // list of receivers
        subject: "Password Reset - Arena 03 Kilifi",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Reset Your Password</h2>
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                        We received a request to reset your password. Use the code below to reset your password:
                    </p>
                    
                    <!-- Reset Code -->
                    <div style="background-color: #f8f9fa; border: 2px dashed #3A8726; padding: 20px; text-align: center; margin: 25px 0;">
                        <h3 style="color: #3A8726; margin: 0; font-size: 32px; letter-spacing: 3px;">${code}</h3>
                        <p style="color: #666666; margin: 10px 0 0 0; font-size: 14px;">This code will expire in 15 minutes</p>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0;">
                        If you didn't request this password reset, please ignore this email or contact our support team.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                    <p style="color: #999999; margin: 0; font-size: 14px;">
                        © 2025 Arena 03 Kilifi. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `,
        attachments: [{
            filename: 'logo.png',
            path: './public/logo.png',
            cid: 'logo'
        }]
      });
    
      console.log("Message sent: %s", info.messageId);
      return "Message sent: %s", info.messageId
}

async function sendWelcomeEmail (email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.SENDERS_EMAIL,
          pass: process.env.SENDERS_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: {
            name: 'Arena 03 Kilifi',
            address: process.env.SENDERS_EMAIL,
        }, // sender address
        to: email, // list of receivers
        subject: "Welcome to Arena 03 Kilifi", // Subject line
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Welcome to Our Sports Community</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Welcome to Our Sports Facility!</h2>
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                        Thank you for registering with Arena 03 Kilifi! We are excited to have you join our sports community dedicated to football excellence and fitness.
                    </p>
                    
                    <div style="background-color: #f0f9ff; border-left: 4px solid #3A8726; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #333333; margin: 0 0 15px 0;">What's Next?</h3>
                        <ul style="color: #666666; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Complete your profile to get personalized training recommendations</li>
                            <li style="margin-bottom: 8px;">Book field sessions for training or matches</li>
                            <li style="margin-bottom: 8px;">Join our football academy programs</li>
                            <li>Participate in our competitive leagues and tournaments</li>
                        </ul>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0;">
                        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                    <p style="color: #999999; margin: 0; font-size: 14px;">
                        © 2025 Arena 03 Kilifi. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `, // html body
        attachments: [{
            filename: 'logo.png',
            path: './public/logo.png',
            cid: 'logo'
        }]
      });
    
      console.log("Message sent: %s", info.messageId);
}

async function sendBookingRecievedEmail (email) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD
      }
  });

  const info = await transporter.sendMail({
      from: {
          name: 'Arena 03 Kilifi',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Booking Confirmed - Arena 03 Kilifi", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #3A8726; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 30px;">✓</div>
                      <h2 style="color: #333333; margin: 0;">Payment Confirmed!</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Thank you for your payment! Your field booking has been successfully confirmed.
                  </p>
                  
                  <div style="background-color: #fefce8; border: 1px solid #3A8726; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">What Happens Next?</h3>
                      <p style="color: #374151; margin: 0 0 15px 0;">
                          Your field reservation is confirmed and ready for your training session or match.
                      </p>
                      <p style="color: #374151; margin: 0;">
                          You can arrive at Arena 03 Kilifi at your scheduled time. All facilities will be prepared for your use.
                      </p>
                  </div>
                  
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #333333; margin: 0 0 15px 0;">Need Help?</h3>
                      <p style="color: #666666; margin: 0;">
                          If you have any questions or need to make changes to your field booking, please contact our team at 
                          <strong style="color: #3A8726;">info@arena03kilifi.com</strong> or call +254 708 123 456
                      </p>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Arena 03 Kilifi. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `, // html body
      attachments: [{
          filename: 'logo.png',
          path: './public/logo.png',
          cid: 'logo'
      }]
    });
  
    console.log("Message sent: %s", info.messageId);
}

async function sendAdminBookingPaidEmail (email, booking, payment) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD
      }
  });

  const info = await transporter.sendMail({
      from: {
          name: 'Arena 03 Kilifi',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: "info@arena03kilifi.com", // list of receivers
      subject: "New Paid Booking - Action Required", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Paid Booking</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #3A8726; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">💰</div>
                      <h2 style="color: #333333; margin: 0;">New Paid Booking Received!</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      A new customer has successfully completed their payment for a field booking. Please review the details and prepare the facility.
                  </p>
                  
                  <!-- Customer Details -->
                  <div style="background-color: #fefce8; border: 1px solid #3A8726; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">Customer Information:</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 8px 0; color: #374151; font-weight: bold; width: 30%;">Customer Name:</td>
                              <td style="padding: 8px 0; color: #374151;">${booking.postedBy.first_name} ${booking.postedBy.second_name}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Email:</td>
                              <td style="padding: 8px 0; color: #374151;">${email}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Booking ID:</td>
                              <td style="padding: 8px 0; color: #374151;">${booking._id || 'N/A'}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Payment Amount:</td>
                              <td style="padding: 8px 0; color: #374151;">${payment.currency || 'KSH'} ${payment.final_amount_invoiced || 'N/A'}</td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- Action Required -->
                  <div style="background-color: #fffbeb; border: 1px solid #2C6A1B; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">Action Required:</h3>
                      <ul style="color: #374151; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Login to the admin portal</li>
                          <li style="margin-bottom: 8px;">Review the booking details</li>
                          <li style="margin-bottom: 8px;">Prepare the field and facilities</li>
                          <li>Contact the customer if needed for special requirements</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="https://arena03kilifi.com" style="background-color: #3A8726; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Access Admin Portal
                      </a>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Arena 03 Kilifi. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `, // html body
      attachments: [{
          filename: 'logo.png',
          path: './public/logo.png',
          cid: 'logo'
      }]
    });
  
    console.log("Message sent: %s", info.messageId);
}

async function sendClientMeetingLinkEmail (email, booking) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD
      }
  });

  const info = await transporter.sendMail({
      from: {
          name: 'Arena 03 Kilifi',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Your Field Booking Details - Arena 03 Kilifi", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Session Details</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Booking Details</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0;">Hello ${booking.postedBy.first_name}!</h2>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Great news! Your field booking has been confirmed and is ready for your training or match. Here are your booking details:
                  </p>
                  
                  <!-- Session Details -->
                  <div style="background-color: #fefce8; border: 1px solid #3A8726; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 20px 0;">📅 Session Information</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold; width: 35%;">Booking ID:</td>
                              <td style="padding: 10px 0; color: #374151;">${booking._id}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">Therapist:</td>
                              <td style="padding: 10px 0; color: #374151;">${booking.therapist.first_name + " " + booking.therapist.second_name || 'To be assigned'}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">Meeting Link:</td>
                              <td style="padding: 10px 0;">
                                  <a href="${booking.googleMeetLink}" style="color: #3A8726; text-decoration: none; font-weight: bold;">
                                      Join Session
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- Important Notes -->
                  <div style="background-color: #fffbeb; border: 1px solid #2C6A1B; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">🔔 Important Reminders:</h3>
                      <ul style="color: #1E4B0F; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Join the session 5 minutes early to test your connection</li>
                          <li style="margin-bottom: 8px;">Ensure you're in a quiet, private space</li>
                          <li style="margin-bottom: 8px;">Have a stable internet connection</li>
                          <li>Keep your session confirmation details handy</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${booking.googleMeetLink}" style="background-color: #3A8726; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Join Your Session
                      </a>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      If you have any questions, please contact us at 
                      <strong style="color: #3A8726;">info@arena03kilifi.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Arena 03 Kilifi. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `, // html body
      attachments: [{
          filename: 'logo.png',
          path: './public/logo.png',
          cid: 'logo'
      }]
    });
  
    console.log("Message sent: %s", info.messageId);
}

async function sendClientRescheduleMeetingLinkEmail (email, booking) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD
      }
  });

  const info = await transporter.sendMail({
      from: {
          name: 'Arena 03 Kilifi',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Booking Rescheduled - Arena 03 Kilifi", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Session Rescheduled</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Booking Rescheduled</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #3A8726; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🔄</div>
                      <h2 style="color: #333333; margin: 0;">Booking Rescheduled</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Hello ${booking.postedBy.first_name}, your field booking has been rescheduled. Please note the new date and time below:
                  </p>
                  
                  <!-- New Session Details -->
                  <div style="background-color: #fefce8; border: 1px solid #3A8726; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 20px 0;">📅 Updated Session Details</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold; width: 35%;">Booking ID:</td>
                              <td style="padding: 10px 0; color: #374151;">${booking._id}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">New Date:</td>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">${booking.rescheduleDate || 'TBD'}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">New Time:</td>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">${booking.rescheduleTime || 'TBD'}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">Therapist:</td>
                              <td style="padding: 10px 0; color: #374151;">${booking.therapist.first_name + " " + booking.therapist.second_name || 'To be assigned'}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #374151; font-weight: bold;">Meeting Link:</td>
                              <td style="padding: 10px 0;">
                                  <a href="${booking.rescheduleLink || booking.googleMeetLink}" style= text-decoration: none; font-weight: bold;">
                                      Join Rescheduled Session
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- Reason for Reschedule -->
                  ${booking.rescheduleReason ? `
                  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #374151; margin: 0 0 15px 0;">📝 Reason for Rescheduling:</h3>
                      <p style="color: #6b7280; margin: 0; font-style: italic;">"${booking.rescheduleReason}"</p>
                  </div>
                  ` : ''}
                  
                  <!-- Important Notes -->
                  <div style="background-color: #fffbeb; border: 1px solid #2C6A1B; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">🔔 Important Reminders:</h3>
                      <ul style="color: #1E4B0F; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Please update your calendar with the new date and time</li>
                          <li style="margin-bottom: 8px;">Join 5 minutes early to test your connection</li>
                          <li style="margin-bottom: 8px;">Contact us if the new time doesn't work for you</li>
                          <li>Keep this email for your session details</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${booking.rescheduleLink || booking.googleMeetLink}" style="background-color: #3A8726; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Join Rescheduled Session
                      </a>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      We apologize for any inconvenience. If you have questions, contact us at 
                      <strong style="color: #3A8726;">info@arena03kilifi.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Arena 03 Kilifi. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `, // html body
      attachments: [{
          filename: 'logo.png',
          path: './public/logo.png',
          cid: 'logo'
      }]
    });
  
    console.log("Message sent: %s", info.messageId);
}

async function sendClientReceiptEmail (email, data) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD
      }
  });

  const info = await transporter.sendMail({
      from: {
          name: 'Arena 03 Kilifi',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Payment Receipt - Arena 03 Kilifi", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Payment Receipt</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #3A8726; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📧</div>
                      <h2 style="color: #333333; margin: 0;">Payment Receipt Ready</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Hello ${data.postedBy.first_name}, thank you for your payment! Your official receipt is now available for download.
                  </p>
                  
                  <!-- Receipt Details -->
                  <div style="background-color: #fefce8; border: 1px solid #3A8726; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 20px 0;">🧾 Receipt Information</h3>
                      <p style="color: #374151; margin: 0 0 20px 0;">
                          Your payment has been processed successfully and your receipt is ready for download.
                      </p>
                      <div style="text-align: center;">
                          <a href="${data.receipt_pdf}" style="background-color: #3A8726; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                              📄 Download Receipt
                          </a>
                      </div>
                  </div>
                  
                  <!-- Payment Summary -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #374151; margin: 0 0 15px 0;">💳 Payment Summary</h3>
                      <p style="color: #6b7280; margin: 0 0 10px 0;">
                          <strong>Service:</strong> Field Booking - Arena 03 Kilifi
                      </p>
                      <p style="color: #6b7280; margin: 0 0 10px 0;">
                          <strong>Client:</strong> ${data.postedBy.first_name} ${data.postedBy.second_name || ''}
                      </p>
                      <p style="color: #6b7280; margin: 0;">
                          <strong>Status:</strong> <span style="color: #3A8726; font-weight: bold;">Paid ✓</span>
                      </p>
                  </div>
                  
                  <!-- Important Notes -->
                  <div style="background-color: #fffbeb; border: 1px solid #2C6A1B; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #2C6A1B; margin: 0 0 15px 0;">📋 Important Notes:</h3>
                      <ul style="color: #1E4B0F; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Keep this receipt for your records</li>
                          <li style="margin-bottom: 8px;">This serves as proof of payment for your field booking</li>
                          <li style="margin-bottom: 8px;">Present this receipt when you arrive at Arena 03 Kilifi</li>
                          <li>Contact us if you need any additional documentation</li>
                      </ul>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      Questions about your receipt? Contact us at 
                      <strong style="color: #3A8726;">info@arena03kilifi.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Arena 03 Kilifi Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Arena 03 Kilifi. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `, // html body
      attachments: [{
          filename: 'logo.png',
          path: './public/logo.png',
          cid: 'logo'
      }]
    });
  
    console.log("Message sent: %s", info.messageId);
}

async function sendAdminBookingConfirmationEmail(email, booking, client, isNewUser = false) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SENDERS_EMAIL,
            pass: process.env.SENDERS_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: {
            name: 'Arena 03 Kilifi',
            address: process.env.SENDERS_EMAIL,
        },
        to: email,
        subject: "Booking Confirmation & Payment - Arena 03 Kilifi",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background-color: #3A8726; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Arena 03 Kilifi</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Field Booking Confirmation</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Hello ${client.first_name}!</h2>
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                        Your field booking has been confirmed. Here are the details of your reservation:
                    </p>
                    
                    <!-- Booking Details -->
                    <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
                        <h3 style="color: #3A8726; margin: 0 0 15px 0; font-size: 18px;">Booking Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666666; font-weight: bold;">Field:</td>
                                <td style="padding: 8px 0; color: #333333;">${booking.field?.name || 'Field Information'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666; font-weight: bold;">Date:</td>
                                <td style="padding: 8px 0; color: #333333;">${booking.date_requested}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666; font-weight: bold;">Time:</td>
                                <td style="padding: 8px 0; color: #333333;">${booking.time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666; font-weight: bold;">Duration:</td>
                                <td style="padding: 8px 0; color: #333333;">${booking.duration} hour(s)</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666; font-weight: bold;">Total Amount:</td>
                                <td style="padding: 8px 0; color: #3A8726; font-weight: bold; font-size: 18px;">KSh ${booking.total_price?.toLocaleString() || booking.amount?.toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Payment Section -->
                    <div style="background-color: #fff3cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f39c12;">
                        <h3 style="color: #f39c12; margin: 0 0 15px 0; font-size: 18px;">Complete Your Payment</h3>
                        <p style="color: #856404; line-height: 1.6; margin: 0 0 20px 0;">
                            To secure your booking, please complete the payment using the link below:
                        </p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${booking.paymentLink}" 
                               style="display: inline-block; padding: 15px 30px; background-color: #f39c12; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Pay Now - KSh ${booking.total_price?.toLocaleString() || booking.amount?.toLocaleString()}
                            </a>
                        </div>
                    </div>

                    ${isNewUser ? `
                    <!-- Account Access (New Users Only) -->
                    <div style="background-color: #e7f3ff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
                        <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">🎉 Welcome! Your Account is Ready</h3>
                        <p style="color: #084298; line-height: 1.6; margin: 0 0 15px 0;">
                            We've created an account for you! You can now log in to view your bookings and manage your profile:
                        </p>
                        <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 5px; overflow: hidden;">
                            <tr>
                                <td style="padding: 15px; color: #666666; font-weight: bold; border-bottom: 1px solid #dee2e6;">Email:</td>
                                <td style="padding: 15px; color: #333333; border-bottom: 1px solid #dee2e6;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px; color: #666666; font-weight: bold;">Password:</td>
                                <td style="padding: 15px; color: #333333; font-family: monospace; background-color: #f8f9fa;">Temporary@123</td>
                            </tr>
                        </table>
                        <p style="color: #084298; line-height: 1.6; margin: 15px 0 0 0; font-size: 14px;">
                            <strong>Important:</strong> Please change your password after first login for security.
                        </p>
                    </div>
                    ` : `
                    <!-- Existing User Message -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6c757d;">
                        <p style="color: #495057; line-height: 1.6; margin: 0;">
                            📱 You can log in to your existing account to view this booking and manage your profile.
                        </p>
                    </div>
                    `}

                    <!-- Important Notes -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h4 style="color: #333333; margin: 0 0 15px 0;">Important Information:</h4>
                        <ul style="color: #666666; line-height: 1.6; margin: 0; padding-left: 20px;">
                            <li>Please arrive 10 minutes before your scheduled time</li>
                            <li>Bring appropriate sports equipment and attire</li>
                            <li>Payment must be completed to secure your booking</li>
                            <li>Cancellations must be made 24 hours in advance</li>
                        </ul>
                    </div>

                    <!-- Contact Information -->
                    <div style="text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <p style="color: #666666; margin: 0 0 10px 0;">Questions? Contact us:</p>
                        <p style="color: #3A8726; font-weight: bold; margin: 0;">
                            📧 info@arena03kilifi.com | 📞 +254 700 000 000
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="color: #666666; margin: 0; font-size: 14px;">
                        Thank you for choosing Arena 03 Kilifi!<br>
                        We look forward to seeing you on the field.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `
    });

    console.log("Admin booking confirmation email sent: %s", info.messageId);
}

module.exports = {
  sendWelcomeEmail, 
  sendForgotEmail, 
  sendBookingRecievedEmail, 
  sendAdminBookingPaidEmail,
  sendClientMeetingLinkEmail,
  sendClientRescheduleMeetingLinkEmail,
  sendClientReceiptEmail,
  sendAdminBookingConfirmationEmail
}
