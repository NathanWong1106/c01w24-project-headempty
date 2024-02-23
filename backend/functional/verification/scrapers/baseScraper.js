class BaseScraper {
    scrapeUrl;

    constructor() {
        throw new Error("Abstract Class");
    }

    getStatus(prescriber, driver) {
        throw new Error("Method must be implemented by subclass");
    }
}