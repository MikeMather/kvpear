import { protectedApiRoute, setAuthCookie } from "@/auth/session";
import { getDb } from "@/database/database";
import User, { UserDocument, UserType } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserDocument) {
  const { method } = req;
  if (!['GET'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
  const stripeApi =  new Stripe(stripeSecret, {
    apiVersion: "2023-08-16",
  });
  const customer = await stripeApi.customers.create({
    email: session.email,
  });

  const intent = await stripeApi.setupIntents.create({
    customer: customer.id,
    automatic_payment_methods: { enabled: true }
  });

  await getDb();
  const newUser = await User.findOneAndUpdate({ _id: session._id }, 
    { customerId: customer.id },
    { new: true }
  ).exec();
  if (!newUser) {
    throw new Error('Update to user failed');
  }
  // Update session to include changes to user
  await setAuthCookie(req, res, JSON.stringify(newUser.toObject()));
  res.status(200).json({ clientSecret: intent.client_secret })
});