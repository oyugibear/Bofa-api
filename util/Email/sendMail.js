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
            name: 'Africa Jipdende Wellness',
            address: process.env.SENDERS_EMAIL,
        }, // sender address
        to: email, // list of receivers
        subject: "Password Reset - Africa Jipende Wellness",
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
                <div style="background-color: #eab308; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Reset Your Password</h2>
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                        We received a request to reset your password. Use the code below to reset your password:
                    </p>
                    
                    <!-- Reset Code -->
                    <div style="background-color: #f8f9fa; border: 2px dashed #eab308; padding: 20px; text-align: center; margin: 25px 0;">
                        <h3 style="color: #eab308; margin: 0; font-size: 32px; letter-spacing: 3px;">${code}</h3>
                        <p style="color: #666666; margin: 10px 0 0 0; font-size: 14px;">This code will expire in 15 minutes</p>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0;">
                        If you didn't request this password reset, please ignore this email or contact our support team.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                    <p style="color: #999999; margin: 0; font-size: 14px;">
                        © 2025 Africa Jipende Wellness. All rights reserved.
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
            name: 'Africa Jipdende Wellness',
            address: process.env.SENDERS_EMAIL,
        }, // sender address
        to: email, // list of receivers
        subject: "Welcome to Africa Jipende Wellness", // Subject line
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
                <div style="background-color: #eab308; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Welcome to Our Community</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Welcome to Our Platform!</h2>
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                        Thank you for registering with Africa Jipende Wellness! We are excited to have you join our community dedicated to mental health and wellness.
                    </p>
                    
                    <div style="background-color: #f0f9ff; border-left: 4px solid #eab308; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #333333; margin: 0 0 15px 0;">What's Next?</h3>
                        <ul style="color: #666666; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Complete your profile to get personalized recommendations</li>
                            <li style="margin-bottom: 8px;">Browse our available therapy services</li>
                            <li style="margin-bottom: 8px;">Book your first session with our qualified therapists</li>
                            <li>Join our community of wellness enthusiasts</li>
                        </ul>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0;">
                        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                    <p style="color: #999999; margin: 0; font-size: 14px;">
                        © 2025 Africa Jipende Wellness. All rights reserved.
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
          name: 'Africa Jipdende Wellness',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Booking Confirmed - Africa Jipende Wellness", // Subject line
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
              <div style="background-color: #eab308; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #eab308; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 30px;">✓</div>
                      <h2 style="color: #333333; margin: 0;">Payment Confirmed!</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Thank you for your payment! Your booking has been successfully confirmed.
                  </p>
                  
                  <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #ca8a04; margin: 0 0 15px 0;">What Happens Next?</h3>
                      <p style="color: #374151; margin: 0 0 15px 0;">
                          A qualified therapist will contact you shortly to discuss your booking and schedule your session.
                      </p>
                      <p style="color: #374151; margin: 0;">
                          You will receive the session details including the meeting link and any preparation instructions.
                      </p>
                  </div>
                  
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #333333; margin: 0 0 15px 0;">Need Help?</h3>
                      <p style="color: #666666; margin: 0;">
                          If you have any questions or need to make changes to your booking, please contact our support team at 
                          <strong style="color: #eab308;">info@africajipendewellness.com</strong>
                      </p>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Africa Jipende Wellness. All rights reserved.
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
          name: 'Africa Jipdende Wellness',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: "info@africajipendewellness.com", // list of receivers
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
              <div style="background-color: #eab308; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #eab308; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">💰</div>
                      <h2 style="color: #333333; margin: 0;">New Paid Booking Received!</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      A new client has successfully completed their payment and booking. Please review the details and assign a therapist.
                  </p>
                  
                  <!-- Client Details -->
                  <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #ca8a04; margin: 0 0 15px 0;">Client Information:</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 8px 0; color: #374151; font-weight: bold; width: 30%;">Client Name:</td>
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
                  <div style="background-color: #fffbeb; border: 1px solid #a16207; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #a16207; margin: 0 0 15px 0;">Action Required:</h3>
                      <ul style="color: #374151; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Login to the admin portal</li>
                          <li style="margin-bottom: 8px;">Review the booking details</li>
                          <li style="margin-bottom: 8px;">Assign an appropriate therapist</li>
                          <li>Contact the client to schedule their session</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="https://africajipendewellness.com" style="background-color: #eab308; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Access Admin Portal
                      </a>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Africa Jipende Wellness. All rights reserved.
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
          name: 'Africa Jipdende Wellness',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Your Therapy Session Details - Africa Jipende Wellness", // Subject line
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
              <div style="background-color: #eab308; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Session Details</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0;">Hello ${booking.postedBy.first_name}!</h2>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Great news! Your therapy session has been confirmed and your therapist has been assigned. Here are your session details:
                  </p>
                  
                  <!-- Session Details -->
                  <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #ca8a04; margin: 0 0 20px 0;">📅 Session Information</h3>
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
                                  <a href="${booking.googleMeetLink}" style="color: #eab308; text-decoration: none; font-weight: bold;">
                                      Join Session
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- Important Notes -->
                  <div style="background-color: #fffbeb; border: 1px solid #a16207; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #a16207; margin: 0 0 15px 0;">🔔 Important Reminders:</h3>
                      <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Join the session 5 minutes early to test your connection</li>
                          <li style="margin-bottom: 8px;">Ensure you're in a quiet, private space</li>
                          <li style="margin-bottom: 8px;">Have a stable internet connection</li>
                          <li>Keep your session confirmation details handy</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${booking.googleMeetLink}" style="background-color: #eab308; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Join Your Session
                      </a>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      If you have any questions, please contact us at 
                      <strong style="color: #eab308;">info@africajipendewellness.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Africa Jipende Wellness. All rights reserved.
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
          name: 'Africa Jipdende Wellness',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Session Rescheduled - Africa Jipende Wellness", // Subject line
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
              <div style="background-color: #eab308; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Session Rescheduled</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #eab308; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🔄</div>
                      <h2 style="color: #333333; margin: 0;">Session Rescheduled</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Hello ${booking.postedBy.first_name}, your therapy session has been rescheduled. Please note the new date and time below:
                  </p>
                  
                  <!-- New Session Details -->
                  <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #ca8a04; margin: 0 0 20px 0;">📅 Updated Session Details</h3>
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
                  <div style="background-color: #fffbeb; border: 1px solid #a16207; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #a16207; margin: 0 0 15px 0;">🔔 Important Reminders:</h3>
                      <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Please update your calendar with the new date and time</li>
                          <li style="margin-bottom: 8px;">Join 5 minutes early to test your connection</li>
                          <li style="margin-bottom: 8px;">Contact us if the new time doesn't work for you</li>
                          <li>Keep this email for your session details</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${booking.rescheduleLink || booking.googleMeetLink}" style="background-color: #eab308; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Join Rescheduled Session
                      </a>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      We apologize for any inconvenience. If you have questions, contact us at 
                      <strong style="color: #eab308;">info@africajipendewellness.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Africa Jipende Wellness. All rights reserved.
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
          name: 'Africa Jipdende Wellness',
          address: process.env.SENDERS_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Payment Receipt - Africa Jipende Wellness", // Subject line
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
              <div style="background-color: #eab308; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Africa Jipende Wellness</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Payment Receipt</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <div style="background-color: #eab308; color: white; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📧</div>
                      <h2 style="color: #333333; margin: 0;">Payment Receipt Ready</h2>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 25px 0;">
                      Hello ${data.postedBy.first_name}, thank you for your payment! Your official receipt is now available for download.
                  </p>
                  
                  <!-- Receipt Details -->
                  <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #ca8a04; margin: 0 0 20px 0;">🧾 Receipt Information</h3>
                      <p style="color: #374151; margin: 0 0 20px 0;">
                          Your payment has been processed successfully and your receipt is ready for download.
                      </p>
                      <div style="text-align: center;">
                          <a href="${data.receipt_pdf}" style="background-color: #eab308; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                              📄 Download Receipt
                          </a>
                      </div>
                  </div>
                  
                  <!-- Payment Summary -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #374151; margin: 0 0 15px 0;">💳 Payment Summary</h3>
                      <p style="color: #6b7280; margin: 0 0 10px 0;">
                          <strong>Service:</strong> Therapy Session Booking
                      </p>
                      <p style="color: #6b7280; margin: 0 0 10px 0;">
                          <strong>Client:</strong> ${data.postedBy.first_name} ${data.postedBy.second_name || ''}
                      </p>
                      <p style="color: #6b7280; margin: 0;">
                          <strong>Status:</strong> <span style="color: #eab308; font-weight: bold;">Paid ✓</span>
                      </p>
                  </div>
                  
                  <!-- Important Notes -->
                  <div style="background-color: #fffbeb; border: 1px solid #a16207; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h3 style="color: #a16207; margin: 0 0 15px 0;">📋 Important Notes:</h3>
                      <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 8px;">Keep this receipt for your records</li>
                          <li style="margin-bottom: 8px;">This serves as proof of payment for your therapy session</li>
                          <li style="margin-bottom: 8px;">You may need this for insurance claims or reimbursements</li>
                          <li>Contact us if you need any additional documentation</li>
                      </ul>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                      Questions about your receipt? Contact us at 
                      <strong style="color: #eab308;">info@africajipendewellness.com</strong>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <img src="cid:logo" alt="Africa Jipende Wellness Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                      © 2025 Africa Jipende Wellness. All rights reserved.
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

module.exports = {
  sendWelcomeEmail, 
  sendForgotEmail, 
  sendBookingRecievedEmail, 
  sendAdminBookingPaidEmail,
  sendClientMeetingLinkEmail,
  sendClientRescheduleMeetingLinkEmail,
  sendClientReceiptEmail
}
