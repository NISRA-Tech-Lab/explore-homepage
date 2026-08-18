import { readData } from "./read-data.js";

export async function populateGrid(id) {

    const cards = await readData("card-layout");

    const grid = document.getElementById(id);

    cards.forEach((card) => {
        let div = document.createElement("div");
        div.classList.add("col-lg-3");
        div.classList.add("col-md-6");

        div.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
              <div class="mb-3">
                <img src="/images/${card.pin}" alt="" style="width: 50px;">
              </div>
              <h5 class="card-title">${card.title}</h5>
              <img src="/images/${card.image}" alt="${card.title}" class="img-fluid mb-3" style="max-height: 150px;">
              <p class="card-text">${card.text}</p>
            </div>
            <div class="card-footer bg-white border-top">
              <div class="d-flex gap-2 align-items-center">
                ${card.mobilefriendly ? '<img src="/images/icon_5.svg" alt="Mobile friendly" style="width: 24px;">' : ''}
                ${card.accessible ? '<img src="/images/icon_6.svg" alt="Accessible" style="width: 24px;">' : ''}
              </div>
            </div>
          </div>
        `;
        
        grid.appendChild(div);
    })

}