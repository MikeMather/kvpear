import { protectedApiRoute, setAuthCookie } from "@/auth/session";
import { getDb } from "@/database/database";
import User, { UserDocument } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserDocument) {
  const { method, body } = req;
  if (!['PATCH'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  await getDb();
  const { email } = body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
  }
  const updated = await User.findByIdAndUpdate(session._id, { email }, { new: true });
  setAuthCookie(req, res, JSON.stringify(updated?.toObject()));
  res.status(200).json({ message: "Email updated successfully" });
});