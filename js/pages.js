/**
 * @fileoverview Page components for SPA
 * @description Individual page templates for routing
 */

import { getHero, getThemeToggle, getFooter } from './components.js';

/**
 * Home page with demo form
 * @returns {string} Home page HTML
 */
export const HomePage = () => {
  return `
    ${getHero()}

    <!-- Demo Section -->
    <section id="demo" class="demo">
      <div class="demo__container">
        <h2 class="demo__title">
          <img src="assets/icons/mail.svg" alt="" class="demo__icon" /> Live
          Demo
        </h2>
        <p class="demo__description">
          Test the contact form - all messages are delivered via email.
        </p>

        <form id="contactForm" class="contact-form">
          <div class="contact-form__group">
            <label for="name" class="contact-form__label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="contact-form__input"
              placeholder="Your Name"
              required
            />
          </div>

          <div class="contact-form__group">
            <label for="email" class="contact-form__label">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              class="contact-form__input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="contact-form__group">
            <label for="subject" class="contact-form__label">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              class="contact-form__input"
              placeholder="What is this about?"
              required
            />
          </div>

          <div class="contact-form__group">
            <label for="message" class="contact-form__label">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              class="contact-form__textarea"
              placeholder="Your message..."
              required
            ></textarea>
          </div>

          <button type="submit" class="contact-form__button">
            <i class="fas fa-paper-plane"></i> Send Message
          </button>
        </form>

        <div id="formStatus" class="form-status"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features__container">
        <h2 class="features__title">Features</h2>

        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/server.svg" alt="" />
            </div>
            <h3 class="feature-card__title">Serverless Functions</h3>
            <p class="feature-card__description">
              Netlify Functions for scalable backend without server management
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/reCAPTCHA.svg" alt="" />
            </div>
            <h3 class="feature-card__title">reCAPTCHA v3</h3>
            <p class="feature-card__description">
              Invisible spam protection with Google reCAPTCHA v3 (score-based)
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/rate-limiting.svg" alt="" />
            </div>
            <h3 class="feature-card__title">Rate Limiting</h3>
            <p class="feature-card__description">
              Automatic limit of 5 requests per hour per IP address
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/modemailer.svg" alt="" />
            </div>
            <h3 class="feature-card__title">SMTP Integration</h3>
            <p class="feature-card__description">
              Reliable email delivery via Nodemailer with SMTP
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/responsive.svg" alt="" />
            </div>
            <h3 class="feature-card__title">Responsive Design</h3>
            <p class="feature-card__description">
              Mobile-first design with BEM methodology for all screen sizes
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">
              <img src="assets/icons/clean-code.svg" alt="" />
            </div>
            <h3 class="feature-card__title">Clean Code</h3>
            <p class="feature-card__description">
              ES6+ modules, JSDoc documentation, max 14 lines per function
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-stack">
      <div class="tech-stack__container">
        <h2 class="tech-stack__title">Tech Stack</h2>

        <div class="tech-stack__grid">
          <div class="tech-item">
            <img src="assets/icons/nodejs.svg" alt="" class="tech-item__icon" />
            <div class="tech-item__name">Node.js</div>
          </div>

          <div class="tech-item">
            <img
              src="assets/icons/netlify.svg"
              alt=""
              class="tech-item__icon"
            />
            <div class="tech-item__name">Netlify</div>
          </div>

          <div class="tech-item">
            <img
              src="assets/icons/javascript.svg"
              alt=""
              class="tech-item__icon"
            />
            <div class="tech-item__name">ES6+</div>
          </div>

          <div class="tech-item">
            <img
              src="assets/icons/node-sass.svg"
              alt=""
              class="tech-item__icon"
            />
            <div class="tech-item__name">Sass/BEM</div>
          </div>

          <div class="tech-item">
            <img
              src="assets/icons/modemailer.svg"
              alt=""
              class="tech-item__icon"
            />
            <div class="tech-item__name">Nodemailer</div>
          </div>

          <div class="tech-item">
            <img src="assets/icons/google.svg" alt="" class="tech-item__icon" />
            <div class="tech-item__name">reCAPTCHA</div>
          </div>
        </div>
      </div>
    </section>

    ${getFooter()}
  `;
};

