import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, GroupInvite } from "@prisma/client";
import { getCookie } from "cookies-next";

const prisma = new PrismaClient();

interface InviteWithGroup {
  id: string;
  userId: string;
  invitedBy: string;
  createdAt: string;
  group: {
    id: string;
    name: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InviteWithGroup[] | { message: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const sessionId = getCookie("session", { req, res });
  if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId as string },
    select: { userId: true },
  });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  try {
    const invites = await prisma.groupInvite.findMany({
      where: { userId: session.userId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedInvites: InviteWithGroup[] = invites.map((invite) => ({
      id: invite.id,
      userId: invite.userId,
      invitedBy: invite.invitedBy,
      createdAt: invite.createdAt.toISOString(),
      group: {
        id: invite.group.id,
        name: invite.group.name,
      },
    }));

    return res.status(200).json(formattedInvites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch invites" });
  }
}
