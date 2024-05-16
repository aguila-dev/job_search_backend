const router = require('express').Router();
import * as adminController from '../controllers/adminController';

router.post('/company', adminController.createCompany);

export default router;
