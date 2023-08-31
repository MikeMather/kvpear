import { getServerSession, protectedApiRoute } from "@/auth/session";
import { UserType } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";

// Returns current user
export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  return res.status(200).json(session);
});