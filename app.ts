import { Request, Response, NextFunction } from 'express';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const fetchAllCompanyLocations = require('./script/getLocations.js');
// const saveLocationsToFile = require('./script/saveLocationsToFile.js');
// const path = require('path');
// const fs = require('fs');
// const { convertPostedOnToDate } = require('./utils/convertPostedOnToDate.js');
const app = express();

import apiRoutes from './api';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// async function initializeLocations() {
//   try {
//     const locations = await fetchAllCompanyLocations();
//     const filePath = path.join(__dirname, 'locations.json');
//     fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));
//     console.log('Locations fetched and saved on server start.');
//   } catch (error) {
//     console.error('Failed to fetch and save locations on server start:', error);
//   }
// }

// initializeLocations();

app.use('/v1/api', apiRoutes);

app.use('/', (req: Request, res: Response) => {
  res.status(401).json({
    access: 'unauthorized to proceed',
    status: res.statusCode,
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

// app.get('/v1/api/locations', (req, res) => {
//   const filePath = path.join(__dirname, 'locations.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading locations file:', err);
//       res.status(500).send('Error reading locations data');
//       return;
//     }
//     res.json(JSON.parse(data));
//   });
// });

// app.get('/v1/api/locations/:company', async (req, res) => {
//   // get the company name from the request and compare to the locations.json file
//   const { company } = req.params;
//   const filePath = path.join(__dirname, 'locations.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading locations file:', err);
//       res.status(500).send('Error reading locations data');
//       return;
//     }
//     const locations = JSON.parse(data);
//     const companyLocations = locations[company];
//     if (!companyLocations) {
//       res.status(404).json({ error: 'Company not found' });
//       return;
//     }
//     res.json(companyLocations);
//   });
// });

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  console.error(err.stack);
  const errStatus = (err as any).status || 500;
  res.status(errStatus).send(err.message || 'Internal server error.');
});

export default app;
