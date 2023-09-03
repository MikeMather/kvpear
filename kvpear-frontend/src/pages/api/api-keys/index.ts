import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import ApiKey from "@/database/models/apiKey";
import { UserType } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';

const createApiKey = async ({ name, userId, permissons }: 
  { name: string, userId: string, permissons: string[] }) => {
  await getDb();
  const apiKey = crypto.randomBytes(16).toString('hex');
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const newApiKey = await ApiKey.create({
    name,
    key: keyHash,
    userId,
    permissions: permissons,
  });
  newApiKey.key = apiKey;
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