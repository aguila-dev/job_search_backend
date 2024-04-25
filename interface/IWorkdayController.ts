export interface Query {
  limit?: string | number;
  offset?: string | number;
  searchText?: string;
  locations?: LocationsData;
}

export interface LocationsData {
  cities?: any[];
  countries?: any[];
}

export interface WorkdayJobsResponse {
  facets: WorkdayFacet[];
  jobPostings: any[];
  total: number;
  userAuthenticated: boolean;
}

export interface WorkdayFacet {
  descriptor?: string;
  facetParameter: string;
  values: WorkdayFacetValues[];
}

export interface WorkdayFacetValues {
  count?: number;
  descriptor: string;
  id?: string;
  facetParameter?: string;
  values: any[];
}
