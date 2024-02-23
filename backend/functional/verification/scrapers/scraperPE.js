export const scraperPE = ScraperPE();

class ScraperPE extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://cpspei.alinityapp.com/client/publicdirectory"
    }

    getStatus(prescriber, driver) {
        // Similar to ScrapeNL
        // Uses license number last name, first name
    }
}