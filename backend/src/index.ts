import app from './app';
import { env } from './config/env';

import { initReminderJobs } from './jobs/reminder.job';
import { initCleanupJobs } from './jobs/cleanup.job';

const startServer = () => {
  try {
    initReminderJobs();
    initCleanupJobs();
    
    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
