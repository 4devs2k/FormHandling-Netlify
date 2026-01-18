/**
 * @fileoverview Netlify serverless function for contact form email delivery
 * @description Handles form submissions with rate limiting, reCAPTCHA validation, and email sending via SMTP
 * @module send-email
 */

import nodemailer from "nodemailer";

// === CONSTANTS ===
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitStore = new Map();

// === CORS HEADERS ===
/**
 * Returns CORS headers for API responses.
 * @returns {Object} CORS headers object
 */
const getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

// === RESPONSE BUILDERS ===
/**
 * Builds HTTP response with CORS headers.
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {Object} extraHeaders - Additional headers
 * @returns {Object} Response object
 */
const buildResponse = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: { ...getCorsHeaders(), ...extraHeaders },
  body: JSON.stringify(data),
});

/**
 * Builds error response.
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error message
 * @param {string|null} details - Optional error details
 * @returns {Object} Error response object
 */
const buildErrorResponse = (statusCode, error, details = null) =>
  buildResponse(statusCode, { error, ...(details && { details }) });

/**
 * Builds success response.
 * @param {Object} data - Success response data
 * @returns {Object} Success response object
 */
const buildSuccessResponse = (data) => buildResponse(200, data);

// === RATE LIMITING ===
/**
 * Filters out requests older than the rate limit window.
 * @param {number[]} requests - Array of request timestamps
 * @param {number} now - Current timestamp
 * @returns {number[]} Filtered recent requests
 */
const cleanOldRequests = (requests, now) =>
  requests.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);

/**
 * Checks if rate limit has been exceeded.
 * @param {number[]} recentRequests - Array of recent request timestamps
 * @returns {boolean} True if limit exceeded
 */
const isRateLimitExceeded = (recentRequests) =>
  recentRequests.length >= MAX_REQUESTS_PER_WINDOW;

/**
 * Updates rate limit store with new request.
 * @param {string} ip - Client IP address
 * @param {number[]} recentRequests - Recent request timestamps
 * @param {number} now - Current timestamp
 */
const updateRateLimitStore = (ip, recentRequests, now) => {
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
};

/**
 * Checks and enforces rate limiting for IP address.
 * @param {string} ip - Client IP address
 * @returns {{allowed: boolean, remaining: number, resetTime: Date}} Rate limit status
 */
const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];
  const recentRequests = cleanOldRequests(userRequests, now);

  if (isRateLimitExceeded(recentRequests)) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(recentRequests[0] + RATE_LIMIT_WINDOW),
    };
  }

  updateRateLimitStore(ip, recentRequests, now);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - recentRequests.length,
    resetTime: new Date(now + RATE_LIMIT_WINDOW),
  };
};

// === RECAPTCHA ===
/**
 * Calls Google reCAPTCHA API for token verification.
 * @param {string} secretKey - reCAPTCHA secret key
 * @param {string} token - reCAPTCHA token from client
 * @returns {Promise<Object>} reCAPTCHA API response
 */
const callRecaptchaApi = async (secretKey, token) => {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    }
  );
  return response.json();
};

/**
 * Validates reCAPTCHA token.
 * @param {string|null} token - reCAPTCHA token
 * @returns {Promise<Object>} Validation result with success and score
 */
const validateRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set - skipping");
    return { success: true, score: 1.0 };
  }

  if (!token) return { success: false, error: "Token missing" };

  try {
    const data = await callRecaptchaApi(secretKey, token);
    console.log("reCAPTCHA:", { success: data.success, score: data.score });
    return data;
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    return { success: false, error: error.message };
  }
};

// === EMAIL ===
/**
 * Retrieves SMTP configuration from environment variables.
 * @returns {Object} SMTP configuration object
 */
const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Creates nodemailer email transporter.
 * @returns {Object} Nodemailer transporter instance
 */
const createEmailTransporter = () => {
  const config = getSmtpConfig();
  // Handle different bundling scenarios
  if (typeof nodemailer.createTransport === 'function') {
    return nodemailer.createTransport(config);
  }
  if (nodemailer.default && typeof nodemailer.default.createTransport === 'function') {
    return nodemailer.default.createTransport(config);
  }
  throw new Error('nodemailer.createTransport not available');
};

/**
 * Builds HTML email content from form data.
 * @param {string} name - Sender name
 * @param {string} email - Sender email
 * @param {string} subject - Email subject
 * @param {string} message - Email message body
 * @returns {string} HTML email content
 */
const buildEmailHtml = (name, email, subject, message) => `
  <h2>Neue Nachricht vom Kontaktformular</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>E-Mail:</strong> ${email}</p>
  <p><strong>Betreff:</strong> ${subject}</p>
  <h3>Nachricht:</h3>
  <p>${message.replace(/\n/g, "<br>")}</p>
`;

/**
 * Creates mail options object for nodemailer.
 * @param {Object} formData - Form data object
 * @returns {Object} Mail options for nodemailer
 */
