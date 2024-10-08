import CustomError from '@/utils/customError';
import { getPaginationOptions, getPagingData } from '@utils/pagination';
import { NextFunction, Request, Response } from 'express';
import { Company, Job, JobApplication } from '../db';

//. GET /v1/api/applications
export const getActiveJobApplications = async (req: Request, res: Response) => {
  const { userId } = req.query;
  console.log('userId', userId);
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const { count, rows: applications } = await JobApplication.findAndCountAll({
      where: { userId, noLongerConsidering: false },
      include: [
        {
          model: Job,
          include: [
            {
              model: Company,
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const data = getPagingData(count, applications, page, pageSize);
    console.log('fetching active applications', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active applications' });
  }
};

// GET applications no longer being considered
// GET /v1/api/applications/no-longer-considering
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

// POST /v1/api/applications
export const createJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, jobId } = req.body;
  console.log('userId', userId);
  console.log('jobId', jobId);
  try {
    // Check if the application already exists
    const existingApplication = await JobApplication.findOne({
      where: { userId, jobId },
    });

    if (existingApplication) {
      throw new CustomError('You have already applied for this job', 400);
    }
    const application = await JobApplication.create({ userId, jobId });
    console.log('application', application);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job application' });
  }
};

// EDIT job application to make it no longer being considered
// PUT /v1/api/applications/:id
export const updateJobApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const application = await JobApplication.findByPk(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    application.noLongerConsidering = true;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};
