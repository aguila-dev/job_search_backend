// // GREENHOUSE CALL

// import { JobSourceEnum } from '@interfaces/IModels';
// import axios from 'axios';
// import { companyConfig } from 'config/companyConfig';
// import { Company, Job, JobSource } from 'db';

// // GREENHOUSE CALL
// async function fetchAndSaveGreenhouseJobs(companyName: string) {
//   const config = companyConfig.greenhouse[companyName];
//   if (!config || !config.active) {
//     throw new Error(
//       `No active configuration found for Greenhouse company: ${companyName}`
//     );
//   }

//   const url = config.frontendUrl;
//   const response = await axios.get(url);
//   const jobs = response.data.jobs;

//   const [company] = await Company.findOrCreate({
//     where: { name: config.title },
//   });
//   const [jobSource] = await JobSource.findOrCreate({
//     where: { name: JobSourceEnum.GREENHOUSE },
//   });

//   for (const jobData of jobs) {
//     await Job.create({
//       companyId: company.id,
//       jobSourceId: jobSource.id,
//       title: jobData.title,
//       absoluteUrl: jobData.absolute_url,
//       location: jobData.location.name,
//       requisitionId: jobData.id.toString(),
//       dataCompliance: jobData.data_compliance,
//       metadata: jobData.metadata,
//       updatedAt: jobData.updated_at,
//     });
//   }
// }

// // WORKDAY CALL
// async function fetchAndSaveWorkdayJobs(companyConfig: any) {
//   const url = `https://${companyConfig.basePathObject.basePath}.${companyConfig.basePathObject.wdNum}.myworkdayjobs.com/wday/cxs/${companyConfig.basePathObject.basePath}`;
//   const response = await axios.post(
//     url,
//     {
//       appliedFacets: { locations: [] },
//       limit: 50,
//       offset: 0,
//       searchText: '',
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     }
//   );

//   const jobs = response.data.jobPostings;

//   const company = await Company.findOrCreate({
//     where: { name: companyConfig.company },
//   });
//   const jobSource = await JobSource.findOrCreate({
//     where: { name: JobSourceEnum.WORKDAY },
//   });

//   for (const jobData of jobs) {
//     await Job.create({
//       companyId: company[0].id,
//       jobSourceId: jobSource[0].id,
//       title: jobData.title,
//       absoluteUrl: `${companyConfig.frontendUri}${jobData.externalPath}`,
//       location: jobData.locationsText,
//       requisitionId: jobData.bulletFields[0],
//       metadata: {},
//       updatedAt: jobData.postedOnDate,
//     });
//   }
// }
