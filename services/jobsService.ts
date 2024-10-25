import { JobSourceEnum } from '@interfaces/IModels';
import { extractJobId } from '@utils/extractJobId';
import axios from 'axios';
import { companyConfig } from 'config/companyConfig';
import { Company, Job, JobSource } from '../db';
import {
  fetchWorkdayData,
  processResponseDataAndIncludeLocations,
} from './workdayService';

// GREENHOUSE CALL
async function fetchAndSaveGreenhouseJobs({
  name,
  slug,
  frontendUrl,
  apiEndpoint,
}: any) {
  const companyConfigData = companyConfig.greenhouse[slug.toLowerCase()];
  console.log('companyConfigData:', companyConfigData);

  if (!companyConfigData || !companyConfigData.backendApi) {
    throw new Error(`No API endpoint found in companyConfig for: ${name}`);
  }
  const [jobSource] = await JobSource.findOrCreate({
    where: { name: JobSourceEnum.GREENHOUSE },
  });
  const [company, created] = await Company.findOrCreate({
    where: {
      name,
      slug,
      frontendUrl,
      apiEndpoint,
      jobSourceId: jobSource.id,
    },
  });

  if (!company) {
    console.log('No company found:', name);
  }

  // let backendUrl = apiEndpoint;
  let backendUrl = apiEndpoint;

  if (!created && companyConfigData.backendApi !== backendUrl) {
    const updatedCompanyBackendUrl = companyConfigData.backendApi;
    await company.update({ apiEndpoint: updatedCompanyBackendUrl });
    console.log(`Updated API endpoint for company: ${name}`);
    backendUrl = updatedCompanyBackendUrl;
    console.log('new backendUrl:', updatedCompanyBackendUrl);
  }

  if (!backendUrl) {
    throw new Error(`No apiEndpoint found for Greenhouse company: ${name}`);
  }

  try {
    const response = await axios.get(backendUrl);

    if (response.status !== 200) {
      console.warn(
        `Invalid API response for ${name}: Received status ${response.status}`
      );
      // Optionally: notify or log the issue
      return;
    }

    const jobs = response.data.jobs;

    if (!jobs || jobs.length === 0) {
      console.warn(`No jobs found for Greenhouse company: ${name}`);
      return;
    }

    for (const jobData of jobs) {
      let absoluteUrl = jobData.absolute_url;

      // Sanitize the URL if the company name is "airbnb"
      if (slug.toLowerCase() === 'airbnb') {
        absoluteUrl = absoluteUrl.split('?')[0];
      }
      const jobValues = {
        companyId: company.id,
        jobSourceId: jobSource.id,
        title: jobData.title,
        absoluteUrl: absoluteUrl,
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
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error(
        `API endpoint not found (404) for Greenhouse company: ${name}, URL: ${backendUrl}`
      );
      // Mark the current API as invalid in the DB if needed
      await updateCompanyApiEndpoint(company.id, 'new-api-endpoint');
      await Company.update(
        { apiEndpoint: null }, // Optionally clear the endpoint
        { where: { id: company.id } }
      );
      // Optionally notify that the endpoint needs to be updated
    } else {
      console.error(`Failed to fetch jobs for Greenhouse company: ${name}`);
    }
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
    throw new Error(`No apiEndpoint found for Workday company: ${name}`);
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

async function updateCompanyApiEndpoint(
  companyId: number,
  newApiEndpoint: string
) {
  await Company.update(
    { apiEndpoint: newApiEndpoint },
    { where: { id: companyId } }
  );
}

function extractJobPath(url: string): string {
  const regex = /\/job\/(.*)/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

export { fetchAndSaveGreenhouseJobs, fetchAndSaveWorkdayJobs };
