import { BaseScraper } from "./baseScraper.js";
import { prescriberDataSchema } from "../../../schemas.js";

export class ScraperNS extends BaseScraper {
    static scrapeUrl = "https://cpsnsphysiciansearch.azurewebsites.net/";
    static nameLocator = "#MainContent_titlefullname";
    static statusLocator = "#MainContent_frmlicencetype";

    static validStatus = "Licence";

    static async getStatus(prescriber, driver) {
        // Uses licence number, last name, first name
        try {
            const licenceNumber = String(prescriber.licenceNumber);
            const prescriberScrapeUrl = `${ScraperNS.scrapeUrl}PhysicianDetails.aspx?LicenceNumber=${licenceNumber.padStart(6, '0')}`;
            await driver.goto(prescriberScrapeUrl, {waitUntil: 'networkidle2'});
            
            // Will go to search homepage if no match
            if (driver.url() === ScraperNS.scrapeUrl) {
                console.warn(`Not found in matches: ${prescriber.firstName} ${prescriber.lastName} Licence Number: ${prescriber.licenceNumber}.`);
                return null;
            }

            // Confirm if prescriber from licence number is the one we want to verify
            const firstName = String(prescriber.firstName);
            const lastName = String(prescriber.lastName);
            const firstNameRegex = new RegExp("\\b" + firstName.toLowerCase() + "\\b");
            const lastNameRegex = new RegExp("\\b" + lastName.toLowerCase() + "\\b");
            const name = await driver.$eval(ScraperNS.nameLocator, ele => ele.textContent.trim());
            if (!(firstNameRegex.test(name.toLowerCase()) && lastNameRegex.test(name.toLowerCase()))) {
                console.error(`Prescriber name: ${firstName} ${lastName}, does not match: ${name}, using Licence Number: ${prescriber.licenceNumber}.`);
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