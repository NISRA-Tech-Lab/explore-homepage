const cache = {};

export async function readData(csv) {

    if (cache[csv]) {
        return cache[csv];
    }

    try {

        const response = await fetch(`public/data/${csv}.csv`);
        const text = await response.text();

        const result = Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        });

        const csv_data = result.data;

        cache[csv] = csv_data;

        return csv_data;

    } catch (error) {
        console.error("Failed to load data:", error);
        return;
    }

}