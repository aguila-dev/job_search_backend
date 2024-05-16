import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
import { companyConfig } from '../config/companyConfig';
import { Worker } from 'worker_threads';
import path from 'path';
import { WorkerData } from '@interfaces/IWorker';
// async function runWorkerThread(workerData: WorkerData): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker('./worker.ts', { workerData });
//     worker.on('message', (message) => {
//       if (message.status === 'done') {
//         resolve();
//       } else {
//         reject(new Error(message.error));
//       }
//     });
//     worker.on('error', reject);
//     worker.on('exit', (code) => {
//       if (code !== 0) {
//         reject(new Error(`Worker stopped with exit code ${code}`));
//       }
//     });
//   });
// }
export async function runWorkerThread(workerData: WorkerData): Promise<void> {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, 'worker.ts'); // Adjust the path here

    const worker = new Worker(workerPath, {
      workerData,
      execArgv: ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'],
    });
    worker.on('message', (message) => {
      if (message.status === 'success') {
        resolve();
      } else {
        reject(new Error(message.error));
      }
    });
    worker.on('error', (err) => {
      console.error('Worker thread error in POPULATEDB():', err);
      reject(err);
    });
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// export const populateDatabase = async (): Promise<void> => {
//   try {
//     const workdayCompanies = Object.keys(companyConfig.workday);
//     const greenhouseCompanies = Object.keys(companyConfig.greenhouse);

//     const workdayPromises = workdayCompanies.map((companyName) =>
//       runWorkerThread({ type: 'workday', companyName }).catch((error) => {
//         console.error(
//           `Error processing workday jobs for ${companyName}: `,
//           error
//         );
//       })
//     );
//     const greenhousePromises = greenhouseCompanies.map((companyName) =>
//       runWorkerThread({ type: 'greenhouse', companyName }).catch((error) => {
//         console.error(
//           `Error processing greenhouse jobs for ${companyName}: `,
//           error
//         );
//       })
//     );

//     await Promise.all([...workdayPromises, ...greenhousePromises]);
//     console.log('Database populated with job listings.');
//   } catch (error) {
//     console.error('Error populating database:', error);
//   }
// };

export const populateDatabase = async () => {
  try {
    // Populate Greenhouse jobs
    for (const companyName in companyConfig.greenhouse) {
      if (companyConfig.greenhouse[companyName].active) {
        await fetchAndSaveGreenhouseJobs(companyName);
      }
    }

    // Populate Workday jobs
    for (const companyName in companyConfig.workday) {
      if (companyConfig.workday[companyName].active) {
        console.log('Populating Workday jobs for:', companyName);
        await fetchAndSaveWorkdayJobs(companyName);
      }
    }

    console.log('Database populated with job listings.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};