/**
 * Privacy Policy page
 * @returns {string} Privacy Policy page HTML
 */
export const PrivacyPolicyPage = () => {
  return `
    ${getThemeToggle()}

    <section class="content-page">
      <div class="content-page__container">
        <h1 class="content-page__title">Privacy Policy</h1>

        <div class="content-page__content">
          <h2>Data Collection</h2>
          <p>
            This contact form collects only the information you voluntarily provide:
          </p>
          <ul>
            <li>Konstantin Aksenov</li>
            <li>konstantin.aksenov@dev2k.org</li>
          </ul>

          <h2>Data Usage</h2>
          <p>
            The collected data is used exclusively to respond to your inquiry.
            We use Google reCAPTCHA v3 to protect against spam, which processes
            your IP address according to Google's Privacy Policy.
          </p>

          <h2>Data Storage</h2>
          <p>
            Messages are sent via Netlify Functions and delivered through SMTP.
            No data is permanently stored in databases. Rate limiting uses
            temporary IP-based counters that expire after one hour.
          </p>

          <h2>Third-Party Services</h2>
          <ul>
            <li><strong>Netlify:</strong> Serverless function hosting</li>
            <li><strong>Google reCAPTCHA v3:</strong> Spam protection</li>
            <li><strong>SMTP Provider:</strong> Email delivery</li>
          </ul>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            Since we don't store data permanently, submitted messages cannot be
            retrieved or deleted from our systems after delivery.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions, please contact us through the
            <a href="/" data-link>contact form</a>.
          </p>

          <p class="content-page__updated">Last updated: January 20, 2026</p>
        </div>
      </div>
    </section>

    ${getFooter()}
  `;
};

/**
 * Sources page
 * @returns {string} Sources page HTML
 */
export const SourcesPage = () => {
  return `
    ${getThemeToggle()}

    <section class="content-page">
      <div class="content-page__container">
        <h1 class="content-page__title">Sources & Credits</h1>

        <div class="content-page__content">
          <h2>Technologies</h2>
          <ul>
            <li>
              <strong>Netlify Functions:</strong>
              <a href="https://www.netlify.com/products/functions/" target="_blank" rel="noopener">
                Serverless Backend
              </a>
            </li>
            <li>
              <strong>Nodemailer:</strong>
              <a href="https://nodemailer.com/" target="_blank" rel="noopener">
                Email Sending Library
              </a>
            </li>
            <li>
              <strong>Google reCAPTCHA v3:</strong>
              <a href="https://developers.google.com/recaptcha/docs/v3" target="_blank" rel="noopener">
                Spam Protection
              </a>
            </li>
          </ul>

          <h2>Icons & Assets</h2>
          <p>
            Icons used in this project are custom-created SVG files or sourced from:
          </p>
          <ul>
            <li>
              <a href="https://fontawesome.com/" target="_blank" rel="noopener">
                Font Awesome
              </a> - Icons (MIT License)
            </li>
            <li>Custom SVG illustrations</li>
          </ul>

          <h2>Fonts</h2>
          <p>
            This project uses system fonts for optimal performance and
            consistent cross-platform appearance.
          </p>

          <h2>Code Libraries</h2>
          <ul>
            <li><strong>ES6+ JavaScript:</strong> Modern vanilla JavaScript</li>
            <li><strong>Sass/SCSS:</strong> CSS preprocessing</li>
            <li><strong>BEM Methodology:</strong> CSS naming convention</li>
          </ul>

          <h2>Inspiration</h2>
          <p>
            This project was inspired by the need for a simple, secure, and
            serverless contact form solution that prioritizes privacy and
            user experience.
          </p>

          <h2>Open Source</h2>
          <p>
            This project is open source and available on
            <a href="https://github.com/4devs2k/FormHandling-Netlify" target="_blank" rel="noopener">
              GitHub
            </a>.
          </p>
        </div>
      </div>
    </section>

    ${getFooter()}
  `;
};

/**
 * About page
 * @returns {string} About page HTML
 */
