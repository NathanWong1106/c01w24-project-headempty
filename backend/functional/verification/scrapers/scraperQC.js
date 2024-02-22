export const scraperQC = ScraperQC();

class ScraperQC extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://www.cmq.org/fr/bottin"
    }

    getStatus(prescriber) {
        // Uses licence number, last name, first name (optional)
    }
}