/*
 Scraping tables using Cheerio

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
  let url = "https://en.wikipedia.org/wiki/List_of_Eurovision_Song_Contest_winners"
  //let url = "https://wiki.openstreetmap.org/wiki/List_of_London_Underground_stations"
  //let url = "https://www.thinkcreatelearn.co.uk/resources/node/web-scraping/sample2.html"
  
  // Make the http request to the URL to get the data
  axios.get(url).then(response => {

    // Get the data from the response
    data = response.data

    // Load the HTML into the Cheerio web scraper
    const $ = cheerio.load(data);
    
    // Create a list to receive the data we will scrape
    results = []

    // Create a new csv file
    scrape_helper.initialiseCsv('table.csv')

    // Get the table
    table = $("table")[0]
    selection = api_helper.scrapeTable($, table)  
    
    // Store results to csv
    scrape_helper.storeCsv('table.csv', selection)
    console.log("See table.csv for results")

  }).catch((err) => {
    // Show any error message
    console.log("Error: " + err.message);
  });
}

