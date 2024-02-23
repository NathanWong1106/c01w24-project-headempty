export const scraperNB = ScraperNB();

class ScraperNB extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory"
    }

    getStatus(prescriber, driver) {
        // Uses license number, last name, first name
    }
}