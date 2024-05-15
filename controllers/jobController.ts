import { Request, Response } from 'express';
import { Job, Company, JobSource } from '../db';
import { JobSourceEnum } from '@interfaces/IModels';

// Get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.findAll({ include: [Company] });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get jobs by company
export const getJobsByCompany = async (req: Request, res: Response) => {
  const { company } = req.params;
  try {
    const companyRecord = await Company.findOne({ where: { name: company } });
    if (!companyRecord) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const jobs = await Job.findAll({
      where: { companyId: companyRecord.id },
      include: [Company],
    });
    res.json(jobs);
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
    res.json(jobs);
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
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Workday jobs' });
  }
};
