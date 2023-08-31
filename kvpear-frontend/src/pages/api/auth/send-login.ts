import { getDb } from "@/database/database"
import User, { UserDocument } from "@/database/models/user";
import { NextApiRequest, NextApiResponse } from "next"
import { generateToken } from "@/auth/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req

  switch (method) {
    case 'POST':
      await getDb();
      // email from json body
      const { email } = JSON.parse(req.body);
      // check if email exists in db
      console.log('email', email);
      const user = await User.findOne({ email });
      if (user) {
        console.log('user exists', user);
        // if email exists, create a new token
        const sealToken = await generateToken({ userId: user._id });
        console.log('token', sealToken);
        // TODO: send email
      } else {
        console.log('user does not exist');
        // if email doesn't exist, create a new user
        const newUser = new User({
          email: email,
        });
        await newUser.save();
        console.log('Saved new user', user);
        // create a new token
        const token = await generateToken(newUser._id);
        console.log('token', token);
        // TODO: send email
      }
      res.status(200).json({ message: 'success' });
  }
}