import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperON extends BaseScraper {
    static scrapeUrl = "https://doctors.cpso.on.ca/?search=general";

    static async getStatus(prescriber, driver) {
        // Uses license number, last name, first name
    }
}