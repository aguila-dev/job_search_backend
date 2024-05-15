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

export interface CompanyConfig {
  title: string;
  name: string;
  frontendUri: string;
  active: boolean;
  logo?: string;
}
export interface GreenhouseConfig {
  [companyName: string]: CompanyConfig;
}

export interface WorkdayBasePath {
  basePath: string;
  wdNum: string;
}
export interface WorkdayCompanyConfig extends CompanyConfig {
  basePathObject: WorkdayBasePath;
  frontendUri: string;
}

export interface WorkdayConfig {
  [companyName: string]: WorkdayCompanyConfig;
}

export interface CompanyConfigurations {
  greenhouse: GreenhouseConfig;
  workday: WorkdayConfig;
}
