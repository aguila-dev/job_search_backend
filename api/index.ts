import checkJwt from '@/middleware/checkJwt';
import express, { Request, Response } from 'express';
import { publicKey } from 'script/genKey';
import adminRoutes from './adminRoutes';
import applicationsRoute from './applicationsRoute';
import companiesRoute from './companiesRoute';
import jobsRoute from './jobsRoute';
const router = express.Router();

router.use(checkJwt);

// v1/api
router.use('/jobs', jobsRoute);
router.use('/applications', applicationsRoute);
router.use('/companies', companiesRoute);
router.use('/public-key', (req: Request, res: Response) => {
  res.send(publicKey);
});

// admin
router.use('/admin', adminRoutes);

// error handling
// router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error');
// });

export default router;
