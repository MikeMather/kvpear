import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket } from './schemas/buckets.schema';

@Injectable()
export class BucketsService {

  constructor(@InjectModel('Bucket') private readonly bucketModel: Model<Bucket>) {}

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

  async findOne(name: string): Promise<Bucket> {
    return this.bucketModel.findOne({  name }).exec();
  }

  async remove(name: string): Promise<Bucket> {
    return await this.bucketModel.findOneAndRemove({ name }).exec();
  }
}
