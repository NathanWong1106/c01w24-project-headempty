import { SERVER } from "../../constants.js";

import puppeteer from "puppeteer";
import { ScraperAB } from "./scrapers/scraperAB.js";
import { ScraperBC } from "./scrapers/scraperBC.js";
import { ScraperMB } from "./scrapers/scraperMB.js";
import { ScraperNB } from "./scrapers/scraperNB.js";
import { ScraperNL } from "./scrapers/scraperNL.js";
import { ScraperNS } from "./scrapers/scraperNS.js";
import { ScraperON } from "./scrapers/scraperON.js";
import { ScraperPE } from "./scrapers/scraperPE.js";
import { ScraperQC } from "./scrapers/scraperQC.js";
import { ScraperSK } from "./scrapers/scraperSK.js";

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
];

const scraperMapping = {
    "College of Physicians and Surgeons of Alberta": ScraperAB,
    "College of Physicians and Surgeons of British Columbia": ScraperBC,
    "College of Physicians and Surgeons of Manitoba": ScraperMB,
    "College of Physicians and Surgeons of New Brunswick": ScraperNB,
    "College of Physicians and Surgeons of Newfoundland and Labrador": ScraperNL,
    "College of Physicians and Surgeons of Nova Scotia": ScraperNS,
    "College of Physicians and Surgeons of Ontario": ScraperON,
    "College of Physicians & Surgeons of Prince Edward Island": ScraperPE,
    "Collège des médecins du Québec": ScraperQC,
    "College of Physicians and Surgeons of Saskatchewan": ScraperSK
}

/**
 * Returns corresponding scraper to use for a given prescriber.
 * If no valid scraper found, an error is thrown.
 * 
 * @param {object} prescriber prescriber data object
 * @returns {BaseScraper}
 */
function getScraper(prescriber) {
    if (!(prescriber.licensingCollege in scraperMapping)) {
        throw new Error("Unrecognized licensing college");
    }
    return scraperMapping[prescriber.licensingCollege];
}

export async function verifyPrescribers(inputData) {
    let invalid = [];
    let verified = [];
    let error = [];

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: SERVER.PUPPETEER_BROWSER_PATH
    });
    const page = await browser.newPage();
    
    for (const prescriber of inputData) {
        console.debug(`Verifying: ${prescriber.firstName} ${prescriber.lastName}`);
        let scraper = getScraper(prescriber);
        let isVerified = await scraper.getStatus(prescriber, page);

        if (isVerified === true) {
            verified.push(prescriber);
            // TODO: Update db status to verified
        }
        else if (isVerified === false) {
            invalid.push(prescriber);
        }
        else {
             // Includes prescribers that could not be found & actual errors when scraping
             error.push(prescriber);
        }
    }

    await browser.close();

    return {
        verified: verified,
        invalid: invalid,
        error: error
    }
}