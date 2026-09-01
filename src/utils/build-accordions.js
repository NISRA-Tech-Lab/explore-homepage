import { themes } from "../config/config.js";
import { populateGrid } from "./populate-grid.js";

export async function buildAccordions(
  searchText = "",
  activeCategory = null,
  mobileFilter = false,
  accessibleFilter = false
) {

    const theme_codes = Object.keys(themes);

    const accordion = document.getElementById("topicsAccordion");

    let accordion_count = 0;

    accordion.innerHTML = "";

    for (const theme of theme_codes) {

        const item = document.createElement("div");
        item.classList.add("accordion-item");

        item.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button ${searchText ? "" : "collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#${theme}">
                    <img src="assets/img/icon/${themes[theme].icon}" alt="">
                    ${themes[theme].name}
                </button>
            </h2>
            <div
                id="${theme}"
                class="accordion-collapse collapse ${searchText ? "show" : ""}"
                data-bs-parent="topicsAccordion">
                <div class="accordion-body">
                    <div id="${theme}-grid" class="row g-4"></div>
                </div>
            </div>
        `;

        accordion.appendChild(item);

        const count = await populateGrid(
            `${theme}-grid`,
            theme,
            searchText,
            activeCategory,
            mobileFilter,
            accessibleFilter
        );

        if (count === 0) {
            item.remove();
        } else {
            accordion_count++;
        }

    }

    return accordion_count;
}