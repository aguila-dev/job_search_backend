import { Request, Response, NextFunction } from 'express';
import { Job, Company, JobSource } from '../db';
import { JobSourceEnum } from '@interfaces/IModels';
import { Op } from 'sequelize';
import { getPaginationOptions, getPagingData } from '@utils/pagination';
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

    res.json(response.data);
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
    startOfDay.setHours(1, 0, 0, 0);

    // get the ending hours of the day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { search, location, companyId } = req.query;

    const { page, pageSize, offset, limit } = getPaginationOptions(req);

    const where: any = {
      lastUpdatedAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (companyId) {
      where.companyId = companyId;
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [Company, JobSource],
      limit,
      offset,
    });

    const data = getPagingData(count, jobs, page, pageSize);
    res.json(data);
  } catch (error) {
    next();
  }
};

export const getDistinctCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get starting hours of today
    const startOfDay = new Date();
    startOfDay.setHours(1, 0, 0, 0);

    // get the ending hours of the day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      lastUpdatedAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };

    const allJobs = await Job.findAll({
      where,
      include: [Company, JobSource],
    });

    // Get distinct companies from the jobs
    const companies = allJobs.reduce((acc: any, job: any) => {
      if (!acc.some((company: any) => company.id === job.companyId)) {
        acc.push({
          id: job.companyId,
          name: job.company?.name || '', // Assuming company name is present
        });
      }
      return acc;
    }, [] as { id: number; name: string }[]);

    companies.sort((compA: any, compB: any) =>
      compA.name.localeCompare(compB.name)
    );

    res.json({ count: companies.length, companies });
  } catch (error) {
    next(error);
  }
};
