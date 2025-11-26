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
    return res.status(401).json({ message: "Not authenticated" });
  }

  const session = await prisma.session.findUnique({
    where: { id: String(sessionId) },
    select: { userId: true },
  });

  if (!session) {
    return res.status(401).json({ message: "Invalid session" });
  }

  const userId = session.userId;
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "Missing eventId" });
  }

  try {
    const joined = await prisma.userOnEvent.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (!joined) {
      return res
        .status(400)
        .json({ message: "User is not joined to this event" });
    }

    await prisma.userOnEvent.delete({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    res.status(200).json({ message: "Successfully left event" });
  } catch (error) {
    console.error("leave_event failed:", error);
    return res.status(500).json({ message: "Error leaving event" });
  }
}
