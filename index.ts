import {
  populateDatabase,
  updateDatabaseJobListings,
} from '@services/populateDatabase';
import app from './app';
import cron from 'node-cron';
const PORT = process.env.PORT;
import { db } from './db';
import redisClient from '@services/redisClient';

const syncDatabase = async () => {
  try {
    await db.sync();
    console.log('Database is synced.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

const startServer = async () => {
  try {
    await syncDatabase();

    // Capture the server instance
    const server = app.listen(PORT, async () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Server running in ${process.env.NODE_ENV} mode`);

      // Run the database population script in the background
      // console.log('Populating database...');
      // populateDatabase()
      //   .then(() => {
      //     console.log('Database populated.');
      //   })
      //   .catch((error) => {
      //     console.error('Error populating database:', error);
      //   });
    });

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
      console.log('Running cron job to populate database...');
      await updateDatabaseJobListings();
      console.log('Cron job completed. Database is populated');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
