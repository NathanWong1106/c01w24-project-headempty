export const scraperPE = ScraperPE();

class ScraperPE extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://cpspei.alinityapp.com/client/publicdirectory"
    }

    getStatus(prescriber) {
        // Similar to ScrapeNL
        // Uses license number last name, first name
    }
}