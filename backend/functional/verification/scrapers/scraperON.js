import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperON extends BaseScraper {
    static scrapeUrl = "https://doctors.cpso.on.ca/?search=general";
    static lastNameLocator = "#txtLastName";
    static firstNameLocator = '#txtFirstName';
    static licenceNumberLocator = '#txtCPSONumberGeneral';
    static searchButtonLocator = '#p_lt_ctl01_pageplaceholder_p_lt_ctl02_CPSO_AllDoctorsSearch_btnSubmit1';

    static headingLocator = ".doctor-details-heading"
    static doctorInfoLocator = ".doctor-info";

    static validStatus = "Active";

    /**
     * 
     * @param { object } prescriber
     * @param { Page } driver
     * @returns { boolean | null }
     */
    static async getStatus(prescriber, driver) {
        // Uses license number, last name, first name
        try {
            await driver.goto(ScraperON.scrapeUrl, { waitUntil: 'networkidle2' });
            await driver.type(ScraperON.lastNameLocator, prescriber.lastName);
            await driver.type(ScraperON.firstNameLocator, prescriber.firstName);
            await driver.type(ScraperON.licenceNumberLocator, prescriber.licenceNumber);

            await driver.click(ScraperON.searchButtonLocator);
            await driver.waitForSelector(ScraperON.headingLocator);

            const doctorDetailsHeading = await driver.$(ScraperON.headingLocator);

            if (doctorDetailsHeading !== null) {
                const doctorInfoDivs = await doctorDetailsHeading.$$(ScraperON.doctorInfoLocator);
                const firstDoctorInfoDiv = doctorInfoDivs[0];
                const strongTags = await firstDoctorInfoDiv.$$('strong');
                const strongTag = strongTags[1];
                const strongText = await driver.evaluate(strongTag => strongTag.textContent, strongTag);

                return strongText.includes(ScraperON.validStatus);
            }
            else {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName} License Number: ${prescriber.licenceNumber}`);
                return null;
            }
        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName} License Number: ${prescriber.licenceNumber}. ${e}`);
            return null;
        }
    }
}