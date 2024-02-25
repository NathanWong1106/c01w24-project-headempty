import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperMB extends BaseScraper {
    static scrapeUrl = "https://member.cpsm.mb.ca/member/profilesearch";

    static async getStatus(prescriber, driver) {
        // Uses last name, first name
    }
}