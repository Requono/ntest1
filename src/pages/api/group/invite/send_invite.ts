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
  if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId as string },
    select: { userId: true },
  });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.userId;

  const { targetUserId, groupId } = req.body;

  if (!targetUserId || !groupId) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const existing = await prisma.groupInvite.findFirst({
      where: {
        userId: targetUserId,
        groupId,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "User already invited." });
    }

    const invite = await prisma.groupInvite.create({
      data: {
        userId: targetUserId,
        groupId,
        invitedBy: userId,
        status: "PENDING",
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(invite);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send invite" });
  }
}
