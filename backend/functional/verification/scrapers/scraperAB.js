export const scraperAB = ScraperAB();

class ScraperAB extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://search.cpsa.ca/"
    }

    getStatus(prescriber) {
        // Uses last name, first name
    }
}