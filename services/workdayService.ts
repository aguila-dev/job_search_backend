import {
  WorkdayFacet,
  WorkdayJobsResponse,
} from '@interfaces/IWorkdayController';
import axios from 'axios';
import { convertPostedOnToDate } from '@utils/convertPostedOnToDate';

export async function fetchWorkdayData(url: string, params: any) {
  let { limit, offset, searchText, locations } = params;
  return axios.post<WorkdayJobsResponse>(
    url,
    {
      appliedFacets: locations,
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
  const jobsWithConvertedDates = responseData.jobPostings.map((job: any) => ({
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
