/*
 Attempt to scrape reddit news - only a few articles returned!

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
  let url = "https://www.reddit.com/r/news/";

  // Make the http request to the URL to get the data
  axios.get(url).then(response => {

    // Get the data from the response
    data = response.data

    // Load the HTML into the Cheerio web scraper
    const $ = cheerio.load(data);
    
    // Create a list to receive the data we will scrape
    results = []

    // Create a new csv file
    scrape_helper.initialiseCsv('reddit.csv')

    // Search for the elements we want
    selection = $('h3')
    selection.each((i,el) => {
        text = $(el).text()
        results.push({title:text})        
    })

    // Save the data to the csv
    scrape_helper.storeCsv('reddit.csv', results)

    console.log("See reddit.csv for results")

  }).catch((err) => {
    // Show any error message
    console.log("Error: " + err.message);
  });
}

