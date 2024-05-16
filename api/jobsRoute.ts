const router = require('express').Router();
import * as jobController from '../controllers/jobController';

router.get('/greenhouse', jobController.getGreenhouseJobs);
router.get('/workday', jobController.getWorkdayJobs);

router.get('/', jobController.getAllJobs);
router.get('/company/:company', jobController.getJobsByCompany);
router.get('/todays-jobs', jobController.getTodaysJobs);

export default router;
