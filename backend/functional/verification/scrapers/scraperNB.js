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
    static resultTableLocator = "#Results";

    static activeStatus = "Current Registration";


    //no Invalid statuses because this site  does not list information for physicians who do 
    //not have an active annual or temporary licence, or who have been suspended from practice

    
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
            
            //checking on all three fields so if the liscence no and name dont match it would be a failed case as wnated
            await driver.waitForSelector(ScraperNB.firstNameLocator);
            await driver.$eval(ScraperNB.firstNameLocator, ele => ele.value = "");
            await driver.type(ScraperNB.firstNameLocator, prescriber.firstName);
            await driver.$eval(ScraperNB.lastNameLocator, ele => ele.value = "");
            await driver.type(ScraperNB.lastNameLocator, prescriber.lastName);
            await driver.$eval(ScraperNB.licenceNumberLocator, ele => ele.value = "");
            await driver.type(ScraperNB.licenceNumberLocator, String(prescriber.licenceNumber));
            
            //for some reason while testing this only works if I do it twice
            await driver.click(ScraperNB.searchButtonLocator)
            await driver.waitForNetworkIdle();
            await driver.click(ScraperNB.searchButtonLocator)
            await driver.waitForNetworkIdle();

            // Check number of matches
            //NOTE: The site only includes people who have a valid active license currently hence not found and 
            //invalid cases are the same
            const matchesText = await driver.$eval(ScraperNB.matchesTextLocator, ele => ele.textContent);
            const numMatches = parseInt(matchesText);
            if (numMatches === 0) {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}. Prescriber is either invalid or does not exist`);
                return null;
            } else if (numMatches === 1){
                return true;
            }
            // //excluding 2 matches cases bc we're also searching on liscence no-> unique instances

        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName}. ${e}`);
            return null;
        }

        console.warn(`Not found in matches: ${prescriber.firstName} ${prescriber.lastName}.`);
        return null;
    }
}
