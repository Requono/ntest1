// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Group ID is required" });
  }

  try {
    const members = await prisma.user.findMany({
      where: { groupId: id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return res.status(200).json(members);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch group members" });
  }
}
