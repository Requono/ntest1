// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

type Data = {
  username: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        hash: req.body.hash,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ username: "Error creating user" });
    }
  }
}
