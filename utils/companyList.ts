import { CompanyPaths } from '@interfaces/IUtilsCompanyList';

export const WORKDAY_COUNTRY_ID = {
  US: 'bc33aa3152ec42d4995f4791a106ed09',
};

const companyPaths: CompanyPaths = {
  caci: {
    basePath: 'caci/External/jobs',
    wdNum: 'wd1',
    frontendUrl: 'https://caci.wd1.myworkdayjobs.com/External/',
  },
  bah: {
    basePath: 'bah/BAH_Jobs/jobs',
    wdNum: 'wd1',
    frontendUrl: 'https://bah.wd1.myworkdayjobs.com/BAH_Jobs',
  },
  accenture: {
    basePath: 'accenture/AccentureCareers/jobs',
    wdNum: 'wd3',
    frontendUrl: 'https://accenture.wd3.myworkdayjobs.com/AccentureCareers/',

    locationRadio: '.css-n9nn59',
  },
  nvidia: {
    basePath: 'nvidia/NVIDIAExternalCareerSite/jobs',
    wdNum: 'wd5',
    frontendUrl:
      'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/',
  },
  patagonia: {
    basePath: 'patagonia/PWCareers/jobs',
    wdNum: 'wd5',
    frontendUrl: 'https://patagonia.wd5.myworkdayjobs.com/PWCareers',
  },
  georgetown: {
    basePath: 'georgetown/Georgetown_Admin_Careers/jobs',
    wdNum: 'wd1',
    frontendUrl:
      'https://georgetown.wd1.myworkdayjobs.com/Georgetown_Admin_Careers',
  },
  travelers: {
    basePath: 'travelers/External/jobs',
    wdNum: 'wd5',
    frontendUrl: 'https://travelers.wd5.myworkdayjobs.com/External',
  },
  thehartford: {
    basePath: 'thehartford/Careers_External/jobs',
    wdNum: 'wd5',
    frontendUrl: 'https://thehartford.wd5.myworkdayjobs.com/Careers_External',
  },
  capitalone: {
    basePath: 'capitalone/Capital_One/jobs',
    wdNum: 'wd12',
    frontendUrl: 'https://capitalone.wd12.myworkdayjobs.com/Capital_One/',
  },
};

export default companyPaths;
