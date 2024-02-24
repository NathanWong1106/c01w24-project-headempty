# Development
Duplicate `.env.sample` and rename as `.env` and replace values with the corresponding environment variables.

## Scraping
If you want to run puppeteer locally (not in the container) to visually see what the browser is doing, change
```
const browser = await puppeteer.launch({
    headless: true,
    executablePath: SERVER.PUPPETEER_BROWSER_PATH
});
```
to
```
const browser = await puppeteer.launch({
    headless: false,
    executablePath: SERVER.PUPPETEER_BROWSER_PATH
});
```
install `npm i puppeteer` locally so that it downloads the automated browser.
and also change `PUPPETEER_BROWSER_PATH` in `.env` to empty.