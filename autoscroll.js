/*
Reddit pushes pages as you scroll.  This example uses auto-scroll.
 */

const puppeteer = require('puppeteer');
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
            let urls = [];
            while (currentPage <= pagesToScrape) {
                console.log("loop")
                if (currentPage < pagesToScrape) {
                    console.log("scroll")
                    await autoScroll(page);
                }
                currentPage++;                
            }


            let newUrls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('h3');
                items.forEach((item) => {
                    results.push({
                        //url:  item.getAttribute('href'),
                        text: item.innerText,
                    });
                });
                return results;
            });
            urls = urls.concat(newUrls);
            if (currentPage < pagesToScrape) {
                console.log("scroll")
                await autoScroll(page);
            }

            
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run(5).then(console.log).catch(console.error);

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