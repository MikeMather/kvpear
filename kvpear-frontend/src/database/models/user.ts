import { Document, Model, Schema, model, models } from 'mongoose';

export interface UserType {
  email: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const User: Model<UserDocument> = models.User || model('User', UserSchema);

export interface UserDocument extends UserType, Document {}

export default User;