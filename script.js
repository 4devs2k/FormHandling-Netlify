/**
 * @fileoverview Client-side script for handling contact form submissions with reCAPTCHA and UI feedback.
 * @description
 * This script manages the contact form submission process, including extracting form data,
 * obtaining reCAPTCHA tokens, sending data to the serverless function, and updating the UI
 * based on success or failure of the submission.
 * @module script
 */

// === DOM ELEMENTS ===
/**
 * Retrieves all form-related DOM elements.
 * @returns {{form: HTMLFormElement, status: HTMLElement, submitBtn: HTMLButtonElement}} Form elements object
 */
const getFormElements = () => ({
  form: document.getElementById("contactForm"),
  status: document.getElementById("formStatus"),
  submitBtn: document.querySelector(".contact-form__button"),
});

// === FORM DATA ===
/**
 * Extracts and trims form data values.
 * @param {FormData} formData - Form data object
 * @returns {{name: string, email: string, subject: string, message: string}} Extracted form values
 */
const extractFormData = (formData) => ({
  name: formData.get("name")?.trim(),
  email: formData.get("email")?.trim(),
  subject: formData.get("subject")?.trim(),
  message: formData.get("message")?.trim(),
});

/**
 * Validates that all form fields are filled.
 * @param {{name: string, email: string, subject: string, message: string}} data - Form data
 * @returns {boolean} True if all fields are filled
 */
const isFormDataValid = (data) =>
  data.name && data.email && data.subject && data.message;

// === UI UPDATES ===
/**
 * Displays an error message in the status element.
 * @param {HTMLElement} statusEl - Status element
 * @param {string} message - Error message to display
 */
const showError = (statusEl, message) => {
  statusEl.className = "form-status form-status--error";
  statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
};

/**
 * Displays a success message in the status element.
 * @param {HTMLElement} statusEl - Status element
 */
const showSuccess = (statusEl) => {
  statusEl.className = "form-status form-status--success";
  statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Nachricht erfolgreich gesendet!';
};

/**
 * Toggles loading state of submit button.
 * @param {HTMLButtonElement} btn - Submit button element
 * @param {boolean} isLoading - Whether to show loading state
 */
const setLoadingState = (btn, isLoading) => {
  if (isLoading) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sende...';
    btn.disabled = true;
  } else {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Nachricht senden';
    btn.disabled = false;
  }
};

/**
 * Clears the status message.
 * @param {HTMLElement} statusEl - Status element
 */
const clearStatus = (statusEl) => {
  statusEl.className = "form-status";
  statusEl.textContent = "";
};

// === RECAPTCHA ===
/**
 * Extracts reCAPTCHA site key from script tag.
 * @returns {string|null} Site key or null if not found
 */
const getRecaptchaSiteKey = () => {
  const script = document.querySelector('script[src*="recaptcha"]');
  return script?.src.match(/render=([^&]+)/)?.[1];
};

/**
 * Checks if reCAPTCHA is properly configured.
 * @param {string} siteKey - Site key to validate
 * @returns {boolean} True if configured
 */
const isRecaptchaConfigured = (siteKey) =>
  siteKey && siteKey !== "DEIN_RECAPTCHA_SITE_KEY";

/**
 * Retrieves reCAPTCHA v3 token.
 * @returns {Promise<string|null>} reCAPTCHA token or null if unavailable
 */
const getRecaptchaToken = async () => {
  if (typeof grecaptcha === "undefined") return null;

  try {
    const siteKey = getRecaptchaSiteKey();
    if (!isRecaptchaConfigured(siteKey)) {
      console.warn("reCAPTCHA Site Key noch nicht konfiguriert");
      return null;
    }

    const token = await grecaptcha.execute(siteKey, { action: "submit" });
    console.log("reCAPTCHA Token erhalten");
    return token;
  } catch (error) {
    console.warn("reCAPTCHA Fehler:", error);
    return null;
  }
};

// === API CALL ===
/**
 * Sends form data to the serverless function.
 * @param {Object} formData - Form data object
 * @param {string|null} recaptchaToken - reCAPTCHA token
 * @returns {Promise<Response>} Fetch response
 */
const sendFormData = async (formData, recaptchaToken) => {
  const response = await fetch("/.netlify/functions/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, recaptchaToken }),
  });

  console.log("Response Status:", response.status);
  return response;
};

/**
 * Parses JSON response from server.
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed JSON data
 * @throws {Error} If JSON parsing fails
 */
const parseResponse = async (response) => {
  try {
    const result = await response.json();
    console.log("Response Data:", result);
    return result;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error("Serverantwort konnte nicht verarbeitet werden");
  }
};

// === ERROR HANDLING ===
/**
 * Generates user-friendly error message.
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (error) => {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Netzwerkfehler - bitte prüfen Sie Ihre Internetverbindung";
  }
  if (error.message.includes("Zu viele Anfragen")) {
    return "Zu viele Anfragen. Bitte warten Sie eine Stunde und versuchen Sie es erneut.";
  }
  return error.message || "Unbekannter Fehler beim Senden";
};

// === FORM HANDLER ===
/**
 * Validates form data and shows error if invalid.
 * @param {Object} formData - Form data to validate
 * @param {HTMLElement} statusEl - Status element for error display
 * @returns {boolean} True if valid
 */
const validateAndPrepareForm = (formData, statusEl) => {
  if (!isFormDataValid(formData)) {
    showError(statusEl, "Bitte füllen Sie alle Felder aus.");
    return false;
  }
  return true;
};

/**
 * Handles successful form submission.
 * @param {HTMLFormElement} form - Form element to reset
 * @param {HTMLElement} statusEl - Status element for success message
 */
const handleSubmitSuccess = (form, statusEl) => {
  showSuccess(statusEl);
  form.reset();
};

/**
 * Handles form submission error.
 * @param {Error} error - Error object
 * @param {HTMLElement} statusEl - Status element for error display
 */
const handleSubmitError = (error, statusEl) => {
  console.error("Form Submit Error:", error);
  showError(statusEl, `Fehler beim Senden: ${getErrorMessage(error)}`);
};

/**
 * Submits form data to server with reCAPTCHA.
 * @param {Object} formData - Form data to send
 * @returns {Promise<Object>} Server response
 * @throws {Error} If submission fails
 */
const submitFormToServer = async (formData) => {
  const recaptchaToken = await getRecaptchaToken();
  console.log("Sende Formulardaten...", formData);
  const response = await sendFormData(formData, recaptchaToken);
  const result = await parseResponse(response);
  if (!response.ok) {
    throw new Error(result.error || `Server-Fehler (${response.status})`);
  }
  return result;
};

/**
 * Handles form submission event.
 * @param {Event} e - Submit event
 * @returns {Promise<void>}
 */
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const { form, status, submitBtn } = getFormElements();
  const formData = extractFormData(new FormData(form));

  if (!validateAndPrepareForm(formData, status)) return;

  setLoadingState(submitBtn, true);
  clearStatus(status);

  try {
    await submitFormToServer(formData);
    handleSubmitSuccess(form, status);
  } catch (error) {
    handleSubmitError(error, status);
  } finally {
    setLoadingState(submitBtn, false);
  }
};

// === INIT ===
/**
 * Initializes contact form event listeners.
 */
const initContactForm = () => {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
};

initContactForm();
