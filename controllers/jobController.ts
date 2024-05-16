import { Request, Response, NextFunction } from 'express';
import { Job, Company, JobSource } from '../db';
import { JobSourceEnum } from '@interfaces/IModels';
import { Op } from 'sequelize';

// Get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.findAll({ include: [Company] });
    const data = {
      count: jobs.length,
      jobs,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get jobs by company
export const getJobsByCompany = async (req: Request, res: Response) => {
  const { company } = req.params;
  try {
    const companyRecord = await Company.findOne({ where: { slug: company } });
    if (!companyRecord) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const jobs = await Job.findAll({
      where: { companyId: companyRecord.id },
      include: [Company],
    });
    const data = {
      count: jobs.length,
      jobs,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs for the company' });
  }
};

// Get Greenhouse jobs
export const getGreenhouseJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.findAll({
      include: [
        Company,
        {
          model: JobSource,
          where: { name: JobSourceEnum.GREENHOUSE },
        },
      ],
    });
    const data = {
      count: jobs.length,
      jobs,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Greenhouse jobs' });
  }
};

// Get Workday jobs
export const getWorkdayJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.findAll({
      include: [
        Company,
        {
          model: JobSource,
          where: { name: JobSourceEnum.WORKDAY },
        },
      ],
    });
    const data = {
      count: jobs.length,
      jobs,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Workday jobs' });
  }
};

export const getTodaysJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get starting hours of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // get the ending hours of the day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const jobs = await Job.findAll({
      include: [Company],
      where: {
        lastUpdatedAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const data = {
      count: jobs.length,
      jobs,
    };

    res.json(data);
  } catch (error) {
    next();
  }
};
