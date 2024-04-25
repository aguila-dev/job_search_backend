const router = require('express').Router();
import * as workdayController from '../controllers/workdayController';

router.use('/:company', workdayController.getWorkdayJobs);

export default router;
