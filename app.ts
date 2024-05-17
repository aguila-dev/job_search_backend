require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { API } from './constants';
const app = express();

import apiRoutes from './api';
import path from 'path';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

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
console.log(`/${API.VERSION}/${API.ENDPOINT}`);
app.use(`/${API.VERSION}/${API.ENDPOINT}`, apiRoutes);

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

/* Error handling */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  console.error(err.stack);
  const errStatus = (err as any).status || 500;
  res.status(errStatus).send(err.message || 'Internal server error.');
});

export default app;
