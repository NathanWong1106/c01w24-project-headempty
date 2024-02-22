class BaseScraper {
    scrapeUrl;

    constructor() {
        if (this.constructor === BaseScraper) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    getStatus(prescriber) {
        throw new Error("Method must be implemented by subclass");
    }
}