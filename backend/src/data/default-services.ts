import { SessionMode, type Prisma } from '@prisma/client';

export const defaultServices: Prisma.ServiceCreateInput[] = [
  {
    slug: 'tarot-reading',
    title: 'Tarot Reading',
    description:
      'A deep dive into your current energetic path using tarot cards. Get clarity on your confusing circumstances.',
    durationMin: 60,
    price: 2500,
    sessionMode: SessionMode.ONLINE,
    idealOutcomes: ['Clarity', 'Peace of Mind', 'Direction'],
  },
  {
    slug: 'astrology-consultation',
    title: 'Astrology Consultation',
    description:
      'Comprehensive analysis of your birth chart to understand your karmic path, strengths, and life cycles.',
    durationMin: 90,
    price: 4000,
    sessionMode: SessionMode.ONLINE,
    idealOutcomes: ['Life Purpose', 'Timing of Events', 'Self Awareness'],
  },
  {
    slug: 'numerology',
    title: 'Numerology',
    description: 'Decode the numbers of your life. Find out your life path, destiny, and soul urge numbers.',
    durationMin: 45,
    price: 2000,
    sessionMode: SessionMode.ONLINE,
    idealOutcomes: ['Name Correction', 'Lucky Numbers', 'Personality Insight'],
  },
  {
    slug: 'love-compatibility',
    title: 'Love Compatibility',
    description: 'Understand the dynamic between you and your partner. Synastry and composite chart analysis.',
    durationMin: 60,
    price: 3000,
    sessionMode: SessionMode.ONLINE,
    idealOutcomes: ['Relationship Clarity', 'Conflict Resolution', 'Connection Depth'],
  },
  {
    slug: 'career-guidance',
    title: 'Career Guidance',
    description: 'Identify the best professional paths and timing for career transitions using astrological indicators.',
    durationMin: 60,
    price: 3500,
    sessionMode: SessionMode.ONLINE,
    idealOutcomes: ['Career Direction', 'Financial Wealth', 'Job Change Timing'],
  },
  {
    slug: 'spiritual-healing',
    title: 'Spiritual Healing',
    description: 'Energy clearing, chakra balancing, and guided meditation for inner peace.',
    durationMin: 60,
    price: 3000,
    sessionMode: SessionMode.OFFLINE,
    idealOutcomes: ['Stress Relief', 'Trauma Release', 'Energetic Reset'],
  },
];
