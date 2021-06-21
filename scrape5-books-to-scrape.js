/*
 Scraping the Books to Scrape page

 Intialise your project with:

 npm install axios
 npm install cheerio
 npm install objects-to-csv
 */

// Load the modules we need 
const axios = require('axios');                     // for sending web requests
const cheerio = require('cheerio');                 // for web scraping
const scrape_helper = require("./scrape-helper")          // for saving objects to csv

// Call the scrape function
scrape()
           

// Function to scrape a page
function scrape() {
  // Specify the URL of page we want to scrape
  let url = "https://books.toscrape.com/";

  // Make the http request to the URL to get the data
  axios.get(url).then(response => {

    // Get the data from the response
    data = response.data

    // Load the HTML into the Cheerio web scraper
    const $ = cheerio.load(data);
    
    // Create a list to receive the data we will scrape
    results = []

    // Create a new csv file
    scrape_helper.initialiseCsv('books.csv')

    // Scrape the books
    articles = $('article')
    articles.each((i,el) => {
        book = {}
        
        img = $(el).find('div > a > img').first()
        text = img.attr('alt')
        book.name = text
        
        price = $(el).find('.price_color')
        book.price = price.text()
        
        stock = $(el).find('.instock')
        book.stock = stock.text().trim()
        
        star = $(el).find('.star-rating')
        //console.log(star).attrib('class')
        book.star = star.attr('class')
        
        // Add the book to the array
        results.push(book)
    })
    
    // Save the data to the csv
    scrape_helper.storeCsv('books.csv', results)

    console.log("See books.csv for results")

  }).catch((err) => {
    // Show any error message
    console.log("Error: " + err.message);
  });
}

