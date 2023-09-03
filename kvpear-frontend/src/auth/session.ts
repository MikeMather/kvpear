import { UserDocument, UserType } from "@/database/models/user";
import { getIronSession, sealData, unsealData } from "iron-session";
import { GetServerSidePropsContext, NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export const ironSessionOptions = {
  cookieName: "auth",
  password: process.env.SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
  },
}

export const getServerSession = async (req: NextRequest | NextApiRequest) => {
  let cookie = null;
  if (req instanceof NextRequest) {
    cookie = req.cookies.get(ironSessionOptions.cookieName);
  } else {
    cookie = req.cookies[ironSessionOptions.cookieName];
  }
  if (!cookie) {
    return null;
  }
  const session = await unsealData(cookie, {
    password: process.env.SECRET as string,
    ttl: 30 * 24 * 60 * 60,
  }) as string;
  
  try {
    return JSON.parse(session);
  } catch (error) {
    return null;
  }
};

export const generateToken = async (content: any): Promise<string> => {
  return sealData(
    content,
    {
      password: process.env.SECRET as string,
      // 30 days
      ttl: 30 * 24 * 60 * 60,
    }
  );
}

export const protectedApiRoute = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session: UserDocument = await getServerSession(req);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return handler(req, res, session);
  }
}

export const protectedSsrRoute = (handler: any) => {
  return async (ctx: any) => {
    const session: UserDocument = await getServerSession(ctx.req);
    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    return handler(ctx, session);
  }
}

export const getCookieString = async (content: any): Promise<string> => {
  const token = await generateToken(content);
  if (ironSessionOptions.cookieOptions.secure) {
    return `${ironSessionOptions.cookieName}=${token}; path=/; HttpOnly; Secure; SameSite=Lax;`;
  }
  return `${ironSessionOptions.cookieName}=${token}; path=/; HttpOnly; SameSite=Lax;`;
}

declare module "iron-session" {
  interface IronSessionData {
    user?: UserType;
  }
}