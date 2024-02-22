export const scraperSK = ScraperSK();

class ScraperSK extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://www.cps.sk.ca/imis/CPSS/Home/CPSS/College_of_Physicians_and_Surgeons_of_Saskatchewan.aspx"
    }

    getStatus(prescriber) {
        // Uses last name (technically also first name but it doesn't work)
        // Note: this one will be a pain
    }
}