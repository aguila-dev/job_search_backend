import { parentPort, workerData } from 'worker_threads';
import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from './jobsService';
import { WorkerData } from '@interfaces/IWorker';

// parentPort?.on('message', async (message) => {
//   try {
//     if (message.type === 'workday') {
//       await fetchAndSaveWorkdayJobs(message.companyName);
//     } else if (message.type === 'greenhouse') {
//       await fetchAndSaveGreenhouseJobs(message.companyName);
//     }
//     parentPort?.postMessage({ status: 'done' });
//   } catch (error) {
//     console.error('Error populating database:', error);
//     parentPort?.postMessage({
//       status: 'error',
//       error: (error as any)?.message,
//     });
//   }
// });

const processJobs = async () => {
  try {
    const data: WorkerData = workerData;
    if (data.type === 'workday') {
      await fetchAndSaveWorkdayJobs(data.companyName);
    } else if (data.type === 'greenhouse') {
      await fetchAndSaveGreenhouseJobs(data.companyName);
    }
    parentPort?.postMessage({ status: 'success' });
  } catch (error: any) {
    console.error('Error in PROCESS JOBS() worker.ts file:', error);
    parentPort?.postMessage({ status: 'error', error: error.message });
  }
};

// processJobs();
