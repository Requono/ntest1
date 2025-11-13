// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { PrismaClient } from "@prisma/client";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

interface RequestBody {
  email: string;
  hash: string;
}

const validationSchema = yup.object({
  email: yup.string().required().email(),
  hash: yup
    .string()
    .required()
    .test({
      name: "is-base64",
      message: "Hash is not a valid base64 string!",
      test: (value) => {
        if (!value) {
          return false;
        }
        try {
          const decodedValue = atob(value);
          const reencodedValue = btoa(decodedValue);
          return value === reencodedValue;
        } catch (error) {
          return false;
        }
      },
    }),
});

const validateRequest = async (body: RequestBody) => {
  try {
    await validationSchema.validate(body);

    return {
      isValid: true,
    };
  } catch (error) {
    return {
      isValid: false,
      error: (error as Error)?.message || "Validation failed",
    };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const validation = await validateRequest({
    email: req.body.email,
    hash: req.body.hash,
  });

  if (!validation.isValid) {
    res.status(400).json({ message: validation.error || "Validation failed" });
    return;
  }

  const { email, hash } = req.body as RequestBody;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      hash: true,
      email: true,
      username: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: "Invalid email or password!" });
    return;
  }

  if (user.hash !== hash) {
    res.status(401).json({ message: "Invalid email or password!" });
    return;
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });

  setCookie("session", session.id, {
    req,
    res,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logged in!",
    userId: user.id,
    email: user.email,
    username: user.username,
  });
}
