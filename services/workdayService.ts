import {
  Query,
  WorkdayFacet,
  WorkdayJobsResponse,
} from '@interfaces/IWorkdayController';
import axios from 'axios';
import { convertPostedOnToDate } from '@utils/convertPostedOnToDate';

export async function fetchWorkdayData(url: string, params: Query) {
  let { limit, offset, searchText, locations } = params;

  return axios.post<WorkdayJobsResponse>(
    url,
    {
      appliedFacets: { locations },
      limit,
      offset,
      searchText,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
}

export function processResponseDataAndIncludeLocations(responseData: any) {
  const validJobs = responseData.jobPostings.filter((job: any) => {
    return job.externalPath && job.title && job.postedOn;
  });
  const jobsWithConvertedDates = validJobs.map((job: any) => ({
    ...job,
    postedOnDate: convertPostedOnToDate(job.postedOn),
  }));

  const locationsData = extractLocationData(responseData.facets);

  return {
    ...responseData,
    jobPostings: jobsWithConvertedDates,
    locations: locationsData,
  };
}

function extractLocationData(facets: WorkdayFacet[]) {
  const locationMainGroup = facets.find(
    (f) => f.facetParameter === 'locationMainGroup'
  );
  const cities =
    locationMainGroup?.values.find((v) => v.facetParameter === 'locations')
      ?.values || [];
  const countries =
    locationMainGroup?.values.find(
      (v) => v.facetParameter === 'locationCountry'
    )?.values || [];

  return { cities, countries };
}
