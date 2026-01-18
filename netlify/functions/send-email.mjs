import nodemailer from "nodemailer";

// Rate Limiting: In-Memory Store (einfache Lösung für Serverless)
// Hinweis: Bei Production würde man Redis/DynamoDB nutzen
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 Stunde in Millisekunden
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 Requests pro Stunde pro IP

// Rate Limiting Helper
function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Entferne alte Requests außerhalb des Zeitfensters
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(recentRequests[0] + RATE_LIMIT_WINDOW)
    };
  }

  // Füge neue Request hinzu
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - recentRequests.length,
    resetTime: new Date(now + RATE_LIMIT_WINDOW)
  };
}

// reCAPTCHA Validierung
async function validateRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY nicht gesetzt - reCAPTCHA wird übersprungen");
    return { success: true, score: 1.0 }; // Fallback wenn nicht konfiguriert
  }

  if (!token) {
    return { success: false, error: "reCAPTCHA Token fehlt" };
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
      }
    );

    const data = await response.json();
    console.log("reCAPTCHA Validierung:", {
      success: data.success,
      score: data.score,
      action: data.action
    });

    return data;
  } catch (error) {
    console.error("reCAPTCHA Validierungsfehler:", error);
    return { success: false, error: error.message };
  }
}

export const handler = async (event, context) => {
  console.log("=== Function Start (ES6+) ===");
  console.log("Function called with method:", event.httpMethod);
  console.log("Environment variables check:", {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    FROM_EMAIL: !!process.env.FROM_EMAIL,
    TO_EMAIL: !!process.env.TO_EMAIL,
    RECAPTCHA_SECRET_KEY: !!process.env.RECAPTCHA_SECRET_KEY,
  });

  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Nur POST-Anfragen erlauben
  if (event.httpMethod !== "POST") {
    console.log("Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Rate Limiting Check
  const clientIP = event.headers['x-forwarded-for'] ||
                   event.headers['client-ip'] ||
                   'unknown';

  console.log("Client IP:", clientIP);

  const rateLimitResult = checkRateLimit(clientIP);

  if (!rateLimitResult.allowed) {
    console.log("Rate limit exceeded for IP:", clientIP);
    return {
      statusCode: 429,
      headers: {
        ...headers,
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString(),
      },
      body: JSON.stringify({
        error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
        resetTime: rateLimitResult.resetTime.toISOString()
      }),
    };
  }

  console.log("Rate limit OK:", {
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime
  });

  try {
    // Formulardaten parsen
    let body;
    try {
      console.log("Raw event body:", event.body);
      body = JSON.parse(event.body);
      console.log("Parsed body:", {
        ...body,
        message: body.message?.substring(0, 50) + "...",
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Ungültige JSON-Daten" }),
      };
    }

    const { name, email, subject, message } = body;

    // Validierung
    if (!name || !email || !subject || !message) {
      console.log("Validation failed:", {
        name: !!name,
        email: !!email,
        subject: !!subject,
        message: !!message,
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Alle Felder sind erforderlich" }),
      };
    }

    // reCAPTCHA v3 Validierung
    const recaptchaResult = await validateRecaptcha(body.recaptchaToken);

    if (!recaptchaResult.success) {
      console.log("reCAPTCHA validation failed:", recaptchaResult.error);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: "reCAPTCHA Validierung fehlgeschlagen. Bitte versuchen Sie es erneut."
        }),
      };
    }

    // Prüfe reCAPTCHA Score (v3 gibt Score von 0.0 bis 1.0)
    // 0.0 = sehr wahrscheinlich Bot, 1.0 = sehr wahrscheinlich Mensch
    if (recaptchaResult.score && recaptchaResult.score < 0.5) {
      console.log("reCAPTCHA score too low:", recaptchaResult.score);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: "Verdächtige Aktivität erkannt. Bitte kontaktieren Sie uns auf anderem Wege."
        }),
      };
    }

    console.log("reCAPTCHA validation passed, score:", recaptchaResult.score);

    // Umgebungsvariablen auslesen
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, TO_EMAIL } =
      process.env;

    console.log("Environment variables:", {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER: SMTP_USER ? SMTP_USER.substring(0, 5) + "***" : "undefined",
      SMTP_PASS: SMTP_PASS ? "***set***" : "undefined",
      FROM_EMAIL,
      TO_EMAIL,
    });

    // Prüfe ob alle Umgebungsvariablen gesetzt sind
    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !FROM_EMAIL ||
      !TO_EMAIL
    ) {
      console.error("Missing environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Server-Konfigurationsfehler - Umgebungsvariablen fehlen",
          debug: {
            SMTP_HOST: !!SMTP_HOST,
            SMTP_PORT: !!SMTP_PORT,
            SMTP_USER: !!SMTP_USER,
            SMTP_PASS: !!SMTP_PASS,
            FROM_EMAIL: !!FROM_EMAIL,
            TO_EMAIL: !!TO_EMAIL,
          },
        }),
      };
    }

    console.log("Creating transporter...");

    // E-Mail-Transporter konfigurieren
    const transporter = nodemailer.createTransporter({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      debug: true,
      logger: true,
    });

    // Transporter testen
    try {
      console.log("Verifying SMTP connection...");
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "E-Mail-Server Verbindungsfehler",
          details: verifyError.message,
        }),
      };
    }

    // E-Mail-Optionen
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Kontaktformular: ${subject}`,
      html: `
        <h2>Neue Nachricht vom Kontaktformular</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Betreff:</strong> ${subject}</p>
        <h3>Nachricht:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    };

    console.log("Sending email...", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    // E-Mail senden
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "E-Mail erfolgreich gesendet",
        success: true,
        messageId: info.messageId,
      }),
    };
  } catch (error) {
    console.error("=== Function Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Interner Server-Fehler",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};
