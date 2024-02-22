import scraperAB from "./scrapers/scraperAB"
import scraperBC from "./scrapers/scraperBC"
import scraperMB from "./scrapers/scraperMB"
import scraperNB from "./scrapers/scraperNB"
import scraperNL from "./scrapers/scraperNL"
import scraperNS from "./scrapers/scraperNS"
import scraperON from "./scrapers/scraperON"
import scraperPE from "./scrapers/scraperPE"
import scraperQC from "./scrapers/scraperQC"
import scraperSK from "./scrapers/scraperSK"

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

/**
 * Returns corresponding scraper to use for a given prescriber.
 * If no valid scraper found, an error is thrown.
 * 
 * @param {object} prescriber prescriber data object
 * @returns {BaseScraper}
 */
function getScraper(prescriber) {
    switch (prescriber.licenceCollege) {
        case "College of Physicians and Surgeons of Alberta":
            return scraperAB;
        case "College of Physicians and Surgeons of British Columbia":
            return scraperBC;
        case "College of Physicians and Surgeons of Manitoba":
            return scraperMB;
        case "College of Physicians and Surgeons of New Brunswick":
            return scraperNB;
        case "College of Physicians and Surgeons of Newfoundland and Labrador":
            return scraperNL;
        case "College of Physicians and Surgeons of Nova Scotia":
            return scraperNS;
        case "College of Physicians and Surgeons of Ontario":
            return scraperON;
        case "College of Physicians & Surgeons of Prince Edward Island":
            return scraperPE;
        case "Collège des médecins du Québec":
            return scraperQC;
        case "College of Physicians and Surgeons of Saskatchewan":
            return scraperSK;
        default:
            throw new Error("Unrecognized licensing college");
    }
}


export function verifyPrescribers(inputData) {
    let unverified = [];
    let verified = []; // probably unnecessary
    
    for (prescriber of inputData) {
        let scraper = getScraper(prescriber);
        let isVerified = scraper.getStatus(prescriber);

        // If verified

            // Update their status in DB
        
            // Async call to other function to generate code & sign up link 

        // Else add to unverified with reason (and possibly other error handling)

    }

    // Some actions & returns for unverified (and maybe verified?)

}