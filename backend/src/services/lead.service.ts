import { prisma } from '../lib/prisma';
import { sendEmail } from './notification.service';

type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}

export const captureLead = async (payload: LeadPayload) => {
  const lead = await prisma.lead.create({
    data: {
      name: payload.name,
      email: payload.email ?? null,
      phone: payload.phone || 'N/A',
      source: payload.message ? `Contact Form Message: ${payload.message}` : (payload.source || 'Website Contact Form'),
      status: 'NEW'
    }
  });

  // Optional: Auto-reply to lead
  if (lead.email) {
    await sendEmail({
      to: lead.email,
      subject: 'Thank you for reaching out to Kosmic Align!',
      html: `<p>Hi ${lead.name},</p><p>We have received your message and will be in touch with you shortly.</p>`
    });
  }

  return lead;
};
