export class BaseScraper {
    /**
     * 
     * @param {object} prescriber 
     * @param {Page} driver 
     * @returns {boolean}
     */
    getStatus(prescriber, driver) {
        throw new Error("Method must be implemented by subclass");
    }
}