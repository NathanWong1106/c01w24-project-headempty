export const scraperQC = ScraperQC();

class ScraperQC extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://www.cmq.org/fr/bottin"
    }

    getStatus(prescriber, driver) {
        // Uses licence number, last name, first name (optional)
    }
}