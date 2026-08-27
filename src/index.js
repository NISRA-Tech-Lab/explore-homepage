import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";
import { populateGrid } from "./utils/populate-grid.js";
import { buildAccordions } from "./utils/build-accordions.js";

let activeCategory = null;
let mobileFilter = false;
let accessibleFilter = false;

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOMContentLoaded fired");

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

  setupCategoryFilters();

  // Search functionality
  const searchBox = document.getElementById("toolSearch");

  searchBox?.addEventListener("input", (e) => {

    const searchText = e.target.value;

    // Refresh main cards
    populateGrid("toolGrid", "main", searchText)
      .then(() => applyCategoryFilter());

    // Refresh accordion cards
    buildAccordions(searchText);

  });

});

function applyCategoryFilter() {

  const cards = document.querySelectorAll("#toolGrid > div");

  cards.forEach(card => {

    let show = true;

    if (
      activeCategory &&
      card.dataset.category !== activeCategory
    ) {
      show = false;
    }

    if (
      mobileFilter &&
      card.dataset.mobile !== "true"
    ) {
      show = false;
    }

    if (
      accessibleFilter &&
      card.dataset.accessible !== "true"
    ) {
      show = false;
    }

    card.style.display = show ? "" : "none";

  });

}

function setupCategoryFilters() {

  console.log("setupCategoryFilters running");

  const buttons =
    document.querySelectorAll(".category-filter");

    console.log("Buttons found:", buttons.length);

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const filter =
        button.dataset.category;

        if (filter === "mobile") {

  mobileFilter = !mobileFilter;

  button.setAttribute(
    "aria-pressed",
    mobileFilter
  );

}
else if (filter === "accessible") {

  accessibleFilter = !accessibleFilter;

  button.setAttribute(
    "aria-pressed",
    accessibleFilter
  );

}
else {

  if (activeCategory === filter) {

    activeCategory = null;

    button.setAttribute(
      "aria-pressed",
      "false"
    );

  } else {

    activeCategory = filter;

    buttons.forEach(btn => {

      if (
        btn.dataset.category !== "mobile" &&
        btn.dataset.category !== "accessible"
      ) {
        btn.setAttribute(
          "aria-pressed",
          "false"
        );
      }

    });

    activeCategory = filter;

    button.setAttribute(
      "aria-pressed",
      "true"
    );
  }
}

applyCategoryFilter();

      if (activeFilter === category) {

        activeFilter = null;

        buttons.forEach(btn =>
          btn.setAttribute("aria-pressed", "false")
        );

      } else {

        activeFilter = category;

        buttons.forEach(btn =>
          btn.setAttribute("aria-pressed", "false")
        );

        button.setAttribute(
          "aria-pressed",
          "true"
        );
      }

      applyCategoryFilter();

    });

  });

}