// Generic helper to parse a table into a 2D array
// This can be used temporarily, but we should ideally parse only the specific columns we want to use
// to save on computational cost/unnecessary work.
export async function parseTable(selector, driver) {
    return driver.$$eval(selector, trs => trs.map(tr => {
        const tds = [...tr.getElementsByTagName('td')];
        return tds.map(td => td.textContent.trim());
    }));
}