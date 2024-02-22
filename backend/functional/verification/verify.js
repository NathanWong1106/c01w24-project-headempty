import scraperAB from "./scrapers/scraperAB"
import scraperBC from "./scrapers/scraperBC"
import scraperMB from "./scrapers/scraperMB"
import scraperNB from "./scrapers/scraperNB"
import scraperNL from "./scrapers/scraperNL"
import scraperNS from "./scrapers/scraperNS"
import scraperON from "./scrapers/scraperON"
import scraperPE from "./scrapers/scraperPE"
import scraperQC from "./scrapers/scraperQC"
import ScraperSK from "./scrapers/scraperSK"

const MOCK_INPUT_DATA = [
    {
        firstName: "Alexandra",
        lastName: "Sylvester",
        province: "NS",
        licensingCollege: "College of Physicians and Surgeons of Nova Scotia",
        licenceNumber: "19314",
    },
    {
        firstName: "Alexia",
        lastName: "Lam",
        province: "QC",
        licensingCollege: "Collège des médecins du Québec",
        licenceNumber: "96332",
    }
]


export function verifyPrescribers(inputData) {
    let unverified = [];

    // Loop through data

    // Find and call corresponding scraper

    // If verified

        // Update their status in DB
    
        // Async call to other function to generate code & sign up link 

    // Else add to unverified with reason (and possibly other error handling)

}