import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import workdayJobsRoute from './workdayJobsRoute';

router.use('/jobs', workdayJobsRoute);

// error handling
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

export default router;
