import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends mongoose.Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: true })
  apiAccessEnabled: boolean;

  @Prop()
  customerId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);