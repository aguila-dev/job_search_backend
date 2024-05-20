import { Request, Response, NextFunction } from 'express';
import { Job, Company, JobSource } from '../db';
import { JobSourceEnum } from '@interfaces/IModels';
import { Op } from 'sequelize';
import { getPaginationOptions, getPagingData } from '@utils/pagination';
import { fetchWorkdayData } from '@services/workdayService';
import axios from 'axios';

// Get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  const { search, sort, location } = req.query;
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    const order =
      sort === 'oldest'
        ? [['lastUpdatedAt', 'ASC']]
        : [['lastUpdatedAt', 'DESC']];

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [Company],
      order,
      limit,
      offset,
    });
    const data = getPagingData(count, jobs, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get jobs by company
export const getJobsByCompany = async (req: Request, res: Response) => {
  const { company } = req.params;
  const { search, sort, location } = req.query;
  try {
    const companyRecord = await Company.findOne({
      where: { slug: company },
      include: [JobSource],
    });
    if (!companyRecord) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const where: any = { companyId: companyRecord.id };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    const order =
      sort === 'oldest'
        ? [['lastUpdatedAt', 'ASC']]
        : [['lastUpdatedAt', 'DESC']];

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [Company, JobSource],
      order,
      limit,
      offset,
    });

    const data = getPagingData(count, jobs, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs for the company' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { fullBackendUrl } = req.query;
  console.log('fullBackendUrl:', fullBackendUrl);

  if (!fullBackendUrl || typeof fullBackendUrl !== 'string') {
    return res
      .status(400)
      .json({ error: 'fullBackendUrl query parameter is required' });
  }

  try {
    const response = await axios.get<any>(fullBackendUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('response in post backend:', response.data);
    res.json(response.data);
    // const companyRecord = await Company.findOne({
    //   where: { slug: company },
    //   include: [JobSource],
    // });
    // if (!companyRecord) {
    //   return res.status(404).json({ error: 'Company not found' });
    // }

    // const job = await Job.findOne({
    //   where: { companyId: companyRecord.id, jobId },
    //   include: [Company, JobSource],
    // });

    // if (!job) {
    //   return res.status(404).json({ error: 'Job not found' });
    // }

    // res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

// Get Greenhouse jobs
export const getGreenhouseJobs = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const { count, rows: jobs } = await Job.findAndCountAll({
      include: [
        Company,
        {
          model: JobSource,
          where: { name: JobSourceEnum.GREENHOUSE },
        },
      ],
      limit,
      offset,
    });

    const data = getPagingData(count, jobs, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Greenhouse jobs' });
  }
};

// Get Workday jobs
export const getWorkdayJobs = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const { count, rows: jobs } = await Job.findAndCountAll({
      include: [
        Company,
        {
          model: JobSource,
          where: { name: JobSourceEnum.WORKDAY },
        },
      ],
      limit,
      offset,
    });

    const data = getPagingData(count, jobs, page, pageSize);
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
      include: [Company, JobSource],
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
