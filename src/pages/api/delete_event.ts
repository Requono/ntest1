// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing event id" });
    }
    const deleteEvent = await prisma.event.delete({
      where: { id },
    });

    res.status(200).json(deleteEvent);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
