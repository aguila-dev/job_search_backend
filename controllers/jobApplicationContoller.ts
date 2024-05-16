import { Request, Response, NextFunction } from 'express';
import { JobApplication, Job, Company } from '../db';
import { getPaginationOptions, getPagingData } from '@utils/pagination';

//. GET /v1/api/job-applications
export const getActiveJobApplications = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const { count, rows: applications } = await JobApplication.findAndCountAll({
      where: { userId, noLongerConsidering: false },
      include: [Job],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const data = getPagingData(count, applications, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active applications' });
  }
};

// GET applications no longer being considered
// GET /v1/api/job-applications/no-longer-considering
export const getNoLongerConsideringApplications = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.query;
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const { count, rows: applications } = await JobApplication.findAndCountAll({
      where: { userId, noLongerConsidering: true },
      include: [Job],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const data = getPagingData(count, applications, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// POST /v1/api/job-applications
export const createJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, jobId } = req.body;
  try {
    const application = await JobApplication.create({ userId, jobId });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job application' });
  }
};
