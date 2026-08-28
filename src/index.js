import { initCookieConsent } from "./utils/cookies.js";
import "./utils/skipToMainContent.js";
import { populateGrid } from "./utils/populate-grid.js";
import { buildAccordions } from "./utils/build-accordions.js";
import { getToolCount } from "./utils/read-data.js";

let activeCategory = null;
let mobileFilter = false;
let accessibleFilter = false;
let totalTools = 0;

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOMContentLoaded fired");

  totalTools = await getToolCount();

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

function applyCategoryFilter() {

  const cards = document.querySelectorAll(
  '[data-tool-card="true"]'
);

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

  
const visibleCards = document.querySelectorAll(
  '[data-tool-card="true"]:not([style*="display: none"])'
).length;

console.log("Visible cards:", visibleCards);

const resultCount =
  document.getElementById("resultCount");

if (resultCount) {
  resultCount.textContent =
    `Showing ${visibleCards} of ${totalTools} tools`;
}


}

function hideEmptyAccordions() {

  document
    .querySelectorAll("#topicsAccordion .accordion-item")
    .forEach(item => {

      const visibleCards = item.querySelectorAll(
        '[data-tool-card="true"]:not([style*="display: none"])'
      );

      item.style.display =
        visibleCards.length > 0 ? "" : "none";

    });

}

function setupCategoryFilters() {

  const buttons =
    document.querySelectorAll(".category-filter");

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
      hideEmptyAccordions();
      updateAccordionState();

    });

  });

}


function updateAccordionState() {

  const searchText =
    document.getElementById("toolSearch")?.value.trim();

  const hasFilters =
    activeCategory !== null ||
    mobileFilter === true ||
    accessibleFilter === true;

    console.log("searchText:", searchText);
    console.log("hasFilters:", hasFilters);

  const shouldExpand =
    !!searchText || hasFilters;

  document
    .querySelectorAll("#topicsAccordion .accordion-collapse")
    .forEach(panel => {
      panel.classList.toggle("show", shouldExpand);
    });

  document
    .querySelectorAll("#topicsAccordion .accordion-button")
    .forEach(button => {
      button.classList.toggle("collapsed", !shouldExpand);
      button.setAttribute(
        "aria-expanded",
        shouldExpand ? "true" : "false"
      );
    });
}
