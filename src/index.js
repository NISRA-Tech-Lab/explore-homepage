import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";

let searchIndex = [];

window.addEventListener("DOMContentLoaded", async () => {
  try {

      initCookieConsent({
        bannerId: 'cookie-banner',
        gtmId: 'GTM-WKK8ZWP'
      });

  } catch (e) {
    console.error("Startup failed:", e);
  }
});