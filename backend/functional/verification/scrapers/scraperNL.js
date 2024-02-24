class ScraperNL extends BaseScraper {
    static scrapeUrl = "https://cpsnl.ca/physician-search/";

    getStatus(prescriber, driver) {
        // Similar to ScraperPE
        // Uses license number, last name, first name
    }
}