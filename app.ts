require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { API } from './constants';
const app = express();

import apiRoutes from './api';
import authRoutes from './auth';
import path from 'path';

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://www.jobsapp.com'
      : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if using https
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(`/${API.VERSION}/${API.API_ENDPOINT}`, apiRoutes);
app.use(`/${API.VERSION}/${API.AUTH_ENDPOINT}`, authRoutes);

app.use('/', (req: Request, res: Response) => {
  res.status(401).json({
    access: 'unauthorized to proceed',
    status: res.statusCode,
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

/* Error handling */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  console.error(err.stack);
  const errStatus = (err as any).status || 500;
  res.status(errStatus).send(err.message || 'Internal server error.');
});

export default app;
