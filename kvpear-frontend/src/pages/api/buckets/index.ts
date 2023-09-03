import { getServerSession, protectedApiRoute } from "@/auth/session";
import { getDb } from "@/database/database";
import Bucket from "@/database/models/bucket";
import { UserType } from "@/database/models/user";
import { serialize } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserType) {
  const { method, body } = req;
  if (!['POST'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  await getDb();
  const user = await getServerSession(req);
  const bucketData = {
    name: body.name,
    userId: user._id,
  };
  const newBucket = await Bucket.create(bucketData);
  res.status(201).json(serialize(newBucket));
});