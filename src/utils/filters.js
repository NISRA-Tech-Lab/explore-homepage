import { readData } from "./read-data.js";

export let totalTools = 0;

let activeCategory = null;
let mobileFilter = false;
let accessibleFilter = false;

export async function updateTotalTools() {

  const tools = await readData("products");

  totalTools = tools.filter(tool => tool.show).length;
}

export function setupCategoryFilters(onChange) {

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

      onChange({
        activeCategory,
        mobileFilter,
        accessibleFilter
      });

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


export function updateResultCount() {

  const visibleCards = document.querySelectorAll(
    '[data-tool-card="true"]'
  ).length;

  const resultCount =
    document.getElementById("resultCount");

  if (resultCount) {
    resultCount.textContent =
      visibleCards === totalTools
        ? ""
        : `Showing ${visibleCards} of ${totalTools} tools`;
  }

}