import { getDb } from "@/database/database"
import User, { UserDocument } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next"
import { generateToken } from "@/auth/session";
import { EmailTemplate, sendEmailMessage } from "@/utils/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req

  switch (method) {
    case 'POST':
      await getDb();
      // email from json body
      const { email } = req.body;
      // check if email exists in db
      const user = await User.findOne({ email });
      if (user) {
        // if email exists, create a new token
        const sealToken = await generateToken({ userId: user._id });
        const sendResult = await sendEmailMessage({
          to: email,
          subject: 'Login to KV Pear',
          templateId: EmailTemplate.LOGIN_SIGNUP,
          context: {
            login_link: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login?token=${sealToken}`
          }
        });
        console.log(sendResult);
      } else {
        // if email doesn't exist, create a new user
        const newUser = new User({
          email: email,
        });
        await newUser.save();
        // create a new token
        const sealToken = await generateToken(newUser._id);
        const sendResult = await sendEmailMessage({
          to: email,
          subject: 'Instant Sign Up to KV Pear',
          templateId: EmailTemplate.LOGIN_SIGNUP,
          context: {
            login_link: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login?token=${sealToken}`
          }
        });
        console.log(sendResult);
      }
      res.status(200).json({ message: 'success' });
  }
}