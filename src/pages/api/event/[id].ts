import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  const eventId = Array.isArray(id) ? id[0] : id;

  if (!eventId || typeof eventId !== "string") {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    console.log(event);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch event" });
  }
}
