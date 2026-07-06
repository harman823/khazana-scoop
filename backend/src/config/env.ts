import { z } from 'zod';
import { loadEnvironment } from './load-env';

loadEnvironment();

const cleanEnvValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (trimmed === '""' || trimmed === "''") {
    return '';
  }

  return trimmed;
};

const optionalEnvString = z.preprocess(cleanEnvValue, z.string().optional());
const requiredEnvString = (message: string) => z.preprocess(cleanEnvValue, z.string().min(1, message));

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  
  // External APIs
  RAZORPAY_KEY_ID: requiredEnvString('RAZORPAY_KEY_ID is required'),
  RAZORPAY_KEY_SECRET: requiredEnvString('RAZORPAY_KEY_SECRET is required'),
  
  // Google Calendar Integration
  GOOGLE_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  GOOGLE_REDIRECT_END_POINT: z.string().optional().default('/oauth/callback'),
  GOOGLE_CALENDAR_ID: z.string().optional().default('primary'),
  GOOGLE_TOKEN_ACCESS_TYPE: z.string().optional().default('offline'),
  GOOGLE_CALENDAR_SCOPE: z.string().optional().default('https://www.googleapis.com/auth/calendar'),
  GOOGLE_ACCESS_TOKEN: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_TOKEN_EXPIRY_DATE: z.coerce.number().optional(),

  // AI Assistant
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().optional().default('gpt-5-mini'),

  // Appointment Scheduling
  START_TIME: z.string().optional().default('10:00'),
  END_TIME: z.string().optional().default('18:00'),
  APPOINTMENT_DURATION: z.coerce.number().optional().default(60),
  APPOINTMENT_INTERVAL: z.coerce.number().optional().default(30),
  START_OF_DAY: z.string().optional().default('00:00'),
  END_OF_DAY: z.string().optional().default('23:59'),
  TIME_FORMAT: z.string().optional().default('HH:mm'),
  
  // Communication (SMTP / Resend / SendGrid)
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),

  // Admin and automation
  ADMIN_KEY: z.string().optional().default('kosmicalign_admin_mock'),
  CRON_SECRET: z.string().optional(),
  ORDER_WEBHOOK_URL: z.string().optional(),
  OLLAMA_BASE_URL: z.string().optional().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().optional().default('llama3.1'),
  INVENTORY_POLL_CRON: z.string().optional().default('*/30 * * * *'),
  INVENTORY_POLL_CRON_DISABLED: z.string().optional().default('false'),
  ADMIN_ALERT_EMAIL: z.string().optional(),
  ADMIN_ALERT_WEBHOOK_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;



