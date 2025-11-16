import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Group ID is required" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdById: true,
        members: {
          select: { id: true, username: true },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json({
      id: group.id,
      name: group.name,
      createdById: group.createdById,
      members: group.members,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch group data" });
  }
}
