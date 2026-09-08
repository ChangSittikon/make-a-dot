import pino from 'pino';

// Define log level based on environment
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Create a Pino logger instance
export const logger = pino({
  level,
  // If in development, format logs nicely. In production, keep as raw JSON.
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard', // YYYY-MM-DD HH:MM:SS
        ignore: 'pid,hostname', // Keep terminal clean
      },
    },
  }),
});
