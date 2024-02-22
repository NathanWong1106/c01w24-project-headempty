export const scraperNS = ScraperNS();

class ScraperNS extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://cpsnsphysiciansearch.azurewebsites.net/"
    }

    getStatus(prescriber) {
        // Uses licence number, last name, first name
    }
}