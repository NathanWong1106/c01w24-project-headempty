import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperQC extends BaseScraper {
    static scrapeUrl = "https://www.cmq.org/fr/bottin/medecins?number=";
    static cookieButtonLocator = "#didomi-notice-agree-button";

    static validStatus = "Inscrit - Actif";

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
            const licenceNumber = String(prescriber.licenceNumber);
            await driver.goto(`${ScraperQC.scrapeUrl}${licenceNumber.padStart(5, '0')}`, { waitUntil: 'networkidle2' });
            try {
                await driver.waitForSelector(ScraperQC.cookieButtonLocator, { timeout: 3000 });
                await driver.click(ScraperQC.cookieButtonLocator);
            } catch (error) {}

            try {
                await driver.waitForSelector('table tr.physician-item', { timeout: 5000 });

                // Check the first row with class "physician-item"
                const firstRow = await driver.$('table tr.physician-item');
                if (!firstRow) {
                    console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName} License Number: ${prescriber.licenceNumber}`);
                    return null;
                }

                // Check if name matches who we are verifying
                const name = await firstRow.$eval('td:nth-child(1)', ele => ele.textContent.trim());
                const nameLowercase = name.toLowerCase();
                if (!nameLowercase.includes(firstName.toLowerCase()) || !nameLowercase.includes(lastName.toLowerCase())) {
                    console.error(`Prescriber name: ${firstName} ${lastName}, does not match: ${name}, using Licence Number: ${licenceNumber}.`);
                    return null;
                }

                await firstRow.click();

                await driver.waitForSelector('ul.o-list-bare.u-owl-s > li:nth-child(4)');

                // Get the text of the span tag inside the div with class "info" within the 4th li element
                const spanText = await driver.evaluate(() => {
                    const fourthLi = document.querySelector('ul.o-list-bare.u-owl-s > li:nth-child(4)');
                    if (fourthLi) {
                        const divInfo = fourthLi.querySelector('.info');
                        if (divInfo) {
                            const spanTag = divInfo.querySelector('span');
                            if (spanTag) {
                                return spanTag.textContent.trim();
                            }
                        }
                    }
                    return null;
                });

                return spanText.includes(ScraperQC.validStatus);

            } catch (error) {
                console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName} License Number: ${prescriber.licenceNumber}`);
                return null;
            }
        } catch (e) {
            console.error(`Error trying to verify: ${prescriber.firstName} ${prescriber.lastName} License Number: ${prescriber.licenceNumber}. ${e}`);
            return null;
        }
    }
}