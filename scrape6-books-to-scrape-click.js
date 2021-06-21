/*
Books to Scrape pages the result.  This example uses Puppeteer to simulate a mouse click.
TODO - tidy and comment
 */
const puppeteer = require('puppeteer');
const scrape_helper = require("./scrape-helper")          // for saving objects to csv


run(5)
.then(results=>{
    // Create a new csv file
    scrape_helper.initialiseCsv('books.csv')
    scrape_helper.storeCsv('books.csv', results)

}).catch(console.error);

function run (pagesToScrape) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pagesToScrape) {
                pagesToScrape = 1;
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://books.toscrape.com/");
            let currentPage = 1;
            let urls = [];
            while (currentPage <= pagesToScrape) {
                let newUrls = await page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('article > div > a > img');
                    items.forEach((item) => {
                        results.push({
                            title:  item.getAttribute('alt')
                        });
                    });
                    return results;
                });
                urls = urls.concat(newUrls);
                if (currentPage < pagesToScrape) {
                    await Promise.all([
                        await page.click('li.next a'),
                        await page.waitForSelector('article')
                    ])
                }
                currentPage++;
            }
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}