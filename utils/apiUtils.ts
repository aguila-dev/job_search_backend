import { Query } from '@interfaces/IWorkdayController';

export function parseQueryParams(query: Query) {
  const { limit = '20', offset = '0', searchText, locations } = query;
  return {
    limit: parseInt(limit as string, 10),
    offset: parseInt(offset as string, 10),
    searchText,
    locations,
  };
}

export function buildApiUrl(company: string, basePathObject: any): string {
  const { basePath, wdNum } = basePathObject;
  return `https://${company}.${wdNum}.myworkdayjobs.com/wday/cxs/${basePath}`;
}
