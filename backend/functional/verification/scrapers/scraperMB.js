export const scraperMB = ScraperMB();

class ScraperMB extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://member.cpsm.mb.ca/member/profilesearch"
    }

    getStatus(prescriber) {
        // Uses last name, first name
    }
}