import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket } from './schemas/buckets.schema';
import { KeyValuesService } from 'src/key-values/key-values.service';

@Injectable()
export class BucketsService {

  constructor(
    private readonly keyValuesService: KeyValuesService,
    @InjectModel('Bucket') private readonly bucketModel: Model<Bucket>
    ) {}

  async create(name: string, userId: string): Promise<Bucket> {
    const newBucket = new this.bucketModel({
      name,
      userId,
    });
    return newBucket.save();
  }

  async findAll(): Promise<Bucket[]> {
    return this.bucketModel.find().exec();
  }

  async findOne({ name, userId }: { name: string, userId: string }): Promise<Bucket> {
    return this.bucketModel.findOne({ name, userId }).exec();
  }

  async remove({ name, userId }: { name: string, userId: string }): Promise<Bucket> {
    const bucket = await this.bucketModel.findOne({ name, userId }).exec();
    if (!bucket) {
      return null;
    }
    await this.keyValuesService.removeAllForBucket(bucket._id);
    await bucket.deleteOne();
    return bucket;
  }
}
