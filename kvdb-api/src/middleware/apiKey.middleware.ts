import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiKeysService } from 'src/api-keys/api-keys.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: NextFunction) {
    const apiKey = req.headers['api-key'] as string;

    if (!apiKey) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'No API key provided' }));
    }

    const apiKeyInfo = await this.apiKeysService.getApiKeyInfo(apiKey);
    if (!apiKeyInfo) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'Invalid API key' }))
    }

    // Attach apiKeyInfo to the request for use in guards and controllers
    req['session'] = apiKeyInfo;

    // @ts-ignore
    const path: string = req.originalUrl;
    const cacheKey = `${apiKeyInfo.userId}:path:${path}`;
    req['cacheKey'] = cacheKey;
    next();
  }
}