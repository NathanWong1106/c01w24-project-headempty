import express from "express";
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import cheerio from 'cheerio';


export const customizedPDF = express.Router();


customizedPDF.post("/createcustomized", express.json(), async (req, res) => {
    try {
        const { rewrite } = req.body;
        if (!rewrite){
            return res.status(400).json({ error: "Wrong input" });
        }

        // Usage
        const inputHtmlPath = 'Prescription PDF Template.html';
        const outputPdfPath = 'Customized.pdf';

        // Read the HTML file
        const ori_html = await fs.readFile(inputHtmlPath, 'utf-8');

        // Load the HTML content into Cheerio
        const $ = cheerio.load(ori_html);

        // Modify the HTML element
        $('span[lang="EN-CA"][style="font-size:14.0pt"]').each(function() {
            const $span = $(this);
            const text = $span.text();
            const modifiedText = text.replace(/\{~~code\}/g, rewrite);
            $span.text(modifiedText);
        });

        // Save the modified HTML
        const modifiedHtml = $.html();
        fs.writeFile('Customized.html', modifiedHtml);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Read HTML content
        const htmlContent = await fs.readFile('Customized.html', { encoding: 'utf-8' });

        // Set HTML content to page
        await page.setContent(htmlContent);

        // Generate PDF
        await page.pdf({ path: outputPdfPath, format: 'letter' });

        // Close browser
        await browser.close();
        fs.unlink('Customized.html');
        console.log('PDF generated successfully:', outputPdfPath);

        res.status(200).json({response: "Successfully generated"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

customizedPDF.get("/downloadCustomized", express.json(), (req, res) => {
    console.log("Download Customized PDF");
    res.download("Customized.pdf");
});

customizedPDF.delete("/removeCustomized", express.json(), (req, res) => {
    console.log("Delete Customized PDF");
    fs.unlink('Customized.pdf');
    res.status(200).json({response: "Successfully removed customized.pdf"});
});

