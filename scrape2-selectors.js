/*
 Simple example showing use of Cheerio for web scraping.

 Intialise your project with:

 npm install axios
 npm install cheerio
 npm install objects-to-csv
 */

// Load the modules we need 
const axios = require('axios');                     // for sending web requests
const cheerio = require('cheerio');                 // for web scraping
const { val } = require('cheerio/lib/api/attributes');
const scrape_helper = require("./scrape-helper")          // for saving objects to csv

// Call the scrape function
scrape()
           

// Function to scrape a page
function scrape() {
  // Specify the URL of page we want to scrape
  let url = "https://www.thinkcreatelearn.co.uk/resources/node/web-scraping/sample2.html";

  // Make the http request to the URL to get the data
  axios.get(url).then(response => {

    // Get the data from the response
    data = response.data

    // Load the HTML into the Cheerio web scraper
    const $ = cheerio.load(data);
    
    // Create a list to receive the data we will scrape
    results = []

    // Create a new csv file
    scrape_helper.initialiseCsv('data.csv')

    // 1. Get all the H1 tags on the page
    selection = $("title")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"title", result:text})        
    })

    // 2. Get all the H2 tags on the page
    selection = $("h1")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"h1", result:text})        
    })    

    // 3. Search for the h1 tags and add to the results
    selection = $("h2")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"h2", result:text})        
    })        

    // 4. Get all the H1 and H2 tags on the page
    selection = $("h1, h2")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"h1 and h2", result:text})        
    })            

    // 5. Select based on an element id stberr
    selection = $("#stberr")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"strawberry", result:text})        
    })            

    // Exercise. Select based on an element id wht 
    selection = $("#wht")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"wheat", result:text})        
    })        

    // 6. Select based on a class estyle
    selection = $(".estyle")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"blackberry", result:text})        
    })      

    // Exercise. Select based on a class dstyle 
    selection = $(".dstyle")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"oats", result:text})        
    })         

    // 7. Select based on one selection within another  
    // All p tags under a div
    selection = $("div > p")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"div-p", result:text})        
    })      

    // 8. Select based on one selection within another which in turn is in another
    // All p tags under 2 divs
    selection = $("div > div > p")
    selection.each((i,el) => {
      text = $(el).text()
      results.push({exercise:"div-div-p", result:text})        
    })      

    // 9. Select based on one selection within another  
    // All p tags under a div
    selection = $("div p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"div-p-indirect", result:text})        
    })      

    // 10a. Select based on one selection within another  
    // Here we select all p elements within the elements with id of "berries"   
    selection = $("#berries > p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"berries", result:text})        
    })          

    // 10b. Select based on one selection within another  
    // Here we select all p elements within the elements with a style of "bstyle"
    selection = $(".bstyle > p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"poultry", result:text})        
    })  


    // 10c. Select based on one selection within another  
    // Here we select all p elements within the elements with a style of "astyle"
    selection = $(".astyle > p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"meat-and-rice", result:text})        
    })  

    // 10d. Select based on one selection within another which in turn is in another
    // Here we select all p elements within div elements within the elements with id of "fruit"
    selection = $("#fruit > div > p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"fruit", result:text})        
    })      

    // 10e Select based on a style within an element id
    selection = $("#cereal > .astyle > p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"rice", result:text})        
    })      

    // Exercise Select just the meat
    selection = $("#meat > div p")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"meat", result:text})        
    })         

    // 11a Get first list item
    selection = $("li").first()
    text = selection.text()
    results.push({exercise:"veg-first", result:text})  
    
    // 11b Get last list item
    selection = $("li").last()
    text = selection.text()
    results.push({exercise:"veg-last", result:text})  
        
    // 11c Select all list items
    selection = $("li")
    selection.each((i,el) => {
        text = $(el).text()
        results.push({exercise:"all-veg", result:text})        
    })       

    // Save the data to the csv
    scrape_helper.storeCsv('data.csv', results)
    console.log("See data.csv for results")

    // Create a new csv file
    scrape_helper.initialiseCsv('table.csv')

    // Get the table
    table = $("table")[0]  //[0] to get first table  
    selection = api_helper.scrapeTable($, table)  

    scrape_helper.storeCsv('table.csv', selection)
    console.log("See table.csv for results")

  }).catch((err) => {
    // Show any error message
    console.log("Error: " + err.message);
  });
}

