import { palette, GEOG_PROPS } from "../config/config.js";
import { loadShapes } from "./loadShapes.js";
import { titleCase } from "./titleCase.js";
import { getColour } from "./getColour.js";
import { quantile} from "./quantile.js";
import { themes_menu, map_container, stats_menu,
         other_menu, map_subtitle, page_title, 
         table_preview, metadata_text, search, geo_menu,
         SIDEBAR_OPEN_KEY, map_card, chart_card, dp_link, 
         chart_updated, nav_product, nav_subject, nav_theme,
         table_title, map_updated, map_title, headline_stat_label,
         additional_tables, table_updated, stat_info_text } from "./elements.js";     
import { downloadButton } from "./download-button.js";
import { buildCharts } from "./buildCharts.js";
import { buildTables } from "./buildTables.js";

export let map;

export async function plotMap (tables, matrix, statistic, geog_type) {   

    let time_var = tables[matrix].time;
    
    let year = tables[matrix].time_series[tables[matrix].time_series.length - 1];

    if (!Array.isArray(tables[matrix].time_series)) {
        year = tables[matrix].time_series;
    }
    
    const normal_vars = ["STATISTIC", geog_type, time_var];
    if (geog_type == "COB_BASIC") {
        normal_vars.push("NI")
    } 

    let other_vars = Object.keys(tables[matrix].categories);
    other_vars = other_vars.filter(x => !normal_vars.includes(x));

    let other_selections = "";
    var other_headline = "";
    let id_vars;

    if (["none", "NI"].includes(geog_type)) {
        map_card.classList.add("d-none");
        chart_card.classList.remove("col-xl-6");
        
        id_vars = `["STATISTIC", "${time_var}"`;

    } else {

        id_vars = `["STATISTIC", "${time_var}", "${geog_type}"`;

    }

    let subtitle_text = "";

    if (other_vars.length > 0) {
        
        additional_tables.classList.remove("d-none");


        for (let i = 0; i < other_vars.length; i ++) {
            
            id_vars += `, "${other_vars[i]}"`;

            let new_menu = document.createElement("div");


            new_menu.innerHTML = `<label for = "${other_vars[i]}" class = "form-label">${tables[matrix].categories[other_vars[i]].label}</label><select id = "${other_vars[i]}" name = "${other_vars[i]}" class = "form-select"></select>`

            let options = Object.keys(tables[matrix].categories[other_vars[i]].category.label);
            let labels = Object.values(tables[matrix].categories[other_vars[i]].category.label);

            other_menu.appendChild(new_menu);

            const new_select = document.getElementById(other_vars[i]);

            for (let j = 0; j < labels.length; j ++) {
                let option = document.createElement("option");
                option.value = options[j];
                option.textContent = labels[j];
                new_select.appendChild(option);
            }

            
            let selected_option = options[0];

            const other_defaults = ["All", "ALL", "N92000002"];
            
            for (let j = 0; j < other_defaults.length; j ++) {
                if (options.includes(other_defaults[j])) {
                    selected_option = other_defaults[j];
                }
            }                

            for (let j = 0; j < search.length; j ++) {
                if (search[j].includes(`${other_vars[i]}=`)) {
                    let search_split = search[j].split("=");
                    selected_option = search_split[1];
                    break;
                }
            }

            new_select.value = selected_option;              

            new_menu.onchange = function () {

                localStorage.setItem(SIDEBAR_OPEN_KEY, "1");
                let search_string = `?table=${geo_menu.value}&stat=${stats_menu.value}`;

                for (let j = 0; j < other_vars.length; j ++) {
                    search_string += `&${other_vars[j]}=${document.getElementById(other_vars[j]).value}`;
                }                    

                window.location.search = search_string;
                
            }
                 
            other_selections += `,"${other_vars[i]}":{"category":{"index":["${new_select.value}"]}}`;


            subtitle_text += `<strong>${tables[matrix].categories[other_vars[i]].label}</strong>: ${tables[matrix].categories[other_vars[i]].category.label[new_select.value]}<br>`;
            

            other_headline += `<strong>${tables[matrix].categories[other_vars[i]].label}</strong> category: <em>"${tables[matrix].categories[other_vars[i]].category.label[new_select.value]}"</em>`;
             if (i != other_vars.length - 1) {
                    other_headline += "<br>"
                }

        }

        map_subtitle.innerHTML = subtitle_text;
    }
    
    id_vars += `]`;   

    let api_url = 'https://ws-data.nisra.gov.uk/public/api.jsonrpc?data=' +
        encodeURIComponent('{"jsonrpc":"2.0","method":"PxStat.Data.Cube_API.ReadDataset","params":{"class":"query","id":' +
            id_vars + ',"dimension":{"STATISTIC":{"category":{"index":["' +
            statistic + '"]}},"' + time_var + '":{"category":{"index":["' + year +
            '"]}}' + other_selections + 
            '},"extension":{"pivot":null,"codes":false,"language":{"code":"en"},"format":{"type":"JSON-stat","version":"2.0"},"matrix":"' +
            matrix + '"},"version":"2.0"}}');


    const response = await fetch(api_url);
    const {result} = await response.json();

    await buildTables(tables, matrix, statistic, geog_type, year, time_var, other_vars, other_selections, id_vars);

    var stat_label = Object.values(result.dimension.STATISTIC.category.label)[0];
    var unit = result.dimension.STATISTIC.category.unit[statistic].label;

    let plot_ni = false;

    if (geog_type == "none") {
        plot_ni = true;
    } else {
        if (result.dimension[geog_type].category.index.includes("N92000002") || themes_menu.value == "67") {
            plot_ni = true;
        }
    }    

        headline_stat_label.innerHTML = `
            ${stat_label}
            <img class="i-button" src="assets/img/icon/i-button.svg" alt="Information button"
                data-bs-toggle="collapse" data-bs-target="#stat-info" aria-expanded="false"
                aria-controls="stat-info">
        `;

        stat_info_text.innerHTML = `
            <div>Access data at: <a href="https://data.nisra.gov.uk/table/${matrix}" target="_blank">${result.label}</a></div>
            <div>Last updated: <strong>${result.updated.substr(8, 2)}/${result.updated.substr(5, 2)}/${result.updated.substr(0, 4)}</strong></div>
            <div><a href="mailto:${result.extension.contact.email}">Email for more information</a></div>
        `;

        const chartData = await buildCharts(tables, matrix, statistic, geog_type, result, plot_ni, time_var, subtitle_text, other_headline, other_selections, id_vars, stat_label, unit);
        
        const data_series = chartData?.data_series ?? [];
        const time_series = chartData?.time_series ?? [];

    if (!plot_ni) {
        
        map_card.classList.remove("col-xl-6")

        if (geog_type == "COB_BASIC") {
            const spacer = document.createElement("div");
            spacer.classList.add("col-xl-2");
            map_card.classList.remove("col-xl-6");
            map_card.classList.add("col-xl-8");
            map_card.parentElement.insertBefore(spacer, map_card);
        } 
    }

    let data;

    if (!["none", "NI"].includes(geog_type)) {

        let u_position;

        if (result.dimension[geog_type].category.index.includes("0")) {
            u_position = result.dimension[geog_type].category.index.indexOf("0")
            result.value.splice(u_position, 1);
            result.dimension[geog_type].category.index.splice(u_position, 1);
            delete result.dimension[geog_type].category.label["0"];
        }

        if (result.dimension[geog_type].category.index.includes("Unknown")) {
            u_position = result.dimension[geog_type].category.index.indexOf("Unknown")
            result.value.splice(u_position, 1);
            result.dimension[geog_type].category.index.splice(u_position, 1);
            delete result.dimension[geog_type].category.label["Unknown"];
        }

        const cleaned = result.value.map(v =>
            typeof v === "number" && !Number.isNaN(v) ? v : null
            );

        data = cleaned;

        // Useful for legend (keep as-is even for COB quintiles)
        let range_min = Math.floor(Math.min(...data.filter(v => v != null)));
        let range_max = Math.ceil(Math.max(...data.filter(v => v != null)));

        let colours = [];

        if (geog_type === "COB_BASIC") {
            // Build evenly-sized quintile thresholds (20/40/60/80%)
            const vals = data.filter(v => v != null).sort((a, b) => a - b);
            const qs = [0.2, 0.4, 0.6, 0.8].map(p => quantile(vals, p));

            // Map each value to a bin 0..4, then normalize to 0..1 in steps of 0.25
            const toBin = (v) => {
                if (v == null) return -1;              // “no data”
                if (v <= qs[0]) return 0;
                if (v <= qs[1]) return 1;
                if (v <= qs[2]) return 2;
                if (v <= qs[3]) return 3;
                return 4;
            };

            for (let i = 0; i < data.length; i++) {
                const bin = toBin(data[i]);
                colours.push(bin < 0 ? -1 : bin / 4);  // -1 marks NA; 0, .25, .5, .75, 1 for bins
            }
        } else {
            // Original continuous scaling
            const range = range_max - range_min || 1; // avoid divide-by-zero
            for (let i = 0; i < data.length; i++) {
                const v = data[i];
                colours.push(v == null ? -1 : (v - range_min) / range);
            }
        }

        let legend_div = document.createElement("div");
        legend_div.id = "map-legend";
        legend_div.classList.add("map-legend");
        legend_div.classList.add("align-self-center");
        legend_div.classList.add("col-6");

        let legend_row_1 = document.createElement("div");
        legend_row_1.classList.add("row");

        let min_value = document.createElement("div");
        min_value.classList.add("legend-min");
        legend_row_1.appendChild(min_value);

        let unit_value = document.createElement("div");
        unit_value.classList.add("legend-unit");
        if (unit.toLowerCase() != "number") {
            unit_value.innerHTML = `(${unit})`;
        }
        legend_row_1.appendChild(unit_value);

        let max_value = document.createElement("div");

        max_value.classList.add("legend-max");
        legend_row_1.appendChild(max_value);

        legend_div.appendChild(legend_row_1);

        let legend_row_2 = document.createElement("div");
        legend_row_2.classList.add("row");

        for (let i = 0; i < palette.length; i++) {
            let colour_block = document.createElement("div");
            colour_block.style.backgroundColor = palette[i];
            colour_block.style.opacity = "0.8";
            colour_block.classList.add("colour-block");
        
            if (i == palette.length - 1) {
                colour_block.style.borderRight = "1px #555555 solid;"
            }

            legend_row_2.appendChild(colour_block);
        }

        legend_div.appendChild(legend_row_2);

        map_container.appendChild(legend_div);

        // Create a div for map to sit in
        let map_div = document.createElement("div");
        map_div.id ="map";
        map_div.classList.add("map");

        let map_title_text = `${stat_label} by ${result.dimension[geog_type].label} (${year})`;
        map_title.textContent = map_title_text;

        
        map_container.classList.add("d-block");
        map_container.appendChild(map_div);

        let initialZoom = window.innerWidth < 768 ? 6 : 7; 
        let bounds = [[-9.20, 53.58], [-4.53, 55.72]];

        if (geog_type == "COB_BASIC") {
            initialZoom = 1;
            bounds = null;
        }

        // Create a map
       map = new maplibregl.Map({
            container: 'map',
            style: 'public/map/style-omt.json',
            center: [-6.85, 54.67],
            zoom: initialZoom,
            minZoom: initialZoom,
            maxZoom: initialZoom + 7,
            maxBounds: bounds,
            attributionControl: false,
            preserveDrawingBuffer: true
        });         
        
        
        // After creating `map`
        map.addControl(
        new maplibregl.NavigationControl({
            showZoom: true,     // +/− buttons
            showCompass: false, // hide rotate/compass
            visualizePitch: false
        }),
        'top-right'           // positions: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        );
            
        const geojsonData = await loadShapes(geog_type);


        map.on('load', async () => {

            // addExportControl(map, map_title_text);

            
            // --- 1) Prepare a styled copy of your GeoJSON with props used by the map ---
            // Assumes these are already in scope: geojsonData, geog_type, result, year, unit,
            // data (array of values), colours (0..1 or bins), getColour(), GEOG_PROPS, titleCase()

            const features = geojsonData.features.map((f, idx) => {
                // Match your Leaflet logic to find this feature’s index in the data array
                const codeProp = GEOG_PROPS[geog_type].code_var;
                const code = String(f.properties[codeProp]).replace(/\s+/g, "");
                const geogIndex = result.dimension[geog_type].category.index.indexOf(code);

                const rawValue = geogIndex >= 0 ? data[geogIndex] : null;
                const label =
                titleCase(result.dimension[geog_type].category.label[code] || code);

                // Convert your normalized/binned "colours[geogIndex]" to an actual hex
                const fillHex =
                rawValue == null
                    ? "#eeeeee"                   // fallback for “no data”
                    : getColour(colours[geogIndex]);

                return {
                ...f,
                id: idx, // stable id for feature-state hover
                properties: {
                    ...f.properties,
                    nisra_code: code,
                    nisra_value: rawValue,
                    nisra_label: label,
                    nisra_unit: unit,
                    nisra_year: year,
                    nisra_fill: fillHex,
                    nisra_hasValue: rawValue !== null && rawValue !== undefined
                }
                };
            });

            const styledGeojson = { ...geojsonData, features };

            // If re-running, clear any previous source/layers
            if (map.getLayer('shapes-outline')) map.removeLayer('shapes-outline');
            if (map.getLayer('shapes-fill')) map.removeLayer('shapes-fill');
            if (map.getSource('shapes')) map.removeSource('shapes');

            // --- 2) Source ---
            map.addSource('shapes', {
                type: 'geojson',
                data: styledGeojson,
                generateId: true
            });

            // --- 3) Fill layer (TOP of stack; ~20% transparency => 0.8 opacity) ---
            map.addLayer({
                id: 'shapes-fill',
                type: 'fill',
                source: 'shapes',
                paint: {
                'fill-color': [
                    'case',
                    ['boolean', ['get', 'nisra_hasValue'], false],
                    ['get', 'nisra_fill'],
                    '#eeeeee'
                ],
                // hover slightly stronger than default
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.8,   // on hover
                    0.7    // default = 20% transparency
                ]
                }
            }); // no beforeId ⇒ above all basemap labels/roads

            // --- 4) Outline layer (also on top) ---
            map.addLayer({
                id: 'shapes-outline',
                type: 'line',
                source: 'shapes',
                paint: {
                'line-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    '#222222',   // darker when hovered
                    '#555555'
                ],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    2,
                    1
                ],
                'line-opacity': 0.9
                }
            });

            // --- 5) Hover interactivity: cursor, highlight, tooltip ---
            let hoveredId = null;
            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: [0, -6],
                className: 'nisra-popup' // optional: style in CSS if you like
            });

            map.on('mousemove', 'shapes-fill', (e) => {
                map.getCanvas().style.cursor = 'pointer';

                const f = e.features && e.features[0];
                if (!f) return;

                // feature-state hover toggling
                if (hoveredId !== null) {
                map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false });
                }
                hoveredId = f.id;
                map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: true });

                // tooltip content from properties we attached above
                const p = f.properties;
                const valueStr = (p.nisra_value == null)
                ? 'Not available'
                : Number(p.nisra_value).toLocaleString('en-GB');

                const unitPart = (p.nisra_unit && p.nisra_unit.toLowerCase() !== 'number')
                ? ` (${p.nisra_unit})`
                : '';

                const html = `
                <div>
                    <strong>${p.nisra_label}</strong> (${p.nisra_year}): 
                    <strong>${valueStr}</strong>${unitPart}
                </div>`.trim();

                popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
            });

            map.on('mouseleave', 'shapes-fill', () => {
                map.getCanvas().style.cursor = '';
                if (hoveredId !== null) {
                map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false });
                hoveredId = null;
                }
                popup.remove();
            });
            });          
            
            min_value.innerHTML = range_min.toLocaleString("en-GB");       
            max_value.innerHTML = range_max.toLocaleString("en-GB"); 
            
            map_updated.innerHTML = table_updated.innerHTML;

        } else {
            data = data_series;
        }

        table_title.textContent = `${result.label}`;
        page_title.textContent += ` - ${result.label}`;

        nav_theme.textContent = tables[geo_menu.value].theme;        
        nav_subject.textContent = tables[geo_menu.value].subject;    
        nav_product.textContent = tables[geo_menu.value].product;   

        chart_updated.innerHTML = `Last updated: <strong>${result.updated.substr(8, 2)}/${result.updated.substr(5, 2)}/${result.updated.substr(0, 4)}</strong>. See this full dataset on <a href = "https://data.nisra.gov.uk/table/${matrix}" target = "_blank">NISRA Data Portal.</a>`;

        let rows = tables[matrix].rows;

        dp_link.innerHTML = `Showing rows 1-${Math.min(data.length, 10)} of ${rows.toLocaleString("en-GB")}. See this full dataset on <a href = "https://data.nisra.gov.uk/table/${matrix}" target = "_blank">NISRA Data Portal</a> or download it in <a href = "https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${matrix}/CSV/1.0/en">CSV format</a>.`

         while (table_preview.firstChild) {
            table_preview.removeChild(table_preview.firstChild)
         }

         let header_row = document.createElement("tr");

         let headers = Object.keys(result.dimension);

         for (let i = 0; i < headers.length; i ++) {
            if (headers[i] != "NI") {
                let th = document.createElement("th");
                th.textContent = result.dimension[headers[i]].label;
                header_row.appendChild(th);
            }
          

         }

         let unit_header = document.createElement("th");
         let value_header = document.createElement("th");

         unit_header.textContent = "Unit";
         value_header.textContent = "Value";
         value_header.classList.add("text-end");

         header_row.appendChild(unit_header);
         header_row.appendChild(value_header);

         table_preview.appendChild(header_row);

         for (let i = 0; i < Math.min(data.length, 10); i ++) {
            let tr = document.createElement("tr");

            let stat_cell = document.createElement("td");
            stat_cell.textContent = stat_label;
            tr.appendChild(stat_cell);

            let year_cell = document.createElement("td");
            if (["none", "NI"].includes(geog_type)) {
                year_cell.textContent = time_series[i];
            } else {
                year_cell.textContent = year;
            }
            tr.appendChild(year_cell);

            if (!["none", "NI"].includes(geog_type)) {
                let geog_cell = document.createElement("td");
                geog_cell.textContent = titleCase(Object.values(result.dimension[geog_type].category.label)[i]);
                tr.appendChild(geog_cell);
            }

            for (let j = 0; j < other_vars.length; j ++) {
                let other_cell = document.createElement("td");
                other_cell.textContent = Object.values(result.dimension[other_vars[j]].category.label)[0];
                tr.append(other_cell);
            }

            let unit_cell = document.createElement("td");
            unit_cell.textContent = unit;
            tr.appendChild(unit_cell);

            let value_cell = document.createElement("td");
            if (data[i] == null) {
                value_cell.textContent = "..";
            } else {
                let decimals = result.dimension.STATISTIC.category.unit[stats_menu.value].decimals;
                value_cell.textContent = data[i].toLocaleString("en-GB", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
            }
            
            value_cell.style = "text-align: right;";
            tr.appendChild(value_cell);

            table_preview.appendChild(tr);
         }

         let note_cleaned = result.note[0].replaceAll("\r", "<br>").replaceAll("[b]", "<strong>").replaceAll("[/b]", "</strong>").replaceAll("[i]", "<em>").replaceAll("[/i]", "</em>").replaceAll("[u]", "<u>").replaceAll("[/u]", "</u>");

         // Convert [url=...]...[/url] into <a href="...">...</a>
        note_cleaned = note_cleaned.replace(
            /\[url=([a-zA-Z][a-zA-Z0-9+.-]*:[^\]]+)\](.*?)\[\/url\]/gi,
            (match, url, text) => {
                if (url.toLowerCase().startsWith("mailto:")) {
                return `<a href="${url}">${text}</a>`;
                } else {
                return `<a href="${url}" target="_blank">${text}</a>`;
                }
            }
        );



         metadata_text.innerHTML = note_cleaned;   

         downloadButton(matrix);
}