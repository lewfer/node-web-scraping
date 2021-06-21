/*
Reddit pushes pages as you scroll.  This example uses Puppeteer to simulate a scroll down.
TODO - tidy and comment
 */

const puppeteer = require('puppeteer');
const scrape_helper = require("./scrape-helper")          // for saving objects to csv


run(5)
.then(results=>{
    // Create a new csv file
    scrape_helper.initialiseCsv('reddit.csv')
    scrape_helper.storeCsv('reddit.csv', results)

}).catch(console.error);


function run (pagesToScrape) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pagesToScrape) {
                pagesToScrape = 1;
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.reddit.com/r/news/");
            let currentPage = 1;
            let results = [];
            while (currentPage <= pagesToScrape) {
                console.log("loop")
                if (currentPage < pagesToScrape) {
                    console.log("scroll")
                    await autoScroll(page);
                }
                currentPage++;                
            }


            let newResults = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('h3');
                items.forEach((item) => {
                    results.push({
                        title: item.innerText,
                    });
                });
                return results;
            });

            // Add newly found results to the complete results
            results = results.concat(newResults);

            // Scroll down the page
            if (currentPage < pagesToScrape) {
                console.log("scroll")
                await autoScroll(page);
            }

            
            browser.close();
            return resolve(results);

        } catch (e) {
            return reject(e);
        }
    })
}


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1000;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}