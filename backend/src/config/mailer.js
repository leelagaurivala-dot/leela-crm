import nodemailer from 'nodemailer';

export const sendLeadAssignmentEmail = async (consultant, lead) => {
  try {
    const isSmtpConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    let transporter;
    
    if (isSmtpConfigured) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '465'),
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('Using SMTP configuration for mailing.');
    } else {
      // Create a test account on Ethereal.email automatically for development
      console.log('No SMTP config found in .env. Creating test mailer on Ethereal...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: `"Leela CRM" <${process.env.EMAIL_USER || 'no-reply@leelacrm.com'}>`,
      to: consultant.email,
      subject: `New Lead Assigned: ${lead.name}`,
      text: `Hello ${consultant.name},

You have been assigned a new consultation lead. Here are the client's details:

Client Profile:
- Full Name: ${lead.name}
- Email ID: ${lead.email}
- WhatsApp Number: ${lead.whatsapp || lead.phone || 'Not provided'}
- Current Location: ${lead.location || 'Not provided'}
- Occupation: ${lead.occupation || 'Not provided'}

Birth Details:
- Date of Birth: ${lead.dob || 'Not provided'}
- Time of Birth: ${lead.tob || 'Not provided'}
- Place of Birth: ${lead.pob || 'Not provided'}

Area of Concern:
${lead.concern || lead.message || 'No concern details specified.'}

Log in to the dashboard to update status.

Regards,
Leela CRM System`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #61191c; color: white; padding: 25px; text-align: center;">
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: bold; letter-spacing: -0.025em;">New Lead Assignment</h2>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.85;">Leela CRM Notification</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 30px; background-color: #FAF7F2;">
            <p style="font-size: 1rem; margin-top: 0;">Hello <strong>${consultant.name}</strong>,</p>
            <p style="font-size: 0.95rem; margin-bottom: 20px;">You have been assigned a new consultation lead. Please review the customer profile below:</p>

            <!-- Section: Profile -->
            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 18px;">
              <h3 style="margin-top: 0; color: #61191c; font-size: 0.95rem; border-bottom: 1.5px solid rgba(97, 25, 28, 0.1); padding-bottom: 6px; text-transform: uppercase;">Client Profile</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                <tr>
                  <th style="padding: 6px 0; color: #475569; width: 35%;">Full Name:</th>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${lead.name}</td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">Email ID:</th>
                  <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${lead.email}">${lead.email}</a></td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">WhatsApp No:</th>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${lead.whatsapp || lead.phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">Location:</th>
                  <td style="padding: 6px 0; color: #0f172a;">${lead.location || 'Not provided'}</td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">Occupation:</th>
                  <td style="padding: 6px 0; color: #0f172a;">${lead.occupation || 'Not provided'}</td>
                </tr>
              </table>
            </div>

            <!-- Section: Birth Details -->
            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 18px;">
              <h3 style="margin-top: 0; color: #61191c; font-size: 0.95rem; border-bottom: 1.5px solid rgba(97, 25, 28, 0.1); padding-bottom: 6px; text-transform: uppercase;">Birth Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                <tr>
                  <th style="padding: 6px 0; color: #475569; width: 35%;">Date of Birth:</th>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${lead.dob || 'Not provided'}</td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">Time of Birth:</th>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${lead.tob || 'Not provided'}</td>
                </tr>
                <tr>
                  <th style="padding: 6px 0; color: #475569;">Place of Birth:</th>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${lead.pob || 'Not provided'}</td>
                </tr>
              </table>
            </div>

            <!-- Section: Concern -->
            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="margin-top: 0; color: #61191c; font-size: 0.95rem; border-bottom: 1.5px solid rgba(97, 25, 28, 0.1); padding-bottom: 6px; text-transform: uppercase;">Area of Concern</h3>
              <p style="margin: 8px 0 0 0; font-size: 0.9rem; color: #334155; white-space: pre-wrap; font-style: italic;">
                "${lead.concern || lead.message || 'No concern details specified.'}"
              </p>
            </div>

            <p style="font-size: 0.85rem; color: #64748b; text-align: center; margin-top: 30px;">
              This is an automated message sent from your Leela CRM workspace.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${consultant.email}. Message ID: ${info.messageId}`);
    
    if (!isSmtpConfigured) {
      console.log(`[TEST EMAIL SENT] View preview url: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send lead assignment email:', error);
    return { success: false, error: error.message };
  }
};
