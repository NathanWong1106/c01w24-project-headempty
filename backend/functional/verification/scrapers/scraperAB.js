export const scraperAB = ScraperAB();

class ScraperAB extends BaseScraper {
    constructor() {
        this.scrapeUrl = "https://search.cpsa.ca/"
    }

    async getStatus(prescriber, driver) {
        // Uses last name, first name
        // first name id MainContent_physicianSearchView_txtFirstName
        // last name id MainContent_physicianSearchView_txtLastName

        // output MainContent_physicianSearchView_gvResults

        await driver.goto(this.scrapeUrl, {waitUntil: 'networkidle2'});
        await driver.waitForSelector("#MainContent_physicianSearchView_txtFirstName")
        await driver.type("#MainContent_physicianSearchView_txtFirstName", prescriber.firstName)
        await driver.waitForSelector("#MainContent_physicianSearchView_txtLastName")
        await driver.type("#MainContent_physicianSearchView_txtLastName", prescriber.lastName)
        await driver.click("#MainContent_physicianSearchView_btnSearch")

        await driver.waitForSelector("#MainContent_physicianSearchView_gvResults")
        const data = await driver.$$eval("#MainContent_physicianSearchView_gvResults > tbody", (els) => {
            els
        });
        // TODO:
    }
}