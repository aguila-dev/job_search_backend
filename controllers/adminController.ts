import { Request, Response } from 'express';
import { Company, JobSource } from '../db';
import { JobSourceEnum } from '@interfaces/IModels';
import {
  fetchAndSaveGreenhouseJobs,
  fetchAndSaveWorkdayJobs,
} from '@services/jobsService';
import { LINK } from '../config/companyConfig';
import { buildApiUrl } from '@utils/apiUtils';

// Create a new company and its associated JobSource
export const createCompany = async (req: Request, res: Response) => {
  const { name, slug, jobSourceName } = req.body;

  try {
    if (!name || !slug || !jobSourceName) {
      return res
        .status(400)
        .json({ error: 'Name, slug, and jobSourceName are required' });
    }

    // Validate the job source
    if (!Object.values(JobSourceEnum).includes(jobSourceName)) {
      return res.status(400).json({ error: 'Invalid job source' });
    }
    // Find or Create the company
    const [company, created] = await Company.findOrCreate({
      where: { slug },
      defaults: { name, slug, active: true },
    });

    if (!created) {
      return res.status(409).json({ error: 'Company already exists' });
    }

    // Find or create the job source
    const [jobSource] = await JobSource.findOrCreate({
      where: { name: jobSourceName },
    });

    if (jobSourceName === JobSourceEnum.GREENHOUSE) {
      console.log('fetching and saving jobs from admin create company');
      await fetchAndSaveGreenhouseJobs({
        name,
        slug,
        apiEndpoint: `${LINK}/${slug}/jobs`,
      });
    } else if (jobSourceName === JobSourceEnum.WORKDAY) {
      console.log('fetching and saving jobs from admin create company');

      const { basePathObject } = req.body;
      await fetchAndSaveWorkdayJobs({
        name,
        slug,
        apiEndpoint: buildApiUrl(slug, basePathObject),
      });
    }

    // Associate the company with the job source (if needed, based on your schema)
    // For example, if you have a CompanyJobSource model
    // await CompanyJobSource.create({ companyId: company.id, jobSourceId: jobSource.id });

    res.status(201).json({ company, jobSource });
  } catch (error) {
    console.error('Error creating company. Deleting company now', name);
    // if error then find company and delete it
    await Company.destroy({ where: { slug }, onDelete: 'CASCADE' });
    console.log('Company deleted');
    res.status(500).json({ error: 'Failed to create company and job source' });
  }
};
