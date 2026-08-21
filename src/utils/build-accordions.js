import { themes } from "../config/config.js";
import { populateGrid } from "./populate-grid.js";

export function buildAccordions () {

    const theme_codes = Object.keys(themes);

    const accordion = document.getElementById("topicsAccordion");

    theme_codes.forEach(theme => {

        const item = document.createElement("div");
        item.classList.add("accordion-item");

        item.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${theme}">
                    <img src="assets/img/icon/${themes[theme].icon}" alt="">
                    ${themes[theme].name}
                </button>
            </h2>
            <div id="${theme}" class="accordion-collapse collapse" data-bs-parent="topicsAccordion">
                <div class="accordion-body">
                    <div id="${theme}-grid" class="row g-4"></div>
                </div>
            </div>
        `;

        accordion.appendChild(item);

        populateGrid(`${theme}-grid`, theme)

    })

}


