import { protectedApiRoute } from "@/auth/session";
import { UserDocument } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default protectedApiRoute(async function handler(req: NextApiRequest, res: NextApiResponse, session: UserDocument) {
  const { method, query } = req;
  if (!['GET'].includes(method as string)) {
    res.status(405).json({ message: "Method not allowed" });
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
  const stripeApi =  new Stripe(stripeSecret, {
    apiVersion: "2023-08-16",
  });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  let returnUrl;
  if (query?.returnto) {
    returnUrl = `${baseUrl}/${query.returnto}`
  } else {
    returnUrl = `${baseUrl}/account`
  }

  const customerPortal = await stripeApi.billingPortal.sessions.create({
    customer: session.customerId,
    return_url: returnUrl
  });
  res.redirect(customerPortal.url);
});