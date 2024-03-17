import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNB extends BaseScraper {
    static scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory";
    //they didnt have IDs for a lot of elements
    static firstNameLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(1) > div:nth-child(1) > input";
    static lastNameLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(2) > div:nth-child(1) > input";
    static licenceNumberLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(4) > div:nth-child(1) > input"
    static searchButtonLocator = "#publicdirectorycontainer > div.page-content.als-page-content > div.row > div > section > div:nth-child(1) > div > div > div.input-group-btn > div > button";
    static matchesTextLocator = "#publicdirectorycontainer > div.page-content.als-page-content > div.row > div > section > div:nth-child(2) > div > div > div > div > div > small > span:nth-child(6)";

    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean | null}
     */
    static async getStatus(prescriber, driver) {
        // Uses license number, last name, first name

        try {

            await driver.goto(ScraperNB.scrapeUrl, {waitUntil: 'networkidle2'});
            
            //checking on two fields so if the liscence no and last name dont match it would be a failed case as wnated
            await driver.waitForSelector(ScraperNB.firstNameLocator);
            await driver.type(ScraperNB.lastNameLocator, prescriber.lastName);
            await driver.type(ScraperNB.licenceNumberLocator, String(prescriber.licenceNumber));
            
            //for some reason while testing this only works if I do it twice
            await driver.click(ScraperNB.searchButtonLocator);
            await new Promise(r => new setTimeout(r, 1000));
            await driver.click(ScraperNB.searchButtonLocator);
            await new Promise(r => new setTimeout(r, 1000));

            // Check number of matches
            //NOTE: The site only includes people who have a valid active license currently hence not found and 
            //invalid cases are the same
            const matchesText = await driver.$eval(ScraperNB.matchesTextLocator, ele => ele.textContent);
            const numMatches = parseInt(matchesText);
            if (numMatches === 0) {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}. Prescriber is either invalid or does not exist`);
                return null;
            } 
            return true;
            // //excluding 2 matches cases bc we're also searching on liscence no-> unique instances

        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName}. ${e}`);
            return null;
        }

        console.warn(`Not found in matches: ${prescriber.firstName} ${prescriber.lastName}.`);
        return null;
    }
}
