export const scraperON = ScraperON();

class ScraperON extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://doctors.cpso.on.ca/?search=general"
    }

    getStatus(prescriber, driver) {
        // Uses license number, last name, first name
    }
}