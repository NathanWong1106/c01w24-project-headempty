export const scraperAB = ScraperAB();

class ScraperAB extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory"
    }

    getStatus(prescriber) {
        // Uses last name, first name
    }
}