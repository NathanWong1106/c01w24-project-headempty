export const scraperNL = ScraperNL();

class ScraperNL extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://cpsnl.ca/physician-search/"
    }

    getStatus(prescriber, driver) {
        // Similar to ScraperPE
        // Uses license number, last name, first name
    }
}