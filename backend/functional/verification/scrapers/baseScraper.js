class BaseScraper {
    driver;
    scrapeUrl;

    constructor(driver) {
        this.driver = driver
    }

    getStatus(prescriber) {
        throw new Error("Method must be implemented by subclass");
    }
}