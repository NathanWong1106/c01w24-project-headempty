import express from "express";
import cors from "cors";
import { SERVER } from "./constants.js";
import { userRouter } from "./userService.js";
import { connectToMongo } from "./database.js";
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import cheerio from 'cheerio';

const app = express();

// Initialize database.js
connectToMongo();

// Open Port
app.listen(SERVER.PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER.PORT}`);
});

// Cors and register all services
app.use(cors());
app.use("/user", userRouter); // User service - handles registration, login, etc

// Basic test endpoint
app.get("/ping", express.json(), async (req, res) => {
  return res.json({ response: "pong" });
});

app.post("/createcustomized", express.json(), async (req, res) => {
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

app.get("/downloadCustomized", express.json(), (req, res) => {
    console.log("Download Customized PDF");
    res.download("Customized.pdf");
});