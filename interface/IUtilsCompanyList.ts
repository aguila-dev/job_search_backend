export interface CompanyPaths {
  [key: string]: Company;
}

export interface Company {
  basePath: string;
  wdNum: string;
  frontendUrl: string;
  locationRadio?: string;
}

export interface CompanyConfig {
  title: string;
  name: string;
  backendApi?: string;
  frontendUrl?: string;
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
  frontendUrl: string;
}

export interface WorkdayConfig {
  [companyName: string]: WorkdayCompanyConfig;
}

export interface CompanyConfigurations {
  greenhouse: GreenhouseConfig;
  workday: WorkdayConfig;
}
