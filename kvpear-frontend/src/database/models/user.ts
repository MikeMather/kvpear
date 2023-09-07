import { Document, Model, Schema, model, models } from 'mongoose';

export interface UserType {
  email: string;
  apiAccessEnabled: string;
  customerId: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  apiAccessEnabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  customerId: {
    type: String
  }
}, { timestamps: true });

const User: Model<UserDocument> = models.User || model('User', UserSchema);

export interface UserDocument extends UserType, Document {}

export default User;