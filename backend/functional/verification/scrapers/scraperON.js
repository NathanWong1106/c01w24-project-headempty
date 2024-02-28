import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperON extends BaseScraper {
    static scrapeUrl = "https://doctors.cpso.on.ca/?search=general";
    static lastNameLocator = "#txtLastName";
    static firstNameLocator = '#txtFirstName';
    static searchButtonLocator = '#p_lt_ctl01_pageplaceholder_p_lt_ctl02_CPSO_AllDoctorsSearch_btnSubmit1';

    static resultLocator = ".doctor-search-results--result";
    static headingLocator = ".doctor-details-heading"
    static doctorInfoLocator = ".doctor-info";

    static validStatus = "Active"
    static invalidStatus = "Expired";

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

            await driver.click(ScraperON.searchButtonLocator)
            await driver.waitForNetworkIdle();

            // Result table is the first table with classes 'table table-borderless table-sm'
            const results = await driver.$$(ScraperON.resultLocator);
            const result = results[0];

            const numMatches = results.length;
            if (numMatches == 0) {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}`);
                return null;
            }
            else if (numMatches > 1) {
                console.warn(
                    `More than 1 match for prescriber: ${prescriber.firstName} ${prescriber.lastName}.
                Selecting first instance if multiple fully match.`
                );
            }

            const hTag = await result.$('h3');
            const info = await hTag.evaluate(ele => {
                const nameElement = ele.getElementsByTagName("a")[0];
                const name = nameElement.textContent.trim();
                const link = nameElement.href;
                return {
                    name: name,
                    link: link
                }
            });

            if (info.name.includes(prescriber.firstName) && info.name.includes(prescriber.lastName)) {
                await driver.goto(info.link, { waitUntil: 'networkidle2' });

                const doctorDetailsHeading = await driver.$(ScraperON.headingLocator);
                const doctorInfoDivs = await doctorDetailsHeading.$$(ScraperON.doctorInfoLocator);
                const firstDoctorInfoDiv = doctorInfoDivs[0];
                const strongTags = await firstDoctorInfoDiv.$$('strong');
                const strongTag = strongTags[1];

                const strongText = await driver.evaluate(strongTag => strongTag.textContent, strongTag);

                if (strongText.includes(ScraperON.invalidStatus)) {
                    return false;
                }
                else if (strongText.includes(ScraperON.validStatus)) {
                    return true;
                }
                else {
                    console.warn(`status is ${strongText}`);
                    return null;
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