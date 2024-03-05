import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNL extends BaseScraper {
    static scrapeUrl = "https://cpsnl.ca/physician-search/";
    static firstNameLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_Input2_TextBox1";
    static lastNameLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_Input1_TextBox1";
    static licenceLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_Input0_TextBox1";
    static searchButtonLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_SubmitButton";
    static iframe = "#pg-post-content > div:nth-child(1) > div > iframe";
    static resultTableLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Grid1_ctl00";

    static validStatus = "Practicing"
    static invalidStatus = "Non-Practicing"

    static async getStatus(prescriber, driver) {
        
        // Similar to ScraperPE
        // Uses license number, last name, first name
        try {
            const firstNameRegex = new RegExp("\\b" + prescriber.firstName + "\\b");
            const lastNameRegex = new RegExp("\\b" + prescriber.lastName + "\\b");

            await driver.goto(ScraperNL.scrapeUrl, {waitUntil: 'networkidle2'});
            
            // Original input preserved after leaving site, must clear input first before enter
            //await driver.waitForSelector(ScraperNL.firstNameLocator);
            //await driver.$eval(ScraperNL.firstNameLocator, ele => ele.value = "");
            await driver.waitForNetworkIdle();
            await driver.waitForSelector('iframe');
            const elementHandle = await driver.$(
                'iframe[src="https://imis.cpsnl.ca/WEB/CPSNL/PhysicianSearch/Physician_Search_New.aspx"]',
            );
            const frame = await elementHandle.contentFrame();
            await frame.$eval(ScraperNL.firstNameLocator, ele => ele.value = "");
            await frame.type(ScraperNL.firstNameLocator, prescriber.firstName);
            await frame.$eval(ScraperNL.lastNameLocator, ele => ele.value = "");
            await frame.type(ScraperNL.lastNameLocator, prescriber.lastName);
            await frame.$eval(ScraperNL.licenceLocator, ele => ele.value = "");
            await frame.type(ScraperNL.licenceLocator, prescriber.licenceNumber);
            
            await frame.click(ScraperNL.searchButtonLocator)
            await driver.waitForNetworkIdle();
            await driver.waitForNetworkIdle();
            
        
            const resultTable = await frame.$(ScraperNL.resultTableLocator);
            // console.log(resultTable);
            const rows = await resultTable.$$("tr");
            console.log(rows.length);

            for (const row of rows) {
                console.log(row);
      
                // Check first name that matches
                const lastName = await row.$eval('td:nth-child(1)', ele => ele.textContent);
                if (!lastName.match(prescriber.lastName)) {
                    //do something eror checking
                } else {
                    const status = await row.$eval('td:nth-child(5)', ele => ele.textContent);
                    if (status.includes(ScraperNL.validStatus)) {
                        return true;
                    } else if (status.includes(ScraperNL.invalidStatus)) {
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
