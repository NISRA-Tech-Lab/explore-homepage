import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";
import { populateGrid } from "./utils/populate-grid.js";
import { buildAccordions } from "./utils/build-accordions.js";

window.addEventListener("DOMContentLoaded", async () => {

  try {
    initCookieConsent({
      bannerId: "cookie-banner",
      gtmId: "GTM-WKK8ZWP"
    });
  } catch (e) {
    console.error("Startup failed:", e);
  }

  // Initial page load
  populateGrid("toolGrid", "main");
  buildAccordions();

  // Search functionality
  const searchBox = document.getElementById("toolSearch");

  searchBox?.addEventListener("input", (e) => {

    const searchText = e.target.value;

    // Refresh main cards
    populateGrid("toolGrid", "main", searchText);

    // Refresh accordion cards
    buildAccordions(searchText);

  });

});