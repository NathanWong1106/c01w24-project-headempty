class BaseScraper {
    getStatus(prescriber, driver) {
        throw new Error("Method must be implemented by subclass");
    }
}