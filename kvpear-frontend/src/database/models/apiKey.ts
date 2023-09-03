import { ApiPermissions } from '@/utils/types';
import { Document, Model, Schema, model, models } from 'mongoose';

export interface ApiKeyType {
  name: string;
  key: string;
  userId: string;
  permissions: ApiPermissions[];
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  // user relation
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
    default: [],
  }
}, { timestamps: true });

const ApiKey: Model<ApiKeyDocument> = models.ApiKey || model('ApiKey', ApiKeySchema);

export interface ApiKeyDocument extends ApiKeyType, Document {}

export default ApiKey;