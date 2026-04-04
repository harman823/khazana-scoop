import { prisma } from '../lib/prisma';
import { sendEmail } from './notification.service';

export const listWebinars = async () => {
  return prisma.webinar.findMany({
    orderBy: { scheduledAt: 'asc' },
    where: { scheduledAt: { gt: new Date() } } // Only upcoming
  });
};

type RegisterPayload = {
  webinarId: string;
  name: string;
  email: string;
};

export const registerForWebinar = async (payload: RegisterPayload) => {
  const webinar = await prisma.webinar.findUnique({ where: { id: payload.webinarId } });
  
  if (!webinar) throw new Error('Webinar not found');

  // Currently, we'll store webinar registrants simply as Leads with source pointing to webinar
  const lead = await prisma.lead.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: 'N/A',
      source: `Webinar: ${webinar.title}`,
      status: 'NEW'
    }
  });

  await sendEmail({
    to: payload.email,
    subject: `Registered: ${webinar.title}`,
    html: `<p>Hi ${lead.name},</p><p>You have successfully registered for the upcoming webinar: <b>${webinar.title}</b>.</p>${webinar.replayLink ? `<p>Access Link: <a href="${webinar.replayLink}">${webinar.replayLink}</a></p>` : ''}`
  });

  return lead;
};
