import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
import { companyConfig } from '../config/companyConfig';
import redisClient from './redisClient';
import { buildApiUrl } from '@utils/apiUtils';
import { Company, JobSource } from 'db';
import { JobSourceEnum } from '@interfaces/IModels';

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
    // Populate jobs from predefined configuration file
    for (const companyName in companyConfig.greenhouse) {
      if (companyConfig.greenhouse[companyName].active) {
        const config = companyConfig.greenhouse[companyName];
        console.log(
          'Populating Greenhouse jobs for config file:',
          config.title
        );
        await fetchAndSaveGreenhouseJobs({
          name: config.title,
          slug: config.name,
          apiEndpoint: config.frontendUri,
        });
      }
    }

    // Populate Workday jobs
    // for (const companyName in companyConfig.workday) {
    //   if (companyConfig.workday[companyName].active) {
    //     console.log('Populating Workday jobs for:', companyName);
    //     await fetchAndSaveWorkdayJobs(companyName);
    //   }
    // }
    for (const companyName in companyConfig.workday) {
      if (companyConfig.workday[companyName].active) {
        const config = companyConfig.workday[companyName];
        console.log('Populating Workday jobs for config file:', config.title);
        await fetchAndSaveWorkdayJobs({
          name: config.title,
          slug: config.name,
          apiEndpoint: buildApiUrl(config.name, config.basePathObject),
        });
      }
    }

    // Populate jobs for companies added dynamically by admin
    // const companies = await Company.findAll();
    // for (const company of companies) {
    //   const jobSource = await JobSource.findOne({
    //     where: { id: company.jobSourceId },
    //   });
    //   if (jobSource.name === JobSourceEnum.GREENHOUSE) {
    //     console.log('Populating Greenhouse jobs for:', company.name);
    //     await fetchAndSaveGreenhouseJobs(company);
    //   } else if (jobSource.name === JobSourceEnum.WORKDAY) {
    //     console.log('Populating Workday jobs for:', company.name);
    //     await fetchAndSaveWorkdayJobs(company);
    //   }
    // }

    console.log('Database populated with job listings.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

export const updateDatabaseJobListings = async () => {
  try {
    const companies = await Company.findAll();
    for (const company of companies) {
      const jobSource = await JobSource.findOne({
        where: { id: company.jobSourceId },
      });
      if (jobSource.name === JobSourceEnum.GREENHOUSE) {
        console.log('Updating Greenhouse jobs for:', company.name);
        await fetchAndSaveGreenhouseJobs(company);
      } else if (jobSource.name === JobSourceEnum.WORKDAY) {
        console.log('Updating Workday jobs for:', company.name);
        await fetchAndSaveWorkdayJobs(company);
      }
    }
    console.log('Database job listings updated.');
  } catch (error) {
    console.error('Error updating database job listings:', error);
  }
};
