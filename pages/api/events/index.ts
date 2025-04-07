// pages/api/events/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }, // Optional: sort upcoming first
    });

    return res.status(200).json(events); // ← return raw list of events
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
