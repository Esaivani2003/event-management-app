import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // 🔒 Check if user is admin
  const foundUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!foundUser || foundUser.role === 'ADMIN') {
    return res.status(403).json({ message: 'Admins are not allowed to register for events' });
  }

  const userId = user.userId;
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const existing = await prisma.registration.findFirst({
      where: { userId, eventId },
    });

    if (existing) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
      },
    });

    return res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
