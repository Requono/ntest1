import { NextApiRequest, NextApiResponse } from "next";
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

  const groupLeaderId = session.userId;
  const { groupId, userIdToRemove } = req.body;

  if (!groupId || !userIdToRemove) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { createdById: true },
  });

  if (!group || group.createdById !== groupLeaderId) {
    return res.status(403).json({ message: "You are not the group leader" });
  }

  try {
    await prisma.user.update({
      where: { id: userIdToRemove },
      data: { groupId: null },
    });

    await prisma.groupInvite.deleteMany({
      where: { id: userIdToRemove, groupId: groupId, status: "ACCEPTED" },
    });

    return res.status(200).json({ message: "User removed from group" });
  } catch (error) {
    console.error("Failed to remove user:", error);
    return res.status(500).json({ message: "Error removing user" });
  }
}
