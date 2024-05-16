import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
import { companyConfig } from '../config/companyConfig';
import redisClient from './redisClient';

const clearCacheKeys = async (pattern: string) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
export const populateDatabase = async () => {
  try {
    // Clear the cache before populating the database
    // Clear the cache before populating the database
    // console.log('Clearing cache...');
    // await clearCacheKeys('jobs-*');
    // await clearCacheKeys('company-jobs-*');
    // await clearCacheKeys('greenhouse-jobs-*');
    // await clearCacheKeys('workday-jobs-*');
    // await clearCacheKeys('todays-jobs-*');
    // console.log('Cache cleared.');

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
