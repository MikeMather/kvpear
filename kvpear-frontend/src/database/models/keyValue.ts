import { Document, Model, Schema, model, models } from 'mongoose';

export interface KeyValueType {
  _id: string;
  key: string;
  value: string;
  bucketId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type KeyValueDocType = Omit<KeyValueType, '_id' | 'createdAt' | 'updatedAt'>;

const KeyValueSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true
  },
  // bucket relation
  bucketId: {
    type: Schema.Types.ObjectId,
    ref: 'Bucket',
    required: true,
  },
  // user relation
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const KeyValue: Model<KeyValueDocument> = models.KeyValue || model('KeyValue', KeyValueSchema);

export interface KeyValueDocument extends KeyValueDocType, Document {}

export default KeyValue;