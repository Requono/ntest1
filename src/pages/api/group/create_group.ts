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
  const { name } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: "Invalid group name" });
  }

  try {
    const existingCreatedGroup = await prisma.group.findUnique({
      where: { createdById: userId },
    });

    if (existingCreatedGroup) {
      return res.status(400).json({ message: "You already created a group." });
    }

    const existingMembership = await prisma.user.findUnique({
      where: { id: userId },
      select: { groupId: true },
    });

    if (existingMembership?.groupId) {
      return res
        .status(400)
        .json({ message: "You are already a member of a group." });
    }

    const group = await prisma.group.create({
      data: {
        name,
        createdById: userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { groupId: group.id },
    });

    return res.status(201).json(group);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create group." });
  }
}
