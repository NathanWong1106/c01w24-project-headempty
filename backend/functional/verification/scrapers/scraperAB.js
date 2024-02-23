import parseTable from "./utils"

export const scraperAB = ScraperAB();

class ScraperAB extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://search.cpsa.ca/"
    }

    async getStatus(prescriber, driver) {
        // Uses last name, first name

        await driver.goto("https://search.cpsa.ca/", {waitUntil: 'networkidle2'});
        await driver.type("#MainContent_physicianSearchView_txtFirstName", prescriber.firstName);
        await driver.type("#MainContent_physicianSearchView_txtLastName", prescriber.lastName);

        await driver.click("#MainContent_physicianSearchView_btnSearch")
        // This waits for the process after button click to fully load
        await driver.waitForNetworkIdle();
        
        // Parse result table as 2D array
        // TODO: try to optimize to use only columns we need to check
        const table = await parseTable("#MainContent_physicianSearchView_gvResults > tbody", driver);

        for (let row in table) {
            // Name in first column
            const name = row[0];
            if (name.includes(prescriber.firstName) && name.includes(prescriber.lastName)) {
                return true;
            }
        }

        return false;
    }
}