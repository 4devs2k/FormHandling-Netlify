# FormHandling-Netlify

Modern single-page application (SPA) with serverless contact form, email delivery, reCAPTCHA v3
spam protection, and rate-limiting. Vanilla JavaScript ES6+, client-side routing, Sass, deployed
on Netlify.

---

## Live

| Environment | URL                                                                      |
| ----------- | ------------------------------------------------------------------------ |
| **App**     | [formhandling.dev2ksoftware.com](https://formhandling.dev2ksoftware.com) |

---

## Core Features

- SPA with History API - clean URLs without hash symbols (`/privacy` instead of `#/privacy`)
- Client-side routing - multiple pages (Home, Privacy Policy, Sources, About) without page reloads
- Component-based architecture - reusable templates and modular structure
- Serverless email delivery via Netlify Functions + Nodemailer
- reCAPTCHA v3 (invisible spam protection)
- Rate-limiting (max 5 requests/hour/IP)
- Auto light/dark mode with manual toggle
- 14-line function rule, ES6+ modules, JSDoc on all functions, BEM CSS methodology
- Custom SVG icons (no external icon dependency), responsive mobile-first design

## Quick Start / Local Development

```bash
pnpm install
pnpm run sass:watch
```

Compiled CSS outputs to `/css/main.css` (gitignored). `pnpm run build` compiles once
(compressed, no source maps).

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

   Netlify builds and deploys automatically (`netlify.toml` handles pnpm setup for both the
   root app and the Functions package).

## Structure

```text
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
├── netlify/functions/         # Serverless functions (own pnpm-lock.yaml, bundled via esbuild)
│   ├── send-email.mjs         # Email handler (main function)
│   └── templates/             # Email HTML templates
│       ├── notification.mjs   # Recipient email template
│       └── confirmation.mjs   # Sender confirmation template
├── netlify.toml               # Netlify config (pnpm build, SPA redirects)
├── index.html                 # SPA container
├── package.json               # Dependencies & build scripts
└── .github/
    └── docs/
        ├── CODE_STRUCTURE.md  # Coding standards, BEM, SPA architecture
        └── RECAPTCHA_SETUP.md # reCAPTCHA v3 setup guide
```

## Sass Development

The project uses **modern Sass (`@use` syntax)** with a modular architecture:

- **Variables** (`_variables.scss`): Colors, spacing, breakpoints, transitions
- **Mixins** (`_mixins.scss`): Responsive utilities (tablet, desktop, glass effect)
- **Base** (`_base.scss`): CSS reset, root variables, global styles
- **Components** (`_*.scss`): Individual sections (hero, features, footer, content-pages, etc.)

```bash
pnpm run sass:watch    # Watch mode (auto-compile on save)
pnpm run sass:build    # Single build (compressed, no source maps)
pnpm run build         # Alias for sass:build
```

Edit SCSS files in `/scss/`, compiled CSS outputs to `/css/main.css` (gitignored) - CSS is
generated on deploy, not committed.

## SPA Architecture

### Router System

Custom History API router for clean URLs:

- **Routes:** `/` (Home + contact form), `/privacy-policy`, `/sources`, `/about`, `/404`
- **Key Files:** `js/router.js` (router implementation), `js/app.js` (init + route registration),
  `js/pages.js` (page templates), `js/components.js` (shared components: Hero, Footer,
  ThemeToggle)

### How It Works

1. **Router initialization** (`app.js`): registers all routes, handles initial page load, sets
   up link interception.
2. **Navigation**: links with `data-link` attribute trigger client-side routing, browser
   back/forward buttons work correctly, page scrolls to top on route change.
3. **Page rendering**: content is injected into `<div id="app"></div>`, theme toggle
   re-initializes after render, contact form listeners attach on the home page.
4. **Netlify Redirects**: `netlify.toml` redirects all paths to `/index.html`, enabling direct
   URL access and page-refresh support.

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
   router.addRoute("/new-page", () => renderPage(NewPage));
   ```

3. Add navigation link:

   ```html
   <a href="/new-page" data-link>New Page</a>
   ```

## Documentation

| Document                                              | Description                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| [CODE_STRUCTURE.md](.github/docs/CODE_STRUCTURE.md)   | Coding standards, BEM, SPA architecture, development workflow |
| [RECAPTCHA_SETUP.md](.github/docs/RECAPTCHA_SETUP.md) | reCAPTCHA v3 setup and environment variable configuration     |

## License

MIT

## Developer

Konstantin Aksenov
GitHub: https://github.com/KosMaster87
Email: konstantin@dev2ksoftware.com
Portfolio: https://portfolio.dev2ksoftware.com
