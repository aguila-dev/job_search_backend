import { Request, Response, NextFunction } from 'express';
import redisClient from '../services/redisClient';
import { promisify } from 'util';

// Promisify Redis client methods
const getAsync = promisify(redisClient.get).bind(redisClient);

export const cacheMiddleware = (prefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 50;
    const cacheKey = `${prefix}-${page}-${pageSize}`;
    console.log(`Checking cache for key: ${cacheKey}`);
    try {
      const cachedData = await getAsync(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      } else {
        console.log(`Cache miss for key: ${cacheKey}`);
        // Override the res.json method to cache the response
        const originalJson = res.json.bind(res);
        res.json = (data: any) => {
          console.log(`Setting cache for key: ${cacheKey}`);
          redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 3 });
          return originalJson(data);
        };
        next();
      }
    } catch (err) {
      console.error('Failed to fetch data from cache', err);
      next();
    }
  };
};
