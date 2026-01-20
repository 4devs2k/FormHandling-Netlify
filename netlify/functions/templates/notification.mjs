/**
 * @fileoverview Email template for contact form notification (sent to recipient)
 * @description Builds HTML email notification for form submission
 * @module templates/notification
 */

/**
 * Builds HTML email notification for form submission.
 * @param {string} name - Sender name
 * @param {string} email - Sender email
 * @param {string} subject - Message subject
 * @param {string} message - Message content
 * @returns {string} HTML email content
 */
export const buildNotificationEmail = (name, email, subject, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc; color: #1a202c;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">

    <!-- Header with Gradient -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New Contact Message</h1>
      <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Received from your portfolio contact form</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">

      <!-- Sender Info Card -->
      <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="margin: 0 0 15px; font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 0.5px;">Sender Information</h2>
        <p style="margin: 8px 0; font-size: 15px; line-height: 1.6;">
          <strong style="color: #4a5568; display: inline-block; width: 80px;">Name:</strong>
          <span style="color: #1a202c;">${name}</span>
        </p>
        <p style="margin: 8px 0; font-size: 15px; line-height: 1.6;">
          <strong style="color: #4a5568; display: inline-block; width: 80px;">Email:</strong>
          <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
        </p>
        <p style="margin: 8px 0; font-size: 15px; line-height: 1.6;">
          <strong style="color: #4a5568; display: inline-block; width: 80px;">Subject:</strong>
          <span style="color: #1a202c;">${subject}</span>
        </p>
      </div>

      <!-- Message Content -->
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 15px; font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 0.5px;">Message</h2>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #2d3748; white-space: pre-wrap;">${message}</p>
        </div>
      </div>

      <!-- Reply Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
          Reply to ${name}
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1a202c; padding: 25px 30px; text-align: center;">
      <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 13px;">
        This message was sent via your portfolio contact form
      </p>
      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.5); font-size: 12px;">
        Powered by Netlify Functions
      </p>
    </div>

  </div>
</body>
</html>
`;
