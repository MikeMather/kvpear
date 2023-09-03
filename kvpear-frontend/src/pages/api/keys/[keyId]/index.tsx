import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import KeyValue from "@/database/models/keyValue";
import { UserType } from "@/database/models/user";
import { serialize } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

const updateKey = async ({ keyId, key, value, userId }: { keyId: string, key: string, value: string, userId: string }) => {
  await getDb();
  const newKey = await KeyValue.findOneAndUpdate(
    { _id: keyId, userId }, 
    { $set: { key, value } },
    { new: true }
  ).exec();
  return serialize(newKey);
};

const deleteKey = async ({ keyId, userId }: { keyId: string, userId: string }) => {
  await getDb();
  await KeyValue.findOneAndDelete({ _id: keyId, userId }).exec();
};

// Returns current user
export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { method, body, query } = req;
  const keyId = query.keyId as string;
  if (!['DELETE', 'PATCH'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  const user = await getServerSession(req);
  // Delete key
  if (method === 'DELETE') {
    try {
      await deleteKey({ keyId, userId: user._id });
      res.status(200).json({ message: "Key deleted" });
    } catch (error: any) {
      if (error.message === "Key not found") {
        res.status(404).json({ message: "Key not found" });
        return;
      }
    }
    return;
  } else {
    // Update key
    const { key, value, bucketId } = body;
    if (!key || !value || !bucketId) {
      res.status(400).json({ message: "Missing key, value or bucketId" });
      return;
    }
    try {
      const newKey = await updateKey({ keyId, key, value, userId: user._id });
      res.status(200).json(newKey);
    } catch (error: any) {
      if (error.message === "Key not found") {
        res.status(404).json({ message: "Key not found" });
        return;
      }
    }
  }
});