import cron from 'node-cron';
import { env } from '../config/env';
import { pollLowInventory } from '../services/automation.service';

export const initInventoryJobs = () => {
  if (env.INVENTORY_POLL_CRON_DISABLED === 'true') {
    console.log('[CRON] Inventory polling is disabled.');
    return;
  }

  cron.schedule(env.INVENTORY_POLL_CRON, async () => {
    try {
      await pollLowInventory();
    } catch (error) {
      console.error('[CRON] Inventory polling failed:', error);
    }
  });

  console.log(`[CRON] Inventory polling scheduled: ${env.INVENTORY_POLL_CRON}`);
};
