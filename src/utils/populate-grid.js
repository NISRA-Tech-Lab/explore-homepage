import { readData } from "./read-data.js";
import { themes } from "../config/config.js"

export async function populateGrid(id, theme, searchText = "") {

const cards = await readData("products");

const search = searchText.toLowerCase().trim();

const theme_cards = cards
  .filter(x => x["theme"] == theme && x["show"])
  .filter(card => {

      if (!search) {
          return true;
      }

      const searchableText = [
          card.name,
          card.description,
          card.keywords
      ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

      return searchableText.includes(search);

  });

    const grid = document.getElementById(id);

    grid.innerHTML = "";

    theme_cards.forEach((card) => {
        let div = document.createElement("div");
        div.dataset.category = card.primary;
        div.dataset.mobile = card.mobile_friendly ? "true" : "false";
        div.dataset.accessible = card.accessible ? "true" : "false";
        div.classList.add("col-xl-3");
        div.classList.add("col-lg-4");
        div.classList.add("col-md-6");

        const icon = icon_lookup[card.primary] ?
          icon_lookup[card.primary] :
          themes[card.theme].icon;

        const img = card.img ?
          `<img src="assets/img/${card.img}" alt="${card.name}" class="img-fluid mb-3" style="width: 100%; height: 12rem; object-fit: contain;">` :
          ``;

        div.innerHTML = `
        <div class="card h-100">
          
          <div class="card-body">

          <div class="d-flex px-1 mb-3">
                <img src="assets/img/icon/${icon}" alt="" class="card-head-icon">
                <h3 class="card-title fs-5 ps-3 d-flex align-items-center mb-0">${card.name}</h3>
              </div>
              ${img}
              <p class="card-text fs-6">${card.description}</p>
            </div>
            <div class="card-footer bg-white border-top">
              <div class="d-flex gap-2 align-items-center">
                ${card.mobile_friendly ? '<img src="assets/img/icon/mobile.svg" alt="Mobile friendly" title="Mobile friendly" style="width: 24px;">' : ''}
                ${card.accessible ? '<img src="assets/img/icon/accessible.svg" alt="Accessible" title="Accessible" style="width: 24px;">' : ''}
                <a class="ms-auto go-button" href="${card.url}" target="_blank" rel="nopener" title="${card.name} (Opens in new tab)">Go</a>
              </div>
            </div>
          </div>
        `;
        
        grid.appendChild(div);
    });

    return theme_cards.length;

}

const icon_lookup = {
  geographic: "geo.svg",
  policy_specific: "policy.svg",
  equality_deprivation: "equality.svg",
  database_lookup: "lookup.svg",
  theme: null
}