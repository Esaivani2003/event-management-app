// pages/api/user/profile.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const { userId } = verifyToken(token);

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, image: true,role:true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    }

    if (req.method === "PUT") {
      const { name, image } = req.body;

      if (!name && !image) {
        return res.status(400).json({ message: "Name or image required for update" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(image && { image }),
        },
      });

      return res.status(200).json({ message: "Profile updated", user: updatedUser });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
