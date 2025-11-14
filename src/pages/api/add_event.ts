// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  try {
    const event = await prisma.event.create({
      data: {
        createdById: userId,
        title: req.body.title,
        description: req.body.description,
        startDate: new Date(req.body.startDate), //TODO: for some reason this is set to be -1 hour than current
        endDate: new Date(req.body.endDate),
        location: req.body.location,
        maxPlayers: String(req.body.maxPlayers),
        visibility: req.body.visibility,
        status: req.body.status,
        gameType: req.body.gameType,
        price: Number(req.body.price),
        users: {
          create: {
            userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    res.status(200).json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ event: "Error creating event" });
    }
  }
}
