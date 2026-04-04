export const authorizeCronRequest = (request: any, response: any) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers?.authorization;

  if (!cronSecret) {
    response.status(500).json({
      success: false,
      message: 'CRON_SECRET is not configured.',
    });
    return false;
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    response.status(401).json({
      success: false,
      message: 'Unauthorized cron request.',
    });
    return false;
  }

  return true;
};
