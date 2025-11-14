// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie, deleteCookie } from "cookies-next";

const client = new PrismaClient();

type Data = {
  iterations?: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const sessionId = getCookie("session", {
    req,
    res,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  if (!sessionId) {
    res.status(200).json({
      message: "Invalid session",
    });
    return;
  }

  const session = await client.session.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      id: true,
    },
  });

  if (!session) {
    res.status(200).json({
      message: "Invalid session",
    });
    return;
  }

  await client.session.delete({
    where: {
      id: session.id,
    },
    select: {
      id: true,
    },
  });

  deleteCookie("session", {
    req,
    res,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logout ok",
  });
}
