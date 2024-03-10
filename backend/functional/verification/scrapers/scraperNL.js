import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNL extends BaseScraper {
    static scrapeUrl = "https://cpsnl.ca/physician-search/";
    static lastNameLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_Input1_TextBox1";
    static licenceLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_Input0_TextBox1";
    static searchButtonLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Sheet0_SubmitButton";
    static iframe = "#pg-post-content > div:nth-child(1) > div > iframe";
    static resultTableLocator = "#ctl00_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Grid1_ctl00";

    static validStatus = "Practicing"
    static invalidStatus = "Non-Practicing"

    static async getStatus(prescriber, driver) {
        // Uses license number, last name, first name
        try {

            //the liscence no format in the csv is diff from the website formatting
            const licenceNo = prescriber.licenceNumber.slice(0, 1) + " " + prescriber.licenceNumber.slice(1);

            await driver.goto(ScraperNL.scrapeUrl, {waitUntil: 'networkidle2'});
            
            await driver.waitForNetworkIdle();
            await driver.waitForSelector('iframe');
            const elementHandle = await driver.$(
                'iframe[src="https://imis.cpsnl.ca/WEB/CPSNL/PhysicianSearch/Physician_Search_New.aspx"]',
            );

            //searching on license number and last name only
            const frame = await elementHandle.contentFrame();
            await frame.type(ScraperNL.lastNameLocator, prescriber.lastName);
            await frame.type(ScraperNL.licenceLocator, licenceNo);
            
            await frame.click(ScraperNL.searchButtonLocator)
            await driver.waitForNetworkIdle();
            await driver.waitForNetworkIdle();
            
            const resultTable = await frame.$(ScraperNL.resultTableLocator);
            const lastName = await resultTable.evaluate(ele => {
                return ele.getElementsByTagName("td")[0].textContent.trim();
            });

            if (lastName.match(prescriber.lastName)){
                const status = await resultTable.evaluate(ele => {
                    return ele.getElementsByTagName("td")[4].textContent.trim();
                });
                if (status === ScraperNL.validStatus) {
                    return true;
                } else if (status === ScraperNL.invalidStatus) {
                    return false;
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
