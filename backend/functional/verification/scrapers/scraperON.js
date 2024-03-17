import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperON extends BaseScraper {
    static scrapeUrl = "https://doctors.cpso.on.ca/?search=general";
    static notRegisteredCheckboxLocator = "#p_lt_ctl01_pageplaceholder_p_lt_ctl02_CPSO_AllDoctorsSearch_chkInactiveDoctors";
    static lastNameLocator = "#txtLastName";
    static firstNameLocator = '#txtFirstName';
    static licenceNumberLocator = '#txtCPSONumberGeneral';
    static searchButtonLocator = '#p_lt_ctl01_pageplaceholder_p_lt_ctl02_CPSO_AllDoctorsSearch_btnSubmit1';

    static headingLocator = ".doctor-details-heading";
    static doctorNameLocator = "#docTitle";
    static doctorInfoLocator = ".doctor-info";
    static doctorStatusLocator = "div.doctor-info:nth-child(2) > div:nth-child(2) > strong:nth-child(1)";
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
            const firstName = String(prescriber.firstName);
            const lastName = String(prescriber.lastName);

            await driver.goto(ScraperON.scrapeUrl, { waitUntil: 'networkidle2' });
            // Check checkbox to also include doctors no longer registered
            await driver.$eval(ScraperON.notRegisteredCheckboxLocator, ele => ele.checked = true);

            await driver.type(ScraperON.lastNameLocator, prescriber.lastName);
            await driver.type(ScraperON.firstNameLocator, prescriber.firstName);
            await driver.type(ScraperON.licenceNumberLocator, prescriber.licenceNumber);

            await driver.click(ScraperON.searchButtonLocator);
            await driver.waitForSelector(ScraperON.headingLocator, { timeout: 5000 });

            const doctorDetailsHeading = await driver.$(ScraperON.headingLocator);

            if (doctorDetailsHeading !== null) {
                const name = await doctorDetailsHeading.$eval(ScraperON.doctorNameLocator, ele => ele.textContent.trim());
                const nameLowercase = name.toLowerCase();
                if (!nameLowercase.includes(firstName.toLowerCase()) || !nameLowercase.includes(lastName.toLowerCase())) {
                    console.error(`Prescriber name: ${firstName} ${lastName}, does not match: ${name}, using Licence Number: ${licenceNumber}.`);
                    return null;
                }

                const status = await doctorDetailsHeading.$eval(ScraperON.doctorStatusLocator, ele => ele.textContent.trim());
                return status.includes(ScraperON.validStatus);
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