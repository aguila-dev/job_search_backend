import { Request, Response } from 'express';
import { Company, JobSource } from '../db';

/**
 * FETCH ALL COMPANIES FROM THE COMPANY TABLE
 */
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.findAll({
      include: [JobSource],
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
