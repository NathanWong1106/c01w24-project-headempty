import SERVER from "../../constants.js"

import puppeteer from "puppeteer"
import ScraperAB from "./scrapers/scraperAB.js"
import ScraperBC from "./scrapers/scraperBC.js"
import ScraperMB from "./scrapers/scraperMB.js"
import ScraperNB from "./scrapers/scraperNB.js"
import ScraperNL from "./scrapers/scraperNL.js"
import ScraperNS from "./scrapers/scraperNS.js"
import ScraperON from "./scrapers/scraperON.js"
import ScraperPE from "./scrapers/scraperPE.js"
import ScraperQC from "./scrapers/scraperQC.js"
import ScraperSK from "./scrapers/scraperSK.js"

const MOCK_INPUT_DATA = [
    {
        firstName: "Alexandra",
        lastName: "Sylvester",
        province: "NS",
        licensingCollege: "College of Physicians and Surgeons of Nova Scotia",
        licenceNumber: "19314",
    },
    {
        firstName: "Alexia",
        lastName: "Lam",
        province: "QC",
        licensingCollege: "Collège des médecins du Québec",
        licenceNumber: "96332",
    }
]

/**
 * Returns corresponding scraper to use for a given prescriber.
 * If no valid scraper found, an error is thrown.
 * 
 * @param {object} prescriber prescriber data object
 * @returns {BaseScraper}
 */
function getScraper(prescriber) {
    switch (prescriber.licenceCollege) {
        case "College of Physicians and Surgeons of Alberta":
            return ScraperAB;
        case "College of Physicians and Surgeons of British Columbia":
            return ScraperBC;
        case "College of Physicians and Surgeons of Manitoba":
            return ScraperMB;
        case "College of Physicians and Surgeons of New Brunswick":
            return ScraperNB;
        case "College of Physicians and Surgeons of Newfoundland and Labrador":
            return ScraperNL;
        case "College of Physicians and Surgeons of Nova Scotia":
            return ScraperNS;
        case "College of Physicians and Surgeons of Ontario":
            return ScraperON;
        case "College of Physicians & Surgeons of Prince Edward Island":
            return ScraperPE;
        case "Collège des médecins du Québec":
            return ScraperQC;
        case "College of Physicians and Surgeons of Saskatchewan":
            return ScraperSK;
        default:
            throw new Error("Unrecognized licensing college");
    }
}


export async function verifyPrescribers(inputData) {
    let unverified = [];
    let verified = []; // probably unnecessary

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: SERVER.PUPPETEER_BROWSER_PATH
    });
    const page = await browser.newPage();
    
    for (prescriber of inputData) {
        let scraper = getScraper(prescriber);
        let isVerified = scraper.getStatus(prescriber, page);

        // If verified

            // Update their status in DB
        
            // Async call to other function to generate code & sign up link 

        // Else add to unverified with reason (and possibly other error handling)

    }

    // Some actions & returns for unverified (and maybe verified?)

}