export interface CompanyPaths {
  [key: string]: Company;
}

export interface Company {
  basePath: string;
  wdNum: string;
  frontendUri: string;
  buttonSelector: string;
  locationRadio?: string;
}
