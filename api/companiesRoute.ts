const router = require('express').Router();
import * as companiesController from '../controllers/companiesController';

router.get('/', companiesController.getAllCompanies);

export default router;
