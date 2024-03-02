import { BaseScraper } from "./baseScraper.js";
import { Page } from "puppeteer";

export class ScraperSK extends BaseScraper {
  static scrapeUrl = `https://www.cps.sk.ca/imis/CPSS/Home/CPSS/College_of_Physicians_and_Surgeons_of_Saskatchewan.aspx`;
  static statusLocator = "#ctl01_TemplateBody_WebPartManager1_gwpciNewSummaryDisplayCommon_ciNewSummaryDisplayCommon_Status";
  static activeStatus = "On the Register"; // this messages indicates that the prescriber is active. Anything else indicates that the prescriber is not active.
  static searchField = "#ctl01_HomePageSearch_Search_TB_Search";
  static searchButton = "#ctl01_HomePageSearch_Search_Btn_Search";
  static table = "tbody > tr.ng-scope";
  /* I use the table as a sign that the page is done loading, because using the networkidle2 made the page wait forever */

  /**
   * 
   * @param {object} prescriber 
   * @param {Page} driver 
   * @returns {boolean | null}
   */

  static async getStatus(prescriber, driver) {

    await driver.goto(ScraperSK.scrapeUrl, { waitUntil: 'networkidle2' });
    await driver.type(ScraperSK.searchField, `${prescriber.lastName}, ${prescriber.firstName}`); // The input has the format "lastName, firstName"
    await driver.click(ScraperSK.searchButton);

    await driver.waitForSelector(ScraperSK.table); // Wait for the table to load

    //driver.on('console', msg => console.log(msg.text())); //this is to debug 

    // Use page.evaluate to find the prescriber row and extract information
    const prescriberInfo = await driver.evaluate((prescriber) => {

      //For the search, I will first get all rows that contain the last name of the prescriber and then I will check if the first name is also in the row.

      prescriberRow = null; //this will save the row that contains the prescriber's information

      let xpath = `//tr[td[contains(text(), "${prescriber.lastName}")]]`; // Find all entries that match the prescriber's last name
      let iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null); 
      /* It's possible that there are multiple rows with the same last name, so I use an iterator to find them all
      If there is only one, then I select it as the prescriberRow and I will later check if the name matches.
      If there are multiple, then I select the one that contains the first name.  
      If there are none, then I return null.
      */

      //This part counts how many rows match the condition
      let count = 0;
      let node = iterator.iterateNext(); 
      while (node) {
        count++;
        node = iterator.iterateNext();
      } //check how many rows have the same last name

      if (count > 1) { 

        let prescriberRows = [];

        // I had to restart the iterator by creating a new one, don't know if there is a better way to do this
        iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let thisNode = iterator.iterateNext();

        while (thisNode) {
          prescriberRows.push(thisNode); // Save all the rows in an array
          thisNode = iterator.iterateNext();
        }

        //I check if any of the rows contain the first name. If so, then I select that row as the prescriberRow.
        let hasFirstName = prescriberRows.some(row => row.textContent.includes(prescriber.firstName)); 
        if (hasFirstName) {
          prescriberRow = prescriberRows.find(row => row.textContent.includes(prescriber.firstName));
          console.warn("Multiple matches found. Selected the first match that contains the first name.");
        }
        else{ 
          console.warn(`Multiple entries matching last name: ${prescriber.lastName} but none match the first name: ${prescriber.firstName}`);
          return null; // If there are multiple rows with the same last name but none of them contain the first name, then I return null
        }

      } else if (count === 1) {
        //if there is only one row with the last name I select it as the prescriberRow.
        prescriberRow = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //check if the first name is in the row
        if (!prescriberRow.textContent.includes(prescriber.firstName)) {
          console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}`); //in this case, 1 match was found for the last name but it didn't match the first name
          return null; //
        }
      } else if (count === 0) {
        console.warn(`No matches for: ${prescriber.firstName} ${prescriber.lastName}`);
        return null; // No matches found
      }

      if (prescriberRow) {
        return { //return the information of the prescriber, including the firstname to compare, and the url to check the status.
          firstName: prescriberRow.querySelector('td:nth-child(2)').textContent.trim(),
          lastName: prescriberRow.querySelector('td:nth-child(1)').textContent.trim(),
          url: prescriberRow.querySelector('td:nth-child(11) a').href.trim(),
        };
      } 
    }, prescriber);

    // If the prescriber is found, then I go to the url to check the status
    if (prescriberInfo) {
      
      await driver.goto(prescriberInfo.url, { waitUntil: 'networkidle2' });
      
      const status = await driver.$eval(`${ScraperSK.statusLocator}`, el => el.textContent.trim()); //get the status of the prescriber 

      console.log("prescriber Status:", status);
      console.log("prescriber Info:", prescriberInfo);

      if (status === ScraperSK.activeStatus) { //if the status is active, then I return true
        return true;
      } else { //if the status is not active, then I return false
        return false;
      }
    }
  }
}