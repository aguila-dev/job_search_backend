import { companyConfig } from '../config/companyConfig';
import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
// import redisClient from './redisClient';
import { JobSourceEnum } from '@interfaces/IModels';
import { buildApiUrl } from '@utils/apiUtils';
// import { testUsers } from 'data/testUsers';
import { Company, JobSource, User } from 'db';

export const seedTestUsers = async () => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('Seeding test users...');
      // await User.bulkCreate(testUsers);
      console.log('Test users seeded.');
    } else {
      console.log('Test users already seeded.');
    }
  } catch (error) {
    console.error('Error seeding test users:', error);
  }
};

export const populateDatabase = async () => {
  try {
    // Populate Greenhouse jobs
    // Populate jobs from predefined configuration file
    for (const companyName in companyConfig.greenhouse) {
      if (companyConfig.greenhouse[companyName].active) {
        const config = companyConfig.greenhouse[companyName];
        console.log('Populating Greenhouse jobs for config file:', config);
        await fetchAndSaveGreenhouseJobs({
          name: config.title,
          slug: config.name,
          frontendUrl: `https://boards.greenhouse.io/${config.name}`,
          apiEndpoint: config.backendApi,
        });
      }
    }
    for (const companyName in companyConfig.workday) {
      if (companyConfig.workday[companyName].active) {
        const config = companyConfig.workday[companyName];
        console.log('Populating Workday jobs for config file:', config.title);
        await fetchAndSaveWorkdayJobs({
          name: config.title,
          slug: config.name,
          frontendUrl: config.frontendUrl,
          apiEndpoint: buildApiUrl(config.name, config.basePathObject),
        });
      }
    }
    console.log('Database populated with job listings.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

export const updateDatabaseJobListings = async () => {
  try {
    const companies = await Company.findAll({
      where: { active: true },
      include: [{ model: JobSource }],
    });
    // console.log('Companies:', companies);
    for (const company of companies) {
      console.log('company:', {
        id: company.id,
        name: company.name,
        slug: company.slug,
        jobSourceId: company?.jobSourceId,
      });
      const jobSource = await JobSource.findOne({
        where: { id: company.jobSourceId },
      });
      try {
        if (jobSource.name === JobSourceEnum.GREENHOUSE) {
          console.log('Updating Greenhouse jobs for:', company.name);
          await fetchAndSaveGreenhouseJobs(company);
        } else if (jobSource.name === JobSourceEnum.WORKDAY) {
          console.log('Updating Workday jobs for:', company.name);
          await fetchAndSaveWorkdayJobs(company);
        }
      } catch (jobError) {
        console.error(`Error updating jobs for ${company.name}:`, jobError);
      }
    }
    console.log('Database job listings updated.');
  } catch (error) {
    console.error('Error updating database job listings:', error);
  }
};
