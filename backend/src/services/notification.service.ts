import nodemailer from 'nodemailer';
import { env } from '../config/env';

const createTransporter = () => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('[EMAIL] SMTP credentials not found. Emails will be mocked.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();
const PRIMARY_TIMEZONE = 'Asia/Kolkata';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

type SessionEmailContext = {
  clientEmail: string;
  clientName: string;
  serviceTitle: string;
  dateTime: string;
  clientTimezone?: string;
  meetLink?: string | null;
};

const formatSessionDate = (dateTime: string, timeZone?: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timeZone || PRIMARY_TIMEZONE,
    }).format(new Date(dateTime));
  } catch {
    return new Date(dateTime).toLocaleString();
  }
};

const buildSessionTimingHtml = (dateTime: string, clientTimezone?: string) => {
  const clientTime = formatSessionDate(dateTime, clientTimezone);
  const indiaTime = formatSessionDate(dateTime, PRIMARY_TIMEZONE);

  if (!clientTimezone || clientTimezone === PRIMARY_TIMEZONE) {
    return `<p style="margin: 0;"><strong>Date & Time:</strong> ${indiaTime} (Asia/Kolkata)</p>`;
  }

  return `
    <p style="margin: 0 0 8px 0;"><strong>Your Local Time:</strong> ${clientTime} (${clientTimezone})</p>
    <p style="margin: 0;"><strong>India Time:</strong> ${indiaTime} (${PRIMARY_TIMEZONE})</p>
  `;
};

const buildMeetLinkHtml = (meetLink?: string | null) => {
  if (!meetLink) {
    return '<p>Your calendar invite will contain the final session access details.</p>';
  }

  return `<p><strong>Join Link:</strong> <a href="${meetLink}">${meetLink}</a></p>`;
};

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  if (!transporter) {
    console.log(`[MOCK EMAIL] TO: ${payload.to} | SUBJECT: ${payload.subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Kosmic Align" <${env.SMTP_USER}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    console.log(`[EMAIL] Sent to ${payload.to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Failed sending to ${payload.to}:`, error);
    return false;
  }
};

export const sendBookingConfirmation = async ({
  clientEmail,
  clientName,
  serviceTitle,
  dateTime,
  clientTimezone,
  meetLink,
}: SessionEmailContext) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4a5568;">Booking Confirmed</h2>
      <p>Hi <b>${clientName}</b>,</p>
      <p>Your session for <strong>${serviceTitle}</strong> has been successfully booked.</p>
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
        ${buildSessionTimingHtml(dateTime, clientTimezone)}
      </div>
      ${buildMeetLinkHtml(meetLink)}
      <p>Warmly,<br/>Kosmic Align</p>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Booking Confirmed: ${serviceTitle}`,
    html,
  });
};

export const sendSessionReminder = async ({
  clientEmail,
  clientName,
  serviceTitle,
  dateTime,
  clientTimezone,
  meetLink,
  reminderWindowLabel,
}: SessionEmailContext & { reminderWindowLabel: string }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4a5568;">Session Reminder</h2>
      <p>Hi <b>${clientName}</b>,</p>
      <p>This is your ${reminderWindowLabel} reminder for <strong>${serviceTitle}</strong>.</p>
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
        ${buildSessionTimingHtml(dateTime, clientTimezone)}
      </div>
      ${buildMeetLinkHtml(meetLink)}
      <p>If you need to make changes, please do so as early as possible.</p>
      <p>Warmly,<br/>Kosmic Align</p>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Reminder: ${serviceTitle} in ${reminderWindowLabel}`,
    html,
  });
};
