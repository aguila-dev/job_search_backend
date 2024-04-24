const fs = require('fs');
const path = require('path');
const fetchAllCompanyLocations = require('./getLocations.js');

// Function to save locations to a file
function saveLocationsToFile(locations) {
    const filePath = path.join(__dirname, 'locations.json');
    fs.writeFile(filePath, JSON.stringify(locations, null, 2), (err) => {
        if (err) {
            console.error('Error writing locations to file:', err);
        } else {
            console.log('Locations saved successfully.');
        }
    });
}

module.exports = saveLocationsToFile;
