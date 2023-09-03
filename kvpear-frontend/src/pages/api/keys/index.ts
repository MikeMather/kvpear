import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import KeyValue from "@/database/models/keyValue";
import { UserType } from "@/database/models/user";
import { serialize } from "@/utils/api";
import { convertToRightType } from "@/utils/objects";
import { NextApiRequest, NextApiResponse } from "next";

const createKey = async ({ key, value, bucketId, userId }: { key: string, value: any, bucketId: string, userId: string }) => {
  await getDb();
  const newKey = await KeyValue.create({
    key,
    value,
    bucketId,
    userId,
  });
  return serialize(newKey);
};

// Returns current user
export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { body, method } = req;
  if (method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }
  const user = await getServerSession(req);
  const { key, value, bucketId } = body;
  if (!key || !value || !bucketId) {
    res.status(400).json({ message: "Missing key, value or bucketId" });
    return;
  }
  const val = convertToRightType(value);
  const newKey = await createKey({ key, value: val, bucketId, userId: user._id });
  res.status(201).json(newKey);
});