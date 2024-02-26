import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperAB extends BaseScraper {
    static scrapeUrl = "https://search.cpsa.ca/";
    static firstNameLocator = "#MainContent_physicianSearchView_txtFirstName";
    static lastNameLocator = "#MainContent_physicianSearchView_txtLastName";
    static searchButtonLocator = "#MainContent_physicianSearchView_btnSearch";

    static matchesTextLocator = "#MainContent_physicianSearchView_ResultsPanel > div.row.resultsHeader > div > h2";
    static numMatchesRegex = /Results: (\d+) matches/;
    static resultTableLocator = "#MainContent_physicianSearchView_gvResults > tbody";

    static headerLocator = ".tabHeader";

    static invalidStatus = "(Inactive)"

    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean | null}
     */
    static async getStatus(prescriber, driver) {
        // Uses last name, first name
        
        try {
            const firstNameRegex = new RegExp("\\b" + prescriber.firstName + "\\b");
            const lastNameRegex = new RegExp("\\b" + prescriber.lastName + "\\b");

            await driver.goto(ScraperAB.scrapeUrl, {waitUntil: 'networkidle2'});
            await driver.type(ScraperAB.firstNameLocator, prescriber.firstName);
            await driver.type(ScraperAB.lastNameLocator, prescriber.lastName);
            await driver.goto(ScraperAB.scrapeUrl, {waitUntil: 'networkidle2'});
            await driver.type(ScraperAB.firstNameLocator, prescriber.firstName);
            await driver.type(ScraperAB.lastNameLocator, prescriber.lastName);

            await driver.click(ScraperAB.searchButtonLocator)
            // This waits for the process after button click to fully load
            await driver.waitForNetworkIdle();

            // Check number of matches
            const matchesText = await driver.$eval(ScraperAB.matchesTextLocator, ele => ele.textContent);
            const numMatches = parseInt(matchesText.match(this.numMatchesRegex)[1]);
            if (numMatches === 0) {
                // TODO: change to some other logging?
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}`);
                return null;
            }
            else if (numMatches >= 2) {
                console.warn(
                    `More than 1 match for prescriber: ${prescriber.firstName} ${prescriber.lastName}.
                    Selecting first instance if multiple fully match.`
                );
            }
            
            // Name available as link in first column of table
            const resultTable = await driver.$(ScraperAB.resultTableLocator);
            const rows = await resultTable.$$("tr");

            for (const row of rows) {
                const info = await row.evaluate(ele => {
                    const nameElement = ele.getElementsByTagName("a")[0];
                    const name = nameElement.textContent.trim();
                    const link = nameElement.href;
                    return {
                        name: name,
                        link: link
                    }
                });

                // Check first name that matches
                if (firstNameRegex.test(info.name) && lastNameRegex.test(info.name)) {
                    await driver.goto(info.link, {waitUntil: 'networkidle2'});
                    
                    // Name and status located in an h2 inside the 'tabHeader'
                    const headerElement = await driver.$(ScraperAB.headerLocator);
                    const name = await headerElement.evaluate(ele => {
                        return ele.getElementsByTagName("h2")[0].textContent.trim();
                    });
                    
                    // If invalid then '(Inactive)' is to the right of name
                    if (name.includes(ScraperAB.invalidStatus)) {
                        return false;
                    }
                    return true;
                }
            }
        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName}. ${e}`);
            return null;
        }

        console.warn(`Not found in matches: ${prescriber.firstName} ${prescriber.lastName}.`);
        return null;
    }
}