import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperPE extends BaseScraper {
    static scrapeUrl = "https://cpspei.alinityapp.com/client/publicdirectory";

    static async getStatus(prescriber, driver) {
        // Similar to ScrapeNL
        // Uses license number last name, first name
    }
}