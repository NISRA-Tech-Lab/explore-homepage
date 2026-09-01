import { populateGrid } from "./populate-grid.js";
import { buildAccordions } from "./build-accordions.js";
import { updateResultCount, updateAccordionState } from "./filters.js";

export const searchBox = document.getElementById("toolSearch");

export async function render(
  activeCategory = null,
  mobileFilter = false,
  accessibleFilter = false
) {

  const searchText = searchBox?.value || "";

  const [
    mainGridCount,
    accordionCount
  ] = await Promise.all([
    populateGrid(
      "toolGrid",
      "main",
      searchText,
      activeCategory,
      mobileFilter,
      accessibleFilter
    ),
    buildAccordions(
      searchText,
      activeCategory,
      mobileFilter,
      accessibleFilter
    )
  ]);

  const mainToolsHeading =
    document.getElementById("mainToolsHeading");

  const policySpecificTools =
    document.getElementById("policySpecificTools");

  const jumpToPolicyLink =
    document.getElementById("jump-to-policy-link");

  mainToolsHeading.classList.toggle(
    "invisible",
    mainGridCount === 0
  );

  policySpecificTools.classList.toggle(
    "invisible",
    accordionCount === 0
  );

  jumpToPolicyLink.classList.toggle(
    "invisible",
    mainGridCount === 0 || accordionCount === 0
  );

  updateResultCount();
  updateAccordionState();
}