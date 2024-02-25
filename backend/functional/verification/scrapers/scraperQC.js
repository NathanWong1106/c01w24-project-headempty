import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperQC extends BaseScraper {
    static scrapeUrl = "https://www.cmq.org/fr/bottin";

    static async getStatus(prescriber, driver) {
        // Uses licence number, last name, first name (optional)
    }
}