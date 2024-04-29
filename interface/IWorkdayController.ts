export interface Query {
  limit?: string | number;
  offset?: string | number;
  searchText?: string;
  locations?: any[];
  locationCountry?: any[];
}

export interface LocationsData {
  locations?: string[];
  locationCountry?: string[];
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
