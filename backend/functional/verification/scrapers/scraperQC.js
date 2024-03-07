import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperQC extends BaseScraper {
    static scrapeUrl = "https://www.cmq.org/fr/bottin";
    static cookieButtonLocator = "#didomi-notice-agree-button";
    static licenceNumberLocator = '#number';
    static searchButtonLocator = '.c-button';

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
            await driver.goto(ScraperQC.scrapeUrl, { waitUntil: 'networkidle2' });
            await driver.click(ScraperQC.cookieButtonLocator);
            await driver.waitForSelector(ScraperQC.licenceNumberLocator);
            await driver.type(ScraperQC.licenceNumberLocator, prescriber.licenceNumber);

            const button = await driver.$('button[type="submit"]');
            await button.click();

            try {
                await driver.waitForSelector('table tr.physician-item', { timeout: 5000 });

                // Click the first row with class "physician-item"
                await driver.evaluate(() => {
                    const firstRow = document.querySelector('table tr.physician-item');
                    if (firstRow) {
                        firstRow.click();
                    } else {
                        console.error('No rows with class "physician-item" found in the table.');
                        return null;
                    }
                });

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