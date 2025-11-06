// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { PrismaClient } from "@prisma/client";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

type Data = {
  message: string;
  accessToken?: string;
};

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
          return false; // Allow empty strings, you can change this behavior if needed
        }
        try {
          // Attempt to decode the value from Base64
          const decodedValue = atob(value);
          // Check if the decoded value can be re-encoded as Base64
          const reencodedValue = btoa(decodedValue);
          // Compare the original value with the re-encoded value
          return value === reencodedValue;
        } catch (error) {
          return false; // Value is not valid Base64
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
  res: NextApiResponse<Data>
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

  res.status(200).json({ message: "Login ok!" });
}
