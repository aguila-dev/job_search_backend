import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
import { companyConfig } from '../config/companyConfig';

export const populateDatabase = async () => {
  try {
    // Populate Greenhouse jobs
    for (const companyName in companyConfig.greenhouse) {
      if (companyConfig.greenhouse[companyName].active) {
        await fetchAndSaveGreenhouseJobs(companyName);
      }
    }

    // Populate Workday jobs
    for (const companyName in companyConfig.workday) {
      if (companyConfig.workday[companyName].active) {
        console.log('Populating Workday jobs for:', companyName);
        await fetchAndSaveWorkdayJobs(companyName);
      }
    }

    console.log('Database populated with job listings.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};
