const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
const companyPaths = require('./utils/companyList.js');
const fetchAllCompanyLocations = require('./script/getLocations.js');
const saveLocationsToFile = require('./script/saveLocationsToFile.js');
const path = require('path');
const fs = require('fs');
const { convertPostedOnToDate } = require('./utils/convertPostedOnToDate.js');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

async function initializeLocations() {
  try {
    const locations = await fetchAllCompanyLocations();
    const filePath = path.join(__dirname, 'locations.json');
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));
    console.log('Locations fetched and saved on server start.');
  } catch (error) {
    console.error('Failed to fetch and save locations on server start:', error);
  }
}

// initializeLocations();


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/v1/api/locations', (req, res) => {
  const filePath = path.join(__dirname, 'locations.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading locations file:', err);
      res.status(500).send('Error reading locations data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get('/v1/api/locations/:company', async (req, res) => {
  // get the company name from the request and compare to the locations.json file
  const { company } = req.params;
  const filePath = path.join(__dirname, 'locations.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading locations file:', err);
      res.status(500).send('Error reading locations data');
      return;
    }
    const locations = JSON.parse(data);
    const companyLocations = locations[company];
    if (!companyLocations) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    res.json(companyLocations);
  });
}
);


app.get('/v1/api/jobs/:company', async (req, res) => {
  try {
    let { company } = req.params;
    let { limit, offset, searchText, locations } = req.query;

    const basePathObject = companyPaths[company];

    if (!basePathObject) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const { basePath, wdNum } = basePathObject;

    const fullPath = `https://${company}.${wdNum}.myworkdayjobs.com/wday/cxs/${basePath}`;

    limit = parseInt(limit, 10) >= 0 ? parseInt(limit, 10) : 20;
    offset = parseInt(offset, 10) >= 0 ? parseInt(offset, 10) : 0;
    searchText = searchText || '';
    locations = locations || [];


    const response = await axios.post(
      fullPath,
      {
        // applied facets takes locations (appliedLocations for accenture) as key and array of location id's as value
        appliedFacets: { locations },
        limit,
        offset,
        searchText,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    const jobsWithConvertedDates = response.data.jobPostings.map(job => ({
      ...job,
      postedOnDate: convertPostedOnToDate(job.postedOn)
    }));

    const citiesData = response.data.facets.find(f => f.facetParameter === 'locationMainGroup')?.values.find(v => v.facetParameter === 'locations')?.values;
    const countryData = response.data.facets.find(f => f.facetParameter === 'locationMainGroup')?.values.find(v => v.facetParameter === 'locationCountry')?.values;

    const locationsData = {
      cities: citiesData || [],
      countries: countryData || []
    }
    res.json({
      ...response.data,
      jobPostings: response.data.jobPostings,
      locations: locationsData || {},
    });
  } catch (error) {
    console.error('Error proxying job listings:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ error: 'Error fetching job listings' });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
