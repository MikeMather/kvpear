import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyValue } from './schemas/keyValues.schema';
import { existsOr404 } from 'src/utils/errors';

type BaseParams = {
  bucketId: string;
  userId: string;
  key: string;
}

type CreateOrUpdateParams = BaseParams & {
  value: string;
}

@Injectable()
export class KeyValuesService {

  constructor(@InjectModel ('KeyValue') private readonly keyValueModel: Model<KeyValue>) {}

  /**
   * Creates or updates a value in a bucket.
   */
  async createOrUpdate({ bucketId, userId, key, value }: CreateOrUpdateParams) {
    const numberValue = Number(value);
    let valueToSave: any = value;
    if (!isNaN(numberValue)) {
      valueToSave = numberValue;
    }

    return await this.keyValueModel.findOneAndUpdate(
      { bucketId, key, userId },
      { value: valueToSave },
      { new: true, upsert: true }
    ).exec();
  }

  /**
   * Increments or decrements a value in a bucket. 
   */
  async createOrIncrement({ bucketId, userId, key, value }: CreateOrUpdateParams) {
    const numberValue = Number(value.replace('+', ''));
    let valueToSave: any = value;
    if (!isNaN(numberValue)) {
      valueToSave = numberValue;
    }

    return await this.keyValueModel.findOneAndUpdate(
      { bucketId, key, userId },
      { $inc: { value: valueToSave } },
      { new: true, upsert: true }
    ).exec();
  }

  /**
   * Reads a value from a bucket.
   */
  async read({ bucketId, userId, key }: BaseParams): Promise<KeyValue> {
    return existsOr404(await this.keyValueModel.findOne({ bucketId, key, userId }), "Key not found");
  }

  async findAll({ bucketId, userId }: Partial<BaseParams>) {
    return this.keyValueModel.find({ bucketId, userId });
  }

  findByPrefix({ bucketId, userId, prefix }: { bucketId: string; userId: string; prefix: string }) {
    return this.keyValueModel.find({ bucketId, userId, key: { $regex: `^${prefix}` } });
  }

  findByRegex({ bucketId, userId, regex }: { bucketId: string; userId: string; regex: string }) {
    return this.keyValueModel.find({ bucketId, userId, key: { $regex: regex } });
  }

  unset({ bucketId, userId, key }: BaseParams) {
    return this.keyValueModel.deleteOne({ bucketId, userId, key });
  }

  removeAllForBucket(bucketId: string) {
    return this.keyValueModel.deleteMany({ bucketId });
  }
}
