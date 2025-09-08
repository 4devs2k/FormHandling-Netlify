const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  console.log("=== Function Start ===");
  console.log("Function called with method:", event.httpMethod);
  console.log("Environment variables check:", {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    FROM_EMAIL: !!process.env.FROM_EMAIL,
    TO_EMAIL: !!process.env.TO_EMAIL,
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
