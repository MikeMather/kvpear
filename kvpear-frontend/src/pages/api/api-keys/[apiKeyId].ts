import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import ApiKey from "@/database/models/apiKey";
import { UserType } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";


const deleteApiKey = async ({ apiKeyId, userId }: { apiKeyId: string, userId: string }) => {
  await getDb();
  return await ApiKey.findOneAndRemove({ _id: apiKeyId, userId }).exec();
};

// Returns current user
export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { method, query } = req;
  const apiKeyId = query.apiKeyId as string;
  if (method !== 'DELETE') {
    res.status(405).json({ message: "Method not allowed" });
  }
  const user = await getServerSession(req);
  const result = await deleteApiKey({ apiKeyId, userId: user._id });
  console.log(apiKeyId)
  res.status(200).json({ message: "Api key deleted" });
});