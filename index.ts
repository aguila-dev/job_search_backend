require('dotenv').config();
import {
  populateDatabase,
  updateDatabaseJobListings,
} from '@services/populateDatabase';
import cron from 'node-cron';
import app from './app';
import { db } from './db';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
// import redisClient from '@services/redisClient';

const syncDatabase = async () => {
  const syncOptions = {
    force: false,
    alter: false,
  };

  if (process.env.DROP_DB === 'true') {
    syncOptions.force = true;
    console.log('Dropping database...');
  } else if (process.env.ALTER_DB === 'true') {
    syncOptions.alter = true;
    console.log('Altering database...');
  } else {
    console.log('Syncing database...');
  }
  try {
    await db.sync(syncOptions);
    console.log('Database is synced.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

const seedOrUpdateDatabase = async () => {
  try {
    if (
      process.env.IGNORE_UPDATE_ON_RESTART === 'true' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.log('Skipping update due to server restart.');
      return;
    }

    if (process.env.SEED_DB === 'true') {
      console.log('Populating database...');
      // await seedTestUsers();
      await populateDatabase();
    } else {
      console.log('Updating database job listings...');
      await updateDatabaseJobListings();
      console.log('Database job listings updated.');
    }
  } catch (error) {
    console.error('Error seeding or updating database:', error);
  }
};

const resetIgnoreUpdateFlag = () => {
  delete process.env.IGNORE_UPDATE_ON_RESTART;
};

const startServer = async () => {
  try {
    await syncDatabase();

    // Capture the server instance
    const server = app.listen(PORT, '0.0.0.0', async () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Server running in ${process.env.NODE_ENV} mode`);
      resetIgnoreUpdateFlag();
    });

    await seedOrUpdateDatabase();

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Please use a different port.`
        );
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown logic
    const shutdown = () => {
      console.log('Shutting down server...');

      // Close the server
      server.close(() => {
        console.log('Server shut down.');

        // Add any other cleanup logic here
        // For example, closing database connections
        db.close().then(() => {
          console.log('Database connection closed.');
          process.exit(0);
        });
      });
    };

    // Handle termination signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Schedule a cron job to populate the database every 3 hours
    cron.schedule('0 */3 * * *', async () => {
      console.log('Running cron job to update database...');
      await updateDatabaseJobListings();
      console.log('Cron job completed. Database is updated');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
