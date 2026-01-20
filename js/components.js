/**
 * @fileoverview Shared components for SPA
 * @description Reusable header and footer templates
 */

/**
 * Get the theme toggle button
 * @returns {string} Theme toggle HTML
 */
export const getThemeToggle = () => {
  return `
    <!-- Theme Toggle Button -->
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
      <img
        src="assets/scheme/scheme-device.svg"
        alt="Auto theme"
        class="theme-toggle__icon"
        id="themeIcon"
      />
    </button>
  `;
};

/**
 * Get the hero section (only for home page)
 * @returns {string} Hero section HTML
 */
export const getHero = () => {
  return `
    <!-- Hero Section -->
    <section class="hero">
      ${getThemeToggle()}

      <div class="hero__container">
        <h1 class="hero__title">
          <img src="assets/icons/mail.svg" alt="" class="hero__icon" />
          Serverless Contact Form
        </h1>
        <p class="hero__subtitle">
          Modern contact form with Netlify Functions, reCAPTCHA v3, and
          intelligent spam protection
        </p>
        <a href="#demo" class="hero__cta"> Try Live Demo </a>
      </div>
    </section>
  `;
};

/**
 * Get the footer component HTML
 * @returns {string} Footer HTML
 */
export const getFooter = () => {
  return `
    <!-- Footer -->
    <footer class="footer">
      <div class="footer__container">
        <p class="footer__text">Built with ❤️ using Netlify Functions</p>
        <div class="footer__links">
          <a
            href="https://github.com/4devs2k/FormHandling-Netlify"
            target="_blank"
            class="footer__link"
          >
            <img src="assets/icons/github.svg" alt="" class="footer__icon" />
            View on GitHub
          </a>
          <a
            href="https://github.com/4devs2k/FormHandling-Netlify/blob/master/CODE_STRUCTURE.md"
            target="_blank"
            class="footer__link"
          >
            <img
              src="assets/icons/documentation.svg"
              alt=""
              class="footer__icon"
            />
            Documentation
          </a>
        </div>
        <nav class="footer__nav" aria-label="Footer navigation">
          <a href="/privacy-policy" data-link class="footer__nav-link">Privacy Policy</a>
          <span class="footer__separator">•</span>
          <a href="/sources" data-link class="footer__nav-link">Sources</a>
          <span class="footer__separator">•</span>
          <a href="/about" data-link class="footer__nav-link">About</a>
          <span class="footer__separator">•</span>
          <a href="/" data-link class="footer__nav-link">Home</a>
        </nav>
      </div>
    </footer>
  `;
};
