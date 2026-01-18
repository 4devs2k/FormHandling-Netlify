document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const formStatus = document.getElementById("formStatus");
    const submitBtn = this.querySelector(".submit-btn");

    // Validierung vor dem Senden
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const subject = formData.get("subject")?.trim();
    const message = formData.get("message")?.trim();

    if (!name || !email || !subject || !message) {
      formStatus.className = "form-status error";
      formStatus.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Bitte füllen Sie alle Felder aus.';
      return;
    }

    // Loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sende...';
    submitBtn.disabled = true;
    formStatus.className = "form-status";
    formStatus.textContent = "";

    try {
      // reCAPTCHA v3 Token holen
      let recaptchaToken = null;

      if (typeof grecaptcha !== 'undefined') {
        try {
          // Hole Site Key aus dem Script-Tag
          const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
          const siteKey = recaptchaScript?.src.match(/render=([^&]+)/)?.[1];

          if (siteKey && siteKey !== 'DEIN_RECAPTCHA_SITE_KEY') {
            recaptchaToken = await grecaptcha.execute(siteKey, { action: 'submit' });
            console.log("reCAPTCHA Token erhalten");
          } else {
            console.warn("reCAPTCHA Site Key noch nicht konfiguriert");
          }
        } catch (recaptchaError) {
          console.warn("reCAPTCHA Fehler:", recaptchaError);
          // Fahre fort auch wenn reCAPTCHA fehlschlägt
        }
      }

      console.log("Sende Formulardaten...", { name, email, subject, message });

      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          recaptchaToken, // Token mitsenden
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", response.status);

      let result;
      try {
        result = await response.json();
        console.log("Response Data:", result);
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        throw new Error("Serverantwort konnte nicht verarbeitet werden");
      }

      if (response.ok) {
        formStatus.className = "form-status success";
        formStatus.innerHTML =
          '<i class="fas fa-check-circle"></i> Nachricht erfolgreich gesendet!';
        this.reset();
      } else {
        console.error("Server Error:", result);
        throw new Error(result.error || `Server-Fehler (${response.status})`);
      }
    } catch (error) {
      console.error("Form Submit Error:", error);

      let errorMessage = "Unbekannter Fehler beim Senden";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Netzwerkfehler - bitte prüfen Sie Ihre Internetverbindung";
      } else if (error.message.includes("Zu viele Anfragen")) {
        errorMessage = "Zu viele Anfragen. Bitte warten Sie eine Stunde und versuchen Sie es erneut.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      formStatus.className = "form-status error";
      formStatus.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Fehler beim Senden: ' +
        errorMessage;
    } finally {
      submitBtn.innerHTML =
        '<i class="fas fa-paper-plane"></i> Nachricht senden';
      submitBtn.disabled = false;
    }
  });
