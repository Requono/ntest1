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
  const { eventId, groupId, userIds } = req.body;

  if (!eventId || !groupId || !Array.isArray(userIds)) {
    return res.status(400).json({ message: "Missing data" });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group || group.createdById !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  try {
    const joins = await Promise.all(
      userIds.map(async (uid) =>
        prisma.userOnEvent.upsert({
          where: {
            eventId_userId: { eventId, userId: uid },
          },
          update: {},
          create: { eventId, userId: uid },
        })
      )
    );

    return res.status(200).json({
      message: "Group joined successfully",
      joinedUsers: joins,
    });
  } catch (error) {
    console.error("join_group failed:", error);
    return res.status(500).json({ message: "Error group joining event" });
  }
}
