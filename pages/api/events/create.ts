import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Role } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const { userId } = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { title, description, date, location, image, id } = req.body;

    switch (req.method) {
      case 'POST': {
        if (!title || !description || !date || !location || !image) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        const event = await prisma.event.create({
          data: {
            title,
            description,
            date: new Date(date),
            location,
            image,
            userId: user.id,
          },
        });

        return res.status(201).json({ message: 'Event created', event });
      }

      case 'PUT': {
        if (!id || !title || !description || !date || !location || !image) {
          return res.status(400).json({ message: 'All fields and event ID are required for update' });
        }

        const existingEvent = await prisma.event.findUnique({ where: { id } });
        if (!existingEvent) {
          return res.status(404).json({ message: 'Event not found' });
        }

        const updated = await prisma.event.update({
          where: { id },
          data: {
            title,
            description,
            date: new Date(date),
            location,
            image,
          },
        });

        return res.status(200).json({ message: 'Event updated', event: updated });
      }

      case 'DELETE': {
        if (!id) {
          return res.status(400).json({ message: 'Event ID is required for deletion' });
        }

        const existingEvent = await prisma.event.findUnique({ where: { id } });
        if (!existingEvent) {
          return res.status(404).json({ message: 'Event not found' });
        }

        await prisma.event.delete({ where: { id } });

        return res.status(200).json({ message: 'Event deleted successfully' });
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error('Event API Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
