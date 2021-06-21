/*
 Some helper functions to make coding a bit easier 
*/
const fs = require('fs');                           // for writing to a file
const ObjectsToCsv = require('objects-to-csv');     // for converting Json objects to csv

// Flag to indicate we are at the first page (so we dump out the column headers)
firstPage = true

module.exports = {
  initialiseCsv: function(filename) {
        // Clear the output file
        fs.writeFile(filename, "", function(err) {});

  },

  // Function to store the data to the csv file
  storeCsv: async function (filename, data, filter) {
    console.log("Found " + data.length + " rows")

    filter = (typeof filter !== 'undefined' ? filter : nullFilter)
  
    // Build up the objects we want to save, using the filter function to select the columns we want
    objects = []
    data.forEach(element => objects.push(filter(element))) 
  
    // Get a array of json objects from the results
    const csv = new ObjectsToCsv(objects)
  
    // Convert the array of json objects to a csv object
    csvString = await csv.toString()
  
    // If this is not the first page of results, strip off the first line, which is the column headings
    if (firstPage)
      firstPage = false
    else
      csvString = csvString.substring(csvString.indexOf("\n")+1) // strip off first line
  
    // Append the results to the output file
    fs.appendFile(filename, csvString, function(err) {});
  },

  scrapeTable: function($, selector) {
    let jsonTable = []
    
    // The column headings are th elements in the first tr row
    let columns = [];
    let headings = $(selector).find("tr").first().find("th")
    headings.each((i,el) => {
      columns.push($(el).text().trim())
    })
  
    // The data in in the td or th elements in the second row onwards
    let rows = $(selector).find("tr")                    // select all the rows
    rows.each((i,row) => {                               // go through each row
      if (i>0) {                                         // ignore first row
        let jsonRow = {};                                // start building the row data
        let cells = $(row).find('td,th')                     // find all the cells in the row
        $(cells).each((j,cell) => {                      // go through all the cells
          jsonRow[columns[j]] = $(cell).text().trim()    // get the text from the cell
        })
        jsonTable.push(jsonRow)                          // store the row in the json table
      }
    })
    return jsonTable
  }
}

// Filter that does nothing (just returns the item)
function nullFilter(item) {
  // Return the object
  return item                                       // return the object
}
