# 🔐 reCAPTCHA v3 Setup Anleitung

## Schritt 1: reCAPTCHA v3 Schlüssel erstellen

1. Gehe zu: https://www.google.com/recaptcha/admin/create
2. Fülle das Formular aus:
   - **Label**: `FormHandling-Netlify` (oder eigener Name)
   - **reCAPTCHA-Typ**: **reCAPTCHA v3** auswählen
   - **Domains**:
     - `formhandling-netlify.netlify.app` (deine Production-Domain)
     - `localhost` (für lokales Testen)
   - **Besitzer**: Deine E-Mail-Adresse
   - Akzeptiere die Nutzungsbedingungen

3. Klicke auf **ABSENDEN**

## Schritt 2: Schlüssel kopieren

Du erhältst zwei Schlüssel:

- **Site Key** (öffentlich, für Frontend)
  ```
  6Lc... (Beispiel)
  ```

- **Secret Key** (privat, für Backend)
  ```
  6Lc... (Beispiel)
  ```

## Schritt 3: Site Key in index.html einfügen

Öffne `index.html` und ersetze `DEIN_RECAPTCHA_SITE_KEY` mit deinem **Site Key**:

```html
<!-- Google reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=6Lc-DEIN-ECHTER-SITE-KEY"></script>
```

## Schritt 4: Secret Key als Environment Variable in Netlify setzen

### Im Netlify Dashboard:

1. Gehe zu deinem Projekt: `formhandling-netlify`
2. Klicke auf **Site configuration** → **Environment variables**
3. Klicke auf **Add a variable**
4. Füge hinzu:
   - **Key**: `RECAPTCHA_SECRET_KEY`
   - **Value**: Dein Secret Key (der mit 6Lc... beginnt)
   - **Scopes**: `All scopes`
   - **Deploy contexts**: `Same value in all deploy contexts`
5. Klicke auf **Create variable**

### Für lokales Testen (.env Datei):

Erstelle eine `.env` Datei (falls noch nicht vorhanden) und füge hinzu:

```env
# Bestehende SMTP Variablen...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=deine-email@gmail.com
SMTP_PASS=dein-app-passwort
FROM_EMAIL=deine-email@gmail.com
TO_EMAIL=empfaenger@example.com

# NEU: reCAPTCHA Secret Key
RECAPTCHA_SECRET_KEY=6Lc-DEIN-ECHTER-SECRET-KEY
```

## Schritt 5: Code zu GitHub pushen

```bash
git add .
git commit -m "Added reCAPTCHA v3 and Rate Limiting"
git push origin master
```

Netlify deployed automatisch!

## ✅ Testen

1. Gehe zu: `https://formhandling-netlify.netlify.app`
2. Fülle das Kontaktformular aus
3. Sende ab

### Was passiert im Hintergrund:

- ✅ **reCAPTCHA v3** validiert im Hintergrund (unsichtbar!)
- ✅ **Rate Limiting** verhindert mehr als 5 Requests pro Stunde pro IP
- ✅ **E-Mail** wird versendet

### Debugging:

Schaue in die **Netlify Function Logs**:
1. Netlify Dashboard → **Functions** → `send-email`
2. Klicke auf einen Deploy
3. Schaue die Logs an

Du solltest sehen:
```
reCAPTCHA Validierung: { success: true, score: 0.9 }
Rate limit OK: { remaining: 4, resetTime: ... }
Email sent successfully
```

## 🎯 Was macht reCAPTCHA v3?

- **Unsichtbar**: Keine Checkboxen oder Captcha-Rätsel
- **Score-basiert**: Gibt Score von 0.0 (Bot) bis 1.0 (Mensch)
- **Schwellwert**: Wir blockieren Requests mit Score < 0.5
- **Aktion**: Überwacht "submit" Action

## 🛡️ Was macht Rate Limiting?

- **5 Requests pro Stunde** pro IP-Adresse
- Nach 5 Requests: HTTP 429 Error
- Reset nach 1 Stunde
- Verhindert Spam-Attacken

## ⚠️ Hinweise

### Für Production:
- ✅ Füge deine echte Domain zu reCAPTCHA Domains hinzu
- ✅ Setze Environment Variables in Netlify
- ✅ Teste gründlich

### Rate Limiting Limitierung:
- Die In-Memory Lösung funktioniert für kleine Projekte
- Bei viel Traffic: Nutze Redis oder Netlify Edge Functions mit KV Storage
- Bei Serverless Functions wird der Store bei jedem Cold Start zurückgesetzt

### Sicherheit:
- ✅ Secret Key NIE in Git committen
- ✅ Immer in .env oder Netlify Environment Variables
- ✅ .env ist in .gitignore

## 🔗 Weitere Ressourcen

- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Dokumentation](https://developers.google.com/recaptcha/docs/v3)
- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
