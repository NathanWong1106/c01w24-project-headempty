import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperNS extends BaseScraper {
    static scrapeUrl = "https://cpsnsphysiciansearch.azurewebsites.net/";

    static async getStatus(prescriber, driver) {
        // Uses licence number, last name, first name
    }
}