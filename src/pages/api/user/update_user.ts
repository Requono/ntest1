import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const sessionId = getCookie("session", { req, res });
  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId as string },
    select: { userId: true },
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.userId;
  const { username, email, newHash } = req.body;

  const data: any = {};
  if (username) data.username = username;
  if (email) data.email = email;
  if (newHash) data.hash = newHash;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ message: "Failed to update profile" });
  }
}
