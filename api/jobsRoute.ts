const router = require('express').Router();
import * as jobController from '../controllers/jobController';
import { cacheMiddleware } from 'middleware/redisCacheMiddleware';

router.get(
  '/greenhouse',
  //   cacheMiddleware('greenhouse-jobs'),
  jobController.getGreenhouseJobs
);
router.get(
  '/workday',
  //   cacheMiddleware('workday-jobs'),
  jobController.getWorkdayJobs
);

router.get(
  '/',
  // cacheMiddleware('jobs'),
  jobController.getAllJobs
);
router.get(
  '/company/:company',
  //   cacheMiddleware('company-jobs'),
  jobController.getJobsByCompany
);
router.get(
  '/todays-jobs',
  //   cacheMiddleware('todays-jobs'),
  jobController.getTodaysJobs
);

export default router;
