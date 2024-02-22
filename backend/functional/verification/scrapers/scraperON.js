export const scraperON = ScraperON();

class ScraperON extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://doctors.cpso.on.ca/?search=general"
    }

    getStatus(prescriber) {
        // Uses license number, last name, first name
    }
}