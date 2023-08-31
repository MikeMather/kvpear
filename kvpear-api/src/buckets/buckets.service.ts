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

  async findOne(id: string): Promise<Bucket> {
    return this.bucketModel.findById(id).exec();
  }

  async remove(id: string): Promise<Bucket> {
    const bucket = await this.bucketModel.findByIdAndRemove(id).exec();
    await this.keyValuesService.removeAllForBucket(id);
    return bucket;
  }
}
