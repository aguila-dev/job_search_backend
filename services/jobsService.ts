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
import { WORKDAY_COUNTRY_ID } from '@utils/companyList';

// GREENHOUSE CALL
async function fetchAndSaveGreenhouseJobs({
  name,
  slug,
  frontendUrl,
  apiEndpoint,
}: any) {
  const [jobSource] = await JobSource.findOrCreate({
    where: { name: JobSourceEnum.GREENHOUSE },
  });
  const [company] = await Company.findOrCreate({
    where: {
      name,
      slug,
      frontendUrl,
      apiEndpoint,
      jobSourceId: jobSource.id,
    },
  });
  const backendUrl = apiEndpoint;
  if (!backendUrl) {
    throw new Error(`No apiEndpoint found for Greenhouse company: ${name}`);
  }
  const response = await axios.get(backendUrl);

  const jobs = response.data.jobs;

  if (!jobs || jobs.length === 0) {
    console.warn(`No jobs found for Greenhouse company: ${name}`);
    return;
  }

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
      // isUnitedStates: true,
    };
    await Job.upsert(jobValues, {
      conflictFields: ['jobId', 'jobSourceId'],
    });
  }
}

// WORKDAY CALL
async function fetchAndSaveWorkdayJobs({
  name,
  slug,
  frontendUrl,
  apiEndpoint,
}: any) {
  const backendUrl = apiEndpoint;
  if (!backendUrl) {
    throw new Error(`No apiEndpoint found for Greenhouse company: ${name}`);
  }

  let offset = 0;
  const limit = 20;
  let totalJobs = 0;
  let jobsFetched = 0;

  const [jobSource] = await JobSource.findOrCreate({
    where: { name: JobSourceEnum.WORKDAY },
  });

  const [company] = await Company.findOrCreate({
    where: {
      name,
      slug,
      frontendUrl,
      apiEndpoint,
      jobSourceId: jobSource.id,
    },
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
      const absoluteUrl = `${company.frontendUrl}${jobData.externalPath}`;
      if (absoluteUrl.length > 500) {
        console.warn('Absolute URL too long:', jobData.absoluteUrl);
        continue;
      }
      // const jobPath = extractJobPath(absoluteUrl);
      // const fullBackendUrl = `${company.apiEndpoint.replace(
      //   '/jobs',
      //   '/job'
      // )}/${jobPath}`;
      // Fetch additional job details from the backend
      // const { data } = await axios.get(
      //   'http://localhost:8000/v1/api/jobs/workday/individualJob',
      //   { params: { fullBackendUrl } }
      // );

      // const isUnitedStates =
      //   data.jobPostingInfo.country?.id === WORKDAY_COUNTRY_ID.US;

      const jobValues = {
        companyId: company.id,
        jobSourceId: jobSource.id,
        title: jobData.title,
        absoluteUrl: absoluteUrl,
        location: jobData.locationsText
          ? jobData.locationsText
          : jobData.bulletFields[0],
        jobId: jobId?.toString() || '',
        requisitionId: jobId?.toString() || '',
        metadata: {},
        lastUpdatedAt: jobData.postedOnDate,
        // isUnitedStates,
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

function extractJobPath(url: string): string {
  const regex = /\/job\/(.*)/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

export { fetchAndSaveGreenhouseJobs, fetchAndSaveWorkdayJobs };
