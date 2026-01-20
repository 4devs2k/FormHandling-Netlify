# 🏗️ Code Structure & Guidelines

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Coding Standards](#coding-standards)
- [BEM Methodology](#bem-methodology)
- [Function Rules](#function-rules)
- [File Structure](#file-structure)
- [Technologies](#technologies)

---

## 🎯 Project Overview

This project implements a modern single-page application (SPA) with client-side routing and serverless backend, featuring:
- **SPA Architecture** with History API routing
- **Client-Side Routing** for multiple pages without reloads
- **Component-Based Structure** with reusable templates
- **Email delivery** via Netlify Functions and nodemailer
- **reCAPTCHA v3** spam protection
- **Rate limiting** (5 requests/hour/IP)
- **BEM CSS** methodology
- **ES6+ Modules** (.mjs for backend, .js for frontend)
- **Strict function rules** (max 14 lines)

---

## 📏 Coding Standards

### 1. Function Rules

Every function must follow these **strict guidelines**:

- ✅ **Maximum 14 lines** per function
- ✅ **One clear task** per function
- ✅ **No nested functions** (extract to separate functions)
- ✅ **Split complex logic** into helper functions
- ✅ **Arrow functions** preferred (except constructors/event handlers)
- ✅ **Descriptive names:** Short and concise (3-5 words max)
- ✅ **camelCase naming:** `getUserById`, not `Get_User_By_ID`
- ✅ **JSDoc documentation** for all functions

**Example:**

```javascript
/**
 * Validates form data and shows error if invalid.
 * @param {Object} formData - Form data to validate
 * @param {HTMLElement} statusEl - Status element for error display
 * @returns {boolean} True if valid
 */
const validateAndPrepareForm = (formData, statusEl) => {
  if (!isFormDataValid(formData)) {
    showError(statusEl, "Please fill in all fields.");
    return false;
  }
  return true;
};
```

### 2. ES6+ Modules

- Use `.mjs` extension for ES6 modules
- Use `import`/`export` instead of `require`/`module.exports`
- Default exports for main handlers

**Example:**

```javascript
// ❌ CommonJS (old)
const nodemailer = require('nodemailer');
exports.handler = async (event) => { ... };

// ✅ ES6+ (new)
import nodemailer from 'nodemailer';
export const handler = async (event) => { ... };
```

### 3. JSDoc Documentation

All functions must have JSDoc comments:

```javascript
/**
 * Brief description of what the function does.
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @throws {Error} When error occurs (optional)
 */
```

---

## 🎨 BEM Methodology

### BEM Structure

**Block__Element--Modifier**

- **Block:** Independent component (`.header`, `.contact-form`)
- **Element:** Part of a block (`.header__title`, `.contact-form__input`)
- **Modifier:** Variation of block/element (`.form-status--error`, `.form-status--success`)

### BEM Naming Convention

```css
/* Block */
.contact-form { }

/* Element */
.contact-form__group { }
.contact-form__label { }
.contact-form__input { }
.contact-form__button { }

/* Modifier */
.form-status--success { }
.form-status--error { }
```

### HTML Example

```html
<form class="contact-form">
  <div class="contact-form__group">
    <label class="contact-form__label">Name:</label>
    <input class="contact-form__input" type="text">
  </div>
  <button class="contact-form__button">Send</button>
</form>

<div class="form-status form-status--success">
  Message sent!
</div>
```

### JavaScript Selectors

```javascript
// ❌ Old (non-BEM)
document.querySelector('.submit-btn')

// ✅ BEM
document.querySelector('.contact-form__button')
```

### Blocks in this Project

- `.page` - Main container
- `.header` - Header section
- `.content` - Content area
- `.demo` - Demo section
- `.contact-form` - Contact form
- `.form-status` - Status messages (with `--success`/`--error` modifiers)
- `.methods` - Methods grid
- `.method` - Individual method block
- `.steps` - Steps container
- `.note` - Note block
- `.warning` - Warning block
- `.footer` - Footer section

---

## 📁 File Structure

```
email-example/
├── index.html                 # SPA container (single div#app)
├── scss/                      # Sass source files
│   ├── main.scss              # Master import file (@use syntax)
│   ├── _variables.scss        # Colors, spacing, breakpoints
│   ├── _mixins.scss           # Responsive mixins
│   ├── _base.scss             # Reset, root, global styles
│   ├── _theme-toggle.scss     # Theme switcher
│   ├── _hero.scss             # Hero section
│   ├── _demo.scss             # Contact form section
│   ├── _features.scss         # Features grid
│   ├── _tech-stack.scss       # Tech stack grid
│   ├── _content-pages.scss    # Content pages styling
│   └── _footer.scss           # Footer with navigation
├── css/                       # Compiled CSS (gitignored)
│   └── main.css               # Generated from SCSS
├── js/                        # JavaScript ES6+ modules
│   ├── app.js                 # SPA entry point, router init
│   ├── router.js              # History API router
│   ├── pages.js               # Page components (Home, Privacy, Sources, About)
│   ├── components.js          # Shared components (Hero, Footer, ThemeToggle)
│   └── theme-toggle.js        # Theme switcher logic
├── assets/
│   ├── icons/                 # Custom SVG icons (15 files)
│   ├── scheme/                # Theme toggle SVG icons
│   └── theme/                 # Favicon
├── netlify.toml               # Netlify config (SPA redirects)
├── README.md                  # Quick start guide
├── RECAPTCHA_SETUP.md         # reCAPTCHA configuration guide
├── CODE_STRUCTURE.md          # This file
├── package.json               # Dependencies & scripts
├── .gitignore                 # Git ignore rules
└── netlify/
    └── functions/
        ├── send-email.mjs         # Main serverless function
        └── templates/             # Email HTML templates
            ├── notification.mjs   # Recipient email template
            └── confirmation.mjs   # Sender confirmation template
```

---

## 🔀 SPA Architecture

### Router System

The application uses a **custom History API router** for clean URLs without hash symbols.

**Key Components:**

1. **`js/router.js`** - Router class
   - Manages routes and navigation
   - Handles browser back/forward buttons
   - Intercepts link clicks with `data-link` attribute
   - Scrolls to top on route change

2. **`js/app.js`** - Application entry point
   - Initializes router
   - Registers all routes
   - Handles page rendering
   - Re-initializes dynamic components (theme toggle, form)

3. **`js/pages.js`** - Page templates
   - `HomePage()` - Main page with hero and contact form
   - `PrivacyPolicyPage()` - Privacy policy
   - `SourcesPage()` - Sources and credits
   - `AboutPage()` - About project and developer
   - `NotFoundPage()` - 404 error page

4. **`js/components.js`** - Shared templates
   - `getHero()` - Hero section (home only)
   - `getThemeToggle()` - Theme toggle button
   - `getFooter()` - Footer with navigation

### Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Contact form and features |
| `/privacy-policy` | `PrivacyPolicyPage` | Privacy information |
| `/sources` | `SourcesPage` | Credits and sources |
| `/about` | `AboutPage` | About developer and project |
| `/404` | `NotFoundPage` | Not found error |

### Navigation Flow

1. User clicks link with `data-link` attribute
2. Router intercepts click event
3. `router.navigate(path)` updates browser history
4. `router.loadRoute(path)` renders page component
5. `renderPage()` injects HTML into `#app` div
6. Dynamic components re-initialize (theme, form)

### Netlify SPA Support

`netlify.toml` configuration:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This enables:
- Direct URL access (e.g., `/about`)
- Page refresh support
- Browser back/forward buttons
- Proper 404 handling

---

## 🔧 Technologies

### Frontend

- **HTML5** - Semantic markup, SPA container
- **Sass (SCSS)** - Modular CSS architecture with @use syntax
- **CSS3** - BEM methodology, light-dark() function, responsive design
- **JavaScript (ES6+)** - Modern syntax, arrow functions, ES6 modules
- **History API** - Client-side routing with clean URLs
- **Custom SVG Icons** - No external dependencies
- **Google reCAPTCHA v3** - Invisible spam protection

### Backend (Netlify Functions)

- **Node.js 22.x** - Runtime environment
- **ES6+ Modules** (.mjs) - Modern import/export
- **nodemailer 7.0.6** - SMTP email delivery
- **esbuild** - Function bundler

### Development

- **Git** - Version control
- **GitHub** - Repository hosting
- **Netlify** - Deployment platform
- **JSDoc** - Code documentation

---

## 🔄 Development Workflow

### 1. Local Development

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local dev server
netlify dev
```

### 2. Environment Variables

Create `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
TO_EMAIL=recipient@example.com
RECAPTCHA_SECRET_KEY=your-secret-key
```

### 3. Code Quality Checklist

Before committing:

- ✅ All functions ≤ 14 lines
- ✅ JSDoc comments added
- ✅ BEM naming followed
- ✅ ES6+ syntax used
- ✅ No console errors
- ✅ Tested locally with `netlify dev`

### 4. Git Workflow

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add new feature"

# Push to GitHub (triggers Netlify deploy)
git push origin master
```

### 5. Deployment

Netlify auto-deploys on push to `master`:

1. Build command: `cd netlify/functions && npm install && cd ../..`
2. Functions bundler: `esbuild`
3. Deploy time: ~10-30 seconds
4. Live URL: https://formhandling-netlify.netlify.app

---

## 📦 Dependencies

### Root (`package.json`)

Currently minimal - add dev dependencies as needed.

### Functions (`netlify/functions/package.json`)

```json
{
  "dependencies": {
    "nodemailer": "^7.0.6"
  }
}
```

**Why separate package.json?**
- Functions need their own dependencies
- Cleaner bundling with esbuild
- Faster cold starts

---

## 🎯 Code Examples

### Example 1: 14-Line Function

```javascript
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
```

**Note:** Complex logic split into helper functions (`validateAndPrepareForm`, `submitFormToServer`, `handleSubmitSuccess`, `handleSubmitError`).

### Example 2: BEM CSS

```css
/* Block */
.contact-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
}

/* Elements */
.contact-form__group {
  margin-bottom: 1.25rem;
}

.contact-form__label {
  display: block;
  font-weight: 600;
  color: white;
}

.contact-form__input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
}

/* Modifier */
.contact-form__button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
```

### Example 3: ES6+ Module Export

```javascript
// netlify/functions/send-email.mjs
import nodemailer from 'nodemailer';

const sendEmail = async (formData) => {
  // ... implementation
};

export const handler = async (event) => {
  // Main handler logic
  const info = await sendEmail(formData);
  return buildSuccessResponse({ messageId: info.messageId });
};
```

---

## 🚀 Performance Optimizations

### 1. Function Bundling

- **esbuild** bundles dependencies
- **Tree-shaking** removes unused code
- **Minification** reduces file size

### 2. Rate Limiting

- **In-memory Map** for tracking (simple projects)
- **5 requests/hour/IP** limit
- **1-hour window** with automatic cleanup

**Limitation:** Memory resets on cold starts. For production, consider:
- Redis
- Netlify Edge Functions with KV Storage
- Upstash Rate Limiting

### 3. reCAPTCHA v3

- **Invisible** - No user interaction
- **Score-based** - 0.0 (bot) to 1.0 (human)
- **Threshold:** 0.5 (configurable)

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` to Git
- ✅ Always add `.env` to `.gitignore`
- ✅ Use Netlify Environment Variables for production
- ✅ Mark sensitive values as "Secret"

### SMTP Credentials

- ✅ Use Gmail App Passwords, not regular passwords
- ✅ Enable 2FA on Gmail account
- ✅ Store in Netlify Environment Variables

### reCAPTCHA Keys

- ✅ **Site Key** - Public (in HTML)
- ✅ **Secret Key** - Private (in Netlify Environment Variables)
- ✅ Never expose Secret Key in client-side code

---

## 🧪 Testing

### Manual Testing

1. **Form Validation**
   - Submit empty form → Error message
   - Fill form → Success message

2. **reCAPTCHA**
   - Check console for "reCAPTCHA Token erhalten"
   - Verify score in Netlify Function logs

3. **Rate Limiting**
   - Submit 6 requests quickly
   - 6th request should return 429 error

4. **Email Delivery**
   - Check recipient inbox
   - Verify sender, subject, message

### Debugging

**Browser Console:**
```javascript
// Check reCAPTCHA status
typeof grecaptcha // should be "object"

// Check site key extraction
const script = document.querySelector('script[src*="api.js?render="]');
script?.src.match(/render=([^&]+)/)?.[1]
```

**Netlify Function Logs:**
1. Go to: https://app.netlify.com/sites/formhandling-netlify/functions
2. Click on `send-email`
3. View logs for errors

---

## 📚 Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [BEM Methodology](https://getbem.com/)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Nodemailer Documentation](https://nodemailer.com/)
- [JSDoc Documentation](https://jsdoc.app/)

---

## 🤝 Contributing

When contributing to this project:

1. Follow the **14-line function rule**
2. Use **BEM naming** for CSS classes
3. Add **JSDoc comments** to all functions
4. Use **ES6+ syntax** (arrow functions, template literals, etc.)
5. Test locally with `netlify dev`
6. Write descriptive commit messages

---

## 📝 License

This project is for educational purposes.

---

## 👨‍💻 Author

Built with ❤️ while learning Netlify Functions, BEM, and modern JavaScript practices.
