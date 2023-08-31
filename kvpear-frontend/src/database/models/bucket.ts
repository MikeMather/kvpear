import { Document, Model, Schema, model, models } from 'mongoose';

export interface BucketType {
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const BucketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // user relation
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Bucket: Model<BucketDocument> = models.Bucket || model('Bucket', BucketSchema);

export interface BucketDocument extends BucketType, Document {}

export default Bucket;