export const scraperNL = ScraperNL();

class ScraperNL extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://cpsnl.ca/physician-search/"
    }

    getStatus(prescriber) {
        // Similar to ScraperPE
        // Uses license number, last name, first name
    }
}