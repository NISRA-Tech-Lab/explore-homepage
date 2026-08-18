
export async function readData (csv) {

    // ===== LOAD THE METADATA =====
    try {

        // ===== LOAD AND PARSE THE CSV DATA =====
        const response = await fetch(`public/data/${csv}.csv`);
        const text = await response.text();

        const result = Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        });

        const csv_data = result.data;

        // ===== RETURN THE DATA =====
        return csv_data;

    // ===== HANDLE LOADING ERRORS =====
    } catch (error) {
        console.error("Failed to load data:", error);
        return; 
    }
    
}