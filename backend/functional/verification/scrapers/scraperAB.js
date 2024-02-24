import { parseTable } from "./utils.js";
import { BaseScraper } from "./baseScraper.js"
import { Page } from "puppeteer";

export class ScraperAB extends BaseScraper {
    static scrapeUrl = "https://search.cpsa.ca/";
    static firstNameLocator = "#MainContent_physicianSearchView_txtFirstName";
    static lastNameLocator = "#MainContent_physicianSearchView_txtLastName";
    static searchButtonLocator = "#MainContent_physicianSearchView_btnSearch";
    static resultTableLocator = "#MainContent_physicianSearchView_gvResults > tbody";

    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean}
     */
    static async getStatus(prescriber, driver) {
        // Uses last name, first name

        await driver.goto(ScraperAB.scrapeUrl, {waitUntil: 'networkidle2'});
        await driver.type(ScraperAB.firstNameLocator, prescriber.firstName);
        await driver.type(ScraperAB.lastNameLocator, prescriber.lastName);

        await driver.click(ScraperAB.searchButtonLocator)
        // This waits for the process after button click to fully load
        await driver.waitForNetworkIdle();
        
        // Parse result table as 2D array
        // TODO: try to optimize to use only columns we need to check
        const table = await parseTable(ScraperAB.resultTableLocator, driver);

        for (let row of table) {
            // Name in first column
            const name = row[0];
            if (name.includes(prescriber.firstName) && name.includes(prescriber.lastName)) {
                return true;
            }
        }

        return false;
    }
}