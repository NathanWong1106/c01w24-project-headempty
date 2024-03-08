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

import { createPrescriber, updatePrescriberRegistered } from "../../database/verificationServiceDbUtils.js";

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

    let browser = null;
    if (SERVER.RUN_PUPPETEER === "container") {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: "google-chrome-stable",
            defaultViewport: null,
        });
    }
    else if (SERVER.RUN_PUPPETEER === "devcontainer") {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: "google-chrome-stable",
            defaultViewport: null,
            args: ['--no-sandbox'],
        });
    }
    else if (SERVER.RUN_PUPPETEER === "local") {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
    }
    else {
        throw new Error("Invalid value for environment variable: RUN_PUPPETEER.");
    }
    
    for (const prescriber of inputData) {
        console.debug(`Verifying: ${prescriber.firstName} ${prescriber.lastName}`);
        // Create prescriber stub
        const res = await createPrescriber(prescriber);
        if (!res) {
            error.push(prescriber);
            continue;
        }

        const page = await browser.newPage();
        // Spoof normal browser to avoid being auto-flagged as a bot
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
        
        let scraper = getScraper(prescriber);
        let isVerified = await scraper.getStatus(prescriber, page);

        if (isVerified === true) {
            verified.push(prescriber);
            updatePrescriberRegistered(prescriber);
        }
        else if (isVerified === false) {
            invalid.push(prescriber);
        }
        else {
             // Includes prescribers that could not be found & actual errors when scraping
             error.push(prescriber);
        }
        await page.close();
    }

    await browser.close();

    return {
        verified: verified,
        invalid: invalid,
        error: error
    }
}