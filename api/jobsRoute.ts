const router = require('express').Router();
import * as jobController from '../controllers/jobController';

router.get('/', jobController.getAllJobs);
router.get('/greenhouse', jobController.getGreenhouseJobs);
router.get('/workday', jobController.getWorkdayJobs);
router.get('/:company', jobController.getJobsByCompany);

export default router;
