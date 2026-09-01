import { readData } from "./read-data.js";

export let totalTools = 0;
let activeCategory = null;
let mobileFilter = false;
let accessibleFilter = false;

export async function updateTotalTools() {

const tools = await readData("products");

totalTools = tools.filter(tool => tool.show).length;
}

export function applyCategoryFilter() {

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

const resultCount =
  document.getElementById("resultCount");

if (resultCount) {
  resultCount.textContent =
    visibleCards == totalTools ?
    `` :
    `Showing ${visibleCards} of ${totalTools} tools`;
}


}

export function hideEmptyAccordions() {

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

export function setupCategoryFilters() {

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


export function updateAccordionState() {

  const searchText =
    document.getElementById("toolSearch")?.value.trim();

  const hasFilters =
    activeCategory !== null ||
    mobileFilter === true ||
    accessibleFilter === true;

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
