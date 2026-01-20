/**
 * @fileoverview Main application entry point for SPA
 * @description Initializes router and handles page rendering
 * @module app
 */

import Router from './router.js';
import { HomePage, PrivacyPolicyPage, SourcesPage, AboutPage, NotFoundPage } from './pages.js';

/**
 * Extracts form data from FormData object
 * @param {FormData} formData - FormData object
 * @returns {{name: string, email: string, subject: string, message: string}} Form data object
 */
const extractFormData = (formData) => ({
  name: formData.get('name')?.trim(),
  email: formData.get('email')?.trim(),
  subject: formData.get('subject')?.trim(),
  message: formData.get('message')?.trim(),
});

/**
 * Validates form data completeness
 * @param {Object} data - Form data object
 * @returns {boolean} True if all fields are filled
 */
const isFormDataValid = (data) =>
  data.name && data.email && data.subject && data.message;

/**
 * Shows error message in status element
 * @param {HTMLElement} status - Status element
 * @param {string} message - Error message
 */
const showError = (status, message) => {
  status.className = 'form-status form-status--error';
  status.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
};

/**
 * Shows success message in status element
 * @param {HTMLElement} status - Status element
 * @param {HTMLFormElement} form - Form to reset
 */
const showSuccess = (status, form) => {
  status.className = 'form-status form-status--success';
  status.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
  form.reset();
};

/**
 * Sets loading state on submit button
 * @param {HTMLButtonElement} btn - Submit button
 * @param {boolean} loading - Loading state
 */
const setLoadingState = (btn, loading) => {
  if (loading) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
  } else {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
  }
};

/**
 * Clears status message
 * @param {HTMLElement} status - Status element
 */
const clearStatus = (status) => {
  status.className = 'form-status';
  status.textContent = '';
};

/**
 * Sends form data to server
 * @param {Object} data - Form data
 * @param {string|null} token - reCAPTCHA token
 * @returns {Promise<Response>} Fetch response
 */
const sendFormData = async (data, token) => {
  return await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, recaptchaToken: token }),
  });
};

/**
 * Validates response and throws on error
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Parsed result
 * @throws {Error} If response not ok
 */
const validateResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Server error (${response.status})`);
  }
  return result;
};

/**
 * Gets reCAPTCHA site key from script tag
 * @returns {string|null} Site key or null
 */
const getRecaptchaSiteKey = () => {
  const script = document.querySelector('script[src*="api.js?render="]');
  return script?.src.match(/render=([^&]+)/)?.[1];
};

/**
 * Gets reCAPTCHA token
 * @returns {Promise<string|null>} Token or null
 */
const getRecaptchaToken = async () => {
  if (typeof grecaptcha === 'undefined') return null;
  try {
    const siteKey = getRecaptchaSiteKey();
    if (!siteKey || siteKey === 'DEIN_RECAPTCHA_SITE_KEY') return null;
    return await grecaptcha.execute(siteKey, { action: 'submit' });
  } catch (error) {
    return null;
  }
};

/**
 * Gets form DOM elements
 * @param {HTMLFormElement} form - Form element
 * @returns {{form: HTMLFormElement, status: HTMLElement, submitBtn: HTMLButtonElement}} Form elements
 */
const getFormElements = (form) => ({
  form,
  status: document.getElementById('formStatus'),
  submitBtn: document.querySelector('.contact-form__button'),
});

/**
 * Prepares form for submission
 * @param {HTMLButtonElement} submitBtn - Submit button
 * @param {HTMLElement} status - Status element
 */
const prepareFormSubmission = (submitBtn, status) => {
  setLoadingState(submitBtn, true);
  clearStatus(status);
};

/**
 * Submits form data to server
 * @param {Object} data - Form data
 * @param {HTMLElement} status - Status element
 * @param {HTMLFormElement} form - Form element
 * @returns {Promise<void>}
 */
const submitFormData = async (data, status, form) => {
  const token = await getRecaptchaToken();
  const response = await sendFormData(data, token);
  await validateResponse(response);
  showSuccess(status, form);
};

/**
 * Handles form submission event
 * @param {Event} e - Submit event
 * @returns {Promise<void>}
 */
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const { form, status, submitBtn } = getFormElements(e.target);
  const data = extractFormData(new FormData(form));
  if (!isFormDataValid(data)) return showError(status, 'Please fill in all fields.');
  prepareFormSubmission(submitBtn, status);
  try {
    await submitFormData(data, status, form);
  } catch (error) {
    showError(status, `Error: ${error.message}`);
  } finally {
    setLoadingState(submitBtn, false);
  }
};

/**
 * Initializes contact form event listeners if form exists
 * @returns {void}
 */
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', handleFormSubmit);
};

/**
 * Renders a page in the app container
 * @param {Function} pageComponent - Page component function
 */
const renderPage = (pageComponent) => {
  const app = document.getElementById('app');
  app.innerHTML = pageComponent();

  if (typeof window.reinitThemeToggle === 'function') {
    window.reinitThemeToggle();
  }

  initContactForm();
};

const router = new Router();

router.addRoute('/', () => renderPage(HomePage));
router.addRoute('/privacy-policy', () => renderPage(PrivacyPolicyPage));
router.addRoute('/sources', () => renderPage(SourcesPage));
router.addRoute('/about', () => renderPage(AboutPage));
router.addRoute('/404', () => renderPage(NotFoundPage));

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => router.init());
} else {
  router.init();
}
