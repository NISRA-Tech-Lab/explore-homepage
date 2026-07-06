import { clearElements } from "./clearElements.js";
import { createMenus } from "./createMenus.js";
import { map_card, chart_card } from "./elements.js";

export async function refreshRoute() {

    await clearElements();
    
    await createMenus();
}