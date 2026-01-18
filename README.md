# 📧 Kontaktformular mit Netlify Functions

Einfaches Kontaktformular mit E-Mail-Versand, reCAPTCHA v3 Spam-Schutz und Rate-Limiting.

## 🚀 Quick Start

1. **Environment Variables in Netlify setzen:**
   - `TO_EMAIL` - Deine E-Mail (Empfänger der Formular-Nachrichten)
   - `FROM_EMAIL` - Absender-E-Mail
   - `SMTP_HOST` - z.B. `smtp.gmail.com`
   - `SMTP_PORT` - z.B. `465`
   - `SMTP_USER` - Deine Gmail-Adresse
   - `SMTP_PASS` - Gmail App-Passwort ([erstellen](https://myaccount.google.com/apppasswords))
   - `RECAPTCHA_SECRET_KEY` - reCAPTCHA Secret Key ([erstellen](https://www.google.com/recaptcha/admin/create))

2. **reCAPTCHA Site Key in `index.html` einfügen:**
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=DEIN_SITE_KEY"></script>
   ```

3. **Deploy:**
   ```bash
   git push origin master
   ```
   Netlify deployed automatisch!

## 🛡️ Features

- ✅ E-Mail-Versand via Nodemailer
- ✅ reCAPTCHA v3 (unsichtbarer Spam-Schutz)
- ✅ Rate-Limiting (max. 5 Requests/Stunde/IP)
- ✅ Responsive Design

## 📖 Detaillierte Anleitung

Siehe [RECAPTCHA_SETUP.md](RECAPTCHA_SETUP.md)

## 🎨 Live Demo

https://formhandling-netlify.netlify.app
