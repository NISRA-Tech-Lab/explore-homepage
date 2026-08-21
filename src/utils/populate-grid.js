import { readData } from "./read-data.js";
import { themes } from "../config/config.js"

export async function populateGrid(id, theme) {

    const cards = await readData("products");

    const theme_cards = cards
      .filter(x => x["theme"] == theme && x["show"])

    const grid = document.getElementById(id);

    theme_cards.forEach((card) => {
        let div = document.createElement("div");
        div.classList.add("col-xl-3");
        div.classList.add("col-lg-4");
        div.classList.add("col-md-6");

        const icon = icon_lookup[card.primary] ? icon_lookup[card.primary] : themes[card.theme].icon;

        console.log(icon)

        div.innerHTML = `
        <div class="card h-100">
          
          <div class="card-body">

          <div class="d-flex px-1 mb-3">
                <img src="/assets/img/icon/${icon}" alt="" class="card-head-icon">
                <h3 class="card-title fs-5 ps-3 d-flex align-items-center mb-0">${card.name}</h3>
              </div>
              <img src="/assets/img/${card.img}" alt="${card.name}" class="img-fluid mb-3" style="width: 100%; height: 12rem; object-fit: contain;">
              <p class="card-text fs-6">${card.description}</p>
            </div>
            <div class="card-footer bg-white border-top">
              <div class="d-flex gap-2 align-items-center">
                ${card.mobile_friendly ? '<img src="/assets/img/icon/mobile-friendly.svg" alt="Mobile friendly" title="Mobile friendly" style="width: 24px;">' : ''}
                ${card.accessible ? '<img src="/assets/img/icon/accessibility.svg" alt="Accessible" title="Accessible" style="width: 24px;">' : ''}
                <a class="ms-auto go-button" href="${card.url}" target="_blank" rel="nopener" title="${card.name} (Opens in new tab)">Go</a>
              </div>
            </div>
          </div>
        `;
        
        grid.appendChild(div);
    })

}

const icon_lookup = {
  geographic: "geo.svg",
  policy_specific: "policy.svg",
  equality_deprivation: "equality.svg",
  database_lookup: "lookup.svg",
  theme: null
}