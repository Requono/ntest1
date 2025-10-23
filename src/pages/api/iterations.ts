import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  iterations?: number;
  message?: string;
};

interface RequestBody {
  email?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email } = req.body as RequestBody;
  const defaultIterations = process.env.iterations || "600000";

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        iterations: true,
      },
    });

    if (!user) {
      res.status(200).json({ iterations: parseInt(defaultIterations) });
      return;
    }

    if (!email) {
      res.status(200).json({ iterations: parseInt(defaultIterations) });
      return;
    }

    res.status(200).json({ iterations: user.iterations });
  } catch (error) {
    console.error("Error querying Prisma:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
