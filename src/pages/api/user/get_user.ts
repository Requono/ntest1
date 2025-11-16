import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
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

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        groupId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("get_user failed:", err);
    return res.status(500).json({ message: "Failed to load user" });
  }
}
