/**
 * @fileoverview Email template for contact form confirmation (sent to sender)
 * @description Builds HTML confirmation email for sender
 * @module templates/confirmation
 */

/**
 * Builds HTML confirmation email for sender.
 * @param {string} name - Sender name
 * @returns {string} HTML confirmation email content
 */
export const buildConfirmationEmail = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received - Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc; color: #1a202c;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">

    <!-- Header with Gradient -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Message Received!</h1>
      <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Thank you for reaching out</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">

      <!-- Confirmation Message -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #e6f0ff; border: 3px solid #667eea; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#667eea" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 style="margin: 0 0 15px; font-size: 24px; color: #1a202c;">Hi ${name}!</h2>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
          I've received your message and will get back to you as soon as possible.
        </p>
      </div>

      <!-- Info Card -->
      <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h3 style="margin: 0 0 10px; font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 0.5px;">What's Next?</h3>
        <ul style="margin: 10px 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #2d3748;">
          <li>I typically respond within 24-48 hours</li>
          <li>Check your spam folder if you don't see my reply</li>
          <li>Feel free to follow up if needed</li>
        </ul>
      </div>

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="margin: 0 0 20px; font-size: 14px; color: #718096;">
          In the meantime, feel free to explore more of my work
        </p>
        <a href="https://formhandling-netlify.netlify.app"
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
          Visit Portfolio
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1a202c; padding: 25px 30px; text-align: center;">
      <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 13px;">
        This is an automated confirmation email
      </p>
      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.5); font-size: 12px;">
        Powered by Netlify Functions
      </p>
    </div>

  </div>
</body>
</html>
`;
