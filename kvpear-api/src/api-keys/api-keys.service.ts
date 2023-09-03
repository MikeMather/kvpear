import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKey } from './schemas/apiKeys.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel('ApiKey') private readonly apiKeyModel: Model<ApiKey>) {}

  async getApiKeyInfo(apiKey: string): Promise<ApiKey> {
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    return this.apiKeyModel.findOne({ key: keyHash }).exec();
  }
}
