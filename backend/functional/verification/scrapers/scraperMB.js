export const scraperMB = ScraperMB();

class ScraperMB extends BaseScraper {
    constructor(driver) {
        super(driver);
        this.scrapeUrl = "https://member.cpsm.mb.ca/member/profilesearch"
    }

    getStatus(prescriber) {
        // Uses last name, first name
    }
}