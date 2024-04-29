import { Request, Response } from 'express';
import companyPaths from '@utils/companyList';

import { parseQueryParams, buildApiUrl } from '@utils/apiUtils';
import {
  fetchWorkdayData,
  processResponseDataAndIncludeLocations,
} from '@services/workdayService';

export const getWorkdayJobs = async (req: Request, res: Response) => {
  try {
    const { company } = req.params as { company: string };
    const queryParams = parseQueryParams(req.query);
    const basePathObject = companyPaths[company];
    if (!basePathObject) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const url = buildApiUrl(company, basePathObject);
    const response = await fetchWorkdayData(url, queryParams);
    const processedData = processResponseDataAndIncludeLocations(response.data);
    res.json(processedData);
  } catch (error: any) {
    console.error('Error getting job listings:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ error: 'Error fetching job listings' });
  }
};