const getMailOptions = (formData) => ({
  from: process.env.FROM_EMAIL,
  to: process.env.TO_EMAIL,
  subject: `Kontaktformular: ${formData.subject}`,
  html: buildEmailHtml(
    formData.name,
    formData.email,
    formData.subject,
    formData.message
  ),
  replyTo: formData.email,
});

/**
 * Sends email using nodemailer.
 * @param {Object} formData - Form data object
 * @returns {Promise<Object>} Email send result
 */
const sendEmail = async (formData) => {
  const transporter = createEmailTransporter();
  await transporter.verify();
  const mailOptions = getMailOptions(formData);
  return await transporter.sendMail(mailOptions);
};

// === VALIDATION ===
/**
 * Parses JSON request body.
 * @param {string} eventBody - Raw request body
 * @returns {Object} Parsed JSON object
 * @throws {Error} If JSON parsing fails
 */
const parseRequestBody = (eventBody) => {
  try {
    return JSON.parse(eventBody);
  } catch (error) {
    throw new Error("Invalid JSON");
  }
};

/**
 * Validates form data fields.
 * @param {Object} data - Form data to validate
 * @returns {{name: string, email: string, subject: string, message: string}} Validated form data
 * @throws {Error} If required fields are missing
 */
const validateFormData = (data) => {
  const { name, email, subject, message } = data;
  if (!name || !email || !subject || !message) {
    throw new Error("All fields required");
  }
  return { name, email, subject, message };
};

/**
 * Checks that all required environment variables are set.
 * @throws {Error} If any required environment variables are missing
 */
const checkEnvVariables = () => {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "FROM_EMAIL",
    "TO_EMAIL",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
};

// === HANDLERS ===
/**
 * Extracts client IP from request headers.
 * @param {Object} headers - Request headers
 * @returns {string} Client IP address
 */
const getClientIP = (headers) =>
  headers["x-forwarded-for"] || headers["client-ip"] || "unknown";

/**
 * Validates HTTP method and handles OPTIONS/non-POST requests.
 * @param {string} method - HTTP method
 * @returns {Object|null} Error response or null if valid
 */
const validateHttpMethod = (method) => {
  if (method === "OPTIONS") return buildResponse(200, "");
  if (method !== "POST") return buildErrorResponse(405, "Method not allowed");
  return null;
};

/**
 * Processes validated POST request (reCAPTCHA, email).
 * @param {Object} body - Parsed request body
 * @param {Object} formData - Validated form data
 * @returns {Promise<Object>} Success response
 */
const processEmailRequest = async (body, formData) => {
  const recaptchaResult = await validateRecaptcha(body.recaptchaToken);
  if (!recaptchaResult.success) {
    return buildErrorResponse(403, "reCAPTCHA validation failed");
  }
  const recaptchaError = handleRecaptchaFailure(recaptchaResult.score);
  if (recaptchaError) return recaptchaError;
  checkEnvVariables();
  const info = await sendEmail(formData);
  console.log("Email sent:", info.messageId);
  return buildSuccessResponse({
    message: "Email sent successfully",
    success: true,
    messageId: info.messageId,
  });
};

/**
 * Handles complete POST request with rate limiting.
 * @param {Object} event - Netlify event object
 * @returns {Promise<Object>} HTTP response
 */
const handlePostRequest = async (event) => {
  const clientIP = getClientIP(event.headers);
  const rateLimitResult = checkRateLimit(clientIP);
  if (!rateLimitResult.allowed) {
    return handleRateLimitExceeded(rateLimitResult.resetTime);
  }
  const body = parseRequestBody(event.body);
  const formData = validateFormData(body);
  return await processEmailRequest(body, formData);
};

/**
 * Handles rate limit exceeded scenario.
 * @param {Date} resetTime - When rate limit resets
 * @returns {Object} Rate limit error response
 */
const handleRateLimitExceeded = (resetTime) =>
  buildResponse(
    429,
    {
      error: "Too many requests. Please try again later.",
      resetTime: resetTime.toISOString(),
    },
    {
      "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": resetTime.toISOString(),
    }
  );

/**
 * Handles reCAPTCHA score validation.
 * @param {number} score - reCAPTCHA score (0.0-1.0)
 * @returns {Object|null} Error response if score too low, null otherwise
 */
const handleRecaptchaFailure = (score) => {
  if (!score || score >= 0.5) return null;
  return buildErrorResponse(403, "Suspicious activity detected");
};

// === MAIN HANDLER ===
/**
 * Main Netlify function handler for contact form submissions.
 * @param {Object} event - Netlify event object
 * @param {string} event.httpMethod - HTTP method
 * @param {Object} event.headers - Request headers
 * @param {string} event.body - Request body
 * @returns {Promise<Object>} HTTP response object
 */
export const handler = async (event) => {
  console.log("=== Function Start ===");
  const methodError = validateHttpMethod(event.httpMethod);
  if (methodError) return methodError;
  try {
    return await handlePostRequest(event);
  } catch (error) {
    console.error("Error:", error);
    return buildErrorResponse(500, "Internal server error", error.message);
  }
};
