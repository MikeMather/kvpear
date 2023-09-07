import { setAuthCookie } from "@/auth/session"
import User from "@/database/models/user";
import { unsealData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/database/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query?.token;
  if (!token || typeof token !== 'string') {
    const errorMessage = encodeURIComponent("The link you used is invalid or has expired. Please try again");
    res.redirect(`/auth/login?error=${errorMessage}`);
    return;
  }

  await getDb();
  const { userId } = await unsealData(token, {
    password: process.env.SECRET as string,
  });
  console.log('UserId: ', userId);
  const user = await User.findById(userId);
  console.log('user: ', user);
  if (!user) {
    res.redirect('/auth/login');
    return;
  }
  console.log('Setting cookie header');
  await setAuthCookie(req, res, JSON.stringify(user.toObject()));
  res.redirect('/buckets');
};