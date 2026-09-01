import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";
import { setupCategoryFilters, updateTotalTools } from "./utils/filters.js";
import { render, searchBox } from "./utils/render.js";

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

  let activeCategory = null;
  let mobileFilter = false;
  let accessibleFilter = false;

  // Initial page load
  await render(activeCategory, mobileFilter, accessibleFilter);

  // Category filters
  setupCategoryFilters((filters) => {
    activeCategory = filters.activeCategory;
    mobileFilter = filters.mobileFilter;
    accessibleFilter = filters.accessibleFilter;
    render(activeCategory, mobileFilter, accessibleFilter);
  });

  // Search
  searchBox?.addEventListener("input", () => {
    render(activeCategory, mobileFilter, accessibleFilter);
  });

});