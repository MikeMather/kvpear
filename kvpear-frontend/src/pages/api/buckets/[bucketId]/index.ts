import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import Bucket from "@/database/models/bucket";
import { UserType } from "@/database/models/user";
import { serialize } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

const updateBucket = async ({ bucketId, name, userId }: { bucketId: string, name: string, userId: string }) => {
  await getDb();
  const newBucket = await Bucket.findOneAndUpdate(
    { _id: bucketId, userId }, 
    { $set: { name } },
    { new: true }
  ).exec();
  return serialize(newBucket);
};

const deleteBucket = async ({ bucketId, userId }: { bucketId: string, userId: string }) => {
  await getDb();
  await Bucket.findOneAndDelete({ _id: bucketId, userId }).exec();
};

export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { method, body, query } = req;
  const bucketId = query.bucketId as string;
  if (!['DELETE', 'PATCH'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  const user = await getServerSession(req);
  // Delete bucket
  if (method === 'DELETE') {
    try {
      await deleteBucket({ bucketId, userId: user._id });
      res.status(200).json({ message: "Bucket deleted" });
    } catch (error: any) {
      if (error.message === "Bucket not found") {
        res.status(404).json({ message: "Bucket not found" });
        return;
      }
    }
    return;
  } else {
    // Update bucket
    const { name } = body;
    if (!name || !bucketId) {
      res.status(400).json({ message: "Missing bucket name" });
      return;
    }
    try {
      const newBucket = await updateBucket({ bucketId, name, userId: user._id });
      res.status(200).json(newBucket);
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Bucket name already exists" });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }
});