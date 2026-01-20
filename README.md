# 📧 Portfolio Landing Page with Contact Form

Modern single-page application (SPA) with serverless contact form, email delivery, reCAPTCHA v3 spam protection, and rate-limiting. Built with vanilla JavaScript ES6+, client-side routing, Sass, and deployed on Netlify.

## 🚀 Quick Start

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Watch SCSS changes:**
   ```bash
   npm run sass:watch
   ```

3. **Build CSS:**
   ```bash
   npm run build
   ```

### Deployment

1. **Environment Variables in Netlify:**
   - `TO_EMAIL` - Your email (receives form submissions)
   - `FROM_EMAIL` - Sender email address
   - `SMTP_HOST` - e.g., `smtp.gmail.com`
   - `SMTP_PORT` - e.g., `465`
   - `SMTP_USER` - Your Gmail address
   - `SMTP_PASS` - Gmail App Password ([create](https://myaccount.google.com/apppasswords))
   - `RECAPTCHA_SECRET_KEY` - reCAPTCHA Secret Key ([create](https://www.google.com/recaptcha/admin/create))

2. **Update reCAPTCHA Site Key in `index.html`:**
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
   ```

3. **Deploy:**
   ```bash
   git push origin master
   ```
   Netlify builds and deploys automatically!

## 🛡️ Features

### Core Features
- ✅ **SPA with History API** - Clean URLs without hash symbols (`/privacy` instead of `#/privacy`)
- ✅ **Client-Side Routing** - Multiple pages (Home, Privacy Policy, Sources, About) without page reloads
- ✅ **Component-Based Architecture** - Reusable templates and modular structure
- ✅ Serverless email delivery via Netlify Functions + Nodemailer
- ✅ reCAPTCHA v3 (invisible spam protection)
- ✅ Rate-limiting (max 5 requests/hour/IP)
- ✅ Auto light/dark mode with manual toggle

### Code Quality
- ✅ **14-line function rule** - Maximum 14 lines per function for maintainability
- ✅ **ES6+ modules** - Modern JavaScript with import/export
- ✅ **JSDoc documentation** - All functions fully documented
- ✅ **BEM methodology** - Clean, maintainable CSS
- ✅ Modular Sass architecture
- ✅ Custom SVG icons (no external dependencies)
- ✅ Responsive design (mobile-first)

## 📁 Project Structure

```
/
├── scss/                      # Sass source files
│   ├── _variables.scss        # Colors, spacing, breakpoints
│   ├── _mixins.scss           # Responsive mixins
│   ├── _base.scss             # Reset, root, global styles
│   ├── _theme-toggle.scss     # Theme switcher component
│   ├── _hero.scss             # Hero section
│   ├── _demo.scss             # Contact form section
│   ├── _features.scss         # Features grid
│   ├── _tech-stack.scss       # Tech stack grid
│   ├── _content-pages.scss    # Content pages (Privacy, About, Sources)
│   ├── _footer.scss           # Footer with navigation
│   └── main.scss              # Master import file
├── css/                       # Compiled CSS (gitignored)
│   └── main.css               # Generated from SCSS
├── assets/
│   ├── icons/                 # Custom SVG icons
│   ├── scheme/                # Theme toggle SVG icons
│   └── theme/                 # Favicon
├── js/                        # JavaScript modules (ES6+)
│   ├── app.js                 # SPA entry point, router initialization
│   ├── router.js              # History API router
│   ├── pages.js               # Page components (Home, Privacy, Sources, About)
│   ├── components.js          # Shared components (Hero, Footer, ThemeToggle)
│   └── theme-toggle.js        # Theme switcher logic
├── netlify/functions/         # Serverless functions
│   ├── send-email.mjs         # Email handler (main function)
│   └── templates/             # Email HTML templates
│       ├── notification.mjs   # Recipient email template
│       └── confirmation.mjs   # Sender confirmation template
├── netlify.toml               # Netlify config (SPA redirects)
├── index.html                 # SPA container
└── package.json               # Dependencies & build scripts
```

## 🎨 Sass Development

### Architecture

The project uses **modern Sass (@use syntax)** with a modular architecture:

- **Variables** (`_variables.scss`): Colors, spacing, breakpoints, transitions
- **Mixins** (`_mixins.scss`): Responsive utilities (tablet, desktop, glass effect)
- **Base** (`_base.scss`): CSS reset, root variables, global styles
- **Components** (`_*.scss`): Individual sections (hero, features, footer, content-pages, etc.)

### Build Scripts

```bash
# Watch mode (auto-compile on save)
npm run sass:watch

# Single build (compressed, no source maps)
npm run sass:build

# Alias for sass:build
npm run build
```

### Adding Styles

1. Edit SCSS files in `/scss/`
2. Run `npm run sass:watch` during development
3. Compiled CSS outputs to `/css/main.css` (gitignored)
4. Before commit, ensure SCSS is clean (CSS is generated on deploy)

## 🔀 SPA Architecture

### Router System

The application uses a custom History API router for clean URLs:

- **Routes:**
  - `/` - Home page with contact form
  - `/privacy-policy` - Privacy policy
  - `/sources` - Sources and credits
  - `/about` - About project and developer
  - `/404` - Not found page

- **Key Files:**
  - `js/router.js` - Router implementation with History API
  - `js/app.js` - Application initialization and route registration
  - `js/pages.js` - Page component templates
  - `js/components.js` - Shared components (Hero, Footer, ThemeToggle)

### How It Works

1. **Router initialization** (`app.js`):
   - Registers all routes
   - Handles initial page load
   - Sets up link interception

2. **Navigation**:
   - Links with `data-link` attribute trigger client-side routing
   - Browser back/forward buttons work correctly
   - Page scrolls to top on route change

3. **Page rendering**:
   - Content is injected into `<div id="app"></div>`
   - Theme toggle re-initializes after render
   - Contact form listeners attach on home page

4. **Netlify Redirects**:
   - `netlify.toml` redirects all paths to `/index.html`
   - Enables direct URL access and page refresh support

### Adding New Pages

1. Create page component in `js/pages.js`:
   ```javascript
   export const NewPage = () => {
     return `
       ${getThemeToggle()}
       <section class="content-page">
         <!-- Your content -->
       </section>
       ${getFooter()}
     `;
   };
   ```

2. Register route in `js/app.js`:
   ```javascript
   router.addRoute('/new-page', () => renderPage(NewPage));
   ```

3. Add navigation link:
   ```html
   <a href="/new-page" data-link>New Page</a>
   ```

## 🎨 Live Demo

https://formhandling-netlify.netlify.app
