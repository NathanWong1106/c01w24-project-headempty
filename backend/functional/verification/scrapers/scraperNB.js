import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNB extends BaseScraper {
    static scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory";

    static async getStatus(prescriber, driver) {
        // Uses license number, last name, first name
    }
}