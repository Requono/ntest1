import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionId = getCookie("session", { req, res });
  if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId as string },
    select: { userId: true },
  });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.userId;

  const { inviteId } = req.body;

  const invite = await prisma.groupInvite.findUnique({
    where: { id: inviteId },
  });

  if (!invite || invite.userId !== userId)
    return res.status(404).json({ message: "Invite not found" });

  await prisma.groupInvite.delete({
    where: { id: inviteId },
  });

  return res.status(200).json({ message: "Invite declined" });
}
