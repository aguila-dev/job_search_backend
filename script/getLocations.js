const puppeteer = require('puppeteer');
const companyPaths = require('../utils/companyList.js');


async function fetchLocationsWithPuppeteer(companyInfo) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(companyInfo.frontendUri, { waitUntil: 'networkidle0' });

        // Click the button to reveal location options or other elements
        await page.waitForSelector(companyInfo.buttonSelector, { timeout: 30000 });

        await page.click(companyInfo.buttonSelector);

        console.log("Company have radio?\n", companyInfo.locationRadio)
        // Special case for Accenture or similar situations
        if (companyInfo.locationRadio) {
            console.log(`Waiting for radio button: ${companyInfo.locationRadio}`);
            await page.waitForSelector(companyInfo.locationRadio, { timeout: 30000 });
            console.log(`Clicking the second radio button: ${companyInfo.locationRadio}`);
            const radioButtons = await page.$$(companyInfo.locationRadio); // Select all matching elements
            if (radioButtons.length > 1) {
                await radioButtons[1].click(); // Click the second radio button
            } else {
                console.error("Expected at least two radio buttons, but found fewer.");
            }
        }

        // Standard case for other companies
        const locationSelector = '.css-1ew7hmu'; // Default location selector if no special one provided
        await page.waitForSelector(locationSelector, { timeout: 30000 });
        const locations = await page.evaluate(selector => {
            const elements = Array.from(document.querySelectorAll(selector));
            return elements.map(el => {
                // const cleanedName = el.innerText.replace(/\s*\(\d+\)\s*$/, '');  
                return {
                    id: el.getAttribute('for'),
                    name: el.innerText
                };
            });
        }, locationSelector);

        return locations;
    } catch (error) {
        console.error(`Error fetching locations from ${companyInfo.frontendUri}:`, error);
        return [];
    } finally {
        await browser.close();
    }
}

async function fetchAllCompanyLocations() {
    const allLocations = {};
    for (const [companyKey, companyInfo] of Object.entries(companyPaths)) {
        console.log(`Fetching locations for ${companyKey}...\nURI: ${companyInfo.frontendUri}...\nButton selector: ${companyInfo.buttonSelector}...`);
        allLocations[companyKey] = await fetchLocationsWithPuppeteer(companyInfo);
    }
    return allLocations;
}

module.exports = fetchAllCompanyLocations;