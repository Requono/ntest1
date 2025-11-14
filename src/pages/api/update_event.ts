// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing event id" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        maxPlayers: String(data.maxPlayers),
        visibility: data.visibility,
        status: data.status,
        gameType: data.gameType,
        price: Number(data.price),
      },
      include: {
        users: true,
      },
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ event: "Error updating event" });
    }
  }
}
