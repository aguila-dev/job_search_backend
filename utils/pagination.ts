import { Request } from 'express';
import { FindAndCountOptions } from 'sequelize';

export interface PaginationOptions {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 20;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { page, pageSize, offset, limit };
};

export const getPagingData = (
  count: number,
  rows: any[],
  page: number,
  pageSize: number
) => {
  const totalPages = Math.ceil(count / pageSize);
  return { count, page, jobs: rows, totalPages };
};
