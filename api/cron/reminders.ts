import { runReminderSweep } from '../../backend/src/jobs/reminder.job';
import { authorizeCronRequest } from '../_lib/cron';

export default async function handler(request: any, response: any) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ success: false, message: 'Method not allowed.' });
    return;
  }

  if (!authorizeCronRequest(request, response)) {
    return;
  }

  try {
    const result = await runReminderSweep();

    response.status(200).json({
      success: true,
      message: 'Reminder sweep completed.',
      data: result,
    });
  } catch (error: any) {
    console.error('[VERCEL CRON] Reminder sweep failed:', error);
    response.status(500).json({
      success: false,
      message: error?.message || 'Reminder sweep failed.',
    });
  }
}
