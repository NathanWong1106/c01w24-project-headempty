import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNS extends BaseScraper {
    static scrapeUrl = "https://cpsnsphysiciansearch.azurewebsites.net/";
    static nameLocator = "#MainContent_titlefullname";
    static statusLocator = "#MainContent_frmlicencetype";

    static validStatus = "Licence";

    static async getStatus(prescriber, driver) {
        // Uses licence number, last name, first name
        https://cpsnsphysiciansearch.azurewebsites.net/PhysicianDetails.aspx?LicenceNumber=019850
        try {
            const prescriberScrapeUrl = `${ScraperNS.scrapeUrl}PhysicianDetails.aspx?LicenceNumber=${prescriber.licenceNumber.padStart(6, '0')}`;
            await driver.goto(prescriberScrapeUrl, {waitUntil: 'networkidle2'});
            
            // Will go to search homepage if no match
            if (driver.url() === ScraperNS.scrapeUrl) {
                console.warn(`Not found in matches: ${prescriber.firstName} ${prescriber.lastName} Licence Number: ${prescriber.licenceNumber}.`);
                return null;
            }

            // Confirm if prescriber from licence number is the one we want to verify
            const firstNameRegex = new RegExp("\\b" + prescriber.firstName + "\\b");
            const lastNameRegex = new RegExp("\\b" + prescriber.lastName + "\\b");
            const name = await driver.$eval(ScraperNS.nameLocator, ele => ele.textContent.trim());
            if (!(firstNameRegex.test(name) && lastNameRegex.test(name))) {
                console.error(`Prescriber name: ${prescriber.firstName} ${prescriber.lastName}, does not match: ${name}, using Licence Number: ${prescriber.licenceNumber}.`);
                return null;
            }
            
            // Located in a disabled input field
            // Anything without 'Licence' in the status is invalid
            const status = await driver.$eval(ScraperNS.statusLocator, ele => ele.value);
            return status.includes(ScraperNS.validStatus);
        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName} Licence Number: ${prescriber.licenceNumber}. ${e}`);
            return null;
        }
    }
}