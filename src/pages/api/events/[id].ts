import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json(event);
    } catch (error) {
      console.error('[GET EVENT ERROR]', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Admin-only routes: PUT & DELETE
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const user = verifyToken(token);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized – Admin access only' });
  }

  if (req.method === 'PUT') {
    const { title, description, date, location, image } = req.body;

    if (!title || !description || !date || !location || !image) {
      return res.status(400).json({ message: 'All fields are required for update' });
    }

    try {
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title,
          description,
          date: new Date(date),
          location,
          image,
        },
      });

      return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
      console.error('[UPDATE EVENT ERROR]', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('[DELETE EVENT ERROR]', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
