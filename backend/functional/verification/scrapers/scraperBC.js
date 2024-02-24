import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";
import { ScraperAB } from "./scraperAB.js";

export class ScraperBC extends BaseScraper {
    static scrapeUrl = "https://www.cpsbc.ca/public/registrant-directory";
    static advancedSearchLocator = "#edit-ps-advance-search > div:nth-child(1) > label";
    static lastNameLocator = "#edit-ps-last-name";
    static firstNameLocator = "#edit-ps-first-name";
    static searchButtonLocator = "#edit-ps-submit";

    static resultWrapperLocator = ".results-main-wrapper";
    static resultsLocator = ".result-item";

    static activeStatus = "Practising";
    static inactiveStatuses = [
        "Not licensed for independent practice",
        "In training",
        "Resigned",
        "Out of province",
        "Cancelled"
    ];

    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean | null}
     */
    static async getStatus(prescriber, driver) {
        // Uses last name, first name
        // Need to first click on advanced search

        await driver.goto(ScraperBC.scrapeUrl, {waitUntil: 'networkidle2'});
        await driver.click(ScraperBC.advancedSearchLocator);
        await driver.type(ScraperBC.firstNameLocator, prescriber.firstName);
        await driver.type(ScraperBC.lastNameLocator, prescriber.lastName);
        await driver.click(ScraperBC.searchButtonLocator);
        await driver.waitForNavigation();

        // Results are inside the div with class results-main-wrapper
        // Each result has class result-item
        // Name located in first div of a result, in an 'a' in an h5 3 layers down
        // Status is located in the second div of a result
        const resultWrapper = await driver.$(ScraperBC.resultWrapperLocator);
        for (const result of await resultWrapper.$$(ScraperBC.resultsLocator)) {
            const name = await result.evaluate(ele => {
                const nameElement = ele.getElementsByTagName("a")[0];
                // Need to remove trailing arrow_forward from a connected span element
                return nameElement.textContent.trim().replace(/\s*arrow_forward$/, '');
            })
            if (name.includes(prescriber.firstName) && name.includes(prescriber.lastName)) {
                const status = await result.evaluate(ele => {
                    const statusElement = ele.getElementsByClassName("ps-contact__element")[0];
                    // Need to remove leading 'Registration status: '
                    return statusElement.textContent.trim().replace(/Registration status:\s*/, '');
                })
                if (status === ScraperBC.activeStatus) {
                    return true;
                }
                else if (ScraperBC.inactiveStatuses.includes(status)) {
                    return false;
                }
                else {
                    return null;
                }
            }
        }

        return null;
    }
}