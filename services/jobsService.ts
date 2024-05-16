import axios from 'axios';
import { Company, Job, JobSource } from '../db';
import { companyConfig } from '../config/companyConfig';
import { JobSourceEnum } from '@interfaces/IModels';
import {
  CompanyConfig,
  WorkdayCompanyConfig,
} from '@interfaces/IUtilsCompanyList';
import { buildApiUrl } from '@utils/apiUtils';
import {
  fetchWorkdayData,
  processResponseDataAndIncludeLocations,
} from './workdayService';
import { extractJobId } from '@utils/extractJobId';

// GREENHOUSE CALL
async function fetchAndSaveGreenhouseJobs(companyName: string) {
  const config: CompanyConfig = companyConfig.greenhouse[companyName];
  if (!config || !config.active) {
    throw new Error(
      `No active configuration found for Greenhouse company: ${companyName}`
    );
  }

  const url = config.frontendUri;
  const response = await axios.get(url);
  const jobs = response.data.jobs;

  const [company] = await Company.findOrCreate({
    where: { name: config.title, slug: config.name },
  });
  const [jobSource] = await JobSource.findOrCreate({
    where: { name: JobSourceEnum.GREENHOUSE },
  });

  for (const jobData of jobs) {
    const jobValues = {
      companyId: company.id,
      jobSourceId: jobSource.id,
      title: jobData.title,
      absoluteUrl: jobData.absolute_url,
      location: jobData?.location.name,
      jobId: jobData.id.toString(),
      requisitionId: jobData?.id.toString(),
      dataCompliance: jobData.data_compliance,
      metadata: jobData.metadata,
      lastUpdatedAt: jobData.updated_at,
    };
    await Job.upsert(jobValues, {
      conflictFields: ['jobId', 'jobSourceId'],
    });
  }
}

// WORKDAY CALL
async function fetchAndSaveWorkdayJobs(companyName: string) {
  const config: WorkdayCompanyConfig = companyConfig.workday[companyName];
  if (!config || !config.active) {
    throw new Error(
      `No active configuration found for Workday company: ${companyName}`
    );
  }

  const name = config.name;
  const { basePathObject } = config;
  const backendUrl = buildApiUrl(name, basePathObject);

  let offset = 0;
  const limit = 20;
  let totalJobs = 0;
  let jobsFetched = 0;

  const [company] = await Company.findOrCreate({
    where: { name: config.title, slug: config.name },
  });
  const [jobSource] = await JobSource.findOrCreate({
    where: { name: JobSourceEnum.WORKDAY },
  });

  while (true) {
    const response = await fetchWorkdayData(backendUrl, {
      limit,
      offset,
      searchText: '',
      locations: [],
    });
    const processedData = processResponseDataAndIncludeLocations(response.data);

    const jobs = processedData.jobPostings;
    if (offset === 0) {
      totalJobs = processedData.total;
    }

    if (jobs.length === 0) {
      break;
    }

    for (const jobData of jobs) {
      const jobId = extractJobId(jobData.externalPath, jobData.bulletFields);
      const jobValues = {
        companyId: company.id,
        jobSourceId: jobSource.id,
        title: jobData.title,
        absoluteUrl: `${config.frontendUri}${jobData.externalPath}`,
        location: jobData.locationsText,
        jobId: jobId?.toString() || '',
        requisitionId: jobId?.toString() || '',
        metadata: {},
        lastUpdatedAt: jobData.postedOnDate,
      };
      await Job.upsert(jobValues, {
        conflictFields: ['jobId', 'jobSourceId'],
      });
    }

    jobsFetched += jobs.length;
    if (jobsFetched >= totalJobs) {
      break;
    }

    offset += limit;
  }
}

export { fetchAndSaveGreenhouseJobs, fetchAndSaveWorkdayJobs };
