// import { createClient } from 'redis';

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient.on('error', (err) => {
//   console.error('Redis client error:', err);
// });

// redisClient.on('ready', () => {
//   console.log('Redis client connected');
// });

// (async () => {
//   try {
//     await redisClient.connect();
//     console.log('Redis client connected successfully');
//   } catch (err) {
//     console.error('Redis client connection error', err);
//   }
// })();

// export default redisClient;
