import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import ApiKey from "@/database/models/apiKey";
import { UserType } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";


const createApiKey = async ({ name, userId, permissons }: 
  { name: string, userId: string, permissons: string[] }) => {
  await getDb();
  const newApiKey = await ApiKey.create({
    name,
    userId,
    permissions: permissons,
  });
  return newApiKey;
};

// Returns current user
export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { method, body } = req;
  if (method !== 'POST') {
    res.status(405).json({ message: "Method not allowed" });
  }
  const user = await getServerSession(req);
  const { name, permissions } = body;
  if (!name || !permissions) {
    res.status(400).json({ message: "Missing name or permissions" });
    return;
  }
  const newApiKey = await createApiKey({ name, userId: user._id, permissons: permissions });
  res.status(201).json(newApiKey);
});