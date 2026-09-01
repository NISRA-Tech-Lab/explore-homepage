import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";
import { populateGrid } from "./utils/populate-grid.js";
import { buildAccordions } from "./utils/build-accordions.js";
import { applyCategoryFilter, hideEmptyAccordions, updateAccordionState, setupCategoryFilters, updateTotalTools } from "./utils/filters.js";

window.addEventListener("DOMContentLoaded", async () => {

  await updateTotalTools();

  try {
    initCookieConsent({
      bannerId: "cookie-banner",
      gtmId: "GTM-WKK8ZWP"
    });
  } catch (e) {
    console.error("Startup failed:", e);
  }

  // Initial page load
Promise.all([
  populateGrid("toolGrid", "main"),
  buildAccordions()
]).then(() => {
  applyCategoryFilter();
  hideEmptyAccordions();
  updateAccordionState();

});

  setupCategoryFilters();

  // Search functionality
  const searchBox = document.getElementById("toolSearch");

  searchBox?.addEventListener("input", (e) => {

    const searchText = e.target.value;

  Promise.all([
    populateGrid("toolGrid", "main", searchText),
    buildAccordions(searchText)
  ]).then(() => {
    applyCategoryFilter();
    hideEmptyAccordions();
    updateAccordionState();
  });

  });

});