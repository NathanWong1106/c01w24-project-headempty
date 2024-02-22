export const scraperAB = ScraperAB();

class ScraperAB extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://cpsnb.alinityapp.com/Client/PublicDirectory"
    }

    getStatus(prescriber) {
        // Uses last name, first name
    }
}