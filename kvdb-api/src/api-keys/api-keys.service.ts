import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKey } from './schemas/apiKeys.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel('ApiKey') private readonly apiKeyModel: Model<ApiKey>) {}

  async getApiKeyInfo(apiKey: string): Promise<ApiKey> {
    return this.apiKeyModel.findOne({ key: apiKey }).exec();
  }
}
