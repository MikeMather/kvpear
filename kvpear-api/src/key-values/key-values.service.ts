import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket } from 'src/buckets/schemas/buckets.schema';
import { existsOr404 } from 'src/utils/errors';

type BaseParams = {
  bucketName: string;
  userId: string;
  key: string;
}

type CreateOrUpdateParams = BaseParams & {
  value: string;
}


@Injectable()
export class KeyValuesService {

  constructor(@InjectModel ('Bucket') private readonly bucketModel: Model<Bucket>) {}


  private getKeyValue(bucket: Bucket, key: string) {
    return bucket.keyValuePairs.find(keyValuePair => keyValuePair.key === key);
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

    const bucket = await this.bucketModel.findOne({ name: bucketName, userId, 'keyValuePairs.key': key });
    if (bucket) {
      const updated = await this.bucketModel.findOneAndUpdate(
        { name: bucketName, userId, 'keyValuePairs.key': key },
        { $set: { 'keyValuePairs.$.value': valueToSave } },
        { new: true }
      ).exec();
      return this.getKeyValue(updated, key);
    }
    const updated = await this.bucketModel.findOneAndUpdate(
      { name: bucketName, userId },
      { $push: { keyValuePairs: { key, value: valueToSave } } },
      { new: true }
    ).exec();
    return this.getKeyValue(updated, key);
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

    const bucket = await this.bucketModel.findOne({ name: bucketName, userId, 'keyValuePairs.key': key });
    if (bucket) {
       const updated = existsOr404(await this.bucketModel.findOneAndUpdate(
        { name: bucketName, userId, 'keyValuePairs.key': key },
        { $inc: { 'keyValuePairs.$.value': valueToSave } },
        { new: true }
      ).exec(), "Bucket not found");

      return this.getKeyValue(updated, key);
    }
    const updated = existsOr404(await this.bucketModel.findOneAndUpdate(
      { name: bucketName, userId },
      { $push: { keyValuePairs: { key, value: valueToSave } } },
      { new: true }
    ).exec(), "Bucket not found");
    return this.getKeyValue(updated, key);
  }

  /**
   * Reads a value from a bucket.
   */
  read({ bucketName, userId, key }: BaseParams): Promise<string> {
    return this.bucketModel.findOne({ name: bucketName, userId, 'keyValuePairs.key': key })
      .then(bucket => {
        if (!bucket) {
          throw new NotFoundException('Key not found')
        }
        const keyValuePair = bucket.keyValuePairs.find(keyValuePair => keyValuePair.key === key);
        return keyValuePair.value;
      });
  }

  async findAll({ bucketName, userId }: Partial<BaseParams>) {
    return existsOr404(await this.bucketModel.findOne({ name: bucketName, userId })
      .then(bucket => {
        if (!bucket) {
          return null;
        }
        return bucket.keyValuePairs;
      }), "Bucket not found");
  }

  findByPrefix({ bucketName, userId, prefix }: { bucketName: string; userId: string; prefix: string }) {
    return this.bucketModel.findOne({ name: bucketName, userId })
      .then(bucket => {
        if (!bucket) {
          return null;
        }
        return bucket.keyValuePairs.filter(keyValuePair => keyValuePair.key.startsWith(prefix));
      });
  }

  unset({ bucketName, userId, key }: BaseParams) {
    return this.bucketModel.findOneAndUpdate(
      { name: bucketName, userId },
      { $pull: { keyValuePairs: { key } } },
      { new: true }
    ).exec();
  }
}
