# 🔐 reCAPTCHA v3 Setup Guide

## Step 1: Create reCAPTCHA v3 Keys

1. Go to: https://www.google.com/recaptcha/admin/create
2. Fill out the form:
   - **Label**: `FormHandling-Netlify` (or your own name)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**:
     - `formhandling-netlify.netlify.app` (your production domain)
     - `localhost` (for local testing)
   - **Owner**: Your email address
   - Accept the terms of service

3. Click **SUBMIT**

## Step 2: Copy Keys

You will receive two keys:

- **Site Key** (public, for frontend)
  ```
  6Lc... (example)
  ```

- **Secret Key** (private, for backend)
  ```
  6Lc... (example)
  ```

## Step 3: Insert Site Key in index.html

Open `index.html` and replace `YOUR_RECAPTCHA_SITE_KEY` with your **Site Key**:

```html
<!-- Google reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=6Lc-YOUR-ACTUAL-SITE-KEY"></script>
```

## Step 4: Set Secret Key as Environment Variable in Netlify

### In Netlify Dashboard:

1. Go to your project: `formhandling-netlify`
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - **Key**: `RECAPTCHA_SECRET_KEY`
   - **Value**: Your Secret Key (starting with 6Lc...)
   - **Scopes**: `All scopes`
   - **Deploy contexts**: `Same value in all deploy contexts`
5. Click **Create variable**

### For Local Testing (.env file):

Create a `.env` file (if not already present) and add:

```env
# Existing SMTP variables...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
TO_EMAIL=recipient@example.com

# NEW: reCAPTCHA Secret Key
RECAPTCHA_SECRET_KEY=6Lc-YOUR-ACTUAL-SECRET-KEY
```

## Step 5: Push Code to GitHub

```bash
git add .
git commit -m "Added reCAPTCHA v3 and Rate Limiting"
git push origin master
```

Netlify deploys automatically!

## ✅ Testing

1. Go to: `https://formhandling-netlify.netlify.app`
2. Fill out the contact form
3. Submit

### What happens in the background:

- ✅ **reCAPTCHA v3** validates invisibly in the background
- ✅ **Rate Limiting** prevents more than 5 requests per hour per IP
- ✅ **Email** is sent

### Debugging:

Check the **Netlify Function Logs**:
1. Netlify Dashboard → **Functions** → `send-email`
2. Click on a deploy
3. View the logs

You should see:
```
reCAPTCHA validation: { success: true, score: 0.9 }
Rate limit OK: { remaining: 4, resetTime: ... }
Email sent successfully
```

## 🎯 What does reCAPTCHA v3 do?

- **Invisible**: No checkboxes or captcha puzzles
- **Score-based**: Provides score from 0.0 (bot) to 1.0 (human)
- **Threshold**: We block requests with score < 0.5
- **Action**: Monitors "submit" action

## 🛡️ What does Rate Limiting do?

- **5 requests per hour** per IP address
- After 5 requests: HTTP 429 Error
- Resets after 1 hour
- Prevents spam attacks

## ⚠️ Notes

### For Production:
- ✅ Add your actual domain to reCAPTCHA domains
- ✅ Set environment variables in Netlify
- ✅ Test thoroughly

### Rate Limiting Limitations:
- The in-memory solution works for small projects
- For high traffic: Use Redis or Netlify Edge Functions with KV Storage
- With Serverless Functions, the store resets on every cold start

### Security:
- ✅ NEVER commit Secret Key to Git
- ✅ Always store in .env or Netlify Environment Variables
- ✅ .env is in .gitignore

## 🔗 Additional Resources

- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
