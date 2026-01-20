# 📧 Portfolio Landing Page with Contact Form

Modern portfolio landing page with serverless contact form, email delivery, reCAPTCHA v3 spam protection, and rate-limiting. Built with Sass, vanilla JavaScript, and deployed on Netlify.

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

- ✅ Serverless email delivery via Netlify Functions + Nodemailer
- ✅ reCAPTCHA v3 (invisible spam protection)
- ✅ Rate-limiting (max 5 requests/hour/IP)
- ✅ Auto light/dark mode with manual toggle
- ✅ Modular Sass architecture
- ✅ BEM methodology
- ✅ 14-line function rule (clean code)
- ✅ ES6+ modules
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
│   ├── _footer.scss           # Footer
│   └── main.scss              # Master import file
├── css/                       # Compiled CSS (gitignored)
│   └── main.css               # Generated from SCSS
├── assets/
│   ├── icons/                 # Custom SVG icons
│   ├── scheme/                # Theme toggle SVG icons
│   └── theme/                 # Favicon
├── js/                        # JavaScript files
│   ├── script.js              # Form handling
│   └── theme-toggle.js        # Theme switcher
├── netlify/functions/         # Serverless functions
│   ├── send-email.mjs         # Email handler (main function)
│   └── templates/             # Email HTML templates
│       ├── notification.mjs   # Recipient email template
│       └── confirmation.mjs   # Sender confirmation template
├── index.html                 # Portfolio page
└── package.json               # Dependencies & build scripts
```

## 🎨 Sass Development

### Architecture

The project uses **modern Sass (@use syntax)** with a modular architecture:

- **Variables** (`_variables.scss`): Colors, spacing, breakpoints, transitions
- **Mixins** (`_mixins.scss`): Responsive utilities (tablet, desktop, glass effect)
- **Base** (`_base.scss`): CSS reset, root variables, global styles
- **Components** (`_*.scss`): Individual sections (hero, features, footer, etc.)

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

## 🎨 Live Demo

https://formhandling-netlify.netlify.app
