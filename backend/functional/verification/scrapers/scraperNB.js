export const scraperNB = ScraperNB();

class ScraperNB extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory"
    }

    getStatus(prescriber) {
        // Uses license number, last name, first name
    }
}