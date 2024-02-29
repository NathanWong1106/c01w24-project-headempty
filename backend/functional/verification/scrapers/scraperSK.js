import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperSK extends BaseScraper {
    static scrapeUrl = "https://www.cps.sk.ca/imis/CPSS/Home/CPSS/College_of_Physicians_and_Surgeons_of_Saskatchewan.aspx";

    static async getStatus(prescriber, driver) {
        // Uses last name (technically also first name but it doesn't work)
        // Note: this one will be a pain
    }
}