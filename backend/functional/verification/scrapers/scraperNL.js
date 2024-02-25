import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNL extends BaseScraper {
    static scrapeUrl = "https://cpsnl.ca/physician-search/";

    static async getStatus(prescriber, driver) {
        // Similar to ScraperPE
        // Uses license number, last name, first name
    }
}