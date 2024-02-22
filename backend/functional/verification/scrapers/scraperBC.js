export const scraperBC = ScraperBC();

class ScraperBC extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://www.cpsbc.ca/public/registrant-directory"
    }

    getStatus(prescriber) {
        // Need to first click on advanced search
    }
}