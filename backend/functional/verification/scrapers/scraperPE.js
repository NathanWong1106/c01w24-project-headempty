import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

//This site can only handle a number of requests until it blocks the user with a "Forbidden" message
//Typically stops working after 4th subsequent try
export class ScraperPE extends BaseScraper {
    static scrapeUrl = "https://cpspei.alinityapp.com/client/publicdirectory";
    static firstNameLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(1) > div:nth-child(1) > input";
    static lastNameLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(2) > div:nth-child(1) > input";
    static licenceNumberLocator = "#parameterformcontainer > div > fieldset > div > div:nth-child(4) > div:nth-child(1) > input"
    static searchButtonLocator = "#publicdirectorycontainer > div.page-content.als-page-content > div.row > div > section > div:nth-child(1) > div > div > div.input-group-btn > div > button";
    static matchesTextLocator = "#publicdirectorycontainer > div.page-content.als-page-content > div.row > div > section > div:nth-child(2) > div > div > div > div > div > small > span:nth-child(6)";
    static memberTableLocator = "#Results > tbody > tr"
    
    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean | null}
     */
    static async getStatus(prescriber, driver) {

        // Search only reliably works with first word of first name and first word of last name
        const firstName = prescriber.firstName.split(" ")[0];
        const lastName = prescriber.lastName.split(" ")[0];

        // Uses licence number last name, first name
        try {
            await driver.goto(ScraperPE.scrapeUrl, { waitUntil: 'networkidle2' });
            await driver.waitForSelector(ScraperPE.firstNameLocator);
            
            //Individuals with multiple first or last names do not pop up correctly when full name is included
            //Search works better when only the starting word of both first name and last name are used 
            await driver.type(ScraperPE.firstNameLocator, firstName);
            await driver.type(ScraperPE.lastNameLocator, lastName);
            await driver.type(ScraperPE.licenceNumberLocator, String(prescriber.licenceNumber));

            // Have to wait before searching, timer can be toned down but is high for consistency purposes
            await new Promise(t => new setTimeout(t, 2000));
            await driver.waitForSelector(ScraperPE.searchButtonLocator);
            await driver.click(ScraperPE.searchButtonLocator);
            await new Promise(t => new setTimeout(t, 2000));

            //Only licensed individuals are listed
            const matchesText = await driver.$eval(ScraperPE.matchesTextLocator, ele => ele.textContent);
            const numMatches = parseInt(matchesText);

            //The case if there's 0 matches
            if (numMatches === 0) {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}. Prescriber is either invalid or does not exist`);
                return false;
            }

            //Check if the record that pops up has the same name and licenceNumber used in the search
            const memberTableElement = await driver.$(ScraperPE.memberTableLocator);
            const memberName = await memberTableElement.evaluate(ele => {
                return ele.getElementsByTagName("td")[0].textContent.trim();
            });
            
            //If the element doesn't contain the first word of first and last name, or licence number, then not verified
            if (!memberName.includes(firstName) || !memberName.includes(lastName) || !memberName.includes(prescriber.licenceNumber))
            {
                return false;
            }

            return true;

        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName}. ${e}`);
            return null;
        }
    }
}