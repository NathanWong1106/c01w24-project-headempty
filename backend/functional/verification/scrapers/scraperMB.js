import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperMB extends BaseScraper {
    static scrapeUrl = "https://member.cpsm.mb.ca/member/profilesearch";
    // NOTE: These selectors will implode on any small website update
    static lastNameLocator = "#main-page > div > div > div > div > div.purpleBorder > div.m-1 > div.row > div > form > div:nth-child(1) > div.col-md-9 > input";
    static firstNameLocator = "#main-page > div > div > div > div > div.purpleBorder > div.m-1 > div.row > div > form > div:nth-child(2) > div.col-md-9 > input";
    static searchButtonLocator = "#main-page > div > div > div > div > div.purpleBorder > div.m-1 > div.row > div > form > div:nth-child(8) > div.p-2 > input";

    static tableLocator = ".table.table-borderless.table-sm";

    static noMatchesText = "There are no entries.";

    static validStatus = "Regulated Member";

    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean | null}
     */
    static async getStatus(prescriber, driver) {
        // Uses last name, first name

        try {
            await driver.goto(ScraperMB.scrapeUrl, { waitUntil: 'networkidle2' });

            await driver.waitForSelector(ScraperMB.firstNameLocator);
            await driver.type(ScraperMB.firstNameLocator, prescriber.firstName);
            await driver.type(ScraperMB.lastNameLocator, prescriber.lastName);

            await driver.click(ScraperMB.searchButtonLocator);
            await driver.waitForNetworkIdle();

            // Result table is the first table with classes 'table table-borderless table-sm'
            const tables = await driver.$$(ScraperMB.tableLocator);
            const resultTable = tables[0];
            const results = await resultTable.$$("tr");

            const numMatches = results.length;
            // No table head
            if (numMatches === 1) {
                // Will display just 1 column with text if no matches
                const text = await results[0].evaluate(ele => {
                    return ele.getElementsByTagName("td")[0].textContent.trim();
                });

                if (text === ScraperMB.noMatchesText) {
                    console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}`);
                    return null;
                }
            }
            // Table head uses a tr
            else if (numMatches >= 3) {
                console.warn(
                    `More than 1 match for prescriber: ${prescriber.firstName} ${prescriber.lastName}.
                    Selecting first instance if multiple fully match.`
                );
            }

            // Skip tr from table head
            for (const result of results.slice(1)) {
                const name = await result.evaluate(ele => {
                    const columns = ele.getElementsByTagName("td");
                    // Last name in first column, first name (given name) in second
                    return {
                        lastName: columns[0].textContent.trim(),
                        firstName: columns[1].textContent.trim()
                    }
                });

                if (name.lastName === prescriber.lastName && name.firstName === prescriber.firstName) {
                    await result.click();
                    await driver.waitForNetworkIdle();

                    // Status table is the third table with classes 'table table-borderless table-sm'
                    // const statusTable = await driver.$$(ScraperMB.tableLocator)[2];
                    const tables = await driver.$$(ScraperMB.tableLocator);
                    const statusTable = tables[2];
                    // const statusTable = await driver.$(ScraperMB.statusTableLocator);
                    const status = await statusTable.evaluate(ele => {
                        // Fourth row in the table, only 1 column
                        const row = ele.getElementsByTagName("tr")[3];

                        return row.getElementsByTagName("td")[0].textContent.trim();
                    });

                    // Status string contains chain of tags
                    if (status.includes(ScraperMB.validStatus)) {
                        return true;
                    }
                    else {
                        return false;
                    }
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