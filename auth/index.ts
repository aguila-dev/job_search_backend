import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './authRoutes';
const router = express.Router();

router.use('/', authRoutes);

// error handling
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

export default router;
