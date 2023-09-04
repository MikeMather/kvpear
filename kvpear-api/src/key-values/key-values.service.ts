import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { KeyValue } from './schemas/keyValues.schema';
import { existsOr404 } from 'src/utils/errors';

type BaseParams = {
  bucketName: string;
  userId: string;
  key: string;
}

type CreateOrUpdateParams = BaseParams & {
  value: string;
}

type SearchParams = BaseParams & {
  matchers?: PipelineStage[];
}

@Injectable()
export class KeyValuesService {

  constructor(
    @InjectModel ('KeyValue') private readonly keyValueModel: Model<KeyValue>,
    @InjectModel ('Bucket') private readonly bucketModel: Model<KeyValue>
  ) {}


  private async findAllKvs({ bucketName, userId, matchers=[] }: Partial<SearchParams>) {
    return await this.keyValueModel.aggregate([
      { $lookup: { from: 'buckets', localField: 'bucketId', foreignField: '_id', as: 'bucket' } },
      { $match: { 'bucket.name': bucketName, userId } },
      ...matchers
    ]);
  }

  private async findKv({ bucketName, userId, key, matchers=[] }: SearchParams) {
    const res = await this.keyValueModel.aggregate([
      { $lookup: { from: 'buckets', localField: 'bucketId', foreignField: '_id', as: 'bucket' } },
      { $match: { 'bucket.name': bucketName, userId, key } },
      { $limit: 1 },
      ...matchers
    ]);
    if (!res.length) {
      return null;
    }
    return res[0];
  }

  /**
   * Creates or updates a value in a bucket.
   */
  async createOrUpdate({ bucketName, userId, key, value }: CreateOrUpdateParams) {
    const numberValue = Number(value);
    let valueToSave: any = value;
    if (!isNaN(numberValue)) {
      valueToSave = numberValue;
    }

    const kv = await this.findKv({ bucketName, userId, key });
    if (!kv) {
      const bucket = existsOr404(await this.bucketModel.findOne({ name: bucketName, userId }).exec(), 'Bucket not found');
      return await this.keyValueModel.create({
        bucketId: bucket._id,
        key,
        value: valueToSave,
        userId
      });
    }
    return await this.keyValueModel.findOneAndUpdate(
      { _id: kv._id },
      { $set: { value: valueToSave } },
      { new: true, upsert: true }
    ).exec();
  }

  /**
   * Increments or decrements a value in a bucket. 
   */
  async createOrIncrement({ bucketName, userId, key, value }: CreateOrUpdateParams) {
    const numberValue = Number(value.replace('+', ''));
    let valueToSave: any = value;
    if (!isNaN(numberValue)) {
      valueToSave = numberValue;
    }

    const kv = await this.findKv({ bucketName, userId, key });
    if (!kv) {
      const bucket = existsOr404(await this.bucketModel.findOne({ name: bucketName, userId }).exec(), 'Bucket not found');
      return await this.keyValueModel.create({
        bucketId: bucket._id,
        key,
        value: valueToSave,
        userId
      });
    }
    return await this.keyValueModel.findOneAndUpdate(
      { _id: kv._id },
      { $inc: { value: valueToSave } },
      { new: true, upsert: true }
    ).exec();
  }

  /**
   * Reads a value from a bucket.
   */
  async read({ bucketName, userId, key }: BaseParams): Promise<KeyValue> {
    return existsOr404(await this.findKv({ bucketName, key, userId }), "Key not found");
  }

  async findAll({ bucketName, userId }: Partial<BaseParams>) {
    return this.findAllKvs({ bucketName, userId });
  }

  async findByPrefix({ bucketName, userId, prefix }: { bucketName: string; userId: string; prefix: string }) {
    return await this.findAllKvs({ 
      bucketName, 
      userId, 
      matchers: [
        { $match: { key: { $regex: `^${prefix}` } } }
      ]
    });
  }

  async findByRegex({ bucketName, userId, regex }: { bucketName: string; userId: string; regex: string }) {
    return await this.findAllKvs({ 
      bucketName, 
      userId, 
      matchers: [
        { $match: { key: { $regex: regex } } }
      ]
    });  }

  async unset({ bucketName, userId, key }: BaseParams) {
    const res = await this.findKv({ bucketName, userId, key });
    if (!res) {
      return;
    }
    return await this.keyValueModel.deleteOne({ _id: res._id });
  }

  async removeAllForBucket(bucketId: string) {
    return await this.keyValueModel.deleteMany({ bucketId });
  }
}