export const AboutPage = () => {
  return `
    ${getThemeToggle()}

    <section class="content-page">
      <div class="content-page__container">
        <h1 class="content-page__title">About</h1>

        <div class="content-page__content">
          <h2>About Me</h2>
          <p>
            Hi, I'm <strong>Konstantin Aksenov</strong> – a passionate software developer
            specializing in modern web applications, from user interfaces to server infrastructure.
          </p>
          <p>
            With expertise in <strong>JavaScript, Angular, and Node.js</strong>, I build not only
            engaging frontends but also robust backend systems and DevOps solutions. My passion
            lies in creating scalable, maintainable applications with clean code and great user experience.
          </p>

          <h2>Technologies I Work With</h2>
          <ul>
            <li><strong>Frontend:</strong> Angular, TypeScript, JavaScript (ES6+), HTML5, CSS3/Sass</li>
            <li><strong>Backend:</strong> Node.js, Express, Netlify Functions, RESTful APIs</li>
            <li><strong>Databases:</strong> MariaDB, MySQL, MongoDB</li>
            <li><strong>Tools & DevOps:</strong> Git, Docker, Netlify, CI/CD</li>
            <li><strong>Best Practices:</strong> BEM, Clean Code, JSDoc, Test-Driven Development</li>
          </ul>

          <h2>About This Project</h2>
          <p>
            This serverless contact form demonstrates modern web development
            practices using Netlify Functions, providing a secure and scalable
            solution without traditional server infrastructure.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li><strong>Serverless Architecture:</strong> No backend servers to manage</li>
            <li><strong>Spam Protection:</strong> Google reCAPTCHA v3 integration</li>
            <li><strong>Rate Limiting:</strong> 5 requests per hour per IP</li>
            <li><strong>Email Delivery:</strong> Reliable SMTP with Nodemailer</li>
            <li><strong>Responsive Design:</strong> Works on all devices</li>
            <li><strong>Clean Code:</strong> Well-documented, maintainable codebase</li>
          </ul>

          <h2>Technical Implementation</h2>
          <p>
            Built with vanilla JavaScript (ES6+), Sass/SCSS, and BEM methodology,
            this project showcases how to create a production-ready contact form
            using serverless functions. The architecture includes:
          </p>
          <ul>
            <li>Client-side form validation</li>
            <li>reCAPTCHA v3 token generation</li>
            <li>Netlify Function backend processing</li>
            <li>Rate limiting with TTL-based counters</li>
            <li>Email templating with HTML formatting</li>
            <li>SPA with History API routing</li>
          </ul>

          <h2>Development Philosophy</h2>
          <p>
            The project follows best practices including:
          </p>
          <ul>
            <li>JSDoc documentation for all functions</li>
            <li>Maximum 14 lines per function for maintainability</li>
            <li>ES6 modules for better code organization</li>
            <li>BEM naming convention for CSS</li>
            <li>Mobile-first responsive design</li>
            <li>Separation of concerns and clean architecture</li>
          </ul>

          <h2>Get in Touch</h2>
          <p>
            Interested in working together? Check out my
            <a href="https://github.com/KosMaster87" target="_blank" rel="noopener">GitHub</a>
            or connect with me on
            <a href="https://www.linkedin.com/in/konstantin-aksenov-802b88190/" target="_blank" rel="noopener">LinkedIn</a>.
            You can also reach me at
            <a href="mailto:konstantin.aksenov@dev2k.org">konstantin.aksenov@dev2k.org</a>.
          </p>

          <h2>Portfolio</h2>
          <p>
            View my complete portfolio with more projects at
            <a href="https://portfolio.dev2k.org" target="_blank" rel="noopener">Portfolio</a>.
          </p>
        </div>
      </div>
    </section>

    ${getFooter()}
  `;
};

/**
 * 404 Not Found page
 * @returns {string} 404 page HTML
 */
export const NotFoundPage = () => {
  return `
    ${getThemeToggle()}

    <section class="content-page">
      <div class="content-page__container">
        <h1 class="content-page__title">404 - Page Not Found</h1>

        <div class="content-page__content">
          <p>
            Sorry, the page you're looking for doesn't exist.
          </p>
          <p>
            <a href="/" data-link class="content-page__link">Go back to home</a>
          </p>
        </div>
      </div>
    </section>

    ${getFooter()}
  `;
};
