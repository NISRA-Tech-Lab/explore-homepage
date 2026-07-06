import { map } from "./plotMap.js";

import {
    themes_menu,
    stats_menu,
    other_menu,
    map_subtitle,
    page_title,
    chart_container,
    table_preview,
    metadata_text,
    geo_menu,
    chart_title,
    chart_subtitle,
    headline_fig,
    dp_link,
    chart_updated,
    nav_product,
    nav_subject,
    nav_theme,
    table_title,
    map_updated,
    map_title,
    headline_stat,
    headline_stat_label,
    table_tabs,
    table_tabs_content,
    tables_title,
    table_updated,
    stat_info_text,
    headline_year,
    map_container,
    subjects_menu,
    products_menu,
    names_menu,
    additional_tables,
    map_card,
    chart_card
} from "./elements.js";

/**
 * Function for clearing out HTML elements
 *
 */
export async function clearElements() {

    chart_container.innerHTML = "";
    other_menu.innerHTML = "";
    table_preview.innerHTML = "";
    table_tabs.innerHTML = "";
    table_tabs_content.innerHTML = "";

    themes_menu.innerHTML = "";
    subjects_menu.innerHTML = "";
    products_menu.innerHTML = "";
    names_menu.innerHTML = "";
    geo_menu.innerHTML = "";
    stats_menu.innerHTML = "";

    map_subtitle.innerHTML = "";
    chart_title.textContent = "";
    chart_subtitle.innerHTML = "";
    headline_fig.innerHTML = "";
    dp_link.innerHTML = "";
    chart_updated.innerHTML = "";
    nav_product.textContent = "";
    nav_subject.textContent = "";
    nav_theme.textContent = "";
    table_title.textContent = "";
    map_updated.innerHTML = "";
    map_title.textContent = "";
    headline_stat.innerHTML = "";
    headline_stat_label.innerHTML = "";
    tables_title.textContent = "";
    table_updated.innerHTML = "";
    stat_info_text.innerHTML = "";
    headline_year.textContent = "";
    metadata_text.innerHTML = "";
    map_container.innerHTML = "";

    // RESET LAYOUT TO DEFAULTS

    map_card.classList.remove("d-none");
    map_card.classList.remove("col-xl-8");
    map_card.classList.remove("col-xl-12");
    map_card.classList.add("col-xl-6");

    chart_card.classList.remove("col-xl-12");
    chart_card.classList.remove("col-xl-8");
    chart_card.classList.add("col-xl-6");

    additional_tables.classList.add("d-none");

}